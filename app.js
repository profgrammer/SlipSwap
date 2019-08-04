const express = require('express');
const bp = require('body-parser');
const morgan = require('morgan');
const request = require('request-promise');
const async = require('async');
const currencies = require('./currencies');
const app = express();
const fetch = require("node-fetch");
const {getETHToTokenRate} = require('./testKyberRates');

// middleware
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bp.json());
app.use(morgan('dev'));
app.use(express.static("public"));

app.get('/home', (req, res) => {
    res.render('index', {title: 'welcome to slipswap!!'});
})

// app.get('/form', (req, res) => {
//     res.redirect('/redirect');
// });

app.get('/:id', async (req, res) => {
    var endpoint = process.env.KYBER_API;
    let tokenid = `${currencies[req.params.id]}`;
    let name = req.params.id;
    endpoint += `sell_rate?id=`+tokenid;
    // console.log(endpoint);
    async function getCoinBaseFeed(name){
        let req = await getETHToTokenRate('eth',name,1);
        // let info = await req.json();
        // var a = parseInt(info.data.rates[name]);
        console.log('coinbase',req);
        return parseInt(req);
    }
    // const from = req.query.from;
    // const to = req.query.to;
    // const amount = parseInt(req.query.amt);
    // if(from.toLowerCase() === 'eth') process.env.factor = 1;
    // else process.env.factor = await getETHToTokenRate(to, from, 1);
    process.env.factor = await getCoinBaseFeed(name);
    console.log(process.env.factor);
    const originalAmt = parseInt(req.query.amt);
    console.log(originalAmt);
    const amt = parseInt(req.query.amt / process.env.factor);
    console.log(amt);
    const rem = req.query.amt % process.env.factor;

    var result = await request(process.env.ETHGASSTATION_API);
    result = JSON.parse(result);
    var gasPrice = result["safeLow"];
    console.log('gasprice', gasPrice);
    function createObject(i, amount) {
        return callback => {
            var start = (i-1)*5 + 1;
            const r = Array();
            var ep = endpoint;
            for(var j = start;j <= Math.min(amount, start+5-1);j++) {
                ep += `&qty=${j * process.env.factor}`;
            }            
            console.log('ep',ep);
            request(ep, (error, response, body) => {
                body = JSON.parse(body);
                if(!body.error) {
                    callback(null, body.data[0]);
                } else {
                    callback(true, {});
                }
            });
        }
    }

    function createObjectArray(amount) {
        var ans = {};
        console.log(amount);
        // amount = amount / process.env.factor;
        var qty = Math.floor((amount+5-1) / 5);
        // console.log(amount, qty);
        for(var i = 1;i <= qty;i++) {
            console.log('i=',i);
            ans[i] = createObject(i, amount);
        }
        console.log('create obj',ans);
        return ans;
    }


    // res.status(200).json(endpoint);
    // request(endpoint, (error, response, body) => {
    //     console.log(error, response, body);
    //     res.json(JSON.parse(body));
    // });
    async.parallel(
        createObjectArray(parseInt(amt))
        ,async (err, result) => {
        if(err) return;
        console.log('parallel', result);
        var withoutSplits = Array();
        for(var i = 0;i < amt;i++) withoutSplits.push(0);
        Object.keys(result).forEach(x => {
            var obj = result[x];
            console.log('obj',obj);
            obj['dst_qty'].forEach((dst, index) => {
                // console.log(dst, index);
                withoutSplits[obj['src_qty'][index] / process.env.factor -1] = dst * 1000000;
            });
        })
        // return;
        // res.json(withoutSplits);
        console.log('ws',withoutSplits);
        var optimalAns = Number.MIN_VALUE;
        var dp = Array();
        var dpList = Array();
        var seq = Array();
        for(var i = 0;i <= amt;i++) dp[i] = 0;
        for(var i = 0;i <= amt;i++) seq[i] = 0;
        seq[0] = -1;
        seq[1] = 1;
        dp[1] = withoutSplits[1];
        for(var i = 1;i <= amt;i++) {
            var maxval = -1;
            for(var j = 0;j < i;j++) {
                var curr_val = withoutSplits[j] + dp[i-j - 1] - (gasPrice/10);
                // console.log(curr_val);
                if(curr_val > maxval) {
                    maxval = curr_val;
                    seq[i] = j +1;
                }
            }
            
            dp[i] = maxval;
        }
        var x = amt;
        console.log(seq);
        while(x > 0) {
            dpList.push(seq[x] * process.env.factor);
            x -= seq[x];
        }
        if(rem != 0){
            dpList[0] += rem;
        } 

        let req = await getETHToTokenRate(name,'eth',rem);
        console.log('req',typeof req, dp[amt]);
        // console.log(d)
        dp[amt] += parseFloat(req * 1000000);
        req = await getETHToTokenRate(name,'eth',originalAmt);
        withoutSplits[amt-1] = parseFloat(req);
        console.log(dp);
        console.log(withoutSplits[amt-1], dp[amt]);

        request('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', (error, request, body) => {
            body = JSON.parse(body);
            var usd = parseFloat(body["USD"]);
            const amountSaved = usd * (dp[amt] / 1000000.0 - withoutSplits[amt-1]);
            console.log(usd);
            dpList.sort((a,b) => {return b-a});
            res.json({
                amount: originalAmt,
                fromCurrency: name, 
                toCurrency: "ETH",
                optimalPrice: dp[amt] / 1000000.0, 
                originalPrice: withoutSplits[amt-1],
                sequence: dpList,
                gasRequired: (dpList.length * (gasPrice / 10)),
                gasSpeed: "safeLow",
                amountSaved: amountSaved,
                conversionRate: process.env.factor
            });
        })
    })
})

const port = process.env.PORT_NUMBER;

app.listen(port, () => console.log(`listening at port ${port}`));
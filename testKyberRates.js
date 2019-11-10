
const Web3  = require("web3");
var fetch   = require('node-fetch');
var _       = require('lodash');


const HTTP_ALCHMEY        = "https://eth-mainnet.alchemyapi.io/jsonrpc/V1GjKybGLx6rzSu517KSWpSrTSIIXmV7";
var web3                  = new Web3(new Web3.providers.HttpProvider(HTTP_ALCHMEY));


const exchangeABI      = [{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"},{"name":"hint","type":"bytes"}],"name":"tradeWithHint","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapEtherToToken","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"token","type":"address"}],"name":"getUserCapInTokenWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kyberNetworkContract","type":"address"}],"name":"setKyberNetworkContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"field","type":"bytes32"}],"name":"info","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newNetworkContract","type":"address"},{"indexed":false,"name":"oldNetworkContract","type":"address"}],"name":"KyberNetworkSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}];
var exchangeContract  = new web3.eth.Contract(exchangeABI, '0x818E6FECD516Ecc3849DAf6845e3EC868087B755');
let arr_tokens              = {};



// getETHToTokenRate('eth','dai', 10)
// .then(finalAmt => {
//     console.log(finalAmt);
// })


async function getETHToTokenRate(src, dest, qty=20 /* ether */){

    let src_addr = await getTokenContract(src);
    let dest_addr = await getTokenContract(dest);
    let qtyInWei = web3.utils.toWei(qty+"", "ether");

    let results = await exchangeContract.methods.getExpectedRate(src_addr, dest_addr, qtyInWei).call()       
    
    let resultAmt = results.expectedRate;
    let finalAmt = web3.utils.fromWei(resultAmt,"ether");
    return src.toUpperCase() === 'ETH' ? finalAmt : finalAmt*qty;
//    console.log(web3.utils.fromWei(resultAmt, "ether"));

}


async function getTokenContract(tokenName){
    if(arr_tokens[tokenName.toUpperCase()]){
        return arr_tokens[tokenName.toUpperCase()];
    }else{
        let tokensBasicInfoRequest = await fetch('https://api.kyber.network/currencies')
        let tokensBasicInfo        = await tokensBasicInfoRequest.json()
        _.forEach(tokensBasicInfo.data, (value, key ) => { arr_tokens[value.symbol] = value.address; });
        return arr_tokens[tokenName.toUpperCase()];
    }
}

module.exports = {
    getETHToTokenRate: getETHToTokenRate
};
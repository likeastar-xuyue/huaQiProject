const HelloWorld = artifacts.require("HelloWorld");
const promptSync = require("prompt-sync")();

module.exports = async function(callback) {
    const instance = await HelloWorld.deployed();
    // let balance = await instance.getOwnerBalance();
    // console.log(web3.utils.fromWei(balance,'ether'),'ETH');

    // const myString = promptSync("你想输入的字符串是：");
    // const result = await instance.returnString(myString);
    // console.log("返回的字符串是：", result);

    const result = await instance.transfer(100);
    callback();
}; 
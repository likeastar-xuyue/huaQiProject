const CreditRecord = artifacts.require("CreditRecord");
const promptSync = require("prompt-sync")();

module.exports = async function(callback) {
  try{
    const instance = await CreditRecord.deployed();

    try{
      //银行卡号后续对接至个人信息完善的银行卡信息填写处
      const _creditCardId = web3.utils.toBN(promptSync("请输入您的银行卡号："));
      // 对应前端输入框
      const _amount = parseInt(promptSync("请输入要转账的金额："));
      const result = await instance.createCredit(_creditCardId,_amount);

      console.log("这是您目前所有信贷记录的ID");
      console.log(instance.getCreditsByCard(_creditCardId));
    }catch(error){
      if(error.reason){
        //报错信息对接前端
        const errorMessages = error.reason.split(';').filter(msg => msg.trim());
        console.log("验证错误：");
        errorMessages.forEach(msg => {
          console.log("- " + msg.trim());
        });
      }
    }

    callback();

  }catch(error){
    callback(error);
  }
  
}; 
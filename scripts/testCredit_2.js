const CreditRecord = artifacts.require("CreditRecord");
const promptSync = require("prompt-sync")();
const Web3 = require("web3");

function sleep(s) {
    const realMs = s * 1000;
    return new Promise(resolve => setTimeout(resolve, realMs));
}

module.exports = async function(callback) {
    try {
        const instance = await CreditRecord.deployed();
        const web3 = new Web3("http://localhost:8545");

        // 显示业务菜单
        console.log("\n=== 信贷业务系统 ===");
        console.log("1、创建信贷记录");
        console.log("2、获取银行卡的所有信贷记录详情");
        console.log("0、退出系统");
        console.log("==================\n");
        
        const businessChoice = promptSync("请输入您想要办理的业务编号：");
        console.log(`\n您选择的业务是: ${businessChoice}`);
        console.log("\n正在加载，请稍后...");
        await sleep(1); // 休眠1秒
        
        if (businessChoice == 1) {
            try {
                // 获取用户输入
                const creditCardId = web3.utils.toBN(promptSync("请输入您的银行卡号："));
                const amount = parseInt(promptSync("请输入要转账的金额："));
                
                // 创建信贷记录
                const result = await instance.createCredit(creditCardId,amount);
                console.log("成功！");
                
            } catch (error) {
                if(error.reason){
                    //报错信息对接前端
                    const errorMessages = error.reason.split(';').filter(msg => msg.trim());
                    console.log("验证错误：");
                    errorMessages.forEach(msg => {
                      console.log("- " + msg.trim());
                    });
                }else{
                    console.log(error);
                }
            }
        } else if (businessChoice == 2) {
            try {
                const creditCardId = promptSync("请输入要查询的银行卡号：");
                const details = await instance.getCardCreditDetails(creditCardId);
                
                console.log("\n=== 信贷记录详情 ===");
                if (details.creditIds.length === 0) {
                    console.log("该银行卡暂无信贷记录");
                } else {
                    for (let i = 0; i < details.creditIds.length; i++) {
                        console.log(`\n记录 ${i + 1}:`);
                        console.log(`- 信贷ID: ${details.creditIds[i]}`);
                        console.log(`- 金额: ${details.amounts[i] / 100} 元`);
                        console.log(`- 时间: ${new Date(details.timestamps[i] * 1000).toLocaleString()}`);
                        console.log(`- 状态: ${details.repaidStates[i] ? '已还款' : '未还款'}`);
                    }
                }
            } catch (error) {
                console.error("\n查询失败：", error);
            }
        } else if (businessChoice == 0) {
            console.log("\n感谢使用，再见！");
        } else {
            console.log("\n无效的业务选择！");
        }
        
        callback();
        
    } catch (error) {
        console.error("\n系统错误：", error);
        callback(error);
    }
}; 
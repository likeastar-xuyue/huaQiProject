// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library StringUtils {
    function numLength(uint256 number) internal pure returns (uint256) {
        if (number == 0) return 1;
        
        uint256 length = 0;
        while (number != 0) {
            number /= 10;
            length++;
        }
        return length;
    }
}

contract CreditRecord {
    using StringUtils for uint256;

    // 信贷记录结构
    struct Credit {
        uint256 creditCardId; // 借入方的银行卡卡号
        int256 amount;       // 金额（以分为单位）
        uint256 timestamp;    // 交易时间戳
        bool isRepaid;       // 是否已还款
    }

    // 所有信贷记录
    Credit[] public credits;
    
    // 通过银行卡号映射到信贷记录ID数组
    mapping(uint256 => uint256[]) private creditCardCredits;
    
    // 事件
    event CreditCreated(
        uint256 indexed creditCardId,
        int256 amount,
        uint256 timestamp
    );
    
    event CreditRepaid(uint256 indexed creditId, uint256 timestamp);

    // 第1个功能：创建信贷记录
    function createCredit(
        uint256 creditCardId,
        int256 amountInYuan  // 以元为单位输入
    ) public returns (uint256) {
        // 动态字符串数组
        string[] memory errorMessages = new string[](2);
        uint256 errorCount = 0;

        // 收集错误信息
        if (creditCardId.numLength() != 16) {
            errorMessages[errorCount] = unicode"请输入有效的银行卡号";
            errorCount++;
        }
        if (amountInYuan <= 0) {
            errorMessages[errorCount] = unicode"金额必须大于0";
            errorCount++;
        }
        
        // 如果有错误，将所有错误信息合并
        if (errorCount > 0) {
            string memory allErrors = "";
            for (uint256 i = 0; i < errorCount; i++) {
                if (i > 0) {
                    allErrors = string(abi.encodePacked(allErrors, "; "));
                }
                allErrors = string(abi.encodePacked(allErrors, errorMessages[i]));
            }
            revert(allErrors);
        }
        
        int256 amountInFen = amountInYuan * 100;  // 转换为分
        
        uint256 creditId = credits.length;
        credits.push(Credit({
            creditCardId: creditCardId,
            amount: amountInFen,
            timestamp: block.timestamp,
            isRepaid: false
        }));
        
        // 添加银行卡号到信贷记录的映射
        creditCardCredits[creditCardId].push(creditId);
        
        emit CreditCreated(
            creditCardId,
            amountInFen,
            block.timestamp
        );
        
        return creditId;
    }
    
    // 第2个功能：获取所有信贷记录
    // function getCreditsByCard(uint256 creditCardId) public view returns (uint256[] memory) {
    //     return creditCardCredits[creditCardId];
    // }
    
    // 第3个功能：获取信贷记录详情
    // function getCreditDetails(uint256 creditId) public view returns (
    //     uint256 creditCardId,
    //     int256 amount,
    //     uint256 timestamp,
    //     bool isRepaid
    // ) {
    //     require(creditId < credits.length, unicode"信贷记录不存在");//?存疑
    //     Credit storage credit = credits[creditId];
    //     return (
    //         credit.creditCardId,
    //         credit.amount,
    //         credit.timestamp,
    //         credit.isRepaid
    //     );
    // }
    
    // 第2个功能：获取银行卡的所有信贷记录详情
    function getCardCreditDetails(uint256 creditCardId) public view returns (
        uint256[] memory creditIds,
        int256[] memory amounts,
        uint256[] memory timestamps,
        bool[] memory repaidStates
    ) {
        uint256[] memory ids = creditCardCredits[creditCardId];
        uint256 length = ids.length;
        
        amounts = new int256[](length);
        timestamps = new uint256[](length);
        repaidStates = new bool[](length);
        
        for (uint256 i = 0; i < length; i++) {
            Credit storage credit = credits[ids[i]];
            amounts[i] = credit.amount;
            timestamps[i] = credit.timestamp;
            repaidStates[i] = credit.isRepaid;
        }
        
        return (ids, amounts, timestamps, repaidStates);
    }
} 
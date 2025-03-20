// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    struct Credit {
        int256 amount;       // 金额（以分为单位）
        uint256 timestamp;    // 交易时间戳
        bool isRepaid;       // 是否已还款
    }

    Credit[] public credits;

    function createCredit(
        int256 amountInYuan  // 以元为单位输入
    ) public returns (uint256) {
        // 动态字符串数组
        string[] memory errorMessages = new string[](2);
        uint256 errorCount = 0;
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
            amount: amountInFen,
            timestamp: block.timestamp,
            isRepaid: false
        }));
        return creditId;
    }}

const CreditSystem = require('../ceramic/creditSystem')
const crypto = require('crypto')

module.exports = async function(callback) {
  try {
    console.log('开始测试 Ceramic 信用系统...')
    
    // 初始化系统
    const creditSystem = new CreditSystem()
    
    // 生成测试用的随机种子
    const seed = crypto.randomBytes(32)
    
    // 认证
    await creditSystem.authenticate(seed)
    console.log('认证成功')
    
    // 创建信用分数
    const score = 85
    const result = await creditSystem.createCreditScore(
      'did:key:test',  // 测试用的 DID
      score
    )
    console.log('创建信用分数结果:', result)
    
    callback()
  } catch (error) {
    console.error('测试过程出错:', error)
    callback(error)
  }
}
const { CeramicClient } = require('@ceramicnetwork/http-client')
const { ComposeClient } = require('@composedb/client')
const { DID } = require('dids')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const { getResolver } = require('key-did-resolver')

class CreditSystem {
  constructor(ceramicNode = 'https://ceramic-clay.3boxlabs.com') {
    this.ceramic = new CeramicClient(ceramicNode)
    // 注意：实际使用时需要替换为你的 ComposeDB 定义
    this.compose = new ComposeClient({
      ceramic: this.ceramic,
      definition: {/* 你的 ComposeDB 定义 */}
    })
  }

  async createCreditScore(userDid, score) {
    const grade = this.calculateGrade(score)
    
    try {
      const result = await this.compose.executeQuery(`
        mutation {
          createCreditScore(input: {
            content: {
              score: ${score}
              grade: "${grade}"
              bankBAccess: true
              bankCAccess: true
            }
          }) {
            document {
              id
              score
              grade
            }
          }
        }
      `)
      return result
    } catch (error) {
      console.error('创建分数失败:', error)
      throw error
    }
  }

  calculateGrade(score) {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    return 'D'
  }

  async authenticate(seed) {
    try {
      const provider = new Ed25519Provider(seed)
      const did = new DID({ provider, resolver: getResolver() })
      await did.authenticate()
      this.ceramic.did = did
      return true
    } catch (error) {
      console.error('认证失败:', error)
      throw error
    }
  }
}

module.exports = CreditSystem
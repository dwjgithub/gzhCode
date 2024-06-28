const sha1 = require('sha1')
const config = require('../config')
const getRawBody = require('raw-body')
const parseString = require('xml2js').parseString
function parseXML(xml) {
  return new Promise((reslove, reject) => {
    parseString(xml, {
      trim: true,
      explicitArray: false
    }, (err, result) => {
      if (err) reject(err)
      reslove(result.xml)
    })
  })

}
module.exports = () => {
  return async ctx => {
    const { signature, echostr, timestamp, nonce } = ctx.query
    const { token } = config
    const sha1Str = sha1([timestamp, nonce, token].join(''))
    if (ctx.method === 'GET') {
      if (sha1Str === signature) {
        return ctx.body = echostr
      }
    } else if (ctx.method === 'POST') {
      if (sha1Str === signature) {
        
        return ctx.body = 'success'
      }
    }
  }
}
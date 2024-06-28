const sha1 = require('sha1')
const config = require('../config')

module.exports = ()=>{
  return async ctx => {
    if (ctx.method === 'GET') {
      const { signature, echostr, timestamp, nonce } = ctx.query
      const sha1Str =sha1([timestamp, nonce, config.token].join('')) 
      if(sha1Str===ctx.query.signature){
        return ctx.body = echostr
      }else{
        return false
      }
    }else if (ctx.method === 'POST') {
  
      return ctx.body = ' holle'
    }
  }
}
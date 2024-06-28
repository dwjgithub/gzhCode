const config = require('../config')
const wechatApi = require('co-wechat-api')

const api = new wechatApi(config.appid, config.AppSecret)
module.exports = api


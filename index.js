const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
    const koa = require('koa');
    const wechat = require('co-wechat')
    // 公众号服务器
    const app = new koa();
    // const wechat  = require('./wechat')
    const config = require('./config')
    const api = require('./api')
    const menuObj = {
      "button": [
        {
          "type": "click",
          "name": "今日歌曲",
          "key": "V1001_TODAY_MUSIC"
        },
        {
          "name": "菜单",
          "sub_button": [
            {
              "type": "view",
              "name": "搜索",
              "url": "http://www.soso.com/"
            }
          ]
        }
      ]
    }
    const createMenu = async (ctx, next) => {
      const getMenu = await api.createMenu(menuObj)
    }
    createMenu()
    app.use(wechat(config).middleware(async (message, ctx) => {
      if (message.Content === '1') {
        return {
          type: 'text',
          content: '你好'
        }
      }
    }))
  });
}

bootstrap();

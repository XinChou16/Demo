// 应用程序的启动(入口)文件

// 加载express模块
var express = require('express');
// 创建app应用 => nodejs http.createServer();
var app = express();

/**
 * req
 * res
 */
app.get('/',function (req,res,next) {
    res.send('<h1>欢迎光临我的博客</h1>');
});


// 监听http请求
app.listen(8000);
console.log('Running at port: 8000');
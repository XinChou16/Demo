// 应用程序的启动(入口)文件

// 加载express模块
var express = require('express');
// 加载模板处理模块
var swig = require('swig');
var mongoose = require('mongoose');
// 创建app应用 => nodejs http.createServer();
var app = express();

// 设置静态文件托管
// 当用户访问的url以public开始，那么直接返回__dirname = '/public'下的文件
app.use('/public',express.static(__dirname + '/public'));

// 配置模板
// 定义当前应用所使用的模板引擎
// 参数一：模板引擎的名称，同时也是模板文件的后缀
// 参数二：用于解析处理模板内容
app.engine('html',swig.renderFile);
// 设置模板文件存放的目录，参数一必须uiviews,参数二是目录
app.set('views','./views');
// 注册所使用的模板引擎，参数一必须是view engine,
// 第二个参数和这个方法当中定义的模板引擎的名称是一致的
app.set('view engine','html');
// 开发过程，需要取消模板缓存
swig.setDefaults({cache:false});

/**
 * 根据不同的功能划分模块
 */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


// 监听http请求
mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if(err){
        console.log('fail');
    }else {
        console.log('success');
        
        app.listen(8000);
        console.log('Running at port: 8000');
    }
});

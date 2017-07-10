// 应用程序的启动(入口)文件

// 加载express模块
var express = require('express');
// 加载模板处理模块
var swig = require('swig');
// 加载mongoose模块
var mongoose = require('mongoose');
// 加载body-parser，用来处理post提交的数据
var bodyParser = require('body-parser');
// 加载cookie
var Cookies = require('cookies')
// 创建app应用 => nodejs http.createServer();
var app = express();

var User = require('./models/User');

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
// 当省略时，注册所使用的模板引擎，参数一必须是view engine,
// 第二个参数和这个方法当中定义的模板引擎的名称是一致的
app.set('view engine','html');
// 开发过程，需要取消模板缓存
swig.setDefaults({cache:false});

// bodyParser设置
app.use(bodyParser.urlencoded({extended: true}) );

// 设置cookie
app.use( (req,res,next) => {
    req.cookies = new Cookies(req,res);
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            // 获取当前登录用户类型，是否是管理员
            User.findById(req.userInfo._id).then( (userInfo) => {
                req.userInfo.isAdmin = Boolean(userInfo);
                next();
            } )
        } catch (error) {}
    }else{
        next(); 
    }
});

/** 
 * 根据不同的功能划分模块
 */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


// 监听http请求
mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if(err){
        console.log('数据库连接fail');
    }else {
        console.log('数据库连接success');
        
        // 连接到数据库才开始监听
        app.listen(8000);
        console.log('Running at port: 8000');
    }
});
//  app.listen(8000);
// console.log('Running at port: 8000');
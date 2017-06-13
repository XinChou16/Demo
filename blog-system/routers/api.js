/**  */

var express = require('express');
var router = express.Router();
// 可以像操作对象一样操作数据
var User = require('../models/User');
//没有踩坑就不会有这条注释
var Content = require('../models/content');

// 统一返回格式
var responseData;

router.use( function (req,res,next) {
    responseData = {
        code: 0,
        message: '',
    }
    next();
} );

/** 
 * 用户注册
 * 注册逻辑
 * 1，用户名不能为空
 * 2，密码不能为空
 * 3,两次输入 密码必须一致
 * 
 * 用户名不能重复注册
 * 查询数据库
 */
// 注册路由
router.post('/user/register',function(req,res,next){
 
    //    console.log( req.body);
   var username = req.body.username;
   var password = req.body.password;
   var repassword = req.body.repassword;

    //  1，用户名不能为空
    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);//返回前端数据
        return;
    }
    //  2，密码不能为空
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);//返回前端数据
        return;
    }
    //  3，两次输入 密码必须一致
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = '两次输入密码必须一致';
        res.json(responseData);//返回前端
        return;
    }

    //用户名是否已经被注册，数据库操作 
    User.findOne({
        username: username
    }).then(function ( userInfo ){
        console.log('userInfo'+userInfo)
        if( userInfo ){
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return ;
        }
        // 保存用户注册的信息到数据库
        var user = new User ({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo){
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);//返回前端    
    })


});

// 登录路由
router.post('/user/login',function(req,res){
   var username = req.body.username;
   var password = req.body.password;

    //  用户名密码不能为空
    if (username == ''|| password == '') {
        responseData.code = 1;
        responseData.message = '用户名密码不能为空';
        res.json(responseData);//返回前端
        return;
    }
    // 查询数据库中相同用户名，密码是否存在
    User.findOne({
        username: username,
        password: password
    }).then(function ( userInfo ){
        if( !userInfo ){
            responseData.code = 2;
            responseData.message = '用户名不存在';
            res.json(responseData);
            return ;
        }
        // 用户名正确
        responseData.message = '登录成功';
        // 显示后台的信息
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    })

})


// 退出
router.get('/user/logout',(req,res) =>{
    req.cookies.set('userInfo',null);
    responseData.message = '退出',
    res.json(responseData);
})

// 获取指定文章的所有评论
router.get('/comment/',function(req,res){
    // 内容的ID
    var contentid = req.query.contentid || '';
    
    // 查询内容的信息
    Content.findOne({
        _id: contentid
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
    })

})


// 评论提交
router.post('/comment/post',function(req,res){
    // 内容的ID
    var contentid = req.body.contentid || '';
    
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    }

    // 查询内容的信息
    Content.findOne({
        _id: contentid
    }).then(function (content) {
        content.comments.push(postData)
        return content.save();
        // res.render('main/view', data);//省略html后缀
    }).then(function(newContent){
        responseData.code = 0;
        responseData.data = newContent;
        responseData.message = '评论成功';
        res.json(responseData);//返回前端

    });



})



module.exports = router;
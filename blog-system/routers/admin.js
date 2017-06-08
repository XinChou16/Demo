/**  */

var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo: req.userInfo
    });
    
});

/**
 * 用户管理
 */
router.get('/user',(req,res) => {
    /**
     * 从数据库读取数据
     * limit(num)，限制条数
     * skip(),忽略数据的条数
     * 每页显示2条
     * 
     */
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    User.count().then( (count) => {
        
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page,pages);
        // 取值不能小于1
        page = Math.max(page,1);
        var skip = (page - 1) * limit;

        // 异步操作，必须在这之后
        User.find().limit(limit).skip(skip).then( (users) =>{
            res.render('admin/user_index',{
            userInfo: req.userInfo,
            users: users,
            count: count,
            pages: pages,
            limit: limit,
            page: page
        });
    })


});

    
    
});

module.exports = router;
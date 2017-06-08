/**  */

var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    // 渲染主页
    res.render('main/index',{
        userInfo: req.userInfo
    });//省略html后缀
});

module.exports = router;
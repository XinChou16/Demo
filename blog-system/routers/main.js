/**  */

var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Content = require('../models/Content');
var data;

//处理通用数据
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: [],
    }

    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })

})

router.get('/', function (req, res, next) {

    data.category = req.body.category || '';
    data.page = Number(req.query.page || 1);
    data.limit = 3;
    data.pages = 0;
    data.count = 0;

    var where = {};
    if (data.category) {
        where.category = data.category;
    }
    // 读取所有的分类信息
    Category.where(where).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        // 取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        // 取值不能小于1
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        });

    }).then(function (contents) {
        data.contents = contents;
        // 渲染主页
        res.render('main/index', data);//省略html后缀
    })

});

router.get('/view', function (req, res) {
    var contentid = req.query.contentid || '';

    // 读取所有的分类信息
    Category.findOne({
        _id: contentid
    }).then(function (content) {
        
        data.content = content;
        content.views++;
        content.save();

        res.render('main/view', data);//省略html后缀
    })
})

module.exports = router;
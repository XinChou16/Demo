/** admin router module */

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/category');
var Content = require('../models/content');

router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });

});

/**
 * 用户管理
 */
router.get('/user', (req, res) => {
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
    User.count().then((count) => {

        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        // 异步操作，必须在这之后
        User.find().limit(limit).skip(skip).then((users) => {
            res.render('admin/user_index', {
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

/**
 * 分类首页
 */
router.get('/category', (req, res) => {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then((count) => {

        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        // 异步操作，必须在这之后
        Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then((categories) => {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        })
    });
});

/**
 * 分类首页
 */
router.get('/category/add', (req, res) => {

    res.render('admin/category_add', {
        userInfo: req.userInfo,
    });

});

/**
 * 分类的增加
 */
router.post('/category/add', function (req, res) {

    var name = req.body.name || '';
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }

    // 数据库是否已经存在同名的数据名称
    Category.findOne({
        name: name,
    }).then((rs) => {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在'
            })
            return Promise.reject();
        } else {
            // 数据库不存在该分类，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then((newCategory) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        })
    })
});

/**
 * 分类的修改
 */
router.get('/category/edit', function (req, res) {
    // 获取要修改的分类信息，以表单形式展现
    var id = req.query.id || '';
    // 获取分类信息
    Category.findOne({
        _id: id,
    }).then((category) => {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }
    })
    // .then((newCategory) => {
    //     res.render('admin/success', {
    //         userInfo: req.userInfo,
    //         message: '分类保存成功',
    //         url: '/admin/category'
    //     })
    // })


});



/**
 * 分类的保存
 */
router.post('/category/edit', function (req, res) {
    // 获取要修改的分类信息，以表单形式展现
    var id = req.query.id || '';
    var name = req.body.name || '';
    // 获取分类信息
    Category.findOne({
        _id: id,
    }).then((category) => {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '分类修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                Category.findOne({
                    _id: { $ne: id },
                    name: name
                })
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '存在同名分类'
            })
            return Promise.reject();
        } else {
            return Category.update({
                _id: id,
            }, {
                    name: name
                })
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        })
        return Promise.reject();
    })


});

/**
 * 分类的删除
 */
router.get('/category/delete', function (req, res) {

    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        })
    });
});

/**
 * 内容首页
 */
router.get('/content', (req, res) => {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then((count) => {

        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        // 异步操作，必须在这之后
        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({
            addTime: -1
        }).then((contents) => {

            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        })
    });
});

router.get('/content/add', (req, res) => {

    Category.find().sort({ _id: -1 }).then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        });

    })
});


/**
 * 内容的保存
 */
router.post('/content/add', function (req, res) {
    // console.log(req.body)

    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类名不能为空'
        });
        return;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容名不能为空'
        });
        return;
    }

    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function (rs) { // 注意参数
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        });
    })

});

/**
 * 内容的修改
 */
router.get('/content/edit', function (req, res) {
    // 获取要修改的内容信息，以表单形式展现
    var id = req.query.id || '';
    var categories = [];
    Category.find().sort({ _id: 1 }).then(function (rs) {
        // 获取内容信息
        categories = rs;

        return Content.findOne({// 数组，单个用findone
            _id: id,
        }).populate('category')
    }).then((content) => {
            // console.log(content)
            if (!content) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '内容信息不存在'
                });
                return Promise.reject();
            } else {
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    categories: categories,
                    content: content
                })
            }
        })



    // .then((newcontent) => {
    //     res.render('admin/success', {
    //         userInfo: req.userInfo,
    //         message: '内容保存成功',
    //         url: '/admin/content'
    //     })
    // })


});

/**
 * 保存内容修改
 */
router.post('/content/edit', function (req, res) {
    // 获取要修改的内容信息，以表单形式展现
    var id = req.query.id || '';
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类名不能为空'
        });
        return;
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '标题不能为空'
        });
        return;
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容名不能为空'
        });
        return;
    }

    Content.update({
        _id: id,
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content 
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content/edit?id='+id
        });
    })


});

/**
 * 内容的删除
 */
router.get('/content/delete', function (req, res) {

    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        })
    });
});






module.exports = router;
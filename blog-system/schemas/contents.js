/**
 * 
 */

var mongoose = require('mongoose');


// 内容的表结构
module.exports = new mongoose.Schema({

    // 关联字段 - 分类的ID
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    // 内容标题
    title: String,

    // 添加时间
    addTime:{
        type: Date,
        default: new Date(),

    },
    // 阅读量
    views:{
        type: Number,
        default: 0
    },

    // 关联字段 - 用户的ID
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    description:{
        type: String,
        default: ''
    },
    content:{
        type: String,
        default: ''
    }
    
});

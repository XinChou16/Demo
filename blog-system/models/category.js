/**
 * 
 */

var mongoose = require('mongoose');
var categriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category',categriesSchema);
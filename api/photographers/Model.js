var mongoose = require('mongoose');
var photoSchema = require('./Schema.js');

module.exports = mongoose.model('photoprofile', photoSchema);

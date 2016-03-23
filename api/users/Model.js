var mongoose = require('mongoose');
var accountSchema = require('./Schema.js');

module.exports = mongoose.model('account', accountSchema);

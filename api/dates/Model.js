var mongoose = require('mongoose');
var dateSchema = require('./Schema.js');

module.exports = mongoose.model('dates', dateSchema);

var mongoose = require('mongoose');

var dateSchema = mongoose.Schema({
  dateVal: Date,
  photographerIds:[String]
});

module.exports = dateSchema;

dateSchema.index({dateVal: 1}, {unique: true});

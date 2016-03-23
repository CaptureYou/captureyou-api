var mongoose = require('mongoose');
var bookingSchema = require('./Schema.js');

module.exports = mongoose.model('bookings', bookingSchema);

var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
  clientId: String,
  photographerId: String,
  eventDate: {type: Date, validate: [checkDates, 'Date has to be future']},
  totalAmount: Number,
  location: {
    address: String,
    zipcode: Number
  },
  eventDescription: String,
  photographerApproval: {type: Boolean, default: false},
  updatedAt: {type: Date, default: new Date(0)}
});

module.exports = bookingSchema;

function checkDates(value) {
   return value > Date.now();
}

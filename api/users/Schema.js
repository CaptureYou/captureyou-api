var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
  facebookId: String,
  created: { type: Date, default : Date.now },
  fullName: {
    familyName: String,
    givenName: String,
    middleName: String
  },
  displayName: String,
  email: String,
  image: String,
  tokens: [String],
  photographerId: {type: String, default: null},
  isAdmin: { type: Boolean, default: false}
});

module.exports = accountSchema;

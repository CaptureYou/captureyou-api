var mongoose = require('mongoose');

var photoSchema = mongoose.Schema({
  userId: String,
  equipment: {
    camera: String,
    extras: String
  },
  genre: {
    wedding: {type: Boolean, default: false},
    gradutaion: {type: Boolean, default: false},
    family: {type: Boolean, default: false},
    sports: {type: Boolean, default: false}
  },
  zipCodes:[Number]
});

module.exports = photoSchema;

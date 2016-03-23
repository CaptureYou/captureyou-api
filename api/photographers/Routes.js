'use strict'

module.exports = photoRoutes;

var callCheck = require('../../general/callCheck.js');

function photoRoutes(app) {
  app.get('/photoprofile', callCheck, require('./get.js'));
  app.get('/photoprofile/:id', callCheck, require('./getById.js'));
  app.post('/photoprofile/create', callCheck, require('./createNewPhotographer.js'));
}

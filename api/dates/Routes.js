'use strict'

module.exports = dateRoutes;

var callCheck = require('../../general/callCheck.js');

function dateRoutes(app) {
  app.get('/dates/', callCheck, require('./get.js'));
  app.get('/dates/:year/:month/:date', callCheck, require('./getAvailablePhotographer.js'));
  //app.put('/dates/:date', callCheck, require('./updateAvailablePhotographers.js'));
  app.post('/photoprofile/:id/dates/', callCheck, require('./updatePhotographerDates.js'));
}

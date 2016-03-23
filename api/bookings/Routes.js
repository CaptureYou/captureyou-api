'use strict'

module.exports = bookingRoutes;

var callCheck = require('../../general/callCheck.js');

function bookingRoutes(app) {
  app.get('/user/:id/bookings/', callCheck, require('./getByClientId.js'));
  app.get('/photoprofile/:id/bookings/', callCheck, require('./getPhotographerBookings.js'));
  app.post('/bookings/:id', callCheck, require('./updatePhotographerBooking.js'));
  app.post('/bookings/add', callCheck, require('./createNewBooking.js'));
}

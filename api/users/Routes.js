'use strict'

module.exports = userRoutes;

var callCheck = require('../../general/callCheck.js');

function userRoutes(app) {
  app.get('/users', callCheck, require('./get.js'));
  app.get('/users/:id', callCheck, require('./getById.js'));
  app.post('/syncUser', callCheck, require('./syncUser.js'));
}

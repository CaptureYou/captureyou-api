'use strict';

var self = getByClientId;
module.exports = self;

var async = require('async');
var BookingModel = require('./Model.js');

function getByClientId(req, res) {
  logs.info('Applying', getByClientId.name);

  var sack = {
    req: req,
    headers: req.headers,
    userCaller: req.userModel,
    resBody: [],
    params: req.params
  }

  async.series([
      checkInput_.bind(null, sack),
      formOutput_.bind(null, sack)
    ],
    function(err) {
      if(err){
        logs.error(err);
        return;
      }
      logs.info('Finished', self.name)
      return res.json(200, sack.resBody);
    }
  );

}

function checkInput_(sack, next){
  var method = self.name + ' | '+ checkInput_.name;
  logs.debug('In', method);

  if(!sack.req)
    return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));

  if(!sack.headers)
    return next(new CallErr(method, CallErr.DataNotFound, 'No headers found'));

  return next();
}

function formOutput_(sack, next){
  var method = self.name + ' | '+ formOutput_.name;
  logs.debug('In', method);

  var searchId = sack.params.id;
  BookingModel.findOne({clientId: searchId},
    function (err, bookingData) {
      if (err)
        return next(new CallErr(who, CallErr.DBEntityNotFound,
          'Database error finding token', err));
      var response = _.map(booking, function (bookingData) {
        return {
          bookingId: bookingData._id,
          photographerId: bookingData.photographerId,
          eventDate: bookingData.eventDate,
          totalAmount: bookingData.totalAmount,
          location: bookingData.location,
          eventDescription: bookingData.eventDescription,
          photographerApproval: bookingData.photographerApproval
        };
      });
      sack.resBody = response;

      return next();
    }
  );

}

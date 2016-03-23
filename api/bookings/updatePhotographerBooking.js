'use strict';

var self = updatePhotographerBooking;
module.exports = self;

var async = require('async');
var BookingModel = require('./Model.js');
var request = require('request');

function updatePhotographerBooking(req, res) {
  logs.info('Applying', updatePhotographerBooking.name);

  var sack = {
    req: req,
    headers: req.headers,
    body: req.body,
    userCaller: req.userModel,
    resBody: [],
    params: req.params
  }

  async.series([
      checkInput_.bind(null, sack),
      frameData_.bind(null, sack),
      updateBookingData.bind(null, sack)
    ],
    function(err) {
      if(err){
        logs.error(err);
        return;
      }
      logs.info('Completed', updatePhotographerBooking.name);
      return res.json(200, sack.resBody);
    }
  );

}

function checkInput_(sack, next){
  var method = self.name + ' | '+ checkInput_.name;
  logs.debug('In', method);

  if(!sack.req)
    return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));

  if(!sack.body)
    return next(new CallErr(method, CallErr.DataNotFound, 'No body found'));

  next();
}

function frameData_(sack, next){
  var method = self.name + ' | '+ frameData_.name;
  logs.debug('In', method);
  sack.data = {
    updatedAt: Date.now(),
  };
  if(sack.body.photographerApproval){
    sack.data.photographerApproval = sack.body.photographerApproval
  }
  next();
}

function updateBookingData(sack, next){
  var method = self.name + ' | '+ updateBookingData.name;
  logs.info('In', method);

  BookingModel.findOneAndUpdate(sack.params.id,
    {$set: sack.data},
    function (err, booking) {
      if (err)
        return next(new CallErr(who, CallErr.DBEntityNotFound,
          'Failed to update booking', err));
      if (!booking) {
        return next();
      }
      sack.resBody = booking;
      next();
    }
  );

}

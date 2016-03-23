'use strict';

var self = createNewBooking;
module.exports = self;

var async = require('async');
var BookingModel = require('./Model.js');
var request = require('request');

function createNewBooking(req, res) {
  logs.info('Applying', createNewBooking.name);

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
      insertBookingData_.bind(null, sack)
    ],
    function(err) {
      if(err){
        logs.error(err);
        return;
      }
      logs.info('Completed', createNewBooking.name);
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
    clientId:sack.body.clientId,
    photographerId:sack.body.photographerId,
    eventDate:sack.body.eventDate,
    totalAmount:sack.body.totalAmount,
    location: sack.body.location,
    eventDescription: sack.body.eventDescription
  };
  next();
}

function insertBookingData_(sack, next){
  var method = self.name + ' | '+ insertBookingData_.name;
  logs.info('In', method);
  BookingModel.create(sack.data,
    function (err, booking) {
      if (err)
        return next(new CallErr(who, CallErr.DBOperationFailed,
          'Failed to create booking', err));
      if (!booking) {
        return next();
      }
      sack.resBody.push(booking._id);
      next();
    }
  );

}

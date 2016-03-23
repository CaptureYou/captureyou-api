'use strict';

var self = updatePhotographerDates;
module.exports = self;

var async = require('async');
var DateModel = require('./Model.js');
var request = require('request');

function updatePhotographerDates(req, res) {
  logs.info('Applying', updatePhotographerDates.name);

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
      logs.info('Completed', updatePhotographerDates.name);
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
  sack.date = {dateVal: new Date(sack.body.dateVal)};
  sack.data = {
    'photographerIds': sack.params.id
  };
  next();
}

function updateBookingData(sack, next){
  var method = self.name + ' | '+ updateBookingData.name;
  logs.info('In', method);
  var request = async.each(sack.body.dates, function(dateNew, nextDate){
    var newDate = {dateVal: new Date(dateNew)};
    DateModel.findOneAndUpdate(newDate,
      {$push: sack.data},
      function (err, dates) {
        if (err)
          return next(new CallErr(who, CallErr.DBEntityNotFound,
            'Failed to update booking', err));
        if (!dates) {
          return next();
        }
        sack.resBody.push(dateNew);
      }
    );
    nextDate();
  });
  next();

}

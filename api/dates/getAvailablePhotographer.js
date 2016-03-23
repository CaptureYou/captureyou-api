'use strict';

var self = getAvailablePhotographer;
module.exports = self;

var async = require('async');
var DateModel = require('./Model.js');

function getAvailablePhotographer(req, res) {
  logs.info('Applying', getAvailablePhotographer.name);

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
      return res.status(200).json(sack.resBody);
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

  var searchId = new Date(sack.params.year, sack.params.month, sack.params.date);
  DateModel.findOne({dateVal: searchId},
    function (err, photoIds) {
      if (err)
        return next(new CallErr(who, CallErr.DBEntityNotFound,
          'Database error finding token', err));

      sack.resBody = photoIds.photographerIds;
      next();
    }
  );

}

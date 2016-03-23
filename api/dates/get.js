'use strict';

var self = get;
module.exports = self;

var async = require('async');
var DateModel = require('./Model.js');

function get(req, res) {
  logs.info('Applying', self.name);

  var sack = {
    req: req,
    headers: req.headers,
    userCaller: req.userModel,
    resBody: []
  }

  async.series([
      checkInput_.bind(null, sack),
      formOutput_.bind(null, sack)
    ],
    function(err) {
      if(err){
        return throwErr(res, err);
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

  if(!sack.userCaller)
    return next(new CallErr(method, CallErr.CallerUserNotFound, 'No User found'));

  next();
}

function formOutput_(sack, next){
  var method = self.name + ' | '+ formOutput_.name;
  logs.debug('In', method);

  DateModel.find({},
    function (err, dates) {
      if (err)
        return next(new CallErr(who, CallErr.DBEntityNotFound,
          'Database error finding token', err));
      sack.resBody = dates;
      next();
    }
  );

}

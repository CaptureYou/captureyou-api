'use strict';

var self = callCheck;
module.exports = self;

var async = require('async');
var UserModel = require('../api/users/Model.js');

function callCheck(req, res, next) {
  logs.info('Applying', callCheck.name);

  var sack = {
    req: req,
    headers: req.headers
  }

  async.series([
      checkInput_.bind(null, sack),
      breakAccessToken_.bind(null, sack),
      formOutput_.bind(null, sack)
    ],
    function(err) {
      if(err){
        logs.error(err);
        return;
      }
      return next();
    }
  );

}

function checkInput_(sack, next){
  var method = self.name + ' | '+ checkInput_.name;
  logs.info('In', method);

  if(!sack.req)
    return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));

  if(!sack.headers)
    return next(new CallErr(method, CallErr.DataNotFound, 'No headers found'));

  next();
}

function breakAccessToken_(sack, next){
  var method = self.name + ' | ' + breakAccessToken_.name;
  logs.info('In', method);
  var accessToken = sack.headers.authorization;
  if(!accessToken)
    return next(new CallErr(method, CallErr.DataNotFound, 'API Token Not found'));
  if(accessToken.indexOf('accessToken') == 0)
    accessToken = accessToken.split(' ');
  if(accessToken.length == 2 && accessToken[1].split('-') > 1)
    logs.debug('Call Contains Valid API Token');

  sack.accessToken = accessToken[1];

  next();
}

function formOutput_(sack, next){
  var method = self.name + ' | '+ formOutput_.name;
  logs.info('In', method);

  UserModel.findOne({tokens: sack.accessToken},
    function (err, user) {
      if (err)
        return next(new CallErr(who, CallErr.DBEntityNotFound,
          'Database error finding token', err));

      if (!user) {
        //maybe its a machine token
        return next();
      }

      sack.req.userModel = user;
      next();
    }
  );

}

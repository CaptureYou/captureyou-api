'use strict';

var self = getById;
module.exports = self;

var async = require('async');
var UserModel = require('./Model.js');

function getById(req, res) {
  logs.info('Applying', getById.name);

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

  var searchId = sack.params.id;
  UserModel.findOne({facebookId: searchId},
    function (err, user) {
      if (err)
        return next(new CallErr(who, CallErr.DBEntityNotFound,
          'Database error finding token', err));
      if(!user){
        return next();
      }
      if (sack.userCaller && user.facebookId == sack.userCaller.facebookId) {
        sack.resBody.push(user);
      } else {
        sack.resBody = {
          facebookId: user.facebookId,
          displayName: user.displayName,
          fullName: user.fullName,
          email: user.email,
          image: user.image
        }
      }

      next();
    }
  );

}

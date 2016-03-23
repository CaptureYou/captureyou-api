'use strict';

var self = syncUser;
module.exports = self;

var async = require('async');
var UserModel = require('./Model.js');
var request = require('request');

function syncUser(req, res) {
  logs.info('Applying', syncUser.name);

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
      createQuery_.bind(null, sack),
      upsertAccounts_.bind(null, sack)
    ],
    function(err) {
      if(err){
        logs.error(err);
        return;
      }
      logs.info('Completed', syncUser.name);
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

function createQuery_(sack, next){
  var method = self.name + ' | '+ createQuery_.name;
  logs.debug('In', method);
  sack.query = {
    facebookId: sack.body.facebookId
  };
  var token = sack.headers.authorization.split(" ")[1];
  sack.data = {
    facebookId: sack.body.facebookId,
    fullName: sack.body.fullName,
    displayName: sack.body.displayName,
    email: sack.body.email,
    image: sack.body.image,
    tokens: sack.body.tokens,
  };
  next();
}

function upsertAccounts_(sack, next){
  var method = self.name + ' | '+ upsertAccounts_.name;
  logs.info('In', method);


  UserModel.findOneAndUpdate(sack.query,
    {$set: sack.data},
    {upsert: true, new: true},
    function (err, user) {
      if (err)
        return next(new CallErr(who, CallErr.DBEntityNotFound,
          'Database error finding token', err));

      if (!user) {
        return next();
      }

      sack.resBody = user;
      next();
    }
  );

}

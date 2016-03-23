'use strict';

var self = getById;
module.exports = self;

var async = require('async');
var PhotoModel = require('./Model.js');

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
  PhotoModel.findOne({userId: searchId},
    function (err, user) {
      if (err)
        return next(new CallErr(who, ActErr.DBEntityNotFound,
          'Database error finding token', err));

      sack.resBody = {
        userId: body.userId,
        equipment: body.equipment,
        genre: body.genre,
        zipCodes: body.zipCodes
      }

      return next();
    }
  );

}

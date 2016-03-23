'use strict';

var self = createNewPhotographer;
module.exports = self;

var async = require('async');
var PhotoModel = require('./Model.js');
var request = require('request');

function createNewPhotographer(req, res) {
  logs.info('Applying', createNewPhotographer.name);

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
      createPhotographer.bind(null, sack)
    ],
    function(err) {
      if(err){
        logs.error(err);
        return;
      }
      logs.info('Completed', self.name);
      return res.status(200).json(sack.resBody);
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
    userId: sack.userCaller.facebookId,
    equipment: {
      camera: sack.body.camera,
      extras: sack.body.extras
    },
    genre: {
      wedding: sack.body.genre.wedding,
      gradutaion: sack.body.genre.gradutaion,
      family:sack.body.genre.family,
      sports: sack.body.genre.sports
    },
    zipCodes: sack.body.zipCodes
  };
  next();
}

function createPhotographer(sack, next){
  var method = self.name + ' | '+ createPhotographer.name;
  logs.info('In', method);
  PhotoModel.create(sack.data,
    function (err, photoprofile) {
      if (err)
        return next(new CallErr(who, CallErr.DBOperationFailed,
          'Failed to create photoprofile', err));
      if (!photoprofile) {
        return next();
      }
      sack.resBody.push(photoprofile);
      next();
    }
  );

}

// 'use strict';
//
// var self = get;
// module.exports = self;
//
// var async = require('async');
//
// function get(req, res) {
//   logs.info('Applying', self.name);
//
//   var sack = {
//     req: req,
//     headers: req.headers,
//     userCaller: req.userModel,
//     resBody: []
//   }
//
//   async.series([
//       checkInput_.bind(null, sack)
//     ],
//     function(err) {
//       if(err){
//         return throwErr(res, err);
//       }
//       logs.info('Finished', self.name)
//       sack.resBody.push(sack.userCaller.displayName);
//       return res.status(200).json(sack.resBody);
//     }
//   );
//
// }
//
// function checkInput_(sack, next){
//   var method = self.name + ' | '+ checkInput_.name;
//   logs.debug('In', method);
//
//   if(!sack.req)
//     return next(new CallErr(method, CallErr.DataNotFound, 'No request object found'));
//
//   if(!sack.userCaller)
//     return next(new CallErr(method, CallErr.CallerUserNotFound, 'No User found'));
//
//   next();
// }
//
// /* ADD METHOD TO CHECK DB IS PHOTOGRAPHER*/

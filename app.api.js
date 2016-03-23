var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var morgan   = require('morgan');
var glob = require('glob');
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('./general/CallError.js');
require('./general/determineErr.js');
require('./general/log.js');


// ENV Variables

process.title = 'Event Managers API';
var port = process.env.PORT || 8010;
global.WEBADDRESSPORT = '8000';

// Router
module.exports = startExpress;            // get an instance of the express Router
global.app = startExpress();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers',
    'Accept,Content-Type,Authorization,Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

function startExpress() {
  app.use(cookieParser('captureyouwww'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({ secret: 'captureyouwww', resave: true, saveUninitialized: true}));
  app.use(morgan('dev'));
  mongoose.set('debug', true);
  var mongoCon = mongoConnected.bind(null, app, 'mongodb://localhost:27017/captureyou');
  mongoose.connect('mongodb://localhost:27017/captureyou', {}, mongoCon);
}

function mongoConnected(app, mongoUrl, err){
  if(err) {
    logs.error('MongoDB failed to connect:', err);
    process.exit(1);
  }
  createRoutes(app);
}

function createRoutes(app){
  logs.info('Mongo is connected, creating routes.');
  glob.sync('./api/**/*Routes.js').forEach(activateRoute.bind(null, app));
  logs.info('ALL ROUTES LOADED');
}

function activateRoute(app, routeFile) {
  logs.debug('Loading route file: ' + routeFile);
  require(routeFile)(app);
}

app.all('/', function (req, res) {
    res.status(200).json({
      status: 'OK',
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      cookies: req.cookies
    });
});


// Start Server

app.listen(port);
logs.debug('Magic happens on port', port);

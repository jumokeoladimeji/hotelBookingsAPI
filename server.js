require('newrelic');
var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var multer = require('multer');


var CronJob = require('cron').CronJob;

var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/hotelsDB');
var db = mongoose.connection;
var updateHotels = require('./saveAllHotels');
var routes = require('./app/api/routes/bookings');

//environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}));
app.use(bodyParser.json()) // parse application/json
app.use(methodOverride()); // simulate DELETE and PUT
// app.use(multer());
app.use(express.static(path.join(__dirname, './public')));

var server = app.listen((process.env.PORT || 3000), function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Your app is running on localhost port 3000');
});



var router = express.Router(); // get an instance of the express Router

routes(app);



var env = process.env.NODE_ENV || 'development';
if ('development' == env) {

}

var job = new CronJob({
  cronTime: '00 00 11 * * 0-6',
  onTick: function() {
    console.log('run');
   updateHotels();
  },
  start: false
});
job.start();

setInterval(function() {
    http.get("https://hotel-bookings-api.herokuapp.com/");
}, 300000);


var express = require('express');
var io = require('socket.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config.json');


var levelup = require('levelup');
var db = levelup(__dirname + '/db', { valueEncoding: 'json' });



var routes = require('./routes/index');
var api = require('./routes/api');
var internal = require('./routes/internal');


var app = express();
var io = require('socket.io');
app.io = io();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.db = db;
  res.config = config;
  res.io = app.io;
  return next();
});

app.use('/', routes);
app.use('/api', api);
app.use('/internal', internal);

//socket io
app.io.on('connection', function (socket) {
  //console.log('a user connected');
  socket.on('message', function (msg) {
    //console.log('message: ' + msg);
  });
  socket.on('disconnect', function () {
    //console.log('user disconnected');
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;




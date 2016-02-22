var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var child_process = require('child_process');

var app = express();

// ============== socket.io.js  ============
var server = require('http').createServer(app);
// ==========================================

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

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// var io = require('socket.io')(server);
var io = require('socket.io').listen(server);


io.on('connection', function(client){
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

    client.on('messages', function(data) {
          console.log("here message");
          console.log("data: "+data);
           client.emit('broad', data);
           client.broadcast.emit('broad',data);
    });

    client.on('command', function(data) {

      console.log("here command");
      console.log("data: "+data);

      child_process.exec(data, function(err, stdout, stderr) {
           client.emit('broad', stdout);
           client.broadcast.emit('broad',stdout);
          console.log("stdout: "+stdout);
          console.log("err: "+err);
          console.log("stderr: "+stderr);
      });
    });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


server.listen(3001);
module.exports = app;

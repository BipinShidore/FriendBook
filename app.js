var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb').MongoClient;
const config = require('./config.json');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var friendRouter = require('./routes/friends');

var app = express();

// Connection URL
const url = config.mongodb.url;
 
// Database Name
const dbName = config.mongodb.dbName;
 
//Use connect method to connect to the server
mongodb.connect(url, function(err, client) {
  console.log("Connected successfully to database");
  const dbConnection = client.db(dbName);
  global.db = dbConnection;
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "content-type, accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, X-PINGOTHER, X-File-Name, Cache-Control");
    if ('OPTIONS' === req.method) {
        res.writeHead('200');
        res.end();
    } else {
        next();
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/friends',friendRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

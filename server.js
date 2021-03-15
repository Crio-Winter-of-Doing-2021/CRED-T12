var createError = require('http-errors');
var express = require('express');
const serverless = require("serverless-http");
const { startDB } = require('./dbConnection');
var path = require('path');
var logger = require('morgan');
var config = require('./src/global/config');
require('./src/models/user');
require('./src/utils/passport');
const endpoints = require('./endpoints');
const allowCrossDomain = require('./src/utils/cors');
const expressValidator = require('express-validator');


var app = express();

if (process.env.NODE_ENV !== 'test') {
  let port = process.env.PORT || 3001;
  app.listen(port, async () => { console.log('We are live on ' + port); });
  // make the connection with mongoDB database
  startDB();
}

app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
endpoints.initialise(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
module.exports.handler = serverless(app);

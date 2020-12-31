require("dotenv").config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var fs = require('fs');

var app = express();

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
app.use(express.static(path.join(__dirname, 'uploads')));


console.log(__dirname)

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, X-Powered-By, Content-Length, Connection');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

import init from "./src/dao/mongo/init";
import users from "./src/routes/UserRoute";
import items from "./src/routes/ItemRoute";
import borrowTransaction from "./src/routes/BorrowTransactionRoute";
import serviceItem from "./src/routes/ServiceItemRoute";
import vehicleTax from "./src/routes/VehicleTaxRoute";

import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "constants";


app.use(cors())
app.use('/users', users);
app.use('/items', items);
app.use('/borrowTransaction', borrowTransaction);
app.use('/serviceItem', serviceItem);
app.use('/vehicleTax', vehicleTax);

// coba paste filename bisa disave dan dicoba nice bang. Udah, direact tinggal disimpan aja path imagenya
app.get('/uploads/*', (req, res) => {
  const uploadedFileName = req.params[0];
  const file = path.join(__dirname, 'uploads/' + uploadedFileName)
  res.sendFile(file);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

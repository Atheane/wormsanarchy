'use strict';

var express = require('express');
var port = process.env.PORT || '3000';
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var router = express.Router();

var app = express();
var server = require('http').Server(app);

var index = require('./routes/index');


/// Routing
app.use('/', index);

/// Pug Set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

/// Serving Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/// Serving boostrap and jquery with nice urls
app.use('/lib/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/lib/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));

/// Set up Mongoose
var mongoDB = 'mongodb://nodeApp:56Lolatipo@127.0.0.1/wormsanarchy';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


















/// Handle 404
app.use(function(req, res) {
  res.status(404);
  res.render('404.pug', {title: '404: Page not found'});
});

/// Handle 500
app.use(function(error, req, res, next) {
  res.status(500);
  res.render('500.pug', {title:'500: Internal Server Error', error: error});
});


app.set('port', port);
server.listen(port);



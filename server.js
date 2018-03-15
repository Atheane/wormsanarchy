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


/// Sockets

// TODO multiplexing
// https://socket.io/docs/
var io = require('socket.io')(server);
var User = require('./models/user');

var connexion = 0;
io.on('connection', function (socket) {
  connexion += 1;
  console.log('connexion :' +  connexion);
  // list of all active players
  User.find({active: true}, function(err, list_users) {
    if (err) {console.log(err.name + ': ' + err.message); }
    console.log(list_users);
    socket.emit('allActivePlayers', list_users);
  });
  var socketNewPlayer = 0;
  socket.on('newPlayer', function (data) {
    socketNewPlayer += 1;
    console.log('socketNewPlayer :' + socketNewPlayer);
    console.log('socket')
    // data.pseudo = data.pseudo.trim;
    console.log(data);
    var re = /[a-zA-Z]+\w*/;
    var valid = {};
    valid.regexp = (re.exec(data.pseudo)) ? true : false;
    valid.length = (data.pseudo.length > 3) ? true : false;
    User.findOne({pseudo: data.pseudo}, function (err, user_exists) {
      if (err) {console.log(err.name + ': ' + err.message); }
      // Successful, so emit
      // console.log(user_exists);
      valid.newPseudo = (!user_exists) ? true : false;
      socket.emit('isValid?', valid);
      // console.log('valid.regexp :' + valid.regexp);
      // console.log('valid.length :' + valid.length);
      // console.log('valid.newPseudo : ' + valid.newPseudo);
      // console.log(valid.regexp && valid.length && valid.newPseudo);
      if (valid.regexp && valid.length && valid.newPseudo) {
        // console.log('condition is met');
        // socket.broadcast.emit('newPlayerToAll', data);
        var user = new User(
          {
            pseudo: data.pseudo,
            avatar: data.avatar,
            dateInscription: data.tsp,
            active: true,
            maxScore: 0
          });
        user.save(function (err) {
          if (err) {console.log(err.name + ': ' + err.message); }
          console.log('user ' + user.pseudo + ' is saved');
        });
      }
    });
  });
  // socket.on('worm', function(data) {
  //   socket.broadcast.emit('wormToAll', data);
  // });
});

// TODO ajouter un lien entre player et worm dans la bdd

// A mettre du cote server
//   game.score
//   worm.active = false <=> game over
//   players = {}
//   worms = {} (+ init)
//   background (+ init background.init(0,0,0,0))

// var worm = new Worm;
// var wormX = Math.floor(Math.random() * (this.wormCanvas.width + 1));
// var wormY = Math.ceil(this.wormCanvas.height*3.8/5);
// worm.init(wormX, wormY, 80, 80);



// A passer du server au client
//   keyPressed
//   worm
//   background
//   game(.score)
//   newPlayer















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



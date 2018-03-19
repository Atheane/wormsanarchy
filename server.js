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

var players = {};
var worms = {};

var keyPressed;
var InitY;

io.on('connection', function (socket) {
  // Fetch all active worms

  // Fetch all active players
  User.find({active: true}, function(err, list_users) {
    if (err) {console.log(err.name + ': ' + err.message); }
    socket.emit('allActivePlayers', list_users);
  });

  socket.on('newPlayer', function (player) {
    players[socket.id] = player;
    User.findOne({pseudo: player.pseudo}, function (err, user_exists) {
      if (err) {console.log(err.name + ': ' + err.message); }
      // Successful, so emit
      var valid = (!user_exists) ? true : false;
      socket.emit('isValid?', valid);

      if (valid) {
        socket.broadcast.emit('newPlayerToAll', player);
        socket.emit('allActiveWorms', Object.values(worms));
        var user = new User(
          { pseudo: player.pseudo,
            avatar: player.avatar,
            dateInscription: player.tsp,
            active: true,
            maxScore: 0
          });

        user.save(function (err) {
          if (err) {console.log(err.name + ': ' + err.message); }
          console.log('user ' + player.pseudo + ' is saved');
        });

      }
    });
  });

  socket.on('createWorm', function(worm) {
    if (worm) {
      // console.log(worm);
      worms[socket.id] = worm;
      // console.log(worms[socket.id]);
      // worm transmitted to all players except client
      socket.broadcast.emit('myWormToAll', worm);
    }
  });


  socket.on('updateWorm', function(worm) {
    console.log(worm);
    if (worm) {
      worms[socket.id] = worm;
      // worm updated to all players except client
      socket.broadcast.emit('updateWormToAll', worm);
    }
  });

});

// TODO ajouter un lien entre player et worm dans la bdd

// A mettre du cote server
//   game.score
//   worm.active = false <=> game over

// A passer du server au client
//   keyPressed
//   game(.score)



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



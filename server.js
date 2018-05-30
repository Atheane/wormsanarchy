'use strict';

var express = require('express');
var port = process.env.PORT || '3000';
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var router = express.Router();
var index = require('./routes/index');
var compression = require('compression');
var helmet = require('helmet');

var app = express();

var server = require('http').Server(app);

var _ = require('lodash');

app.use(compression()); //Compress all routes
app.use(helmet());
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
var mongoDB = process.env.MONGODB_URI || 'mongodb://nodeApp:56Lolatipo@ds141720.mlab.com:41720/wormsanarchy';

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

var collision;


io.on('connection', function (socket) {
  // Fetch all active worms

  // Fetch all active players for dashboard
  User.find({active: true}, function(err, players) {
    if (err) {console.log(err.name + ': ' + err.message); }
    socket.emit('allActivePlayers', players);
  });

  // Fetch all players for high-scores
  User.find({}, function(err, players) {
    if (err) {console.log(err.name + ': ' + err.message); }
    players = _.orderBy(players, ['score'],['desc']); // Use Lodash to sort array by 'name'

    socket.emit('allKnownPlayers', players);
  });

  socket.on('newPlayer', function (player) {
    console.log("newPlayer", player)
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
            score: 0
          });

        user.save(function (err) {
          if (err) {console.log(err.name + ': ' + err.message); }
          console.log('user ' + player.pseudo + ' is saved');
        });

      }
    });
  });

  socket.on('createWorm', function(worm) {
    worms[socket.id] = worm;
    // worm transmitted to all players except client
    socket.broadcast.emit('myWormToAll', worm);
  });

  socket.on('updateWorm', function(shooter) {
    if (shooter) {
      worms[socket.id] = shooter;
      if (shooter.weapon) {
        if (shooter.weapon.active) {
          Object.values(worms).forEach( function(shooted) {
            if (!Object.is(shooter, shooted) && collisionDetection(shooter.weapon.state, shooted.state)) {
              shooter.weapon.active = false
              if (collision && (Date.now() - collision) > 500) {
                console.log("collision")
                shooter.state.score += 50
                shooted.state.life -= 50

                if (shooted.state.life <= 0) {
                  io.emit('gameOver', shooted.props.pseudo)
                  shooted.state.active = false

                  // update the shooted status
                  User.findOne({pseudo: shooted.props.pseudo}, function (err, user) {
                    if (err) {console.log(err.name + ': ' + err.message) }
                    user.active = shooted.state.active
                    user.save()
                  })

                  shooter.state.score += 100
                }

                io.emit('collision', {
                  shooter: shooter,
                  shooted: shooted
                })

                // update the shooter score
                User.findOne({pseudo: shooter.props.pseudo}, function (err, user) {
                  if (err) {console.log(err.name + ': ' + err.message) }
                  user.score = shooter.state.score
                  user.save()
                })

              }
             collision = Date.now()
            }
          })
        }
      }
      socket.broadcast.emit('updateWormToAll', shooter)
    }
  })

  function collisionDetection (w1, w2) {
    return (w1.x < w2.x + 80 &&  w1.x + 80 > w2.x &&
     w1.y < w2.y + 80 &&  80 + w1.y > w2.y)
  }

  if (!Object.is) {
    Object.is = function(x, y) {
      // SameValue algorithm
      if (x === y) { // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
       // Step 6.a: NaN == NaN
       return x !== x && y !== y;
      }
    };
  }

  socket.on('disconnect', function() {
     console.log('Got disconnect!');
     var player = worms[socket.id];

     if (player && player !== null) {
       io.emit('userDisconnected',  player.props.pseudo )
       User.findOne({pseudo: player.props.pseudo}, function (err, player) {
         if (err) {console.log(err.name + ': ' + err.message); }
         player.active = false
         player.save()
       });
     }

     delete worms[socket.id]
  });

  socket.on('reload',function(){
    var player = worms[socket.id];
    if (player && player !== null) {
      io.emit('userDisconnected',  player.props.pseudo )
      User.findOne({pseudo: player.props.pseudo}, function (err, player) {
        if (err) {console.log(err.name + ': ' + err.message); }
        player.active = false
        player.save()
      });
    }
    delete worms[socket.id]
  })

});

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

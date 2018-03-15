'use strict';

///// Loading images
// Only needed when drawing canvas => client side
var imageContainer = {};

imageContainer.background = new Image;
imageContainer.walkLeft = new Image;
imageContainer.walkRight = new Image;
imageContainer.jumpLeft = new Image;
imageContainer.jumpRight = new Image;


var imageLoading = function() {
  $(imageContainer.background).on('load', function() {
    console.log('Background Image Loaded');
  });
  imageContainer.background.src = 'images/snow.png';
  imageContainer.background.id='background_snow';

  $(imageContainer.walkLeft).on('load', function() {
    console.log('walkLeft Image Loaded');
  });
  imageContainer.walkLeft.src = 'images/walk_left.png';
  imageContainer.walkLeft.id='walkLeft';

  $(imageContainer.walkRight).on('load', function() {
    console.log('walkRight Image Loaded');
  });
  imageContainer.walkRight.src = 'images/walk_right.png';
  imageContainer.walkRight.id='walkRight';

  $(imageContainer.jumpLeft).on('load', function() {
    console.log('jumpLeft Image Loaded');
  });
  imageContainer.jumpLeft.src = 'images/jump_left.png';
  imageContainer.jumpLeft.id='jumpLeft';

  $(imageContainer.jumpRight).on('load', function() {
    console.log('jumpRight Image Loaded');
  });
  imageContainer.jumpRight.src = 'images/jump_right.png';
  imageContainer.jumpRight.id='jumpRight';
};
imageLoading();

/// Background Constructor
var Background = function() {
}

Background.prototype.draw = function() {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.context.drawImage(imageContainer.background, 0, 0, imageContainer.background.width, imageContainer.background.height, 0, 0, this.canvasHeight*imageContainer.background.width/imageContainer.background.height, this.canvasHeight);
}

///// Drawing canvas functions

var socket = io.connect('http://localhost:3000');
// var socket = io.connect('http://18.196.138.28:3000');
console.log('Client connected to socket');

var game = {};

$(document).ready(function() {
  console.log('DOM ready');

  /// Fetch all active users
  socket.on('allActivePlayers', function(players) {
    $('ul.players').html('');
    players.forEach(function(player) {
      $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>');
    });
  });

  /// Form Handler
  $('.form-container').fadeIn(500);
  var player;
  $("#form").submit(function(event){
    event.preventDefault();
    var avatar = $('input[name=avatar]:checked').val();
    var pseudo = $('input#pseudo').val();
    // Empty form after click
    $('input#pseudo').val('');
    // Clean unwanted spaces
    pseudo = pseudo.trim();
    if (pseudo.length === 0) {
      $('h3#alert').html('You must choose a pseudo');
    } else {
      var re = /[a-zA-Z]+\w*/;
      if (!re.exec(pseudo)) {
        $('h3#alert').html('Invalid characters in pseudo');
      } else {
        if (pseudo.length < 4) {
          $('h3#alert').html('Pseudo must have at least 4 letters');
        } else {
          // Inscription date
          var tsp = Date.now();
          player = { avatar: avatar, pseudo: pseudo, tsp: tsp };
          // Push new player data to server
          socket.emit('newPlayer', player);
        }
      }
    }
  });

  // Server says if username valid of not (not already taken)
  socket.on('isValid?', function(valid) {
    if (!valid) {
      $('h3#alert').html('Pseudo already taken');
    } else {
      $('.form-container').hide();
      $('.game-container').fadeIn(500);
      $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>');
      // gameLoop started
      // we send canvas dimensions to generrate a worm
      socket.emit('createWorm', {width: parseInt(document.getElementById('background').width), height: parseInt(document.getElementById('background').height) });

      gameLoop(0);
      console.log('Game Start')
    }
  });

  socket.on('newPlayerToAll', function(player){
    $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>');
  });

  /// Initialize Canvas CSS width and height attributes
  /// (caveat: different fom canvas width and height properties....)
  /// https://stackoverflow.com/questions/4938346/canvas-width-and-height-in-html5
  var width = Math.ceil($(window).width() * 0.7);
  var height = Math.ceil($(window).height() * 0.7);

  /// Elements for Background Constructor
  var wormCanvas = document.getElementById('worm');
  wormCanvas.width = width;
  wormCanvas.height = height;

  socket.on('newWorm', function(worm) {
    console.log(worm);
    wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  });

  /// Elements for Background Constructor
  var backgroundCanvas = document.getElementById('background');
  backgroundCanvas.width = width;
  backgroundCanvas.height = height;
  var backgroundContext = backgroundCanvas.getContext('2d');
  // Passing context, and canvas dimensions to the constructor Background
  Background.prototype.context = backgroundContext;
  Background.prototype.canvasWidth = backgroundCanvas.width;
  Background.prototype.canvasHeight = backgroundCanvas.height;

  game.background = new Background;
});


// for worm canvas
function wormDraw(canvas, worm, walkLeft, walkRight, jumpLeft, jumpRight) {
  console.log(canvas, worm, walkLeft, walkRight, jumpLeft, jumpRight);
  var context =  canvas.getContext('2d');
  console.log(context);
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (worm.orientation === 'left') {
    context.drawImage(walkLeft, 0, walkLeft.height * worm.rankWalk/15, walkLeft.width, walkLeft.height/15, worm.x, worm.y, worm.width, worm.height);
  } else if (worm.orientation === 'right') {
    // more efficient to use a separate reversed sprite
    // https://stackoverflow.com/questions/8168217/html-canvas-how-to-draw-a-flipped-mirrored-image/24260982
    // option flop with imageMagik
    context.drawImage(walkRight, 0, walkRight.height * worm.rankWalk/15, walkRight.width, walkRight.height/15, worm.x, worm.y, worm.width, worm.height);
  } else if (worm.orientation === 'up left') {
    context.drawImage(jumpLeft, 0, jumpLeft.height * worm.rankJump/6, jumpLeft.width, jumpLeft.height/6, worm.x, worm.y, worm.width, worm.height);
  } else if (worm.orientation === 'up right') {
    context.drawImage(jumpRight, 0, jumpRight.height * worm.rankJump/6, jumpRight.width, jumpRight.height/6, worm.x, worm.y, worm.width, worm.height);
  }
};


//   $(window).keydown(function(event) {
//     if (event.keyCode === 37) {
//       keyPressed.left = true;
//     } else if (event.keyCode === 39) {
//       keyPressed.right = true;
//     }
//     if (event.keyCode === 38) {
//       keyPressed.up = true;
//     }
//   });

//   $(window).keyup(function(event) {
//     if (event.keyCode === 37) {
//       keyPressed.left = false;
//     } else if (event.keyCode === 39) {
//       keyPressed.right = false;
//     }
//   });


// });

/// gameLoop
// window, canvas => client side
// to-do worm server -> client
// ajouter allWorms = {}
var start1, start2;

var gameLoop = function (timestamp) {
  if (!start1) { start1 = timestamp; }
  if (!start2) { start2 = timestamp; }

  // if (timestamp - start1 >= 50) {
  //   wormDraw(wormCanvas, worm, imageContainer.worm);
  //   // image.worm : doit etre un objet de 4 sprites left / right, jump left, jump right
  //   worm.walk();
  //   // méthode définie dans la fonction constructeur worm (côté server), dans helpers / worm.js
  //   worm.jump();
  //   // méthode définie dans la fonction constructeur worm (côté server), dans helpers / worm.js
  //   socket.emit('worm', {worm: worm, player: player });
  //   // to-do faire le lien entre l'id du player et le worm coté server

  //   start1 = timestamp;
  // }

  if (timestamp - start2 >= 500) {
    game.background.draw();
    start2 = timestamp;
  }


  // TODO game server -> client
  // if (!game.over) {
  //   window.reqAnimFrame(gameLoop);
  // }

  window.reqAnimFrame(gameLoop);
};


// // A passer du client au server
// //   player
// //   keyPressed


// // socket.on('wormToAll', function(data) {
// //   if (!otherWorms[data.player.pseudo]) {
// //     console.log('not in object before');
// //     var worm = new Worm;
// //     worm.init(data.worm.x, data.worm.y, 80, 80);
// //     otherWorms[data.player.pseudo] = worm;
// //   } else {
// //     // update worm instance variables
// //     console.log('update wom instances');
// //     var worm = otherWorms[data.player.pseudo];
// //     worm.x = data.worm.x;
// //     worm.y = data.worm.y;
// //     worm.orientation = data.worm.orientation;
// //     worm.rankWalk = data.worm.rankWalk;
// //     worm.rankJump = data.worm.rankJump;
// //   }
// //   worm.draw();
// //   worm.walk();
// //   worm.jump();
// //   // console.log("otherWorms data.player.pseudo" + data.player.pseudo);
// //   // console.log("otherWorms worm.x" + worm.x);
// //   // console.log("otherWorms worm.y" + worm.y);
// //   // console.log("otherWorms worm.orientation" + worm.orientation);
// //   // console.log("otherWorms worm.rankWalk" + worm.rankWalk);
// //   // console.log("otherWorms worm.rankJump" + worm.rankJump);
// // });

// Polyfill for request animation frame
window.reqAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback, e){
      window.setTimeout(callback, 1000 / 60);
    };
})();


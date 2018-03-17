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
var wormDraw = function (canvas, worm, walkLeft, walkRight, jumpLeft, jumpRight) {
  var context =  canvas.getContext('2d');
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

/// KeyPressed object to stock player inputs
var keyPressed = {
  left: false,
  up: false,
  right: false,
  space: false,
  enter: false
};

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
      socket.emit('createWorm', {width: parseInt(document.getElementById('background').width), height: parseInt(document.getElementById('background').height), pseudo: player.pseudo });

      // gameLoop(0);
      console.log('Game Start')
    }
  });

  socket.on('newPlayerToAll', function(player){
    $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>');
  });


  /// Drawing Background
  var width = Math.ceil($(window).width() * 0.7);
  var height = Math.ceil($(window).height() * 0.7);

  var backgroundCanvas = document.getElementById('background');
  // https://stackoverflow.com/questions/4938346/canvas-width-and-height-in-html5
  backgroundCanvas.width = width;
  backgroundCanvas.height = height;
  var backgroundContext = backgroundCanvas.getContext('2d');
  // Passing context, and canvas dimensions to the constructor Background
  Background.prototype.context = backgroundContext;
  Background.prototype.canvasWidth = backgroundCanvas.width;
  Background.prototype.canvasHeight = backgroundCanvas.height;

  game.background = new Background;
  game.background.draw();

  /// Drawing Worms
  socket.on('allActiveWorms', function(worms) {
    worms.forEach(function(worm){
      var newWormCanvas = createCanvas(backgroundCanvas, worm, width, height);
      wormDraw(newWormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
    });
  });

  socket.on('myWorm', function(worm) {
    var wormCanvas = createCanvas(backgroundCanvas, worm, width, height);
    wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  });

  socket.on('myWormToAll', function(worm) {
    var newWormCanvas = createCanvas(backgroundCanvas, worm, width, height);
    wormDraw(newWormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  });

  $(window).keydown(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = true;
    } else if (event.keyCode === 39) {
      keyPressed.right = true;
    }
    if (event.keyCode === 38) {
      keyPressed.up = true;
    }
    socket.emit('pressKey', keyPressed);
  });

  $(window).keyup(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = false;
    } else if (event.keyCode === 39) {
      keyPressed.right = false;
    }
    if (event.keyCode === 38) {
      keyPressed.up = false;
    }
    socket.emit('pressKey', keyPressed);
  });

  socket.on('walkWorm', function(worm) {
    var wormCanvas = document.getElementById(worm.id)
    wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  });

  socket.on('walkWormToAll', function(worm) {
    var wormCanvas = document.getElementById(worm.id)
    wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  });

  // socket.on('stopWorm', function(worm) {
  //   wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  // });

  // socket.on('stopWormToAll', function(worm) {
  //   wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  // });

});

function createCanvas(siblingCanvas, worm, width, height) {
  var newSiblingCanvas = document.createElement("canvas");
  var gameContainer = document.getElementsByClassName('game-container')[0];
  // gameContainer.appendChild(newWormCanvas);
  siblingCanvas.parentNode.insertBefore(newSiblingCanvas, siblingCanvas.nextSibling);
  newSiblingCanvas.setAttribute('id', worm.id);
  newSiblingCanvas.width = width;
  newSiblingCanvas.height = height;
  return newSiblingCanvas;
}

// var start1, start2;
// var gameLoop = function (timestamp) {
//   if (!start1) { start1 = timestamp; }
//   if (!start2) { start2 = timestamp; }
//   if (timestamp - start2 >= 500) {
//     game.background.draw();
//     start2 = timestamp;
//   }
//   window.reqAnimFrame(gameLoop);
// };

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


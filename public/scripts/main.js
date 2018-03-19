'use strict';

///// Loading images
// Only needed when drawing canvas => client side
var imageContainer = {};

imageContainer.background = new Image;
imageContainer.walkLeft = new Image;
imageContainer.walkRight = new Image;
imageContainer.jumpLeft = new Image;
imageContainer.jumpRight = new Image;
imageContainer.getHollyLeft = new Image;
imageContainer.getHollyRight = new Image;


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

  $(imageContainer.getHollyLeft).on('load', function() {
    console.log('getHollyLeft Image Loaded');
  });
  imageContainer.getHollyLeft.src = 'images/saintegrenade_get_left.png';
  imageContainer.getHollyLeft.id = 'getHollyLeft';

  $(imageContainer.getHollyRight).on('load', function() {
    console.log('getHollyRight Image Loaded');
  });
  imageContainer.getHollyRight.src = 'images/saintegrenade_get_right.png';
  imageContainer.getHollyRight.id='getHollyRight';

};
imageLoading();

/// Background
var Background = function() {
}

Background.prototype.draw = function() {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.context.drawImage(imageContainer.background, 0, 0, imageContainer.background.width, imageContainer.background.height, 0, 0, this.canvasHeight*imageContainer.background.width/imageContainer.background.height, this.canvasHeight);
}


///// Worm
var Worm = function() {
  this.init = function(props, state) {
    this.props = props, // Data that do not change. Ex : props = {pseudo: 'robert'}
    this.state = state // Data that changes.
    // Ex : state = {x: 158 , y: 3.8/5 * height, orientation: 'left', events: keyPressed, iterations: {walk: 4, jump: 0, getHolly: 0, target: 0, dropHolly: 0}, life: 100, active: true }
  }
};

Worm.prototype.createCanvas = function(siblingCanvas, width, height) {
  var newSiblingCanvas = document.createElement("canvas");
  var gameContainer = document.getElementsByClassName('game-container')[0];
  // gameContainer.appendChild(newWormCanvas);
  siblingCanvas.parentNode.insertBefore(newSiblingCanvas, siblingCanvas.nextSibling);
  newSiblingCanvas.setAttribute('id', this.props.pseudo);
  newSiblingCanvas.width = width;
  newSiblingCanvas.height = height;
  this.canvas = newSiblingCanvas;
}

Worm.prototype.walk = function(canvas, images) {
  var context =  canvas.getContext('2d');
  if (this.state.events.left) {
    this.state.orientation = 'left';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.walkLeft, 0, images.walkLeft.height * this.state.iterations.walk/15, images.walkLeft.width, images.walkLeft.height/15, this.state.x, this.state.y, 60, 60);
    if (this.state.iterations.walk === 14) {
      this.state.iterations.walk = 0
      this.state.x -= 14;
    } else {
      this.state.iterations.walk += 1;
    }
  } else if (this.state.events.right) {
    this.state.orientation = 'right';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.walkRight, 0, images.walkRight.height * this.state.iterations.walk/15, images.walkRight.width, images.walkRight.height/15, this.state.x, this.state.y, 60, 60);
    if (this.state.iterations.walk  === 14) {
      this.state.iterations.walk  = 0
      this.state.x += 14;
    } else {
      this.state.iterations.walk += 1;
    }
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images.walkLeft, 0, images.walkLeft.height * this.state.iterations.walk/15, images.walkLeft.width, images.walkLeft.height/15, this.state.x, this.state.y, 60, 60);
  }
};

Worm.prototype.jump = function(canvas, images) {
  var context =  canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (this.state.events.up) {
    if (this.state.iterations.jump < 5) {
      this.state.iterations.jump += 1;
    }
    if (this.state.iterations.jump === 1) {
      this.state.y -= 20;
    }
    else if (this.state.iterations.jump === 5) {
      this.state.y += 20;
      this.state.events.up = false;
    }
  }
  if (!this.state.events.up) {
    this.state.iterations.jump = 0;
  }
  if(this.state.orientation === 'left') {
    context.drawImage(images.jumpLeft, 0, images.jumpLeft.height * this.state.iterations.jump/6, images.jumpLeft.width, images.jumpLeft.height/6, this.state.x, this.state.y, 60, 60);
  } else if (this.state.orientation === 'right') {
    context.drawImage(images.jumpRight, 0, images.jumpRight.height * this.state.iterations.jump/6, images.jumpRight.width, images.jumpRight.height/6, this.state.x, this.state.y, 60, 60);
  }

};

Worm.prototype.getHolly = function(canvas, images) {
  var context =  canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (this.state.events.space) {
    this.state.iterations.getHolly += 1;
  } else {
    this.state.iterations.getHolly = 0;
  }
  if (this.state.orientation === 'left') {
    context.drawImage(images.getHollyLeft, 0, images.getHollyLeft.height * this.state.iterations.getHolly/10, images.getHollyLeft.width, images.getHollyLeft.height/10, this.state.x, this.state.y, 60, 60);
  } else if (this.state.orientation === 'right') {
    context.drawImage(images.getHollyRight, 0, images.getHollyRight.height * this.state.iterations.getHolly/10, images.getHollyRight.width, images.getHollyRight.height/10, this.state.x, this.state.y, 60, 60);
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
game.worms = {};
game.players = {};

$(document).ready(function() {
  console.log('DOM ready');

  /// Drawing Background
  game.width = Math.ceil($(window).width() * 0.7);
  game.height = Math.ceil($(window).height() * 0.7);

  game.backgroundCanvas = document.getElementById('background');
  // https://stackoverflow.com/questions/4938346/canvas-width-and-height-in-html5
  game.backgroundCanvas.width = game.width;
  game.backgroundCanvas.height = game.height;
  // Passing context, and canvas dimensions to the constructor Background
  Background.prototype.context = game.backgroundCanvas.getContext('2d');
  Background.prototype.canvasWidth = game.backgroundCanvas.width;
  Background.prototype.canvasHeight = game.backgroundCanvas.height;

  game.background = new Background;

  /// Fetch all active users
  socket.on('allActivePlayers', function(players) {
    $('ul.players').html('');
    players.forEach(function(player) {
      $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>');
      game.players[player.pseudo] = player;
    });
  });

  /// Form Handler
  $('.form-container').fadeIn(500);
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
          game.player = { avatar: avatar, pseudo: pseudo, tsp: tsp };
          // Push new player data to server
          socket.emit('newPlayer', game.player);
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
      $('ul.players').append('<li>'+ game.player.pseudo +'<span class="green_text"> is connected <span> </li>');

      var worm = new Worm;
      var props = {
        pseudo: game.player.pseudo
      };
      var state = { x: Math.floor(Math.random() * (game.width - 50 + 1)) + 50,
        y: Math.ceil(game.height*3.8/5),
        orientation: 'left',
        events: keyPressed,
        iterations: {walk: 0, jump: 0, getHolly: 0, target: 0, dropHolly: 0},
        life: 100,
        active: true
      };
      worm.init(props, state);
      socket.emit('createWorm', worm);
      // debugger;

      worm.createCanvas(game.backgroundCanvas, game.width, game.height);
      game.worms[worm.props.pseudo] = worm;
      game.worm = worm;
      gameLoop(0);
      console.log('game start')

    }
  });

  socket.on('newPlayerToAll', function(player){
    $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>');
  });


  /// Drawing Worms
  socket.on('allActiveWorms', function(worms) {
    if (worms.length > 0) {
      worms.forEach(function(wormJson){
        createWormObject(wormJson);
      });
    }
  });

  socket.on('myWormToAll', function(wormJson) {
    createWormObject(wormJson);
  });

function createWormObject(wormJson) {
  var newWorm = new Worm;
  newWorm.init(wormJson.props, wormJson.state);
  newWorm.createCanvas(game.backgroundCanvas, game.width, game.height);
  game.worms[wormJson.props.pseudo] = newWorm;
};


  $(window).keydown(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = true;
      // debugger;
      socket.emit('updateWorm', game.worm);
    } else if (event.keyCode === 39) {
      keyPressed.right = true;
      socket.emit('updateWorm', game.worm);
    }
    if (event.keyCode === 38) {
      keyPressed.up = true;
      socket.emit('updateWorm', game.worm);
    }
    if (event.keyCode === 32) {
      keyPressed.space = true;
      socket.emit('updateWorm', game.worm);
    }
  });

  $(window).keyup(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = false;
      socket.emit('updateWorm', game.worm);
    } else if (event.keyCode === 39) {
      keyPressed.right = false;
      socket.emit('updateWorm', game.worm);
    }
    if (event.keyCode === 38) {
      keyPressed.up = false;
      socket.emit('updateWorm', game.worm);
    }
  });

  socket.on('updateWormToAll', function(wormJson) {
    updateWormObject(wormJson);
  });

function updateWormObject(wormJson) {
  var worm = new Worm;
  worm.init(wormJson.props, wormJson.state);
  var canvas = document.getElementById(wormJson.props.pseudo);
  worm.canvas = canvas;
  game.worms[wormJson.props.pseudo] = worm;
};

  // socket.on('stopWorm', function(worm) {
  //   wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  // });

  // socket.on('stopWormToAll', function(worm) {
  //   wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  // });

});

game.start1;
game.start2;

var gameLoop = function (timestamp) {
  if (!game.start1) { game.start1 = timestamp; }
  if (!game.start2) { game.start2 = timestamp; }
  if (timestamp - game.start1 >= 50) {
    // debugger;
    Object.values(game.worms).forEach(function(worm){
      if (worm) {
        worm.walk(worm.canvas, imageContainer);
        // worm.jump(worm.canvas, imageContainer);
      }
    });
    game.start1 = timestamp;
  }
  if (timestamp - game.start2 >= 500) {
    game.background.draw();
    game.start2 = timestamp;
  }
  window.reqAnimFrame(gameLoop);
};

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


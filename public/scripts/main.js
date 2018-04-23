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
imageContainer.targetHollyLeft = new Image;
imageContainer.targetHollyRight = new Image;

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

  $(imageContainer.targetHollyLeft).on('load', function() {
    console.log('targetHollyLeft Image Loaded');
  });
  imageContainer.targetHollyLeft.src = 'images/saintegrenade_target_left.png';
  imageContainer.targetHollyLeft.id = 'targetHollyLeft';

  $(imageContainer.targetHollyRight).on('load', function() {
    console.log('targetHollyRight Image Loaded');
  });
  imageContainer.targetHollyRight.src = 'images/saintegrenade_target_right.png';
  imageContainer.targetHollyRight.id='targetHollyRight';


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
}

Worm.prototype.createCanvas = function(siblingCanvas, width, height) {
  var newSiblingCanvas = document.createElement("canvas")
  var gameContainer = document.getElementsByClassName('game-container')[0]
  // gameContainer.appendChild(newWormCanvas);
  siblingCanvas.parentNode.insertBefore(newSiblingCanvas, siblingCanvas.nextSibling)
  newSiblingCanvas.setAttribute('id', this.props.pseudo)
  newSiblingCanvas.width = width
  newSiblingCanvas.height = height
  this.canvas = newSiblingCanvas
  this.canvas.style.zIndex = "1"
}

Worm.prototype.walk = function(canvas, images) {
  var context =  canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (this.state.events.left && !this.state.events.space) {
    this.state.orientation = 'left';
    if (this.state.iterations.walk === 14) {this.state.x -= 14}
  } else if (this.state.events.right && !this.state.events.space) {
    this.state.orientation = 'right';
    if (this.state.iterations.walk  === 14) {this.state.x += 14}
  }
  if (this.state.events.left || this.state.events.right) {
    (this.state.iterations.walk === 14) ? this.state.iterations.walk = 0 : this.state.iterations.walk += 1
  }
  if (this.state.orientation === 'left') {
    context.drawImage(images.walkLeft, 0, images.walkLeft.height * this.state.iterations.walk/15, images.walkLeft.width, images.walkLeft.height/15, this.state.x, this.state.y, 60, 60)
  } else  {
    context.drawImage(images.walkRight, 0, images.walkRight.height * this.state.iterations.walk/15, images.walkRight.width, images.walkRight.height/15, this.state.x, this.state.y, 60, 60)
  }
}

Worm.prototype.jump = function(canvas, images) {
  var context =  canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  if ( this.state.iterations.jump < 5) {
    this.state.iterations.jump += 1
  } else {
    this.state.events.up = false
    this.state.iterations.jump = 0
  }
  if(this.state.orientation === 'left') {
    context.drawImage(images.jumpLeft, 0, images.jumpLeft.height * this.state.iterations.jump/6, images.jumpLeft.width, images.jumpLeft.height/6, this.state.x, this.state.y, 60, 60)
  } else {
    context.drawImage(images.jumpRight, 0, images.jumpRight.height * this.state.iterations.jump/6, images.jumpRight.width, images.jumpRight.height/6, this.state.x, this.state.y, 60, 60)
  }
}

Worm.prototype.getHolly = function(canvas, images) {
  var context =  canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  (this.state.iterations.getHolly < 8) ? this.state.iterations.getHolly += 1 : this.state.iterations.getHolly = 8
  if (this.state.orientation === 'left') {
    context.drawImage(images.getHollyLeft, 0, images.getHollyLeft.height * this.state.iterations.getHolly/10, images.getHollyLeft.width, images.getHollyLeft.height/10, this.state.x, this.state.y, 60, 60)
  } else {
    context.drawImage(images.getHollyRight, 0, images.getHollyRight.height * this.state.iterations.getHolly/10, images.getHollyRight.width, images.getHollyRight.height/10, this.state.x, this.state.y, 60, 60)
  }
}

Worm.prototype.targetHolly = function(canvas, images) {
  var angle = 0
  var context =  canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (this.state.events.space) {
    angle = toDegrees(getAngle(this.state.x, this.state.y, this.state.events.mousePosition.x,  this.state.events.mousePosition.y  ));
    if (angle >= -90 && angle < 110) {
      this.state.orientation = 'left'
      this.state.iterations.targetHolly = Math.ceil(31 * (angle + 90) / 180) - 2
    } else {
      this.state.orientation = 'right'
      if (angle >= 110 && angle < 180) {
        this.state.iterations.targetHolly = 31 - Math.ceil(31 * (angle - 90) / 180)
      } else {
        this.state.iterations.targetHolly = Math.ceil(31 * (Math.abs(angle) - 90) / 180)
      }
    }
    if (this.state.orientation === 'left') {
      context.drawImage(images.targetHollyLeft, 0, images.targetHollyLeft.height * this.state.iterations.targetHolly/32, images.targetHollyLeft.width, images.targetHollyLeft.height/32, this.state.x, this.state.y, 60, 60)
    } else {
      context.drawImage(images.targetHollyRight, 0, images.targetHollyRight.height * this.state.iterations.targetHolly/32, images.targetHollyRight.width, images.targetHollyRight.height/32, this.state.x, this.state.y, 60, 60)
    }
  }
}

Worm.prototype.getRelativePosition = function() {
  this.state.ratioX = this.state.x / game.width
  this.state.ratioY = this.state.y / game.height
}


/// KeyPressed object to stock player inputs
var keyPressed = {
  left: false,
  up: false,
  right: false,
  space: false,
  mousePosition: {x: undefined, y: undefined}
}

var socket = io.connect('http://localhost:3000')
// var socket = io.connect('http://18.196.138.28:3000');
console.log('Client connected to socket')

var game = {}
game.worms = {}
game.players = {}


$(document).ready(function() {
  console.log('DOM ready')
  setBackground()
  game.background = new Background

  /// Fetch all active users
  socket.on('allActivePlayers', function(players) {
    $('ul.players').html('')
    players.forEach(function(player) {
      $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>')
      game.players[player.pseudo] = player
    })
  })

  /// Form Handler
  $('.form-container').fadeIn(500)

  $("#form").submit(function(event){
    event.preventDefault()
    var avatar = $('input[name=avatar]:checked').val()
    var pseudo = $('input#pseudo').val()
    // Empty form after click
    $('input#pseudo').val('')
    // Clean unwanted spaces
    pseudo = pseudo.trim()
    if (pseudo.length === 0) {
      $('h3#alert').html('You must choose a pseudo')
    } else {
      var re = /[a-zA-Z]+\w*/
      if (!re.exec(pseudo)) {
        $('h3#alert').html('Invalid characters in pseudo')
      } else {
        if (pseudo.length < 4) {
          $('h3#alert').html('Pseudo must have at least 4 letters')
        } else {
          // Inscription date
          var tsp = Date.now()
          game.player = { avatar: avatar, pseudo: pseudo, tsp: tsp }
          // Push new player data to server
          socket.emit('newPlayer', game.player)
        }
      }
    }
  })

  // Server says if username valid of not (not already taken)
  socket.on('isValid?', function(valid) {
    if (!valid) {
      $('h3#alert').html('Pseudo already taken')
    } else {
      $('.form-container').hide()
      $('.game-container').fadeIn(500)
      $('ul.players').append('<li>'+ game.player.pseudo +'<span class="green_text"> is connected <span> </li>')
      /// Drawing Background

      var worm = new Worm;
      var props = {
        pseudo: game.player.pseudo
      }
      var state = { x: Math.floor(Math.random() * (game.width - 150 + 1)) + 100,
        y: Math.ceil(game.height*3.9/5),
        ratioX: 1,
        ratioY: 1,
        orientation: 'left',
        events: keyPressed,
        iterations: {walk: 0, jump: 0, getHolly: 0, targetHolly: 0, dropHolly: 0},
        life: 100,
        active: true
      }
      worm.init(props, state)
      // compute ratio x and Y
      worm.getRelativePosition()
      console.log("compute ratio x and Y")
      socket.emit('createWorm', worm)

      worm.createCanvas(game.backgroundCanvas, game.width, game.height)

      game.worms[worm.props.pseudo] = worm
      game.worm = worm;

      gameLoop(0);
      console.log('game start')
      console.log(game.width)
      console.log(game.height)
      console.log(Object.assign(game.worm))

      var width = Object.assign(game.width)
      var height = Object.assign(game.height)

      $(window).resize(function() {
        console.log("resize")
        setBackground()
      })
    }
  })

  socket.on('newPlayerToAll', function(player){
    $('ul.players').append('<li>'+ player.pseudo +'<span class="green_text"> is connected <span> </li>')
  })


  /// Drawing Worms
  socket.on('allActiveWorms', function(worms) {
    if (worms.length > 0) {
      worms.forEach(function(wormJson){
        createWormObject(wormJson)
      })
    }
  })

  socket.on('myWormToAll', function(wormJson) {
    createWormObject(wormJson)
  })

  function createWormObject(wormJson) {
    if (wormJson) {
      var newWorm = new Worm;
      newWorm.init(wormJson.props, wormJson.state)
      // debugger;
      newWorm.createCanvas(game.backgroundCanvas, game.width, game.height)
      game.worms[wormJson.props.pseudo] = newWorm
    } else {
      console.log("wormJson in createWormObject is")
      console.log(wormJson)
    }
  }


  $(window).keydown(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = true
      // debugger;
      socket.emit('updateWorm', game.worm)
    } else if (event.keyCode === 39) {
      keyPressed.right = true
      socket.emit('updateWorm', game.worm)
    }
    if (event.keyCode === 38) {
      keyPressed.up = true
      socket.emit('updateWorm', game.worm)
    }
    if (event.keyCode === 32) {
      keyPressed.space = true
      socket.emit('updateWorm', game.worm)
    }
  })

  $(window).keyup(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = false
      socket.emit('updateWorm', game.worm)
    } else if (event.keyCode === 39) {
      keyPressed.right = false
      socket.emit('updateWorm', game.worm)
    }
    if (event.keyCode === 38) {
      keyPressed.up = false
      socket.emit('updateWorm', game.worm)
    }
    if (event.keyCode === 32) {
      keyPressed.space = false
      socket.emit('updateWorm', game.worm)
    }
  })

  $(window).mousemove(function(event) {
    if (keyPressed.space) {
      // changing ref : worm x and worm y are in canvas ref, not event.client x, event.clientY
      var mouseX = parseInt(event.clientX - $("canvas#background").offset().left)
      var mouseY = parseInt(event.clientY - $("canvas#background").offset().top)
      keyPressed.mousePosition.x = mouseX
      keyPressed.mousePosition.y = mouseY
    }
  })

  socket.on('updateWormToAll', function(wormJson) {
    updateWormObject(wormJson)
  })

function updateWormObject(wormJson) {
  if (wormJson) {
    var worm = new Worm
    worm.init(wormJson.props, wormJson.state)
    var canvas = document.getElementById(wormJson.props.pseudo)
    worm.canvas = canvas
    game.worms[wormJson.props.pseudo] = worm
  } else {
    console.log("wormJson in updateWormObject is")
    console.log(wormJson)
  }

}

  // socket.on('stopWorm', function(worm) {
  //   wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  // });

  // socket.on('stopWormToAll', function(worm) {
  //   wormDraw(wormCanvas, worm, imageContainer.walkLeft, imageContainer.walkRight, imageContainer.jumpLeft, imageContainer.jumpRight);
  // });

});

game.start1
game.start2

var gameLoop = function (timestamp) {
  if (!game.start1) { game.start1 = timestamp }
  if (!game.start2) { game.start2 = timestamp }
  if (timestamp - game.start1 >= 50) {
    Object.values(game.worms).forEach(function(worm){
      if (worm) {
        updateWormCanvasDimensions(worm)
        worm.state.x = Math.ceil(game.width * worm.state.ratioX)
        worm.state.y = Math.ceil(game.height * worm.state.ratioY)

        worm.walk(worm.canvas, imageContainer)
        worm.getRelativePosition()
        if (worm.state.events.up) {
          worm.jump(worm.canvas, imageContainer)
        } else if (worm.state.events.space) {
          worm.getHolly(worm.canvas, imageContainer)
          if (worm.state.events.mousePosition.x) {
            worm.targetHolly(worm.canvas, imageContainer)
          } else {
            worm.state.iterations.targetHolly = 0
          }
        } else { /// !space
          // worm.shoot(worm.canvas, imageContainer)
          worm.state.iterations.getHolly = 0
          worm.state.events.mousePosition.x = undefined
        }
        // if (!worm.state.events.space) {
        //
        // }
      }
    });
    game.start1 = timestamp
  }
  if (timestamp - game.start2 >= 500) {
    game.background.draw()
    game.start2 = timestamp
  }
  window.reqAnimFrame(gameLoop)
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

function setBackground() {
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
};

function updateWormCanvasDimensions(worm) {
  var canvas = worm.canvas
  game.width = Math.ceil($(window).width() * 0.7);
  game.height = Math.ceil($(window).height() * 0.7);
  canvas.width = game.width;
  canvas.height = game.height;
}

function getAngle( x1, y1, x2, y2 ) {

  var dx = x1 - x2, dy = y1 - y2;

  return Math.atan2(dy,dx);
};


function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

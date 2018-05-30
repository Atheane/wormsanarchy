'use strict';

///// Loading images
// Only needed when drawing canvas => client side
var imageContainer = {};

imageContainer.background = new Image;
imageContainer.walkLeft = new Image;
imageContainer.walkRight = new Image;
imageContainer.getHollyLeft = new Image;
imageContainer.getHollyRight = new Image;
imageContainer.targetHollyLeft = new Image;
imageContainer.targetHollyRight = new Image;
imageContainer.shoot = new Image;

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

  $(imageContainer.shoot).on('load', function() {
    console.log('shoot Image Loaded');
  });
  imageContainer.shoot.src = 'images/hgrenade.png';
  imageContainer.shoot.id='shoot';

};
imageLoading();

/// Background
var Background = function() {
}

Background.prototype.draw = function() {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.context.drawImage(imageContainer.background, 0, 0, imageContainer.background.width, imageContainer.background.height, 0, 0, this.canvasHeight*imageContainer.background.width/imageContainer.background.height, this.canvasHeight);
}

var Weapon = function() {
  this.init = function(state) {
    this.state = state
    this.t = 0
    this.active = true
  }
}


///// Worm
var Worm = function() {
  this.init = function(props, state) {
    this.props = props, // Data that do not change. Ex : props = {pseudo: 'robert'}
    this.state = state // Data that changes.
    // Ex : state = {x: 158 , y: 3.8/5 * height, orientation: 'left', events: keyPressed, iterations: {walk: 4, jump: 0, getHolly: 0, target: 0, dropHolly: 0}, life: 100, active: true }
    this.weapon = undefined;
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
  context.font = '16px sans-serif'
  context.fillStyle = 'white'
  context.fillText(this.props.pseudo, this.state.x + 10, this.state.y - 20)
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


Worm.prototype.getHolly = function(canvas, images) {
  var context =  canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '16px sans-serif';
  context.fillStyle = 'white';
  context.fillText(this.props.pseudo, this.state.x + 10, this.state.y - 20);
  (this.state.iterations.getHolly < 8) ? this.state.iterations.getHolly += 1 : this.state.iterations.getHolly = 8;
  if (this.state.orientation === 'left') {
    context.drawImage(images.getHollyLeft, 0, images.getHollyLeft.height * this.state.iterations.getHolly/10, images.getHollyLeft.width, images.getHollyLeft.height/10, this.state.x, this.state.y, 60, 60);
  } else  {
    context.drawImage(images.getHollyRight, 0, images.getHollyRight.height * this.state.iterations.getHolly/10, images.getHollyRight.width, images.getHollyRight.height/10, this.state.x, this.state.y, 60, 60);
  }
};

Worm.prototype.targetHolly = function(canvas, images) {
  var angle = 0
  var context =  canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '16px sans-serif';
  context.fillStyle = 'white';
  context.fillText(this.props.pseudo, this.state.x + 10, this.state.y - 20);
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

Worm.prototype.shoot = function(canvas, images) {
  var context =  canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.font = '16px sans-serif'
  context.fillStyle = 'white'
  context.fillText(this.props.pseudo, this.state.x + 10, this.state.y - 20)
  if (this.state.orientation === 'left') {
    context.drawImage(images.walkLeft, 0, images.walkLeft.height * this.state.iterations.walk/15, images.walkLeft.width, images.walkLeft.height/15, this.state.x, this.state.y, 60, 60)
  } else  {
    context.drawImage(images.walkRight, 0, images.walkRight.height * this.state.iterations.walk/15, images.walkRight.width, images.walkRight.height/15, this.state.x, this.state.y, 60, 60)
  }
  var weapon = new Weapon
  var angleRadian = getAngle(this.state.x, this.state.y, this.state.events.mousePosition.x,  this.state.events.mousePosition.y)
  var state = {
    x: this.state.x,
    y: this.state.y,
    angle: angleRadian
  }
  weapon.init(state)
  this.weapon = weapon
}

Weapon.prototype.draw = function(canvas, images) {
  // console.log('weapon draw is called')
  var context =  canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(images.shoot, 0, 0, images.shoot.width, images.shoot.height, this.state.x, this.state.y, 38, 38)
  this.t += 0.5
  this.state.x -= Math.ceil(20 * Math.cos(this.state.angle) * this.t)
  this.state.y -= Math.ceil(20 * Math.sin(this.state.angle) * this.t - 0.5 * 8 * this.t * this.t)
  socket.emit("updateWorm", game.worm)
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
  game.width = 1024
  game.height = 520
  setBackground()
  game.background = new Background

  /// Fetch all active users to dahsboard
  socket.on('allActivePlayers', function(players) {
    $('#dashboard ul.players').html('')
    players.forEach(function(player) {
      $('#dashboard ul.players').append(`<li id=li_${player.pseudo}>`+ player.pseudo +'<span class="green_text"> is connected </span> </li>')
      game.players[player.pseudo] = player
    })
  })

  /// Fetch all known users to high-scores
  socket.on('allKnownPlayers', function(players) {
    $('#high-scores ul.players').html('')
    players.forEach(function(player) {
      if (!player.active) {
        $('#high-scores ul.players').append(`<li id=li_${player.pseudo}>`+ player.pseudo + '<span class=black_text> ' + player.score + ' points </span> </li>')
      }
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
      $('#dashboard ul.players').append(`<li id=li_${game.player.pseudo}>`+ game.player.pseudo +'<span class="green_text"> is connected <span> </li>')
      /// Drawing Background

      var worm = new Worm
      var props = {
        pseudo: game.player.pseudo,
        tsp: game.player.tsp
      }
      var state = { x: Math.floor(Math.random() * (game.width - 150 + 1)) + 100,
        y: Math.ceil(game.height*3.9/5),
        orientation: 'left',
        events: keyPressed,
        iterations: {walk: 0, getHolly: 0, targetHolly: 0},
        life: 100,
        score: 0,
        active: true,
      }
      worm.init(props, state)
      // console.log("compute ratio x and Y")
      socket.emit('createWorm', worm)

      setBackground()

      worm.createCanvas(game.backgroundCanvas, game.width, game.height)

      game.worms[worm.props.pseudo] = worm
      game.worm = worm;

      gameLoop(0)

      game.weaponCanvas = document.getElementById('weapon')
      updateWeaponCanvasDimensions()

      Object.values(game.worms).forEach(function(worm){
        updateWormCanvasDimensions(worm)
      })
    }

    socket.on('myWormToAll', function(wormJson) {
      createWormObject(wormJson)
    })

  })

  $(document).keyup(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = false
      socket.emit('updateWorm', game.worm)
    } else if (event.keyCode === 39) {
      keyPressed.right = false
      socket.emit('updateWorm', game.worm)
    }
    if (event.keyCode === 32) {
      keyPressed.space = false
      socket.emit('updateWorm', game.worm)
    }
  })

  $(document).keydown(function(event) {
    if (event.keyCode === 37) {
      keyPressed.left = true
      socket.emit('updateWorm', game.worm)
    } else if (event.keyCode === 39) {
      keyPressed.right = true
      socket.emit('updateWorm', game.worm)
    }
    if (event.keyCode === 32) {
      keyPressed.space = true
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

  $(window).click(function(event) {
    keyPressed['click'] = true
    socket.emit('updateWorm', game.worm)
  })

  $(window).on('load',function(){
    socket.emit('reload')
  })

})

game.start1
game.start2

var gameLoop = function (timestamp) {
  if (!game.start1) { game.start1 = timestamp }
  if (!game.start2) { game.start2 = timestamp }
  if (timestamp - game.start1 >= 50) {
    Object.values(game.worms).forEach(function(worm){
      var diffTime = Math.floor((Date.now() - worm.props.tsp) / 1000)
      $('#li_'+worm.props.pseudo).html(worm.props.pseudo +'<span class="green_text"> connected ' + diffTime + ' s. </span> </li>')
      if (worm && worm.state.active) {
        worm.walk(worm.canvas, imageContainer)
        if (worm.state.events.space) {
          worm.getHolly(worm.canvas, imageContainer);
          if (worm.state.events.mousePosition.x) {
            worm.targetHolly(worm.canvas, imageContainer);
            if (worm.state.events.click) {
              worm.shoot(worm.canvas, imageContainer);
            }
          }
        } else  {
          worm.state.iterations.getHolly = 0;
          worm.state.iterations.targetHolly = 0;
          worm.state.events.mousePosition.x = undefined;
          worm.state.events.click = false;
        }
        if (worm.weapon) {
          if (worm.weapon.state.y > worm.state.y + 20) {
            worm.weapon.active = false
          }
          if (worm.weapon.active) {
            worm.weapon.draw(game.weaponCanvas, imageContainer)
          }
        }
      }
      // console.log(worm)
    });
    game.start1 = timestamp
  }
  if (timestamp - game.start2 >= 500) {
    game.background.draw()
    game.start2 = timestamp
  }
  window.reqAnimFrame(gameLoop)
};


/////////////////////// Sockets
socket.on('newPlayerToAll', function(player){
  $('#dashboard ul.players').append(`<li id=li_${player.pseudo}>`+ player.pseudo +'<span class="green_text"> is connected </span> </li>')
})

socket.on('allActiveWorms', function(worms) {
  if (worms.length > 0) {
    worms.forEach(function(wormJson){
      createWormObject(wormJson)
    })
  }
})

socket.on('updateWormToAll', function(wormJson) {
  updateWormObject(wormJson)
})

socket.on('collision', function(data) {
  var shooter = game.worms[data.shooter.props.pseudo]
  var shooted = game.worms[data.shooted.props.pseudo]
  shooter.state.score = data.shooter.state.score
  $(`#li_${shooter.props.pseudo}`).html(`<li id=li_${shooter.props.pseudo}>`+ shooter.props.pseudo +'<span class="green_text"> Score: '+ shooter.state.score  +' </span> </li>')

  if (shooted) {
    shooted.state.life = data.shooted.state.life
    console.log(shooted.props.pseudo + " life " + shooted.state.life)
  }
})

socket.on('userDisconnected', function(pseudo) {
  if (pseudo && pseudo !== null) {
    $(`#li_${pseudo}`).html(`<li id=li_${pseudo}>`+ pseudo +'<span class="red_text"> is disconnected </span> </li>')
    var worm = game.worms[pseudo]
    if (worm && worm.state.active) {
      worm.state.active = false
      worm.canvas.remove()
    }
    delete game.worms[pseudo]
  }
})

socket.on('gameOver', function(pseudo) {
  if (pseudo && pseudo !== null) {
    console.log(pseudo, "game over")
    var worm = game.worms[pseudo]
    if (worm) {
      worm.state.active = false
      worm.canvas.remove()
    }
    $(`#li_${pseudo}`).html(`<li id=li_${pseudo}> <i class="fas fa-skull"></i> `+ pseudo +'<span class="red_text"> Score: '+ worm.state.score  +' </span> </li>')
    delete game.worms[pseudo]
  }
})

///////////////// Helpers
function setBackground() {
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
  var pseudo = worm.props.pseudo
  var c = document.getElementById(pseudo)
  c.width = game.width;
  c.height = game.height;
}

function updateWeaponCanvasDimensions() {
  var weaponCanvas = document.getElementById("weapon")
  weaponCanvas.width = game.width;
  weaponCanvas.height = game.height;
}

function createWormObject(wormJson) {
  if (wormJson) {
    var newWorm = new Worm;
    newWorm.init(wormJson.props, wormJson.state)
    newWorm.createCanvas(game.backgroundCanvas, game.width, game.height)
    game.worms[wormJson.props.pseudo] = newWorm
  } else {
    console.log("wormJson in createWormObject is")
    console.log(wormJson)
  }
}

function updateWormObject(wormJson) {
  if (wormJson) {
    var worm = new Worm
    worm.init(wormJson.props, wormJson.state)
    var canvas = document.getElementById(wormJson.props.pseudo)
    worm.canvas = canvas
    if (wormJson.weapon) {
      var weapon = new Weapon
      var angleRadian = getAngle(worm.state.x, worm.state.y, worm.state.events.mousePosition.x, worm.state.events.mousePosition.y);
      weapon.init({x: wormJson.weapon.state.x, y: wormJson.weapon.state.y, angle: angleRadian})
      worm.weapon = weapon
    }
    game.worms[wormJson.props.pseudo] = worm
  } else {
    console.log("wormJson in updateWormObject is")
    console.log(wormJson)
  }
}

function getAngle( x1, y1, x2, y2 ) {
  var dx = x1 - x2, dy = y1 - y2;
  return Math.atan2(dy,dx);
};

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

/// polyfill
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

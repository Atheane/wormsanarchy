var Drawable = require('./drawable');


var Worm = function() {
  this.id = ''
  this.rankWalk = 0;
  this.rankJump = 0;
  this.active = true;
  this.orientation = 'left';
};

var drawable = new Drawable();
Worm.prototype = drawable;
//// Worm Constructor


Worm.prototype.walk = function() {
  if (keyPressed.left) {
    this.orientation = 'left';
    if (this.rankWalk === 14) {
      this.rankWalk = 0
      this.x -= 14;
    } else {
      this.rankWalk += 1;
    }
  } else if (keyPressed.right) {
    this.orientation = 'right';
    if (this.rankWalk === 14) {
      this.rankWalk = 0
      this.x += 14;
    } else {
      this.rankWalk += 1;
    }
  }
};
Worm.prototype.jump = function() {
  if (keyPressed.up) {
    if (this.orientation === 'left') {
      this.orientation = 'up left';
    } else if (this.orientation === 'right') {
      this.orientation = 'up right';
    }
    if (this.rankJump < 5) {
      this.rankJump += 1;
    }
    if (this.rankJump === 1) {
      this.y -= 20;
    }
    else if (this.rankJump === 5) {
      this.y += 20;
      keyPressed.up = false;
    }
  }
  if (!keyPressed.up) {
    this.rankJump = 0;
    if (this.orientation === 'up left') {
      this.orientation = 'left';
    } else if (this.orientation === 'up right') {
      this.orientation = 'right';
    }
  }
};

module.exports = Worm;

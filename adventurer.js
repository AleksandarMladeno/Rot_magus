function Adventurer(game) {
  this.game = game;
  this.x = ROT.RNG.getUniformInt(0, ROT.DEFAULT_WIDTH);
  this.y = ROT.RNG.getUniformInt(0, ROT.DEFAULT_HEIGHT);
  this.char = '@';
  this.drawFOV();
}

Adventurer.prototype.act = function() {
  this.drawFOV();
  this.game.engine.lock();
  window.addEventListener('click', this);
}

Adventurer.prototype.drawFOV = function() {
  var x, y;
  for (x = 0; x < ROT.DEFAULT_WIDTH; x += 1) {
    for (y = 0; y < ROT.DEFAULT_HEIGHT; y += 1) {
      this.game.display.draw(x, y, '');
    }
  }
  var ps = new ROT.FOV.PreciseShadowcasting(function (x, y) {
    if(this.game.terrain[x + ',' + y]) {
      return this.game.terrain[x + ',' + y].transparent;
    }
    return true;
  }.bind(this));
  var offset = Math.floor(this.game.display.getOptions().height / 2);
  ps.compute(this.x, this.y, offset, function(x, y) {
    var c = '.';
    if (this.game.actors[x + ',' + y]) {
      c = this.game.actors[x + ',' + y].char;
    } else if (this.game.terrain[x + ',' + y]) {
      c = this.game.terrain[x + ',' + y].char;
    }
    this.game.display.draw(x - this.x + offset, y - this.y + offset, c);
  }.bind(this));
}

Adventurer.prototype.handleEvent = function(e) {
  var offset = Math.floor(this.game.display.getOptions().height / 2);
  var targetX = this.game.display.eventToPosition(e)[0] - offset + this.x;
  var targetY = this.game.display.eventToPosition(e)[1] - offset + this.y;
  var x = this.x + (targetX > this.x ? 1 : (targetX < this.x ? -1 : 0));
  var y = this.y + (targetY > this.y ? 1 : (targetY < this.y ? -1 : 0));
  if (!this.game.actors[x + ',' + y] &&
    (!this.game.terrain[x + ',' + y] ||
    (this.game.terrain[x + ',' + y] &&
    this.game.terrain[x + ',' + y].passable))) {
    this.game.actors[this.x + ',' + this.y] = null;
    this.x = x;
    this.y = y;
    this.game.actors[this.x + ',' + this.y] = this;
    window.removeEventListener("keydown", this);
    this.game.engine.unlock();
  }
}

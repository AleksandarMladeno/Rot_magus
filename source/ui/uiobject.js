/*global RM*/
RM.UIObject = function (x, y, width, height) {
  'use strict';
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.hovered = false;
  this.clicked = false;
};

RM.UIObject.prototype.isHovered = function () {
  'use strict';
  return RM.mouse.x > this.x &&
         RM.mouse.y > this.y &&
         RM.mouse.x < this.x + this.width &&
         RM.mouse.y < this.y + this.height;
};

RM.UIObject.prototype.update = function () {
  'use strict';
  this.hovered = this.isHovered();
  this.clicked = this.hovered && RM.mouse.clicked && RM.mouse.down;
};

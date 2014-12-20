/*global ROT*/
var RM = {};

RM.init = function () {
  'use strict';
  var tileSet = document.createElement('img');
  tileSet.src = 'tileset.png';
  RM.terrainSet = RM.getTerrainSet();
  RM.actorSet = RM.getActorSet();
  RM.scheduler = new ROT.Scheduler.Action();
  RM.engine = new ROT.Engine(RM.scheduler);
  RM.display = new ROT.Display({
    width: 26,
    height: 22,
    layout: 'tile',
    tileWidth: 24,
    tileHeight: 21,
    tileSet: tileSet,
    tileMap: RM.getTileMap()
  });
  RM.cursor = [16, 11];
  document.body.appendChild(RM.display.getContainer());
  window.addEventListener('click', RM.start);
  window.addEventListener('keypress', this);
};

RM.getTerrainSet = function () {
  'use strict';
  var t, i, set;
  set = [];
  for (t in RM.terrains) {
    if (RM.terrains.hasOwnProperty(t)) {
      for (i = 0; i < RM.terrains[t].chance; i += 1) {
        set.push(RM.terrains[t]);
      }
    }
  }
  return set;
};

RM.getActorSet = function () {
  'use strict';
  var a, i, set;
  set = [];
  for (a in RM.actors) {
    if (RM.actors.hasOwnProperty(a)) {
      for (i = 0; i < RM.actors[a].chance; i += 1) {
        set.push(RM.actors[a]);
      }
    }
  }
  return set;
};

RM.getTileMap = function () {
  'use strict';
  var i, tileMap;
  tileMap = {
    '': [0, 0],
    '*': [24, 0],
    ' ': [2 * 24, 0],
    'L': [3 * 24, 0],
    'X': [4 * 24, 0],
    'H': [5 * 24, 0],
    'M': [6 * 24, 0],
    'B': [7 * 24, 0],
    'S': [8 * 24, 0],
    'W': [9 * 24, 0],
    'A': [10 * 24, 0],
    'P': [11 * 24, 0],
    '_': [12 * 24, 0],
    '0': [13 * 24, 0],
    '1': [14 * 24, 0],
    '2': [15 * 24, 0],
    '3': [16 * 24, 0],
    '4': [17 * 24, 0],
    '5': [18 * 24, 0],
    '6': [19 * 24, 0],
    '7': [20 * 24, 0],
    '8': [21 * 24, 0],
    '9': [22 * 24, 0]
  };
  for (i in RM.terrains) {
    if (RM.terrains.hasOwnProperty(i)) {
      tileMap[RM.terrains[i].tile] = [
        RM.terrains[i].tileX,
        RM.terrains[i].tileY
      ];
    }
  }
  for (i in RM.actors) {
    if (RM.actors.hasOwnProperty(i)) {
      tileMap[RM.actors[i].tile] = [
        RM.actors[i].tileX,
        RM.actors[i].tileY
      ];
    }
  }
  return tileMap;
};

RM.start = function () {
  'use strict';
  var x, y, actor, i;
  window.removeEventListener('click', RM.start);
  RM.map = [];
  for (x = -50; x < 51; x += 1) {
    RM.map[x] = [];
    for (y = -50; y < 51; y += 1) {
      RM.map[x][y] = {};
      RM.map[x][y].terrain = RM.terrainSet.random();
      if (ROT.RNG.getPercentage() === 1) {
        RM.map[x][y].actor = new RM.Actor(RM.actorSet.random(), x, y, true);
      }
    }
  }
  for (i = 0; i < 1; i += 1) {
    RM.map[i][0] = {
      terrain: RM.terrains.grass,
      actor: new RM.Actor(RM.actors.elf, i, 0)
    };
  }
  RM.engine = new ROT.Engine(RM.scheduler);
  RM.engine.start();
};

RM.handleEvent = function (e) {
  'use strict';
  if (e.charCode === 99) {
    if (RM.charView) {
      RM.display.setOptions({
        layout: 'tile'
      });
      RM.charView = false;
    } else {
      RM.display.setOptions({
        layout: 'rect'
      });
      RM.charView = true;
    }
  }
};

RM.getPoint = function (x, y) {
  'use strict';
  return RM.map[x] ? RM.map[x][y] : null;
};

RM.getActor = function (x, y) {
  'use strict';
  var point = RM.getPoint(x, y);
  return point ? point.actor : null;
};

RM.getTile = function (x, y) {
  'use strict';
  var actor;
  if (RM.getPoint(x, y)) {
    actor = RM.getActor(x, y);
    if (actor) {
      return actor.tile;
    } else {
      return RM.map[x][y].terrain.tile;
    }
  }
  return '';
};

RM.isTransparent = function (x, y) {
  'use strict';
  var point = RM.getPoint(x, y);
  return point ? point.terrain.transparent : false;
};

RM.isPassable = function (x, y) {
  'use strict';
  var point = RM.getPoint(x, y);
  return point ? point.terrain.passable : false;
};

RM.drawMap = function (x, y, points) {
  'use strict';
  var p, dx, dy, actor, terrain;
  x = 15 - x;
  y = 10 - y;
  RM.clearMap();
  for (p in points) {
    if (points.hasOwnProperty(p)) {
      dx = points[p][0];
      dy = points[p][1];
      RM.display.draw(x + dx, y + dy, RM.getTile(dx, dy));
    }
  }
};

RM.drawHUD = function () {
  'use strict';
  var x, y;
  for (x = 0; x < 5; x += 1) {
    for (y = 0; y < 15; y += 1) {
      RM.display.draw(x, y, ' ');
    }
    for (y = 15; y < 20; y += 1) {
      RM.display.draw(x, y, '_');
    }
    RM.display.draw(x, 20, ' ');
  }
  for (x = 0; x < 26; x += 1) {
    RM.display.draw(x, 21, ' ');
  }
  RM.display.draw(0, 0, 'L');
  RM.display.drawText(1, 0, '1');
  RM.display.draw(0, 1, 'X');
  RM.display.drawText(1, 1, '50');
  RM.display.draw(0, 2, 'H');
  RM.display.drawText(1, 2, '100');
  RM.display.draw(0, 3, 'M');
  RM.display.drawText(1, 3, '0');
  RM.display.draw(0, 4, 'B');
  RM.display.drawText(1, 4, '0');
  RM.display.draw(0, 5, 'S');
  RM.display.drawText(1, 5, '10');
  RM.display.draw(0, 6, 'W');
  RM.display.drawText(1, 6, '0');
  RM.display.draw(0, 7, 'A');
  RM.display.drawText(1, 7, '4');
  RM.display.draw(0, 8, 'P');
  RM.display.drawText(1, 8, '10');
  RM.display.draw(2, 10, '_');
  RM.display.draw(2, 11, '_');
  RM.display.draw(1, 12, '_');
  RM.display.draw(2, 12, '_');
  RM.display.draw(3, 12, '_');
  RM.display.draw(1, 13, '_');
  RM.display.draw(2, 13, '_');
  RM.display.draw(3, 13, '_');
};

RM.clearMap = function () {
  'use strict';
  var x, y;
  for (x = 5; x < 26; x += 1) {
    for (y = 0; y < 21; y += 1) {
      RM.display.draw(x, y, '');
    }
  }
};

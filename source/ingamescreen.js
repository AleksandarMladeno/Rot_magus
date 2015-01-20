/*global RM*/
RM.IngameScreen = function (background) {
  'use strict';
  var barBackground = new RM.Image(96, 0, 72, 21, RM.uiObjectsImage);
  this.background = RM.ingame;
  this.uiObjects = [
    new RM.Bar(40, 9, 72, 21, barBackground,
      function () {
        return RM.currentActor.xp;
      },
      function () {
        return 50 * Math.pow(2, RM.currentActor.level);
      },
      '#e3e300'),
    new RM.Bar(40, 30, 72, 21, barBackground,
      function () {
        return Math.floor(RM.currentActor.health);
      },
      function () {
        return RM.currentActor.maxHealth;
      },
      '#00e300'),
    new RM.Bar(40, 51, 72, 21, barBackground,
      function () {
        return RM.currentActor.mana;
      },
      function () {
        return RM.currentActor.maxMana;
      },
      '#4261e7'),
    new RM.Bar(40, 72, 72, 21, barBackground,
      function () {
        return RM.currentActor.burden;
      },
      function () {
        return RM.currentActor.strength;
      },
      '#844121'),
    new RM.Label(16, 114, 24, 21, '#616161',
      function () {
        return RM.currentActor.strength;
      },
      '#000'),
    new RM.Label(40, 114, 24, 21, '#616161',
      function () {
        return RM.currentActor.wisdom;
      },
      '#000'),
    new RM.Label(64, 114, 24, 21, '#616161',
      function () {
        return RM.currentActor.agility;
      },
      '#000'),
    new RM.Label(88, 114, 24, 21, '#616161',
      function () {
        return RM.currentActor.precision;
      },
      '#000'),
    new RM.Frame(128, 9, 504, 441, '#000', {
      map: RM.map,
      x: 0,
      y: 0,
      width: 21,
      height: 21,
      empty: RM.guitiles.invisible
    }, function (x, y) {

    })
  ];
};

'use strict';

var knightPosition = [0, 0];
var observer = null;

function emitChange() {
  observe(knightPosition);
}

function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }

  observer = o;
  emitChange();

  return function () {
    observer = null;
  };
}

function canMoveKnight(toX, toY) {
  var _knightPosition = knightPosition;
  var x = _knightPosition[0];
  var y = _knightPosition[1];

  var dx = toX - x;
  var dy = toY - y;

  return Math.abs(dx) === 2 && Math.abs(dy) === 1 || Math.abs(dx) === 1 && Math.abs(dy) === 2;
}

function moveKnight(toX, toY) {
  knightPosition = [toX, toY];
  emitChange();
}

module.exports = {
  "observe": observe,
  "canMoveKnight": canMoveKnight,
  "moveKnight": moveKnight
};

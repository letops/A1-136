var React = require('react');
var ReactDOM = require('react-dom');
var Context = require('./context');

if (typeof CONST_GRIDSIZE == 'undefined' || CONST_GRIDSIZE == null) {
  alert('No CONST_GRIDSIZE has been defined globally');
}

if (typeof CONST_IMAGESIZE == 'undefined' || CONST_IMAGESIZE == null) {
  alert('No CONST_IMAGESIZE has been defined globally');
}

//var observe = require('./game').observe;

//observe(function (knightPosition) {
ReactDOM.render(
  <Context imageSize={CONST_IMAGESIZE}/>,
  document.getElementById('content')
);

//});

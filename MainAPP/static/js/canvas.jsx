var React = require('react');
var ReactDOM = require('react-dom');
var Sidebar = require('./sidebar');

//var observe = require('./game').observe;

//observe(function (knightPosition) {
ReactDOM.render(
  <Sidebar source="../rest/CanvasInfo"/>,
  document.getElementById('content')
);

//});

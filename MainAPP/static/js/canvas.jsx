var React = require('react');
var ReactDOM = require('react-dom');
var Context = require('./context');

//var observe = require('./game').observe;

//observe(function (knightPosition) {
ReactDOM.render(
  <Context imageSize="150px"/>,
  document.getElementById('content')
);

//});

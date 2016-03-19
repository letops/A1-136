var React = require('react');
var ReactDOM = require('react-dom');
var Board = require('./board');
var observe = require('./game').observe;

observe(function (knightPosition) {
  ReactDOM.render(
    <Board knightPosition={knightPosition}/>,
    document.getElementById('content')
  );
});

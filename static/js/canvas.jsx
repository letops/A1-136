var React = require('react');
var ReactDOM = require('react-dom');
var Board = require('./board');


ReactDOM.render(
  <Board knightPosition={[0,0]} />,
  //React.createElement(Board(knightPosition=[1, 1]), null),
  document.getElementById('content')
);

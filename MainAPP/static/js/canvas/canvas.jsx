var React = require('react');
var ReactDOM = require('react-dom');
var Context = require('./context');

ReactDOM.render(
  <Context imageSize="150px"/>,
  document.getElementById('content')
);

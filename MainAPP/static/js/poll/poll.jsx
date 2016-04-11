var React = require('react');
var ReactDOM = require('react-dom');
var Context = require('./context');

ReactDOM.render(
  <div className='row'><Context /></div>,
  document.getElementById('content')
);

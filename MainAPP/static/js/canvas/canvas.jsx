var React = require('react');
var ReactDOM = require('react-dom');
var Context = require('./context');

if (typeof CONST_SYSTEM_NAME == 'undefined' || CONST_SYSTEM_NAME == null) {
  alert('No CONST_SYSTEM_NAME has been defined globally');
}

if (typeof CONST_GRIDSIZE == 'undefined' || CONST_GRIDSIZE == null) {
  alert('No CONST_GRIDSIZE has been defined globally');
}

if (typeof CONST_IMAGESIZE == 'undefined' || CONST_IMAGESIZE == null) {
  alert('No CONST_IMAGESIZE has been defined globally');
}

if (typeof CONST_URL_FINISH == 'undefined' || CONST_URL_FINISH == null) {
  alert('No CONST_URL_FINISH has been defined globally');
}

ReactDOM.render(
  <Context imageSize={CONST_IMAGESIZE}/>,
  document.getElementById('content')
);

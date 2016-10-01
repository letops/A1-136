var React = require('react');
var ReactDOM = require('react-dom');
// var PageTour = require('./page_tour');
var DragDropContext = require('react-dnd').DragDropContext;
var Backend = null;
var Sidebar = require('./sidebar');
var Grid = require('./grid');
var isMobile = require('../tools/mobile').isMobile;

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

if (isMobile()) {
  Backend = require('react-dnd-touch-backend');
} else {
  Backend = require('react-dnd-html5-backend');
}

var Canvas = DragDropContext(Backend)(React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },

  render: function () {
    var imageSize = this.props.imageSize;
    return (
      <div className='canvas'>
        <Sidebar imageSize={imageSize} />
        <Grid imageSize={imageSize} />
      </div>
    );
  },
}));

ReactDOM.render(
  <Canvas imageSize={ CONST_IMAGESIZE }/>,
  document.getElementById('content')
);

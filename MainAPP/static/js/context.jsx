var React = require('react');
var ReactDOM = require('react-dom');
var DragDropContext = require('react-dnd').DragDropContext;
var Backend = require('react-dnd-html5-backend');
var Sidebar = require('./sidebar');
var Grid = require('./grid');

//var Grid = require('./grid');

var Context = React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },

  render: function () {
    var imageSize = this.props.imageSize;
    return (
      <div className='context'>
        <Sidebar
          source="../rest/CanvasInfo/"
          imageSize={imageSize}
        />
        <Grid
          imageSize={imageSize}
        />
      </div>
    );
  },
});

module.exports = DragDropContext(Backend)(Context);

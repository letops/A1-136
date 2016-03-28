var React = require('react');
var DragDropContext = require('react-dnd').DragDropContext;
var Backend = null;
var Sidebar = require('./sidebar');
var Grid = require('./grid');

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  Backend = require('react-dnd-touch-backend');
} else {
  Backend = require('react-dnd-html5-backend');
}

//var Grid = require('./grid');

var Context = React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },

  render: function () {
    var imageSize = this.props.imageSize;
    return (
      <div className='row'>
        <Sidebar imageSize={imageSize} />
        <Grid imageSize={imageSize} />
      </div>
    );
  },
});

module.exports = DragDropContext(Backend)(Context);

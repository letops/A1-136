var React = require('react');
var DragDropContext = require('react-dnd').DragDropContext;
var Backend = null;
var Sidebar = require('./sidebar');
var Grid = require('./grid');
var isMobile = require('../tools/mobile').isMobile;

if (isMobile()) {
  Backend = require('react-dnd-touch-backend');
} else {
  Backend = require('react-dnd-html5-backend');
}

var Context = React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },

  render: function () {
    var imageSize = this.props.imageSize;
    return (
      <div>
        <Sidebar imageSize={imageSize} />
        <Grid imageSize={imageSize} />
      </div>
    );
  },
});

module.exports = DragDropContext(Backend)(Context);

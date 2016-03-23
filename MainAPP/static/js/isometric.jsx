var React = require('react');
var PropTypes = React.PropTypes;
var ItemTypes = require('./constants').ItemTypes;
var DragSource = require('react-dnd').DragSource;

var isometricSource = {
  beginDrag: function (props) {
    return {};
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

var Isometric = React.createClass({
  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    imageId: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    imageSize: PropTypes.string.isRequired,
  },

  componentDidMount: function () {
    connectDragPreview = this.props.connectDragPreview;
    var img = new Image();
    img.src = this.props.imageUrl;
    img.onload = function () {
      connectDragPreview(img);
    };
  },

  render: function () {
    var connectDragSource = this.props.connectDragSource;
    var isDragging = this.props.isDragging;
    var imageUrl = this.props.imageUrl;
    var imageId = this.props.imageId;
    var imageSize = this.props.imageSize;

    return connectDragSource(
      <img key={imageId} src={imageUrl} width={imageSize} height={imageSize} />
    );
  },
});

module.exports = DragSource(ItemTypes.ISOMETRIC, isometricSource, collect)(Isometric);

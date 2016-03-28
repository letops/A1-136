var React = require('react');
var PropTypes = React.PropTypes;
var ItemTypes = require('./constants').ItemTypes;
var DragSource = require('react-dnd').DragSource;

var knightSource = {
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

var Knight = React.createClass({
  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  },

  componentDidMount: function () {
    connectDragPreview = this.props.connectDragPreview;
    var img = new Image();
    img.src = '/built/img/grvtyisotipo.png';
    img.onload = function () {
      connectDragPreview(img);
    };
  },

  render: function () {
    var connectDragSource = this.props.connectDragSource;
    var isDragging = this.props.isDragging;

    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
      }}>
        ♘
      </div>
    );
  },
});

module.exports = DragSource(ItemTypes.KNIGHT, knightSource, collect)(Knight);

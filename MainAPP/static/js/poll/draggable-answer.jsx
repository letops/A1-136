var React = require('react');
var PropTypes = React.PropTypes;
var findDOMNode = require('react-dom').findDOMNode;
var ItemTypes = require('./constants').ItemTypes;
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;

var answerSource = {
  beginDrag: function (props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

var answerTarget = {
  hover: function (props, monitor, component) {
    var dragIndex = monitor.getItem().index;
    var hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    var hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    var clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    var hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveAnswer(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

var DragAnswer = React.createClass({
  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveAnswer: PropTypes.func.isRequired,
  },

  render: function () {
    var text = this.props.text;
    var style = {
      border: '1px dashed gray',
      padding: '0.5rem 1rem',
      marginBottom: '.5rem',
      backgroundColor: 'white',
      cursor: 'move',
      opacity: this.props.isDragging ? 0 : 1,
    };

    return this.props.connectDragSource(this.props.connectDropTarget(
      <div style={style}>
        {text}
      </div>
    ));
  },
});

var DragSourceDecorator = DragSource(ItemTypes.DRAGANSWER, answerSource, collectSource);
var DropTargetDecorator = DropTarget(ItemTypes.DRAGANSWER, answerTarget, collectTarget);
module.exports = DropTargetDecorator(DragSourceDecorator(DragAnswer));

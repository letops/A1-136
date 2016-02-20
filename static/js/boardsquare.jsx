var React = require('react');
var PropTypes = React.PropTypes;
var Square = require('./square');
var canMoveKnight = require('./game').canMoveKnight;
var moveKnight = require('./game').moveKnight;
var ItemTypes = require('./constants').ItemTypes;
var DropTarget = require('react-dnd').DropTarget;

var squareTarget = {
  canDrop: function (props) {
    return canMoveKnight(props.x, props.y);
  },

  drop: function (props) {
    moveKnight(props.x, props.y);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

var BoardSquare = React.createClass({
  propTypes: {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  },

  renderOverlay: function (color) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }} />
    );
  },

  render: function () {
    var x = this.props.x;
    var y = this.props.y;
    var connectDropTarget = this.props.connectDropTarget;
    var isOver = this.props.isOver;
    var black = (x + y) % 2 === 1;

    return connectDropTarget(
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        <Square black={black}>
          {this.props.children}
        </Square>
        {this.props.isOver && !this.props.canDrop && this.renderOverlay('red')}
        {!this.props.isOver && this.props.canDrop && this.renderOverlay('yellow')}
        {this.props.isOver && this.props.canDrop && this.renderOverlay('green')}
      </div>
    );
  }
});

module.exports = DropTarget(ItemTypes.KNIGHT, squareTarget, collect)(BoardSquare);

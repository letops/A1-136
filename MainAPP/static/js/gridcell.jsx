var React = require('react');
var PropTypes = React.PropTypes;
var ItemTypes = require('./constants').ItemTypes;
var DropTarget = require('react-dnd').DropTarget;
var Cell = require('./cells');

var gridTarget = {
  
  drop: function (props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    var item = monitor.getItem();

    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);
    console.log("item");
    console.log(item.imageUrl);
    component.setState({
      imageUrl : item.imageUrl
    });

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

var GridCell = React.createClass({
  getInitialState : function (){
    return{
      imageUrl : ""
    };
  },
  propTypes: {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    children: PropTypes.node,
    imageUrl: PropTypes.string,
    fill: PropTypes.string,
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
    var imageUrl = this.state.imageUrl;
    var fill = this.props.fill;
    var connectDropTarget = this.props.connectDropTarget;
    var isOver = this.props.isOver;
    if (imageUrl==""){
      return connectDropTarget(
        <div style = {{ position: 'relative' }}>
            <Cell internalColor = 'black'>
                {this.props.children}
            </Cell>
            {isOver && this.renderOverlay('green')}
        </div>
      );
    }
    else {
      return connectDropTarget(
        <div style = {{ position: 'relative' }}>
            <Cell internalColor = 'black'
                imageUrl = {imageUrl}>
                {this.props.children}
            </Cell>
            {isOver && this.renderOverlay('green')}
        </div>
      );
    }
  },

});

module.exports = DropTarget(ItemTypes.ISOMETRIC, gridTarget, collect)(GridCell);

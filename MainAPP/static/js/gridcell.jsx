var React = require('react');
var PropTypes = React.PropTypes;
var ItemTypes = require('./constants').ItemTypes;
var DropTarget = require('react-dnd').DropTarget;

var gridTarget = {

  drop: function (props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }

    var item = monitor.getItem();
    component.setState({
      imageUrl: item.imageUrl,
      imageId: item.imageId,
    });
    return { moved: true };
  },
};

function collect(connect, monitor) {
  return {
    isOver: monitor.isOver(),
    connectDropTarget: connect.dropTarget(),
  };
}

var GridCell = React.createClass({
  getInitialState: function () {
    return {
      imageId: 0,
      imageUrl: '',
    };
  },

  propTypes: {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    children: PropTypes.node,
    imageUrl: PropTypes.string,
    imageId: PropTypes.number,
    fill: PropTypes.string,
  },

  renderOverlay: function (color) {
    return (
      <div
          className='col grid-box'
          style={{
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: color,
            backgroundSize: '100%',
            position: 'relative',
          }}
        />
    );
  },

  render: function () {
    var x = this.props.x;
    var y = this.props.y;
    var imageUrl = this.state.imageUrl;
    var imageId = this.state.imageId;
    var fill = this.props.fill;
    var connectDropTarget = this.props.connectDropTarget;
    var isOver = this.props.isOver;
    if (imageUrl == '') {
      return connectDropTarget(
        <div className='col grid-box'
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
          }}
        >
          {isOver && this.renderOverlay('green')}
        </div>
      );
    } else {
      return connectDropTarget(
        <div
          className='col grid-box'
          style={{
            backgroundImage: 'url(' + imageUrl + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
          }}
          data-image-id={imageId}
        >
          {isOver && this.renderOverlay('green')}
        </div>
      );
    }
  },

});

module.exports = DropTarget(ItemTypes.ISOMETRIC, gridTarget, collect)(GridCell);

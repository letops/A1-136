var React = require('react');
var PropTypes = React.PropTypes;
var ItemTypes = require('./constants').ItemTypes;
var DropTarget = require('react-dnd').DropTarget;
var Csrf = require('../tools/csrf');

var gridTarget = {

  drop: function (props, monitor, component) {
    var item = monitor.getItem();
    if (item.imageId != component.state.imageId) {

      component.setState({
        imageUrl: item.imageUrl,
        imageId: item.imageId,
      });

      var csrftoken = Csrf.getCookie('csrftoken');
      this.serverRequest = $.ajax({
        beforeSend: function (xhr, settings) {
          if (!Csrf.csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
          }

        },

        async: 'true',
        type: 'POST',
        url: 'save/',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(
          {
            imageId: item.imageId,
            column: component.props.column,
            row: component.props.row,
          }
        ),
      });
    }

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
  propTypes: {
    column: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string,
    imageId: PropTypes.number,
  },

  getInitialState: function () {
    return {
      imageId: undefined,
      imageUrl: undefined,
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.state.imageId == undefined) {
      this.setState({
        imageId: nextProps.imageId,
        imageUrl: nextProps.imageUrl,
      });
    }
  },

  renderOverlay: function (color) {
    return (
      <div
        className='canvas-box'
        style={{
          zIndex: 1,
          opacity: 0.5,
          backgroundColor: color,
          backgroundSize: '100% 100%',
          position: 'absolute',
          width: 'inherit',
          height: 'inherit',
        }}
      />
    );
  },

  render: function () {
    var column = this.props.column;
    var row = this.props.row;
    var connectDropTarget = this.props.connectDropTarget;
    var isOver = this.props.isOver;
    var stateUrlEmpty = ((this.state.imageUrl == '' ||
                          this.state.imageUrl == undefined ||
                          this.state.imageUrl == null) ? true : false);
    if (stateUrlEmpty == true) {
      return connectDropTarget(
        <div className='canvas-box col-xs-3'>
          {isOver && this.renderOverlay('green')}
        </div>
      );
    } else {
      var imageUrl = this.state.imageUrl;
      var imageId = this.state.imageId;
      return connectDropTarget(
        <div
          className='canvas-box col-xs-3'
          style={{
            backgroundImage: 'url(' + imageUrl + ')',
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

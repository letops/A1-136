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
    errorOverlay: PropTypes.bool,
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
      <div className='gc-overlay'/>
    );
  },

  render: function () {
    var column = this.props.column;
    var row = this.props.row;
    var connectDropTarget = this.props.connectDropTarget;
    var isOver = this.props.isOver;
    var stateUrlEmpty = this.state.imageUrl == '' ||
      this.state.imageUrl == undefined || this.state.imageUrl == null;

    if (stateUrlEmpty) {
      return connectDropTarget(
        <div className='grid-cell'>
          <div className='gc-overlay error'/>
          { isOver && <div className='gc-overlay good'/> }
        </div>
      );

    } else {
      var imageUrl = this.state.imageUrl;
      var imageId = this.state.imageId;
      return connectDropTarget(
        <div className='grid-cell' data-image-id={imageId}
          style={{ backgroundImage: 'url(' + imageUrl + ')', }}>
          { isOver && <div className='gc-overlay good'/> }
        </div>
      );
    }
  },

});

module.exports = DropTarget(ItemTypes.ISOMETRIC, gridTarget, collect)(GridCell);

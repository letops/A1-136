'use strict';

var React = require('react');
var PropTypes = React.PropTypes;

var Cell = React.createClass({
  propTypes: {
    black: PropTypes.bool
  },

  render: function () {
    var internal_color = this.props.internal_color;
    var image_url = this.props.image_url
    var fill = internal_color;
    var stroke = green;

    return (
      <div style={{ backgroundColor: fill,
          color: stroke,
          width: '100%',
          height: '100%' }}>
          <img src = image_url>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Cell;

'use strict';

var React = require('react');
var PropTypes = React.PropTypes;

var Cell = React.createClass({
  render: function () {
    var internal_color = this.props.internal_color;
    var imageUrl = this.props.imageUrl
    var fill = internal_color;
    
    return (
      <div style={{ backgroundColor: fill,
          width: '100%',
          height: '100%' }}>
          <img src = {imageUrl} />
        {this.props.children}
      </div>
    );
  }
});

module.exports = Cell;

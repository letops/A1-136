var React = require('react');
var PropTypes = React.PropTypes;

var Cell = React.createClass({
  propTypes: {
    imageId: PropTypes.number,
    imageUrl: PropTypes.string,
    imageSize: PropTypes.string,
    internalColor: PropTypes.string,
  },

  render: function () {
    var imageUrl = this.props.imageUrl;
    var fill = this.props.internalColor;

    return (
      <div style={{ backgroundColor: fill }} >
          <img src = {imageUrl} />
        {this.props.children}
      </div>
    );
  },
});

module.exports = Cell;

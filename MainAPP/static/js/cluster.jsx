var React = require('react');
var PropTypes = React.PropTypes;
var Isometric = require('./isometric');

var Cluster = React.createClass({
  propTypes: {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isometric_images: PropTypes.array.isRequired,
  },

  render: function () {
    var hiddenIsos = false;

    var IsometricNodes = this.props.isometric_images.map(function (isoimage) {
      var hideMe = hiddenIsos;
      hiddenIsos = true;
      return (
        <Isometric
          hide = {hideMe}
          imageUrl={isoimage.url}
          key={isoimage.id}
          imageId={isoimage.id}
        />
      );
    });
    
    return (
      <div key={this.props.id}>
        {IsometricNodes}
      </div>
    );
  },

});

module.exports = Cluster;

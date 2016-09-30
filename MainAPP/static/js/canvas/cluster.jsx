var React = require('react');
var PropTypes = React.PropTypes;
var Isometric = require('./isometric');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Cluster = React.createClass({
  propTypes: {
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isometricImages: PropTypes.array.isRequired,
    selected: PropTypes.bool.isRequired,
    selectCluster: PropTypes.func.isRequired,
  },

  render: function () {
    var IsometricNodes = null;
    if (this.props.isometricImages != 'undefined') {
      var preview = true;
      var hideAll = !this.props.selected;
      IsometricNodes = this.props.isometricImages.map(function (isoimage, number) {
        var isPreview = preview;  // Only the first image will be shown always
        preview = false;
        var style;
        if (this.props.index % 2 !== 0) {
          switch (number) {
            case 0:
            case 2:
              style = {};
              break;
            case 1:
              style = {
                top: 0,
                right: '-100%',
              };
              break;
            case 3:
              style = {
                right: '-100%',
              };
              break;
          }
        } else {
          switch (number) {
            case 0:
            case 3:
              style = {};
              break;
            case 1:
              style = {
                top: 0,
                left: '-100%',
              };
              break;
            case 2:
              style = {
                left: '-100%',
              };
              break;
          }
        }

        return (
          <Isometric key={ isoimage.id } imageId={ isoimage.id }
            imageUrl={ isoimage.url } preview={ isPreview }
            hide={ hideAll && !isPreview } position={ style }
          />
        );
      }.bind(this));

    } else {
      IsometricNodes = <span>Loading</span>;
    }

    var clusterSide = (this.props.index % 2 !== 0)
      ? ' left'
      : ' right';

    return (
        <div key={ this.props.id } className={ 'cluster' + clusterSide }
          onClick={ this.props.selectCluster.bind(null, this.props.id) }>
          { IsometricNodes }
        </div>
    );
  },

});

module.exports = Cluster;

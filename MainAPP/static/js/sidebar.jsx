var React = require('react');
var ReactDOM = require('react-dom');
var Isometric = require('./isometric');
var DragDropContext = require('react-dnd').DragDropContext;
var TouchBackend = require('react-dnd-touch-backend');

var Sidebar = React.createClass({
  getInitialState: function () {
    return {
      categories: '',
    };
  },

  componentWillMount: function () {
    this.serverRequest = $.get(this.props.source, function (result) {
      this.setState({
        categories: result,
      });
    }.bind(this));
  },

  render: function () {
    if (this.state.categories === '') {
      return (
        <div>
          <p className='loading'>Loading</p>
        </div>
      );
    } else {
      var categories = this.state.categories;
      var CategoryNodes = categories.map(function (category) {
        var clusters = category.clusters;
        var ClusterNodes = clusters.map(function (cluster) {
          var isometricimages = cluster.isometric_images;
          var IsometricNodes = isometricimages.map(function (isoimage) {
            console.log(isoimage);
            return (
              <Isometric imageUrl='/built/img/grvtyisotipo.png' />
            );
          });
//{isoimage.urls['25x25']}
          return (
            <div key={cluster.id}>
              {IsometricNodes}
            </div>
          );
        });

        return (
          <div key={category.id} id={category.name} className='category'>
            {ClusterNodes}
          </div>
        );
      });

      return (
        <div className='Hello'>{CategoryNodes}</div>
      );
    }
  },

});

module.exports = DragDropContext(TouchBackend)(Sidebar);

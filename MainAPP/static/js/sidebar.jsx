var React = require('react');
var Isometric = require('./isometric');

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var Sidebar = React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      categories: '',
    };
  },

  componentWillMount: function () {
    // this.serverRequest = $.get(this.props.source, function (result) {
    //   this.setState({
    //     categories: result,
    //   });
    // }.bind(this));
    var csrftoken = getCookie('csrftoken');
    var filtersvar = {
      size: this.props.imageSize,
    };
    this.serverRequest = $.ajax({
      beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }

      },

      type: 'POST',
      url: this.props.source,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({ filters: filtersvar }),
      success: function (result) {
        this.setState({
          categories: result,
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    if (this.state.categories === null || this.state.categories === '') {
      return (
        <div>
          <p className='loading'>Loading</p>
        </div>
      );
    } else {
      var imageSize = this.props.imageSize;
      var CategoryNodes = this.state.categories.map(function (category) {
        var ClusterNodes = category.clusters.map(function (cluster) {
          var IsometricNodes = cluster.isometric_images.map(function (isoimage) {
            return (
              <Isometric
                imageUrl={isoimage.url}
                imageSize={imageSize}
                key={isoimage.id}
                imageId={isoimage.id}
              />
            );
          });

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
        <div className='react-sidebar'>{CategoryNodes}</div>
      );
    }
  },

});

module.exports = Sidebar;

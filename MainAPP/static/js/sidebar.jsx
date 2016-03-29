var React = require('react');
var Isometric = require('./isometric');
var Csrf = require('./csrf');

var Sidebar = React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      categories: '',
      selected: '',
    };
  },

  componentWillMount: function () {
    var csrftoken = Csrf.getCookie('csrftoken');
    var filtersvar = {
      size: this.props.imageSize,
    };
    this.serverRequest = $.ajax({
      beforeSend: function (xhr, settings) {
        if (!Csrf.csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      },

      type: 'POST',
      url: '../rest/CanvasInfo/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({ filters: filtersvar }),
      success: function (result) {
        this.setState({
          categories: result,
          selected: ((result.length > 0) ? result[0].id  + '-' + result[0].name : 'select'),
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  change: function (event) {
    this.setState({ selected: event.target.value });
  },

  renderOptions: function () {
    var CategoryOptions = this.state.categories.map(function (category) {
      return (
        <option key={category.id} value={category.id  + '-' + category.name}>
          {category.name}
        </option>
      );
    });

    return (
      <select id='category-selector' onChange={this.change} value={this.state.selected}>
        {CategoryOptions}
      </select>
    );
  },

  renderNodes: function () {
    var imageSize = this.props.imageSize;
    var selected = this.state.selected;
    var CategoryNodes = this.state.categories.map(function (category) {
      var hideCategory = (
        (selected == category.id  + '-' + category.name) ?
        '' : 'hidden'
      );
      var ClusterNodes = category.clusters.map(function (cluster) {
        var IsometricNodes = cluster.isometric_images.map(function (isoimage) {
          return (
            <Isometric
              imageUrl={isoimage.url}
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
        <div
          key={category.id} id={category.id  + '-' + category.name}
          className={'category ' + hideCategory}
        >
          {ClusterNodes}
        </div>
      );
    });

    return CategoryNodes;
  },

  render: function () {
    if (this.state.categories === null || this.state.categories === '') {
      return (
        <div className='col-md-offset-1 col-md-3 col-xs-offset-1 col-xs-2 colClass2'>
          <h1 className="title">Drag &amp; Drop</h1>
          <p className="description">
            Quisque vel nisl diam sed consectetur sed magna nec posuere.
          </p>

          <p>
            Loading
          </p>
        </div>
      );
    } else {

      var CategoryOptions = this.renderOptions();
      var CategoryNodes = this.renderNodes();

      return (
        <div className='col-md-offset-1 col-md-3 col-xs-offset-1 col-xs-2 colClass2'>
          <h1 className="title">Drag &amp; Drop</h1>
          <p className="description">
            Quisque vel nisl diam sed consectetur sed magna nec posuere.
          </p>
          {CategoryOptions}
          {CategoryNodes}
        </div>
      );
    }
  },

});

module.exports = Sidebar;

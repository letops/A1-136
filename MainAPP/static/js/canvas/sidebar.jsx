var React = require('react');
var PropTypes = React.PropTypes;
var Cluster = require('./cluster');
var Csrf = require('../tools/csrf');

var Sidebar = React.createClass({
  propTypes: {
    imageSize: PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      categories: '',
      selected: '',
    };
  },

  componentDidUpdate(prevProps, prevState) {
    isoimages = document.getElementsByClassName('col grid-img');
    for (i = 0; i < isoimages.length; i++) {
      jQuery(isoimages[i]).fadeIn('slow');
    }
  },

  componentWillUpdate(nextProps, nextState) {
    isoimages = document.getElementsByClassName('col grid-img');
    for (i = 0; i < isoimages.length; i++) {
      jQuery(isoimages[i]).fadeIn('slow');
    }
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
      url: 'images/',
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
        console.error('URL: images/', status, err.toString());
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

    // Bootstrap won't work with a combo, because it reads the DOM and overwrites
    // the section with its own JS. The render overwrites this section after the initial
    // load, so Bootstrap will flunk.
    return (
      <label className='selectLabel'>
        <select
          id='category-selector'
          className='dropdownStyle'
          onChange={this.change}
          value={this.state.selected}
        >
          {CategoryOptions}
        </select>
      </label>
    );
  },

  renderNodes: function () {
    var imageSize = this.props.imageSize;
    var selected = this.state.selected;
    var CategoryNodes = this.state.categories.map(function (category) {
      var hideCategory = (
        (selected == category.id  + '-' + category.name) ? '' : 'hidden'
      );
      firstImage = 'left';
      var ClusterNodes = category.clusters.map(function (cluster) {
        first = firstImage;
        firstImage = (firstImage == 'left') ? 'right' : 'left';
        return (
          <Cluster className={first}
            key={cluster.id}
            id={cluster.id}
            name={cluster.name}
            isometric_images={cluster.isometric_images}
            firstImage = {first}
          />
        );
      });

      return (
        <div
          key={category.id} id={category.id  + '-' + category.name}
          className={'grid category ' + hideCategory}
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
        <div className='col-md-offset-1 col-md-3 col-xs-offset-0 col-xs-2 hidden-sm hidden-xs canvas-sidebar'>
          <h1 className='title'>{ CONST_SYSTEM_NAME }</h1>
          <p className='description'>
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
        <div className='col-md-offset-1 col-md-3 col-xs-offset-0 col-xs-2 hidden-sm hidden-xs canvas-sidebar'>
          <h1 className='title'>{ CONST_SYSTEM_NAME }</h1>
          <p className='description'>
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

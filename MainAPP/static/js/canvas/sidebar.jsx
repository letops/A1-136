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
    isoimages = document.getElementsByClassName("col grid-img");
    for(i = 0 ; i<isoimages.length ; i++){
      console.log(isoimages[i])
      jQuery(isoimages[i]).fadeIn("slow");
    }
  },

  componentWillUpdate(nextProps, nextState) {
    isoimages = document.getElementsByClassName("col grid-img");
    for(i = 0 ; i<isoimages.length ; i++){
      console.log(isoimages[i])
      jQuery(isoimages[i]).fadeIn("slow");
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
        (selected == category.id  + '-' + category.name) ? '' : 'hidden'
      );
      var ClusterNodes = category.clusters.map(function (cluster) {
        return (
          <Cluster
            key={cluster.id}
            id={cluster.id}
            name={cluster.name}
            isometric_images={cluster.isometric_images}
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
        <div className='col-md-offset-1 col-md-3 col-xs-offset-1 col-xs-2 colClass2 hidden-sm hidden-xs'>
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

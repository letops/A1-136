var React = require('react');
var PropTypes = React.PropTypes;
var Cluster = require('./cluster');
var Csrf = require('../tools/csrf');

var Sidebar = React.createClass({
  propTypes: {
    imageSize: PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return { categories: '', selectedCat: 0, selectedCluster: -1 };
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
          selectedCat: (result.length > 0) ? result[0].id : 0,
          selectedCluster: -1,
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('URL: images/', status, err.toString());
      }.bind(this),
    });
  },

  handleCategoryChange: function (event) {
    this.setState({ selectedCat: event.target.value, selectedCluster: -1 });
  },

  handleSelectCluster: function (id) {
    console.log(id);
    this.setState({ selectedCluster: id });
  },

  renderOptions: function () {
    var CategoryOptions = this.state.categories.map(function (category, index) {
      return (
        <option key={ index } value={ category.id }>
          { category.name }
        </option>
      );
    });

    return (
      <label className='sel-label'>
        <select id='category-selector' className='sel-drop'
          onChange={ this.handleCategoryChange } value={ this.state.selectedCat }
          data-intro='Este es el seleccionador de categoria, aqui puedes escoger el tipo de imagenes'
          data-position='top'> { CategoryOptions }
        </select>
      </label>
    );
  },

  renderCategories: function () {
    var imageSize = this.props.imageSize;
    var selectedCat = this.state.selectedCat;
    var selectedCluster = this.state.selectedCluster;
    var handleSelectCluster = this.handleSelectCluster;
    var rowSize = 2;
    var CategoryNodes = this.state.categories.map(function (category, catIndex) {
      var hideCategory = (selectedCat == category.id)
        ? ''
        : 'hidden';

      var ClusterNodes = category.clusters.map(function (cluster, index) {
        var selected = selectedCluster == cluster.id;
        return (
          <Cluster key={ cluster.id } id={ cluster.id } index={ index + 1 }
            name={ cluster.name } isometricImages={ cluster.isometric_images }
            selected={ selected } selectCluster={ handleSelectCluster }
          />
        );
      }).reduce(function (r, element, index) {
        index % rowSize === 0 && r.push([]);
        r[r.length - 1].push(element);
        return r;
      }, []).map(function (rowContent, index) {
        return <div className="row" key={ index }>{ rowContent }</div>;
      });

      return (
        <div key={ category.id } id={ category.id }
          className={ 'category ' + hideCategory }>
          { ClusterNodes }
        </div>
      );
    });

    return CategoryNodes;
  },

  render: function () {
    var CategoryOptions = null;
    var CategoryNodes = null;

    if (this.state.categories === null || this.state.categories === '') {
      CategoryOptions = <p>Loading</p>;
    } else {
      CategoryOptions = this.renderOptions();
      CategoryNodes = this.renderCategories();
    }

    return (
      <div id='sidebar'
        data-intro='Este es el sidebar, aquí puedes escoger las imágenes que gustes'
        data-position='bottom' className='sidebar'>
        <h1 className='title'>{ CONST_SYSTEM_NAME }</h1>
        <p className='description'
          >Quisque vel nisl diam sed consectetur sed magna nec posuere.
        </p>
        { CategoryOptions }
        { CategoryNodes }
      </div>
    );
  },

});

module.exports = Sidebar;

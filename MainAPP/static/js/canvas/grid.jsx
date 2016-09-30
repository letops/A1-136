var React = require('react');
var PropTypes = React.PropTypes;
var GridCell = require('./gridcell.jsx');
var Csrf = require('../tools/csrf');
var ExtraScripts = require('../tools/extra-scripts');

var Grid = React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      cached: '',
      finished: undefined,
    };
  },

  componentWillMount: function () {
    this.updateCache();
  },

  submitCanvas: function (event) {
    event.preventDefault();
    gridElements = document.getElementsByClassName('grid-cell');
    var nonImageCounter = 0;
    for (i = 0; i < (CONST_GRIDSIZE * CONST_GRIDSIZE); i++) {
      // console.log(gridElements[i]);
      if (gridElements[i].hasAttribute('data-image-id')) {
        gridElements[i].className = 'grid-cell col-xs-3';
      } else {
        gridElements[i].className += ' grid-error';
        nonImageCounter++;
      }

    }

    // console.log(nonImageCounter);
    if (nonImageCounter != 0) {
      alert('not finished yet');
    }

    if (nonImageCounter == 0) {
      document.getElementById('form-submit').submit();
    }
  },

  submitReact: function (event) {
    this.updateCache();
    if (this.state.cached == undefined || this.state.cached == null ||
        this.state.cached.length != (CONST_GRIDSIZE * CONST_GRIDSIZE)) {
      event.preventDefault();
      this.setState({
        finished: false,
      });
    } else {
      time = ExtraScripts.countTime();
      document.getElementById('timer').value = time;
    }
  },

  updateCache: function () {
    var csrftoken = Csrf.getCookie('csrftoken');
    var filtersvar = { size: this.props.imageSize, };
    this.serverRequest = $.ajax({
      beforeSend: function (xhr, settings) {
        if (!Csrf.csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      },

      type: 'POST',
      url: 'cached/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({ filters: filtersvar }),
      success: function (result) {
        this.setState({ cached: result, });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('URL: cached/', status, err.toString());
      }.bind(this),
    });
  },

  renderRow: function (i, cells) {
    return (
      <div
        className='row'
        key={ i }>
          { cells }
      </div>
    );
  },

  renderCell: function (i) {
    var column = i % CONST_GRIDSIZE;
    var row = Math.floor(i / CONST_GRIDSIZE);
    var cached = this.state.cached;
    var redOverlay = (this.state.finished == false)
      ? true
      : false;
    if (cached != '' && cached != null) {
      for (var j = 0; j < cached.length; j++) {
        if (cached[j].column == column && cached[j].row == row) {
          return (
            <GridCell
              imageId = { cached[j].isometric_image.id }
              imageUrl = { cached[j].isometric_image.url }
              column = { column }
              row = { row }
              key={ i }
            />
          );
        }
      }
    }

    return (
      <GridCell
        column = {column}
        row = {row}
        key={i}
        errorOverlay={redOverlay}
      />
    );

  },

  render: function () {
    var csrftoken = Csrf.getCookie('csrftoken');
    var rows = [];
    var cells = [];
    var warningMessage = ((this.state.finished == false) ?
      'appear' : 'disappear'
    );
    for (i = 0; i < CONST_GRIDSIZE; i++) {
      for (j = 0; j < CONST_GRIDSIZE; j++) {
        var k = (i * CONST_GRIDSIZE) + j;
        cells.push(this.renderCell(k));
      }

      rows.push(this.renderRow(i, cells));
      cells = [];
    }

    return (
      <div id='grid' data-intro='Este es el canvas' data-position='bottom'
        className='grid'>
        {rows}

        <form method='post' id='form-submit' action={ CONST_URL_FINISH }
          className='row'>
          <input type='hidden' name='csrfmiddlewaretoken' value={ csrftoken } />
          <input type='hidden' name='time' value='0' id='timer' />

          <button type='button' className={'btn btn-danger ' + warningMessage}
            disabled={ true }>
            <span className='warning-message'>¡RELLENA TODOS LOS BLOQUES!</span>
          </button>

          <button type='submit' id='button-submit'
            className='btn btn-default'
            data-intro='Al terminar, presiona este boton para guardar tus cambios'
            data-position='left' onClick={ this.submitReact }
          >ENVIAR</button>
        </form>
      </div>
    );
  },

});

module.exports = Grid;

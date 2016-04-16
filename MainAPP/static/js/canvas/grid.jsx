var React = require('react');
var PropTypes = React.PropTypes;
var GridCell = require('./gridcell.jsx');
var Csrf = require('../tools/csrf');

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

  submitCanvas: function (event) {
    event.preventDefault();
    gridElements = document.getElementsByClassName('canvas-box');
    var nonImageCounter = 0;
    for (i = 0; i < (CONST_GRIDSIZE * CONST_GRIDSIZE); i++) {
      console.log(gridElements[i]);
      if (gridElements[i].hasAttribute('data-image-id')) {
        gridElements[i].className = 'canvas-box col-xs-3';
      } else {
        gridElements[i].className += ' grid-error';
        nonImageCounter++;
      }

    }

    console.log(nonImageCounter);
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
    }
  },

  updateCache: function () {
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
      url: 'cached/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({ filters: filtersvar }),
      success: function (result) {
        this.setState({
          cached: result,
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('URL: cached/', status, err.toString());
      }.bind(this),
    });
  },

  componentWillMount: function () {
    this.updateCache();
  },

  renderRow: function (i, cells) {
    return (
      <div
        className='row'
        key={i}>
          {cells}
      </div>
    );
  },

  renderCell: function (i) {
    var column = i % CONST_GRIDSIZE;
    var row = Math.floor(i / CONST_GRIDSIZE);
    var cached = this.state.cached;
    var redOverlay = (this.state.finished == false) ? true : false;
    if (cached != '' && cached != null) {
      for (var j = 0; j < cached.length; j++) {
        if (cached[j].column == column && cached[j].row == row) {
          return (
            <GridCell
              imageId = {cached[j].isometric_image.id}
              imageUrl = {cached[j].isometric_image.url}
              column = {column}
              row = {row}
              key={i}
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
      <div className='col-md-8 col-xs-10 hidden-sm hidden-xs canvas-draw'>
        {rows}
        <div className='row'>
          <form method='post' id='form-submit' action={CONST_URL_FINISH}>
            <div className='col-xs-7'>
              <button
                type="button"
                className={'btn btn-danger btn-block disabled ' + warningMessage}>
                <span className="warning-message"></span> ¡RELLENA TODOS LOS BLOQUES!
              </button>
            </div>
            <div className='col-xs-3'>
              <input
                type='hidden'
                name='csrfmiddlewaretoken'
                value={csrftoken}
              />
              <button
                type='submit'
                id='button-submit'
                className='btn btn-default btn-block hidden-sm hidden-xs'
                onClick={this.submitReact}
              >
                ENVIAR
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },

});

module.exports = Grid;

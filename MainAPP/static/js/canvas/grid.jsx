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
    };
  },

  componentWillMount: function () {
    var csrftoken = Csrf.getCookie('csrftoken');
    document.getElementById("button-submit").addEventListener("click", function(event){
      event.preventDefault();
      gridElements = document.getElementsByClassName("grid-box");
      var nonImageCounter = 0;
      for (i=0 ; i < 16 ; i++){
        console.log("element "+i);
        if (gridElements[i].hasAttribute("data-image-id")){
          gridElements[i].className = "col grid-box";
        }
        else{
          gridElements[i].className += " grid-error";
          nonImageCounter++;
        }

        // gridElements[i].style.backgroundColor = 'red';
      }
      console.log(nonImageCounter);
      if(nonImageCounter != 0){
        alert("not finished yet");
      }
      if(nonImageCounter==0){
        document.getElementById("form-submit").submit();
      }


    });
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

  renderRow: function (i, cells) {
    return (
      <div
        className="grid"
        key={i}>
          {cells}
      </div>
    );
  },

  renderCell: function (i) {
    var column = i % CONST_GRIDSIZE;
    var row = Math.floor(i / CONST_GRIDSIZE);
    var cached = this.state.cached;
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
      />
    );

  },

  render: function () {
    var rows = [];
    var cells = [];
    for (i = 0; i < CONST_GRIDSIZE; i++) {
      for (j = 0; j < CONST_GRIDSIZE; j++) {
        var k = (i * CONST_GRIDSIZE) + j;
        cells.push(this.renderCell(k));
      }

      rows.push(this.renderRow(i, cells));
      cells = [];
    }

    return (
      <div className='col-md-8 col-xs-8 colClass hidden-sm hidden-xs'>
        {rows}
      </div>
    );
  },

});

module.exports = Grid;

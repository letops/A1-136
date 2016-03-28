var React = require('react');
var PropTypes = React.PropTypes;
var GridCell = require('./gridcell.jsx');

var Grid = React.createClass({
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
    var column = i % 4;
    var row = Math.floor(i / 4);
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
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        var k = (i * 4) + j;
        cells.push(this.renderCell(k));
      }

      rows.push(this.renderRow(i, cells));
      cells = [];
    }

    return (
      <div className='col-md-8 col-xs-8 colClass'>
        {rows}
      </div>
    );
  },

});

module.exports = Grid;

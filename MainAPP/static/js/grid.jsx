var React = require('react');
var PropTypes = React.PropTypes;
var GridCell = require('./gridcell.jsx');
var DragDropContext = require('react-dnd').DragDropContext;
var TouchBackend = require('react-dnd-html5-backend');

var Grid = React.createClass({
  propTypes: {
    imageSize: React.PropTypes.string.isRequired,
  },
  renderCell: function (i) {
    var x = i % 4;
    var y = Math.floor(i / 4);
    return (
      <div key={i}
        style={{ width: '25%', height: '25%' }}>
        <GridCell
          x = {x}
          y = {y}
        />
      </div>
    );
  },

  render: function () {
    var cells = [];
    for (i = 0; i < 16; i++) {
      cells.push(this.renderCell(i));
    }

    return (
        <div className='react-grid'>
          {cells}
        </div>
    );
  },

});

module.exports = Grid;

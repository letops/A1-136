var React = require('react');
var Knight = require('./knight');
var BoardSquare = require('./boardsquare');
var canMoveKnight = require('./game').canMoveKnight;
var moveKnight = require('./game').moveKnight;
var DragDropContext = require('react-dnd').DragDropContext;
var TouchBackend = require('react-dnd-html5-backend');

var Board = React.createClass({
  propTypes: {
    knightPosition: React.PropTypes.arrayOf(
      React.PropTypes.number.isRequired
    ).isRequired,
  },

  renderSquare: function (i) {
    var x = i % 8;
    var y = Math.floor(i / 8);

    return (
      <div key={i}
           style={{ width: '12.5%', height: '12.5%' }}>
        <BoardSquare x={x}
                     y={y}>
          {this.renderPiece(x, y)}
        </BoardSquare>
      </div>
    );
  },

  renderPiece: function (x, y) {
    var knightX = this.props.knightPosition[0]
    var knightY = this.props.knightPosition[1];

    if (x === knightX && y === knightY) {
      return <Knight/>;
    }
  },

  render: function () {
    var squares = [];
    for (i = 0; i < 64; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div style={{
        width: '90%',
        height: '90%',
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {squares}
      </div>
    );
  }
});

module.exports = DragDropContext(TouchBackend)(Board);

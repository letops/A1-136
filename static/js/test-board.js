var React = require('react');
var BoardSquare = require('test-boardsquare');
var Knight = require('test-knight');
var DragDropContext = require('react-dnd');
var HTML5Backend = require('react-dnd-touch-backend');
var less = require('Board.less');

//@DragDropContext(HTML5Backend)
export default class Board extends Component {
  static propTypes = {
    knightPosition: React.PropTypes.arrayOf(
      PropTypes.number.isRequired
    ).isRequired
  };

  renderSquare(i) {
    const x = i % 8;
    const y = Math.floor(i / 8);

    return (
      <div key={i}
           style={{ width: '12.5%', height: '12.5%' }}>
        <BoardSquare x={x}
                     y={y}>
          {this.renderPiece(x, y)}
        </BoardSquare>
      </div>
    );
  }

  renderPiece(x, y) {
    const [knightX, knightY] = this.props.knightPosition;
    if (x === knightX && y === knightY) {
      return <Knight />;
    }
  }

  render() {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div className='Board'>
        {squares}
      </div>
    );
  }
}

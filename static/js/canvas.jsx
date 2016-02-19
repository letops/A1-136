var React = require('react');

var Board = React.createClass({
  propTypes: {
    knightPosition: PropTypes.arrayOf(
      PropTypes.number.isRequired
    ).isRequired
  },

  render: function () {
    return (
      <div>
        <Square black>
          <Knight/>
        </Square>
      </div>
    );
  }
});

React.render(
  React.createElement(Board, knightPosition=[0, 0]),
  document.getElementById('content')
);

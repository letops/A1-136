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

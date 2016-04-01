var React = require('react');
var DragAnswer = require('./draggable-answer');
var DragDropContext = require('react-dnd').DragDropContext;
var Backend = null;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  Backend = require('react-dnd-touch-backend');
} else {
  Backend = require('react-dnd-html5-backend');
}

var style = {
  width: 400,
};

var AnswersContainer = React.createClass({
  getInitialState: function () {
    // this.moveCard.bind(this);
    return {
      cards: [
        {
          id: 1,
          text: 'Write a cool JS library',
        }, {
          id: 2,
          text: 'Make it generic enough',
        }, {
          id: 3,
          text: 'Write README',
        }, {
          id: 4,
          text: 'Create some examples',
        }, {
          id: 5,
          text: 'Spam in Twitter and IRC to promote it (note that this taller than the others)',
        }, {
          id: 6,
          text: '???',
        }, {
          id: 7,
          text: 'PROFIT',
        },
      ],
    };
  },

  moveCard: function (dragIndex, hoverIndex) {
    var cards = this.state.cards;
    var dragCard = cards[dragIndex];
    var newCards = cards;
    newCards.splice(dragIndex, 1); // removing what you are dragging.
    newCards.splice(hoverIndex, 0, dragCard); // inserting it into hoverIndex.

    this.setState({
      cards: newCards,
    });
  },

  render: function () {
    var cards = this.state.cards;
    var moveCard = this.moveCard;
    var CardNodes = cards.map(function (card, i) {
      return (
          <DragAnswer
            key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          />
      );
    });

    return (
      <div>
        {CardNodes}
      </div>
    );
  },
});

module.exports = DragDropContext(Backend)(AnswersContainer);

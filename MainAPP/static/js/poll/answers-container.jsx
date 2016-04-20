var React = require('react');
var PropTypes = React.PropTypes;
var DragAnswer = require('./draggable-answer');
var DragDropContext = require('react-dnd').DragDropContext;
var Csrf = require('../tools/csrf');
var isMobile = require('../tools/mobile').isMobile;
var Backend = null;

if (isMobile()) {
  Backend = require('react-dnd-touch-backend');
} else {
  Backend = require('react-dnd-html5-backend');
}

var style = {
  width: 400,
};

var AnswersContainer = React.createClass({
  propTypes: {
    answers: PropTypes.array.isRequired,
    questionId: PropTypes.number.isRequired,
  },

  getInitialState: function () {
    return {
      answers: undefined,
    };
  },

  componentWillMount: function () {
    if (this.state.answers == undefined) {
      this.setState({
        answers: this.props.answers,
      });
    }
  },

  saveAnswers: function () {
    var questionId = this.props.questionId;
    var index = this.state.answers.length + 1;
    var answersJSON = this.state.answers.map(function (answer) {
      index--;
      return {
        questionId: questionId,
        answerId: answer.id,
        weight: index,
      };
    });

    var csrftoken = Csrf.getCookie('csrftoken');
    this.serverRequest = $.ajax({
      beforeSend: function (xhr, settings) {
        if (!Csrf.csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      },

      async: 'true',
      type: 'POST',
      url: 'priority/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(answersJSON),
    });
    $.fn.fullpage.moveSectionDown();
  },

  moveAnswer: function (dragIndex, hoverIndex) {
    var answers = this.state.answers;
    var dragAnswer = answers[dragIndex];
    var newAnswers = answers;
    newAnswers.splice(dragIndex, 1); // removing what you are dragging.
    newAnswers.splice(hoverIndex, 0, dragAnswer); // inserting it into hoverIndex.

    this.setState({
      answers: newAnswers,
    });
  },

  render: function () {
    var answers = this.state.answers;
    if (answers == undefined) {
      return (
        <div> Loading </div>
      );
    }

    var moveAnswer = this.moveAnswer;
    var saveAnswers = this.saveAnswers;
    var AnswerNodes = answers.map(function (answer, i) {
      return (
          <DragAnswer
            key={answer.id}
            index={i}
            id={answer.id}
            text={answer.text}
            moveAnswer={moveAnswer}
          />
      );
    });

    return (
      <div>
        {AnswerNodes}
        <button className="btn pull-right" type="button" onClick={saveAnswers}>Next</button>
      </div>
    );
  },
});

module.exports = DragDropContext(Backend)(AnswersContainer);

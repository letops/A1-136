var React = require('react');
var PropTypes = React.PropTypes;
var DraggableAnswer = require('./draggable-answer');
var DragDropContext = require('react-dnd').DragDropContext;
var Csrf = require('../tools/csrf');
var isMobile = require('../tools/mobile').isMobile;
var Backend = null;

if (isMobile()) {
  Backend = require('react-dnd-touch-backend');
} else {
  Backend = require('react-dnd-html5-backend');
}

var PriorityAnswers = DragDropContext(Backend)(React.createClass({
  propTypes: {
    answers: PropTypes.array.isRequired,
    questionId: PropTypes.number.isRequired,
  },

  getInitialState: function () {
    return { answers: undefined, };
  },

  componentWillMount: function () {
    if (this.state.answers == undefined) {
      this.setState({ answers: this.props.answers, });
    }
  },

  moveAnswer: function (dragIndex, hoverIndex) {
    var answers = this.state.answers;
    var dragAnswer = answers[dragIndex];
    var newAnswers = answers;
    newAnswers.splice(dragIndex, 1); // removing what you are dragging.
    newAnswers.splice(hoverIndex, 0, dragAnswer); // inserting it into hoverIndex.

    this.setState({ answers: newAnswers, });
  },

  render: function () {
    var answers = this.state.answers;
    if (answers == undefined) {
      return <div className='load-text'> Cargando preguntas ... </div>;
    }

    var AnswerNodes = answers.map(function (answer, index) {
      return (
          <DraggableAnswer key={ answer.id } index={ index } id={ answer.id }
            text={ answer.text } moveAnswer={ this.moveAnswer } />
      );
    }.bind(this));

    return (
      <div className='row'>
        { AnswerNodes }
      </div>
    );
  },
}));

var RadioAnswers = React.createClass({
  propTypes: {
    questionId: PropTypes.number.isRequired,
    submitRadioChange: PropTypes.func.isRequired,
    answers: PropTypes.array.isRequired,
  },

  render: function () {
    var AnswerNodes = this.props.answers.map(function (answer) {
      return (
        <div key={answer.id} className='qr-answer'>
          <label className='qr-label'>
            <input
              type='radio'
              name={ 'question-' + this.props.questionId }
              value={ answer.id }
              onChange={ this.props.submitRadioChange }
            />{ answer.text }
          </label>
        </div>
      );
    }.bind(this));

    return (
      <div className='row'>
        { AnswerNodes }
      </div>
    );
  },
});

var Question = React.createClass({
  propTypes: {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    style: PropTypes.number.isRequired,
    answers: PropTypes.array.isRequired,
  },

  submitRadioChange: function (event) {
    var csrftoken = Csrf.getCookie('csrftoken');
    this.serverRequest = $.ajax({
      beforeSend: function (xhr, settings) {
        if (!Csrf.csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      },

      async: 'true',
      type: 'POST',
      url: 'radio/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(
        {
          questionId: this.props.id,
          answerId: event.target.value,
        }
      ),
    });
  },

  submitPriority: function (questionId, answers) {
    var index = answers.length - 1;
    var answersJSON = answers.map(function (answer) {
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
  },

  render: function () {
    var style = this.props.style;
    var AnswerNodes = (style == 0)
      ? <RadioAnswers answers={ this.props.answers } questionId={ this.props.id }
          submitRadioChange={ this.submitRadioChange }/>
      : <PriorityAnswers answers={ this.props.answers } questionId={ this.props.id }
          />;

    var id = this.props.id;
    return (
      <div className='q-row'>
        <div className='row'>
          <div className='q-title'>
            <span className='q-number'>{ this.props.number }</span>
            <span className='q-text'>{ this.props.text }</span>
          </div>
        </div>
        <div className='row'>
          <span className='q-desc'>{ this.props.description.toUpperCase() }</span>
        </div>
        { AnswerNodes }
      </div>
    );

  },
});

module.exports = Question;

var React = require('react');
var PropTypes = React.PropTypes;
var Csrf = require('../tools/csrf');
var AnswersContainer = require('./answers-container');

var Question = React.createClass({
  propTypes: {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    style: PropTypes.number.isRequired,
    answers: PropTypes.array.isRequired,
  },

  // scrollDown: function (event) {
  //   $.fn.fullpage.moveSectionDown();
  // },

  changeRadio: function (event) {
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

  renderAsRadio: function () {
    var questionId = this.props.id;
    var changeRadio = this.changeRadio;
    var AnswerNodes = this.props.answers.map(function (answer) {
      return (
        <div key={answer.id} className='radioAnswers'>
          <label className='radioLabels'>
            <input
              type='radio'
              name={'question-' + questionId}
              value={answer.id}
              onChange={changeRadio}
            />{answer.text}
          </label>
        </div>
      );
    });

    return AnswerNodes;
  },

  renderAsPriority: function () {
    var questionId = this.props.id;
    var answers = this.props.answers;
    return (
      <AnswersContainer
        key={ questionId }
        answers={ answers }
        questionId={ questionId }
      />
    );
  },

  render: function () {
    var style = this.props.style;
    var AnswerNodes = ((style == 0) ? this.renderAsRadio() : this.renderAsPriority());
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
        <div className='row'>
          { AnswerNodes }
        </div>
      </div>
    );

  },
});

module.exports = Question;

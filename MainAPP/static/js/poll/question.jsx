var React = require('react');
var PropTypes = React.PropTypes;
var Csrf = require('../tools/csrf');
var AnswersContainer = require('./answers-container');

var Question = React.createClass({
  propTypes: {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    style: PropTypes.number.isRequired,
    answers: PropTypes.array.isRequired,
  },

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
        <div key={answer.id} className="radioAnswers">
          <label className='radioLabels'>
            <input
              type='checkbox'
              name={'question-' + questionId}
              value={answer.id}
              onChange={changeRadio}
            />{answer.text}:
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
        key={questionId}
        answers={answers}
        questionId={questionId}
      />
    );
  },

  render: function () {
    var style = this.props.style;
    var questionId = this.props.id;
    var AnswerNodes = ((style == 0) ? this.renderAsRadio() : this.renderAsPriority());

    return (
      <div className='questionRow'>
        <div className='col-xs-offset-1'>
          <form action='#'>
            <div className='questionText'>
              <span className='spanID'>{this.props.id}</span>
              <i className="fa fa-long-arrow-right customArrow" aria-hidden="true"></i>
              {this.props.text}
            </div>
            <div>
              {AnswerNodes}
            </div>
          </form>
        </div>
      </div>
    );

  },
});

module.exports = Question;

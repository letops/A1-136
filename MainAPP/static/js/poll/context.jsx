var React = require('react');
var Question = require('./question');

var Context = React.createClass({
  getInitialState: function () {
    return {
      questions: '',
    };
  },

  componentWillMount: function () {
    this.serverRequest = $.ajax({
      type: 'GET',
      url: 'questions/',
      success: function (result) {
        this.setState({
          questions: result,
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('URL: questions/', status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    var questions = this.state.questions;
    if (questions == '' || questions == null || questions == undefined) {
      return (
        <div className='row'>
          Loading
        </div>
      );
    } else {
      var QuestionNodes = this.state.questions.map(function (question) {
        return (
          <Question
            key={question.id}
            id={question.id}
            text={question.text}
            style={question.style}
            answers={question.answers}
          />
        );
      });

      return (
        <div className='col-xs-8 col-xs-offset-2'>
          {QuestionNodes}
        </div>
      );
    }
  },
});

module.exports = Context;

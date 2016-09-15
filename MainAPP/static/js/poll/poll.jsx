var React = require('react');
var ReactDOM = require('react-dom');
var Question = require('./question');
var TypeForm = require('../tools/typeform');

var Context = React.createClass({
  getInitialState: function () {
    return {
      questions: [],
    };
  },

  componentWillMount: function () {
    this.getQuestions();
  },

  getQuestions: function () {
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
      var QuestionNodes = this.state.questions.map(function (question, index) {
        var number = index + 1;
        return (
          <Question
            key={number}
            number={number}
            id={question.id}
            text={question.text}
            description={question.description}
            style={question.style}
            answers={question.answers}
          />
        );
      });

      // window.onscroll = function () { changeProgress(); };

      return (
        <TypeForm prevBtnText='ANTERIOR' prevBtnClass='btn prev'
          nextBtnText='SIGUIENTE' nextBtnClass='btn next'
          submitBtnText='GUARDAR' submitBtnClass='btn btn-primary save'>
          { QuestionNodes }
        </TypeForm>
      );
    }
  },
});

ReactDOM.render(
  <div className='row'><Context /></div>,
  document.getElementById('content')
);

var React = require('react');
var Question = require('./question');

function getCurrentScroll() {
  currentScroll = (window.pageYOffset !== undefined) ?
    window.pageYOffset :
    (document.documentElement || document.body.parentNode || document.body).scrollTop;
  // console.log(currentScroll);
  return currentScroll;
}

function getMaxScroll() {
  var documentHeight = jQuery(document).height();
  var windowHeight = jQuery(window).height();
  height = documentHeight - windowHeight;
  // console.log(height);
  return height;
}

function getTotalQuestions() {
  questions = document.getElementsByClassName('questionRow');
  return questions.length;
}

function getCurrentQuestion() {
  questions = document.getElementsByClassName('questionRow');
  var current = 0;
  while (current < questions.length) {
    if ($(questions[current]).hasClass('active')) {
      break;
    }

    current++;
  }

  return current + 1;
}

function getCurrentProgress() {
  // console.log(getCurrentQuestion());
  // console.log(getTotalQuestions());
  scrollPercent = (getCurrentQuestion() / getTotalQuestions()) * 100;
  var position = scrollPercent;
  // console.log(position);
  return position;
  // return getCurrentScroll()/getMaxScroll()*100;
}

function changeProgress() {
  var newProgress = getCurrentProgress();
  document.getElementById('progress-bar').style.width = getCurrentProgress() + '%';
  if (newProgress == 100) {
    document.getElementById('poll-button').style.height = '8%';
    document.getElementById('poll-button').style.zIndex = '2';
  } else {
    document.getElementById('poll-button').style.height = '0';
    document.getElementById('poll-button').style.zIndex = '0';
  }
}

function loadTypeForm() {
  $('#fullpage').fullpage();

  startTime = new Date().getTime();

  changeProgress();

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {
      var q = changeProgress();
    });
  });

  var target = document.getElementById('fullpage');
  observer.observe(target, { attributes: true, attributeFilter: ['style'] });
}

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
        loadTypeForm();
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

      window.onscroll = function () { changeProgress(); };

      return (
        <div className='col-xs-12' id='fullpage'>
          {QuestionNodes}
        </div>
      );
    }
  },
});

module.exports = Context;

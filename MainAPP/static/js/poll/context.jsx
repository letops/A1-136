var React = require('react');
var Question = require('./question');

function getCurrentScroll() {
  currentScroll = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  console.log(currentScroll);
  return currentScroll;
}

function getMaxScroll() {
  var documentHeight = jQuery(document).height();
  var windowHeight = jQuery(window).height();
  height = documentHeight-windowHeight;
  console.log(height);
  return height;
}

function getCurrentProgress() {
  scrollPercent = (getCurrentScroll() / getMaxScroll()) * 100;
  var position = scrollPercent;
  return position;
  // return getCurrentScroll()/getMaxScroll()*100;
}

function changeProgress(totalQuestions) {
  var newProgress = getCurrentProgress();
  console.log("hola");
  document.getElementById("progress-bar").style.width=getCurrentProgress()+"%";
  if(newProgress == 100){
    document.getElementById("poll-button").style.height="8%";
    document.getElementById("poll-button").style.zIndex="2";
  }
  else{
    document.getElementById("poll-button").style.height="0";
    document.getElementById("poll-button").style.zIndex="0";
  }
}

// function getTotalQuestions(){
//   questions = document.getElementsByClassName("questionRow");
//   return questions.length;
// }

// function hasClass(element, cls) {
//     return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
// }

// function getCurrentQuestion(){
//   questions = document.getElementsByClassName("questionRow");
//   var current = 0;
//   while(current < questions.length){
//     if(hasClass(questions[current],'active'))
//       break;
//     current++;
//   }
// }

// jQuery(document).ready(function(){
//   var observer = new MutationObserver(function(mutations) {
//       mutations.forEach(function(mutationRecord) {
          
//          var q = getCurrentQuestion();
//          console.log(q);
//           console.log('scrolled');
//       });    
//   });

//   var target = document.getElementById('fullpage');
//   observer.observe(target, { attributes : true, attributeFilter : ['style'] });
// });


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
      window.onscroll = function() {changeProgress()};

      return (
        <div className='col-xs-12' id='fullpage'>
          {QuestionNodes}
        </div>
      );
    }
  },
});

module.exports = Context;

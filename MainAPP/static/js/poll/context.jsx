var React = require('react');
var DragDropContext = require('react-dnd').DragDropContext;
var Backend = null;
var SideQuestionbar = require('./question');
var Csrf = require('../tools/csrf');

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  Backend = require('react-dnd-touch-backend');
} else {
  Backend = require('react-dnd-html5-backend');
}

var Context = React.createClass({
  getInitialState: function () {
    return {
      questions: '',
    };
  },

  componentWillMount: function () {
    var csrftoken = Csrf.getCookie('csrftoken');
    this.serverRequest = $.ajax({
      beforeSend: function (xhr, settings) {
        if (!Csrf.csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      },

      type: 'POST',
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
      return (
        <div className='row'>
          <Question />
        </div>
      );
    }
  },
});

module.exports = DragDropContext(Backend)(Context);

'use strict';

var TestApp = React.createClass({
  render: function() {
    return (
      <div className="page">
        <h1>Oh shit! React works with inheritance!</h1>
      </div>
    );
  }
});

React.render(
  React.createElement(TestApp, null),
  document.getElementById('content')
);
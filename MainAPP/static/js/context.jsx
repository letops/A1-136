var React = require('react');
var ReactDOM = require('react-dom');
var DragDropContext = require('react-dnd').DragDropContext;
var Backend = require('react-dnd-touch-backend');
var Sidebar = require('./sidebar');
var Grid = require('./grid');

var Context = React.createClass({
  render: function () {
    return (
      <div></div>
    );
  },
});

module.exports = DragDropContext(Backend)(Context);

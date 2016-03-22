var React = require('react');
var PropTypes = React.PropTypes;
var ImageHolder = require('./cells.jsx');


var gridTarget = {
	drop: function(props) {

	}
}

function collect(connect, monitor) {
	return{
		connectDropTarget: connect.dropTarget(),
	}
}

var 
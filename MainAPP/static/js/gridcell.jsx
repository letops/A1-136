var React = require('react');
var PropTypes = React.PropTypes;
var ItemTypes = require('./constants').ItemTypes;
var DropTarget = require('react-dnd').DropTarget;
var Cell = require('./cells');

var gridTarget = {
    drop: function(props) {
        //still thinking
    }
}

function collect(connect, monitor) {
    return{
        connectDropTarget: connect.dropTarget(),
    }
}

var GridCell = React.createClass({
    propTypes: {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        children: PropTypes.node,
        imageUrl: PropTypes.string,
    },

    renderOverlay: function (color) {
        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 0.5,
                backgroundColor: color,
              }} />
        );
    },

    render : function () {
        var x = this.props.x;
        var y = this.props.y;
        var imageUrl = this.props.imageUrl;
        var fill = this.props.fill;
        var connectDropTarget = this.props.connectDropTarget;
        var isOver = this.props.isOver;
        return connectDropTarget(
            <div style = {{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}>
                <Cell internal_color = 'black'
                    imageUrl = {imageUrl}>
                    {this.props.children}
                </Cell>
                {isOver && this.renderOverlay('green')}
            </div>
        );
    }
});

module.exports = DropTarget(ItemTypes.ISOMETRIC, gridTarget, collect)(GridCell);

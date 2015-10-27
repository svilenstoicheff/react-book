var customComponent = React.createClass({
	propTypes:{name: React.PropTypes.string.isRequired}, 
	render: function(){
		return React.DOM.span(null, 'custom element ' + this.props.name);
	}
});

var	textAreaCounter = React.createClass({
		propTypes: {text: React.PropTypes.string},
		getInitialState: function(){
			return {text: this.props.text};
		}, 
		_textChange: function(ev){
			this.setState({text: ev.target.value});
		},
		render: function(){
			return React.DOM.div(null, React.DOM.textarea({value: this.state.text, onChange: this._textChange}), 
			React.DOM.h3(null, this.state.text.length));
			
		}
	});



React.render(React.createElement(textAreaCounter, {text:'Bob'}), document.getElementById('app'));
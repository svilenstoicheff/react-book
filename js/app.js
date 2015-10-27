var customComponent = React.createClass({
	propTypes:{name: React.PropTypes.string.isRequired}, 
	render: function(){
		return React.DOM.span(null, 'custom element ' + this.props.name);
	}
});

var logMixin = {
		_log: function(methodName, args){ console.log(methodName, args); }, 
		componentWillUpdate:  function() {this._log('componentWillUpdate',  arguments);},
  		componentDidUpdate:   function() {this._log('componentDidUpdate',   arguments);},
  		componentWillMount:   function() {this._log('componentWillMount',   arguments);},
  		componentDidMount:    function() {this._log('componentDidMount',    arguments);},
  		componentWillUnmount: function() {this._log('componentWillUnmount', arguments);}
}

var Counter = React.createClass({
	name: 'Counter',
	mixins: [logMixin],
	propTypes: { count: React.PropTypes.number.isRequired}, 
	render: function(){
		return React.DOM.span(null, this.props.count);
	}
	
});

var	textAreaCounter = React.createClass({
		mixins: [logMixin],
		propTypes: {text: React.PropTypes.string},
		getInitialState: function(){
			return {text: this.props.text};
		}, 
		_textChange: function(ev){
			this.setState({text: ev.target.value});
		},
		render: function(){
			var counter = null;
			console.log(this.state.text.length);
			if(this.state.text.length > 0){
				counter = React.DOM.h3(null,
					React.createElement(Counter, {count: this.state.text.length}));
			}
			return React.DOM.div(null, 
				React.DOM.textarea({
										value: this.state.text, 
										onChange: this._textChange 
									}), 
			counter 
			);
	}
});



var myAwsomeTextAreaCounter = React.render(React.createElement(textAreaCounter, {text:'Bob'}), document.getElementById('app'));
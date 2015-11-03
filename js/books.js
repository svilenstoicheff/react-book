var headers = ["Book", "Author", "Language", "Published", "Sales"], 
	data = [["The Lord of the Rings", "J. R. R. Tolkien",
    "English", "1954–1955", "150 million"],
  ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry",
    "French", "1943", "140 million"],
  ["Harry Potter and the Philosopher's Stone", "J. K. Rowling",
    "English", "1997", "107 million"],
  ["And Then There Were None", "Agatha Christie",
    "English", "1939", "100 million"],
  ["Dream of the Red Chamber", "Cao Xueqin",
    "Chinese", "1754–1791", "100 million"],
  ["The Hobbit", "J. R. R. Tolkien",
    "English", "1937", "100 million"],
  ["She: A History of Adventure", "H. Rider Haggard",
    "English", "1887", "100 million"]];
	
	//component
	var Excel = React.createClass({
		displayName: 'Excel',
		getInitialState: function(){
			return {
				data: this.props.initialData, 
				sortby: null, 
				descending: false, 
				edit: null, 
				search: false
				};
		}, 
		_log: [], 
		_logSetState: function(newState){
			if (this._log.length === 0) {
				this._log.push(JSON.parse(JSON.stringify(this.state)));
			}
			this._log.push(JSON.parse(JSON.stringify(newState)));
			this.setState(newState);
		},
		
		propTypes: {
					headers: React.PropTypes.arrayOf(React.PropTypes.string),
					initialData: React.PropTypes.arrayOf(
									React.PropTypes.arrayOf(React.PropTypes.string)
								 )  
		},
		
		_preSearchData: null, 
		
		_toggleSearch: function(){
			if (this.state.search) {
				this._logSetState({
					data: this._preSearchData, 
					search: false
				});
				this._preSearchData= null;
			} else {
				this._preSearchData = this.state.data;
				this._logSetState({search: true}); 
			}	
		},
		
		_search: function(e){
			var needle = e.target.value.toLowerCase();
			if (!needle) {
				this._logSetState({data: this._preSearchData});
				return;
			}
			var idx = e.target.dataset.idx;
			
			
			console.log(idx);
			
			var searchdata = this._preSearchData.filter(function(row){
				return row[idx].toString().toLowerCase().indexOf(needle) > -1;
			});
			this._logSetState({data: searchdata});
			
		},
		_sort: function(e){
			var column = e.target.cellIndex,
				descending = this.state.sortby === column && !this.state.descending;
				data = this.state.data.slice();
			data.sort(function(a,b){
				return descending ? a[column] < b[column] : a[column] > b[column];
			});
			this._logSetState({
				data: data, 
				sortby: column, 
				descending: descending
				});
		}, 
		_showEditor: function(e){
			this._logSetState({edit: {row: parseInt(e.target.dataset.row, 10), cell: e.target.cellIndex }});
		}, 
		_save: function(e){
			e.preventDefault();
			var input = e.target.firstChild;
			var data = this.state.data.slice();
			data[this.state.edit.row][this.state.edit.cell] = input.value;
			this._logSetState({
				edit: null, 
				data: data
			});
		},
		render: function(){
			return (
				React.DOM.div(null,
					this._renderToolbar(), 
					this._renderTable()
			));
				
		},
		_renderToolbar: function(){
			return (React.DOM.button({onClick: this._toggleSearch, className: 'toolbar'}, 'search'));	
		},
		_renderSearch: function(){
			if(!this.state.search){
				return null;
			}
			return(
				React.DOM.tr({onChange: this._search}, this.props.headers.map(function(_ignore, idx){
					return React.DOM.td({key: idx}, React.DOM.input({type: 'text', 'data-idx': idx}));	
				}))
			);
		},
		_renderTable: function(){
			var self = this;
			return (React.DOM.table(null, 
					React.DOM.thead({onClick: this._sort}, 
					React.DOM.tr(null, 
						this.props.headers.map(function(title, idx){
							if(this.state.sortby === idx){
								title += this.state.descending ? '\u2191' : '\u2193';
							}
							
							return React.DOM.th({key: idx}, title);
						}.bind(this))
						)
					),
					React.DOM.tbody({onDoubleClick: self._showEditor}, 
								this._renderSearch(),
								self.state.data.map(function(row, rowidx){
						return (
							React.DOM.tr({key: rowidx}, 
								row.map(function(cell, idx){
									var content = cell;
									//TODO - turn content into an input
									var edit = self.state.edit;
									//if the idx and rowidx match the one being edited
									if(edit && edit.row === rowidx && edit.cell === idx){
										var content = React.DOM.form({onSubmit: self._save},
											React.DOM.input({
												type: 'text', 
												defaultValue: content
											})
										);
									}
									//otherwise just show the text content 
							return React.DOM.td({
								key: idx, 
								'data-row': rowidx
								}, content);
							
						})));
					})) 
					
				)
			);
		},
		componentDidMount: function () {
			document.onkeydown = function(e) {
				if (e.altKey && e.shiftKey && e.which === 82) {
					this._replay();
				}
			}.bind(this);
		}, 
		_replay: function() {
			if (this._log.length === 0) {
				console.warn('No state to replay yet');
				return;
			}	
			var idx = -1;
			var interval = setInterval(function() {
				idx++;
				if (idx === this._log.length -1) {
					clearInterval(interval);
				}
				this.setState(this._log[idx]);
			}.bind(this), 1000);
		}
	});
	
	//render component
	React.render(React.createElement(Excel, {
		headers: headers, 
		initialData: data
	}), 
	document.getElementById('app')
	);
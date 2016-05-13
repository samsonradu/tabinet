var s = null;

var Game = React.createClass({

	getInitialState: function () {
		return {
			turn: false,
			points: 0,
			hand: [],
			table: [],
			log: [],
			stack: [],
			players: [],
			proposal: [null, []]
		};
	},

	componentWillMount: function () {
		var self = this;
		this.socket = io();
		s = this.socket;
		this.socket.on('data', function (data) {
			self.setState(data);
		});
	},

	join: function(name){
		this.socket.emit('join', {"name": name}, function(){});
	}, 

	sendMessage: function(text){
		this.socket.emit('message', {"text": text}, function(){});
	}, 

	play: function (proposal) {
		if (!this.state.turn)
			return false;
		this.socket.emit('play', proposal, function (){});
	},

	confirm: function(proposal){
		if (this.state.turn || !this.state.proposal[0])
			return false;
		this.socket.emit('confirm', proposal);
	},

	reject: function(proposal){
		if (this.state.turn || !this.state.proposal[0])
			return false;
		this.socket.emit('reject', proposal);
	},

	selectHand: function(card){
		if (!this.state.turn)
			return false;
		let currentState = this.state;
		if (this.state.proposal[0] === card)
			currentState.proposal[0] = null;
		else 
			currentState.proposal[0] = card;
		this.setState(currentState);
	},

	selectTable: function(card){
		if (!this.state.turn)
			return false;
		let currentState = this.state;
		let idx = this.state.proposal[1].indexOf(card);
		if (idx !== -1)
			currentState.proposal[1].splice(idx, 1);
		else
			currentState.proposal[1].push(card); 
		this.setState(currentState);
	},

	render: function() {
		let self = this;

		if (this.state.players.length < 2){
			let ids = this.state.players.map(function(player){
				return player.id;
			});
			let opponents = this.state.players.filter(function(item){
				return item.isOpponent;
			});

			return (
				<Joiner callback={this.join} joined={this.state.players.length >0 && !opponents.length}/>
				);
			}
			else {
				let opponents = this.state.players.filter(function(item){
					return item.isOpponent;
				});
				opponent = opponents[0];

				return (
				<div class="game-container">
				<div className="row game-table">
				<div className="col-md-6">
				<Opponent turn={this.state.turn} data={opponent}/>
				<br/>
				<Table data={this.state.table} proposal={this.state.proposal} selectTable={this.selectTable} />
				<br/>
				<Hand turn={this.state.turn} data={this.state.hand} proposal={this.state.proposal} selectHand={this.selectHand} />
				</div>
				<div className="col-md-3">
				<Proposal data={this.state.proposal} />
				<Controls confirm={this.confirm} reject={this.reject} play={this.play} proposal={this.state.proposal} turn={this.state.turn} />
				</div>
				<div className="col-md-3">
				<Log callback={this.sendMessage} data={this.state.log}/>
				</div>
				</div>
				<br/>
				<div class="row">
				<div className="col-md-4 col-md-offset-4">
				<div class="stats">
				<div>Points: {this.state.points}</div>
				<div className="stack">Stack: {this.state.stack.length}</div>
				</div>
				</div>      
				</div>
				</div>
				);
			}
		}
	});

	var Opponent = React.createClass({
		render: function() {
			let cards = [];
			for (let i = 0; i < this.props.data.hand; i++){
				cards.push(<a className="card card-selected">&nbsp;</a>);
			}
			return (
			<div className="opponent">
			{cards}
			{!this.props.turn ? (<span className='label-turn label label-primary'>turn</span>) : " "}
			</div>
			)
		}
	});

	var Hand = React.createClass({
		render: function() {
			let self = this;
			let hand = this.props.data.map(function(card){
				let classes = "card";
				if (card === self.props.proposal[0])
					classes += " selected";

				return (
				<a href="#" className={classes} onClick={() => self.props.selectHand(card)}> {card} </a>
				);
			});

			return (
			<div className="hand">
			{hand}
			{this.props.turn ? (<span className='label-turn label label-primary'>turn</span>) : " "}
			</div>
			)
		}
	});

	var Joiner = React.createClass({

		join: function(){
			let username = this.refs.username.getDOMNode();
			this.props.callback(username.value);
		}, 

		render: function(){
			if (this.props.joined)
				return (
			<div className="col-md-4 col-md-offset-4">
			Waiting for opponent ..
			</div>
			)
			else 
				return (
			<div className="col-md-4 col-md-offset-4">
			<input className="form-control" ref="username" name="username" type="text" placeholder="enter your name" />
			<br/>
			<a onClick={() => this.join()} className="btn btn-block btn-success">join</a>
			</div>
			)
		}
	});

	var Table = React.createClass({
		render: function() {
			let self = this;
			let table = this.props.data.map(function(card){
				let classes = "card";
				if (Array.isArray(self.props.proposal[1]) && self.props.proposal[1].indexOf(card) !== -1)
					classes += " selected";
				return (
				<a href="#" className={classes} onClick={() => self.props.selectTable(card)}> {card} </a>
				);
			});

			return (
			<div className="table">{table}</div>
			)
		}
	});

	var Log = React.createClass({
		render: function() {
			let log = this.props.data.map(function(message){
				return (
				<div className="form-control message"> {message} </div>
				);
			});
			return (
			<div className="log">
			{log}
			<br/>
			<input ref="chat" className="form-control" onKeyPress={this.sendMessage}/>
			</div>
			)
		},

		sendMessage: function(event){
			if (event.key === 'Enter'){
				let text = event.target.value;
				this.refs.chat.getDOMNode().value = "";
				this.props.callback(text);
			}
		}
	});

	var Controls = React.createClass({
		render: function(){
			let buttons = []
			if (this.props.proposal[0]){
				if (this.props.turn)
					buttons.push(
				<a onClick={() => this.props.play(this.props.proposal)} href="#" className="btn btn-primary">play</a>
				);
				else { 
					buttons.push(
					<a onClick={() => this.props.confirm(this.props.proposal)} href="#" className="btn btn-success">confirm</a>
					)
					buttons.push(
					<span>&nbsp;</span>
					)
					buttons.push(
					<a onClick={() => this.props.reject(this.props.proposal)} href="#" className="btn btn-danger">reject</a>
					)
				}
			}
			return (
			<div className="buttons">{buttons}</div>
			)
		}
	});

	var Proposal = React.createClass({
		render: function(){
			let proposal = this.props.data.map(function(card){
				if (Array.isArray(card)){
					let arr = card.map(function(item){
						return (<a className="card"> {item} </a>);
					});
					return arr;
				}
				else 
					if (card)
						return (
							<div>
								<a className="card"> {card} </a>
							</div>
						);
				});

				return (
				<div className="proposal">
				{proposal}
				</div>
				);
			}
		});

		React.render(
		<Game/>,
		document.getElementById('content')
		);

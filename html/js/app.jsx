var s = null;

var Game = React.createClass({

	getInitialState: function () {
		return {
			turn: false,
			points: 0,
			extraPoints: 0,
			deck: 0,
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
			console.log(data);
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

	accept: function(){
		if (!this.state.turn)
			return false;
		this.socket.emit('accept');
	},

	refuse: function(){
		if (!this.state.turn)
			return false;
		this.socket.emit('refuse');
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
							<Controls deck={this.state.deck} accept={this.accept} refuse={this.refuse} confirm={this.confirm} reject={this.reject} play={this.play} proposal={this.state.proposal} turn={this.state.turn} />
						</div>
						<div className="col-md-3">
							<Log callback={this.sendMessage} data={this.state.log}/>
						</div>
					</div>
					<br/>
					<div class="row">
						<div className="col-md-4 col-md-offset-4">
							<div class="stats">
								<div>Points: {this.state.points} ({this.state.extraPoints})</div>
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
			cards.push(
				<Card value="" classes="card card-selected"/>
			);
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
				<Card clickHandler={() => self.props.selectHand(card)} value={card} classes={classes}/>
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
				<Card clickHandler={() => self.props.selectTable(card)} value={card} classes={classes}/>
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
				<div ref="messages" className="messages">
					{log}
				</div>
				<br/>
				<input placeholder="chat here .. " ref="chat" className="form-control" onKeyPress={this.sendMessage}/>
			</div>
		)
	},

	componentDidUpdate: function(){
		let el = this.refs.messages.getDOMNode();
		el.scrollTop = el.offsetHeight;
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
		if (this.props.deck === 48 && this.props.turn){
			buttons.push(
				<a onClick={() => this.props.accept()} href="#" className="btn btn-primary">accept</a>
			)
			buttons.push(
				<a onClick={() => this.props.refuse()} href="#" className="btn btn-danger">refuse</a>
			);
		}

		else if (this.props.proposal[0]){
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
					return (<Card value={item} classes="card"/>);
				});
				return arr;
			}
			else 
				if (card)
					return (
						<div>
							<Card value={card} classes="card"/>
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

var Card = React.createClass({
	render: function(){
		let value = this.props.value;
		let html = "";
		if (value)
			html = (<img src={"/img/cards/" + value + ".svg"}/>);
		else {
			let style = {
				"background-color": "#337AB7",
				width: "70px",
				height: "110px"
			};
			html = (<div style={style}>&nbsp;</div>)
		}
		let classes = this.props.classes;
		if (this.props.clickHandler)
			return (
				<a className={classes} onClick={this.props.clickHandler}>{html}</a>
			)
		else
			return (
				<a className={classes}>{html}</a>
			)
	}
})

React.render(
	<Game/>,
	document.getElementById('content')
);

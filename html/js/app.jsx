var s = null;

var Game = React.createClass({
	getInitialState: function () {
		return {
			turn: false,
			hand: [],
			table: [],
			stack: [],
			proposal: []
		};
	},
	componentDidMount: function () {
		var self = this;
		this.socket = io();
		s = this.socket;
		this.socket.on('data', function (data) {
			self.setState(data);
		});
	},
	play: function (card, tableCards) {
		this.socket.emit('play', [card, tableCards], function () {

		});
	},
	selectHand: function(card){
		console.log("Selected hand card " + card);

	},

	selectTable: function(card){
		console.log("Selected table card " + card);

	},

	render: function() {
		let self = this;
		let hand = this.state.hand.map(function(card){
			return (
				<a onClick={() => self.selectHand(card)}> {card} </a>
			);
		});

		let table = this.state.table.map(function(card){
			return (
				<a onClick={() => self.selectTable(card)}> {card} </a>
			);
		});

		let proposal = this.state.proposal.map(function(card){
			if (Array.isArray(card))
				return card.toString();
			else 
				return (
					<a> {card} </a>
				);
		});

		let colStyle = {
			float: "left",
			width: "30%"
		}

		return (
			<div className="table">
				<div style={colStyle}>
					<div className="hand">HAND: {hand}</div>
					<div className="table">TABLE: {table}</div>
				</div>
				<div style={colStyle}>
					<div className="proposal">PROPOSAL: {proposal}</div>
				</div>
				<div style={colStyle}>
					<div className="stack">STACK: {this.state.stack.toString()}</div>
				</div>
				<div>{this.state.turn ? "YOUR TURN" : " "}</div>
			</div>
		);
	}
});

React.render(
	<Game/>,
	document.getElementById('content')
);
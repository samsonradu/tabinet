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
			proposal: [null, []]
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
	play: function (proposal) {
        if (!this.state.turn)
            return false;
		this.socket.emit('play', proposal, function () {});
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
		let hand = this.state.hand.map(function(card){
            let classes = "card";
            if (card === self.state.proposal[0])
                classes += " selected";

			return (
				<a href="#" className={classes} onClick={() => self.selectHand(card)}> {card} </a>
			);
		});

		let table = this.state.table.map(function(card){
            let classes = "card";
            if (Array.isArray(self.state.proposal[1]) && self.state.proposal[1].indexOf(card) !== -1)
                classes += " selected";
			return (
				<a href="#" className={classes} onClick={() => self.selectTable(card)}> {card} </a>
			);
		});

		let proposal = this.state.proposal.map(function(card){
			if (Array.isArray(card))
				return card.toString();
			else 
                if (card)
				    return (
					    <a className="card"> {card} </a>
				    );
		});

		let log = this.state.log.map(function(message){
            return (
                <div className=""> {message} </div>
            );
		});

		let colStyle = {
			float: "left",
			width: "30%"
		}

        let buttons = []
        if (this.state.turn)
            buttons.push(
                <a onClick={() => this.play(this.state.proposal)} href="#" className="btn btn-primary">play</a>
            );
        else { 
            buttons.push(
                <a onClick={() => this.confirm(this.state.proposal)} href="#" className="btn btn-success">confirm</a>
            )
            buttons.push(
                <span>&nbsp;</span>
            )
            buttons.push(
                <a onClick={() => this.reject(this.state.proposal)} href="#" className="btn btn-danger">reject</a>
            )
        }

		return (
			<div className="table">
				<div style={colStyle}>
					<div className="hand">HAND: {hand}</div>
					<div className="table">TABLE: {table}</div>
				</div>
				<div style={colStyle}>
					<div className="proposal">PROPOSAL: {proposal}</div>
                    {buttons}
				</div>
				<div style={colStyle}>
					<div className="stack">STACK: {this.state.stack.length}</div>
                    <div className="log">{log}</div>
				</div>
				<div>{this.state.turn ? "YOUR TURN" : " "}</div>
                <div>Points: {this.state.points}</div>
			</div>
		);
	}
});

React.render(
	<Game/>,
	document.getElementById('content')
);

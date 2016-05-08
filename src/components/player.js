"use strict";

let EventEmitter = require('events');

class Player extends EventEmitter {
	constructor(name, socket){
		super();

		this.name = name;

		this.socket = socket;

		this.isCurrent = false;

		socket.on('play', (function(data){
			console.log("playing data")
			if (data && data.length === 2)
			  this.take(data[0], data[1]);
		}).bind(this));

		socket.on('confirm', (function(proposal){
			this.confirm(proposal);
		}).bind(this));
		
		this.hand = [];
		
		this.stack = [];
	}

	getPoints(){
		//TODO
		return 0;
	}

	//take 0 or more table cards with a card from hand
	take(card, tableCards){
		this.emit('take', [card, tableCards]);
	}

	confirm(proposal){
		this.emit('confirm', proposal);
	}
}

module.exports = Player;
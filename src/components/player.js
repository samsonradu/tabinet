"use strict";

let EventEmitter = require('events');

class Player extends EventEmitter {
	constructor(name, socket){
		super();

		this.name = name;

		this.acceptFlag = null; //accept first 4 cards

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

		socket.on('message', (function(data){
			this.message(data);
		}).bind(this));

		socket.on('reject', (function(proposal){
			this.reject(proposal);
		}).bind(this));

		socket.on('accept', (function(){
			this.accept();
		}).bind(this));

		socket.on('refuse', (function(){
			this.refuse();
		}).bind(this));
		
		this.hand = [];
		
		this.stack = [];

		this.extraPoints = 0; //also known as "table"
	}

	getPoints(){
		return this.extraPoints + this.stack.reduce(function(prev, current, index){
			let points = 0;
			if (current === "2C" || current === "TD")
				points = 2;
			else if (["T", "J", "Q", "K", "A"].indexOf(current.charAt(0)) !== -1)  
				points = 1;

			return prev + points;
		}, 0);
	}

	//take 0 or more table cards with a card from hand
	take(card, tableCards){
		this.emit('take', [card, tableCards]);
	}

	confirm(proposal){
		this.emit('confirm', proposal);
	}

	reject(proposal){
		this.emit('reject', proposal);
	}

	accept(){
		this.acceptFlag = true;
		this.emit('accept');
	}

	refuse(){
		this.acceptFlag = false;
		this.emit('refuse');
	}

	message(data){
		this.emit('message', data);
	}
}

module.exports = Player;

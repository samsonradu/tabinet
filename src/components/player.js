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

		socket.on('reject', (function(proposal){
			this.reject(proposal);
		}).bind(this));
		
		this.hand = [];
		
		this.stack = [];
	}

	getPoints(){
        return this.stack.reduce(function(prev, current, index){
            let points = 0;
            if (current === "2S" || current === "TD")
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
}

module.exports = Player;

"use strict";

class Tabi {

    constructor(){

        this.runner = null;

        this.history = [];

        this.players = [];      

        this.table = [];

        this.log = [];

        this.deck = [];

        this.proposal = [null, []];

        var self = this;
        setInterval(function(){
            self.print();
        }, 10000);
    }

    deal(){
        if (this.deck.length === 52){
            let table = this.deck.splice(0, 4);
            let h1 = this.deck.splice(0, 6);
            let h2 = this.deck.splice(0, 6);

            this.players[0].hand = h1;
            this.players[1].hand = h2;
            this.table = table;
            this.update();
        }

        else if (this.deck.length > 12){
            let h1 = this.deck.splice(0, 6);
            let h2 = this.deck.splice(0, 6);

            this.players[0].hand = h1;
            this.players[1].hand = h2;
            this.update();
        }
        else {
            console.info("No more cards to deal!");
            return false;
        }
        return true;
    }

    add(player){
        this.players.push(player);
        player.on('take', (function(data){
            let card = data[0];
            let tableCards = data[1];
            this.play(player, card, tableCards);
        }).bind(this));

        player.on('confirm', (function(data){
            this.confirm(player, data);
        }).bind(this));

        player.on('reject', (function(data){
            this.reject(player, data);
        }).bind(this));

        this.log.push("Added player");

        this.update();
        if (this.players.length === 2){
            this.players[0].isCurrent = 1;
            this.run();
            return;
        }
    }

    play(player, card, tableCards){
        if (player.isCurrent === false){
            console.log("Not your turn!")
            return;
        }

        console.log(player.name + " gives " + card + " takes: " + tableCards.toString());
        this.log.push(player.name + " plays " + card);
        
        this.proposal = [card, tableCards];
        this.update();
    }

    confirm(player, proposal){
        let card = proposal[0];
        let tableCards = proposal[1];
        let otherPlayer = this.players[0].name === player.name ? this.players[1] : this.players[0];

        //filter from opponent's hand
        otherPlayer.hand = otherPlayer.hand.filter((x) => x !== card);

        if (tableCards.length === 0)
            //lay on the table
        this.table.push(card);
        else {
            //filter from table
            this.table = this.table.filter((x) => tableCards.indexOf(x) === -1);
            otherPlayer.stack.push(card);
            otherPlayer.stack = otherPlayer.stack.concat(tableCards);
        }
        
        this.proposal = [null, []];
        this.log.push("Player " + player.name + " confirms " + card);

        player.isCurrent = true;
        otherPlayer.isCurrent = false;
        this.update();
    }

    reject(player, proposal){
        console.log("rejecting");
        console.log(this.proposal);
        this.proposal = [null, []]; //try again
        this.update();
    }

    print(){
        if (this.players.length !== 2)
            return;
        console.log("Table: " + this.table.toString())
        console.log("Player 1 hand: " + this.players[0].hand.toString())
        console.log("Player 1 stack: " + this.players[0].stack.toString())
        console.log("Player 2 hand: " + this.players[1].hand.toString())
        console.log("Player 2 stack: " + this.players[1].stack.toString())
        console.log("Deck left: " + this.deck.length);
    }

    update(){
        var self = this;
        this.players.map(function(player){
            player.socket.emit('data', {
                turn: player.isCurrent,
                hand: player.hand,
                points: player.getPoints(),
                log: self.log,
                table: self.table,
                stack: player.stack,
                players: self.players.map(function(p){
                    return {
                        id: player.socket.id,
                        isOpponent: (p.socket.id !== player.socket.id),
                        name: p.name,
                        stack: p.stack.length,
                        hand: p.hand.length
                    }
                }),
                proposal: self.proposal
            });
        });
    }

    run(){
        console.log('Running new game ..');
        function shuffle(arr) {
            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        }

        var cards = require("./deck.js");
        this.deck = shuffle(cards.slice(0));

        let self = this;  
        this.players.map(function(player){
            player.hand = [];
        });
        this.update();

        clearInterval(this.runner);

        this.runner = setInterval(function(){
            if (self.players.length === 2){
                if (self.players[0].hand.length === 0 && self.players[1].hand.length === 0){
                    console.log("Dealing cards ..");
                    if (!self.deal()){
                        console.log("Game over!");
                    }
                }
            }
            else {
                //waiting for players...
            }
        }, 100);
    }
}

module.exports = Tabi;



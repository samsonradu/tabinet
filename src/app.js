"use strict";

let Tabi = require("./components/tabi.js");
let Player = require("./components/player.js");

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static('html'));

io.on('connection', function(socket){
	socket.on('join', function(data){
		let name = data.name;
		console.log(name + ' joined');
		var p = new Player(data.name, socket);
		t.add(p);
	});
	socket.on('disconnect', function(){
		console.log('a user disconnected');
		for (let i = 0; i < t.players.length; i++){
			if (socket.id === t.players[i].socket.id)
				t.players.splice(i, 1);
		}
		console.log("Players left: " + t.players.length);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});


let t = new Tabi();

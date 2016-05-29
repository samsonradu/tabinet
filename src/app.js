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
		t.remove(socket);
	});
});

http.listen(80, function(){
	console.log('listening on *:80');
});


let t = new Tabi();

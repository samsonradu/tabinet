"use strict";

let Tabi = require("./components/tabi.js");
let Player = require("./components/player.js");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/../html/index.html'));
});

app.get('/js/app.jsx', function(req, res){
  res.sendFile(path.join(__dirname + '/../html/js/app.jsx'));
});

let count = 0;

io.on('connection', function(socket){
  console.log('a user connected');
  count++;
  var p = new Player("Player" + count, socket);
  t.add(p);

  socket.on('disconnect', function(){
    console.log('a user disconnected');
  	for (let i = 0; i < t.players.length; i++){
  		if (socket.id === t.players[i].socket.id)
  			t.players.splice(i, 1);
  	}
    console.log("Players left: " + t.players.length);
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


let t = new Tabi();

import {ACTION_DATA} from '../actions/gameActions.js';
console.log("initializing socket");
let socket = io();
socket.on("connect", function(){
    console.log("connected socket");
});


module.exports = {
	bind: function(store){
		socket.on("data", function (data) {
			store.dispatch({
				'type' : ACTION_DATA,
				'payload' : data
			});
		})
	},
	io: socket
};

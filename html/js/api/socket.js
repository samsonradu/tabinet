import {ACTION_DATA} from '../actions/gameActions.js';

let socket = io();

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
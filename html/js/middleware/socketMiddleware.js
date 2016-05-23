import {io as socket} from '../api/socket.js';
import {ACTION_DATA, ACTION_MESSAGE, ACTION_JOIN, ACTION_PLAY, ACTION_CONFIRM, ACTION_REJECT, ACTION_REFUSE, ACTION_ACCEPT, ACTION_SELECT_HAND, ACTION_SELECT_TABLE} from '../actions/gameActions.js';

export default function socketMiddleware(store){
	return function(next){
		return function(action){
			const result = next(action);
 
    		if (action.type === ACTION_MESSAGE) 
    			socket.emit("message", {"text" : action.data});
    		
 			if (action.type === ACTION_JOIN) 
 				socket.emit("join", {"name" : action.data});

 			if (action.type === ACTION_CONFIRM) 
 				socket.emit("confirm", {"data" : action.data});

 			if (action.type === ACTION_REJECT) 
 				socket.emit("reject", {"data" : action.data});

  			if (action.type === ACTION_PLAY) 
 				socket.emit("play", {"data" : action.data});

 			if (action.type === ACTION_ACCEPT) 
 				socket.emit("accept");

 			if (action.type === ACTION_REFUSE) 
 				socket.emit("refuse");

    		return result;
		}

	}
}
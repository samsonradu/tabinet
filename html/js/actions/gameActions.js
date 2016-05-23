
import {io as socket} from '../api/socket.js';

export const ACTION_MESSAGE = 'ACTION_MESSAGE';
export const ACTION_JOIN = 'ACTION_JOIN';
export const ACTION_PLAY = 'ACTION_PLAY';
export const ACTION_CONFIRM = 'ACTION_CONFIRM';
export const ACTION_REJECT = 'ACTION_REJECT';
export const ACTION_ACCEPT = 'ACTION_ACCEPT';
export const ACTION_REFUSE = 'ACTION_REFUSE';
export const ACTION_SELECT_HAND = 'ACTION_SELECT_HAND';
export const ACTION_SELECT_TABLE = 'ACTION_SELECT_TABLE';
export const ACTION_DATA = 'ACTION_DATA';


export function sendMessage(data){
	return function(dispatch){
		dispatch({
			type: ACTION_MESSAGE,
			data: data
		});
	}
}

export function join(data){
	return function(dispatch){
		dispatch({
			type: ACTION_JOIN,
			data: data
		});
	}
}

export function confirm(data){
	return function(dispatch){
		dispatch({
			type: ACTION_CONFIRM,
			data: data
		});
	}
}

export function reject(data){
	return function(dispatch){
		dispatch({
			type: ACTION_REJECT,
			data: data
		});
	}
}

export function play(data){
	return function(dispatch){
		dispatch({
			type: ACTION_PLAY,
			data: data
		});
	}
}

export function accept(){
	return function(dispatch){
		dispatch({
			type: ACTION_ACCEPT
		})
	}
}

export function refuse(){
	return function(dispatch){
		dispatch({
			type: ACTION_REFUSE
		})
	}
}

export function selectHand(card){
	return function(dispatch){
		dispatch({
			type: ACTION_SELECT_HAND,
			card: card
		})
	}
}

export function selectTable(card){
	return function(dispatch){
		dispatch({
			type: ACTION_SELECT_TABLE,
			card: card
		})
	}
}
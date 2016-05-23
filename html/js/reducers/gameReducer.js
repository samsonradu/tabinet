import {ACTION_DATA, ACTION_MESSAGE, ACTION_JOIN, ACTION_PLAY, ACTION_CONFIRM, ACTION_REJECT, ACTION_REFUSE, ACTION_ACCEPT, ACTION_SELECT_HAND, ACTION_SELECT_TABLE} from '../actions/gameActions.js';

let initialState = {
	turn: false,
	points: 0,
	extraPoints: 0,
	deck: 0,
	hand: [],
	table: [],
	log: [],
	stack: [],
	players: [],
	proposal: [null, []]
};

function gameReducer(state, action){
	switch (action.type){
		case ACTION_DATA: 
			var newState = action.payload;
		    return newState;
		case ACTION_SELECT_HAND:
			var newState = Object.assign({}, state);
			if (state.proposal[0] === action.card)
				newState.proposal[0] = null;
			else 
				newState.proposal[0] = action.card;
			return newState;

		case ACTION_SELECT_TABLE: 
			var newState = Object.assign({}, state);
			let idx = state.proposal[1].indexOf(action.card);
			if (idx !== -1)
				newState.proposal[1].splice(idx, 1);
			else
				newState.proposal[1].push(action.card);
			return newState;

		default:
			return state;
	}
}

function gameApp(state = initialState, action){
    return gameReducer(state, action)
}

export default gameApp;
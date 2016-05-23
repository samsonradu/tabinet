
import React from 'react';
import App from './containers/app.js';
import gameReducer from './reducers/gameReducer.js';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {render} from 'react-dom';
import createLogger from 'redux-logger';

import {ACTION_DATA} from './actions/gameActions.js';

const logger = createLogger();

let store = applyMiddleware(thunk, logger)(createStore)(gameReducer);

//websocket connection bind
let socket = require("./api/socket.js");
socket.bind(store);

render(
	<App store={store} />,
	document.getElementById('content'));

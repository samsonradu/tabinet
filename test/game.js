import expect from 'expect';
import * as actions from '../html/js/actions/gameActions.js';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import gameReducer from '../html/js/reducers/gameReducer.js';

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
    it('should send message', () => {
        const expectedAction = {
            type: actions.ACTION_MESSAGE,
            data: 'hello world'
        }

        const store = mockStore(gameReducer)
        store.dispatch(actions.sendMessage('hello world'))
        expect(store.getActions()).toEqual([expectedAction])
    });
});



describe('reducer', () => {
    it('should select hand card', () => {
        let initialState = {
            proposal: [null, []]
        }

        let finalState = gameReducer(initialState, {
            type: actions.ACTION_SELECT_HAND,
            card: 'AH'
        })

        expect(finalState.proposal[0]).toEqual('AH')
    });
});

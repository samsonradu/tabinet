import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { Provider } from 'react-redux'
import Joiner from '../components/joiner.js';
import Opponent from '../components/opponent.js';
import Table from '../components/table.js';
import Hand from '../components/hand.js';
import Proposal from '../components/proposal.js';
import Controls from '../components/controls.js';
import Log from '../components/log.js';

import {join, sendMessage, accept, refuse, confirm, reject, play, selectHand, selectTable} from '../actions/gameActions.js';


class Game extends Component {

    render() {
        let st = this.props.st;
        let {store} = this.props;
        let self = this;

        if (st.players.length < 2){
            let ids = st.players.map(function(player){
                return player.id;
            });
            let opponents = st.players.filter(function(item){
                return item.isOpponent;
            });

            return (
                <Joiner callback={this.props.join} joined={st.players.length >0 && !opponents.length}/>
            );
        }
        else {
            let opponents = st.players.filter(function(item){
                return item.isOpponent;
            });
            let opponent = opponents[0];


            return (
                <Provider store={store}>
                    <div class="game-container">
                        <div className="row game-table">
                            <div className="col-md-6">
                                <Opponent turn={st.turn} data={opponent}/>
                                <br/>
                                <Table data={st.table} proposal={st.proposal} selectTable={this.props.selectTable} />
                                <br/>
                                <Hand turn={st.turn} data={st.hand} proposal={st.proposal} selectHand={this.props.selectHand} />
                            </div>
                            <div className="col-md-3">
                                <Controls deck={st.deck} accept={this.props.accept} refuse={this.props.refuse} confirm={this.props.confirm} reject={this.props.reject} play={this.props.play} proposal={st.proposal} turn={st.turn} />
                                <Proposal data={st.proposal} />
                            </div>
                            <div className="col-md-3">
                                <Log callback={this.props.sendMessage} data={st.log}/>
                                <div class="stats">
                                    <br/>
                                    <div>Points: {st.points} ({st.extraPoints})</div>
                                    <div className="stack">Stack: {st.stack.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Provider>
            );
        }
    }
}

let mapStateToProps = function(state){
    return {
        st : state
    }
}

export default connect(mapStateToProps, {
    sendMessage,
    join,
    confirm,
    reject,
    play,
    accept, 
    refuse,
    selectHand,
    selectTable
})(Game)

import Card from '../components/card.js';

import React, {Component, PropTypes} from 'react';

export default class Hand extends Component{
    render(){
        let self = this;
        let hand = this.props.data.map(function(card){
            let classes = "card";
            if (card === self.props.proposal[0])
                classes += " selected";
            return (
                <Card clickHandler={() => self.props.selectHand(card)} value={card} classes={classes}/>
            );
        });
        return (
            <div className="hand">
                {hand}
                {this.props.turn ? (<span className='label-turn label label-primary'>turn</span>) : " "}
            </div>
        )
    }
}

import Card from '../components/card.js';

import React, {Component, PropTypes} from 'react';

export default class Opponent extends Component{
	render(){
		let cards = [];
		for (let i = 0; i < this.props.data.hand; i++){
			cards.push(
				<Card value="" classes="card card-selected"/>
			);
		}
		return (
			<div className="hidden-xs opponent">
				{cards}
				{!this.props.turn ? (<span className='label-turn label label-primary'>turn</span>) : " "}
			</div>
		)
	}
}

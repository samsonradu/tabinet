import Card from '../components/card.js';

import React, {Component, PropTypes} from 'react';

export default class Proposal extends Component{
	render(){
		let proposal = this.props.data.map(function(card){
			if (Array.isArray(card)){
				let arr = card.map(function(item){
					return (<Card value={item} classes="card"/>);
				});
				return arr;
			}
			else 
				if (card)
					return (
						<div>
							<Card value={card} classes="card"/>
						</div>
					);
		});

		return (
			<div className="proposal">
				{proposal}
			</div>
		);
	}
}
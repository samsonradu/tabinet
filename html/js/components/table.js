import Card from '../components/card.js';
import React, {Component, PropTypes} from 'react';

export default class Table extends Component{
	render(){
		let self = this;
		let table = this.props.data.map(function(card){
			let classes = "card";
			if (Array.isArray(self.props.proposal[1]) && self.props.proposal[1].indexOf(card) !== -1)
				classes += " selected";
			return (
				<Card clickHandler={() => self.props.selectTable(card)} value={card} classes={classes}/>
			);
		});

		return (
			<div className="table">{table}</div>
		)
	}
}
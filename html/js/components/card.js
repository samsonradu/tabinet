import React, {Component, PropTypes} from 'react';

export default class Card extends Component{
	render(){
		let value = this.props.value;
		let html = "";
		if (value)
			html = (<img src={"/img/cards/" + value + ".svg"}/>);
		else {
			let style = {
				"background-color": "#337AB7",
				width: "70px",
				height: "110px"
			};
			html = (<div style={style}>&nbsp;</div>)
		}
		let classes = this.props.classes;
		if (this.props.clickHandler)
			return (
				<a className={classes} onClick={this.props.clickHandler}>{html}</a>
			)
		else
			return (
				<a className={classes}>{html}</a>
			)
	}
}
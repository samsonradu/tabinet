import React, {Component, PropTypes} from 'react';

export default class Log extends Component{
	render(){
		let log = this.props.data.map(function(message){
			return (
				<div className="form-control message"> {message} </div>
			);
		});
		return (
			<div className="log">
				<div ref="messages" className="messages">
					{log}
				</div>
				<br/>
				<input placeholder="chat here .. " ref="chat" className="form-control" onKeyPress={this.sendMessage}/>
			</div>
		)
	}

	componentDidUpdate(){
		let el = this.refs.messages;
		el.scrollTop = el.offsetHeight;
	}

	sendMessage(event){
		if (event.key === 'Enter'){
			let text = event.target.value;
			this.refs.chat.value = "";
			this.props.callback(text);
		}
	}
}
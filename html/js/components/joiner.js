import React, {Component, PropTypes} from 'react';

export default class Joiner extends Component{

	join(){
		let username = this.refs.username;
		this.props.callback(username.value);
	}

	render(){
		if (this.props.joined)
			return (
				<div className="col-xs-12 col-md-4 col-md-offset-4">
					Waiting for opponent ..
				</div>
			)
		else 
			return (
				<div className="col-xs-12 col-md-4 col-md-offset-4">
					<input className="form-control" ref="username" name="username" type="text" placeholder="enter your name" />
					<br/>
					<a onClick={() => this.join()} className="btn btn-block btn-success">join</a>
				</div>
			)
	}
}

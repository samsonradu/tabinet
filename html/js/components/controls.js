import React, {Component, PropTypes} from 'react';

export default class Controls extends Component{
    render(){
        let buttons = []
        if (this.props.deck === 48 && this.props.turn){
            buttons.push(
                <a onClick={() => this.props.accept()} href="#" className="btn btn-primary">accept</a>
            )
            buttons.push(
                <a onClick={() => this.props.refuse()} href="#" className="btn btn-danger">refuse</a>
            );
        }

        else if (this.props.proposal[0]){
            if (this.props.turn)
                buttons.push(
                    <a onClick={() => this.props.play(this.props.proposal)} href="#" className="btn btn-primary">play</a>
                );
            else { 
                buttons.push(
                    <a onClick={() => this.props.confirm(this.props.proposal)} href="#" className="btn btn-success">confirm</a>
                )
                buttons.push(
                    <span>&nbsp;</span>
                )
                buttons.push(
                    <a onClick={() => this.props.reject(this.props.proposal)} href="#" className="btn btn-danger">reject</a>
                )
            }
        }
        return (
            <div className="buttons">{buttons}</div>
        )
    }
}

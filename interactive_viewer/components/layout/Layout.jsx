import React from "react";

export default class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.buttonPressed = this.pressButton.bind(this)
    }

    pressButton() {
        this.props.switch_layout(this.props.layout);
    }

    render() {
        return <button id={this.props.name} onClick={this.buttonPressed.bind(this)}>{this.props.name}</button>
    }
}
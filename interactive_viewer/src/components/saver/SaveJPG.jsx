import React from "react";

export default class SaveJPG extends React.Component {

    pressButton() {
        this.props.save(this.props.cy.jpg({full : true}));
    }

    render() {
        return (
            <button id="saveJPG" onClick={this.pressButton.bind(this)}>JPG</button>
        )
    }


}
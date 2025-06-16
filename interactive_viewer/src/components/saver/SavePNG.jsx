import React from "react";

export default class SavePNG extends React.Component {

    pressButton() {
        this.props.save(this.props.cy.png({full : true}));
    }

    render() {
        return (
            <button id="savePNG" onClick={this.pressButton.bind(this)}>PNG</button>
        )
    }


}
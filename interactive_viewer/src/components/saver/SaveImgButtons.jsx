import React from "react";

import SavePNG from "./SavePNG";
import SaveJPG from "./SaveJPG";

export default class SaveImgButtons extends React.Component {

    constructor(props) {
        super(props);
        this.save = this.saveImage.bind(this);
    }

    /**
     * Detect the url format of a data url
     * @param {*} dataUrl 
     * @returns 
     */
    detectImageFormat(dataUrl) {
        if (typeof dataUrl !== 'string') return null;

        const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        return match ? match[1] : null;
    }

    saveImage(file) {
        const ele = document.createElement('a');
        ele.href = file;
        ele.download = 'graph.' + this.detectImageFormat(file);
        ele.click();
    }

    render() {
        return (
            <div id="saveImgButtons">
                <SavePNG save={this.save} cy={this.props.cy}/>
                <SaveJPG save={this.save} cy={this.props.cy}/>
            </div>
        )
    }


}
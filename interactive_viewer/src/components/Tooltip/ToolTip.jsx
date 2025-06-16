import React from "react";

/**
 * Create a HTML tooltip with the events of the cytoscape instance 
 * @param {*} elementType 
 */
export default class ToolTip extends React.Component {

    constructor(props) {
        super(props)
        this.tooltipRef = React.createRef();
        this.toRef = React.createRef();
        
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount() {
        if (this.props.cy) {
        this.props.cy.on("mouseover", this.props.elementType, this.handleMouseOver);
        this.props.cy.on("mouseout", this.props.elementType, this.handleMouseOut);
        this.props.cy.on("mousemove", this.handleMouseMove);
        }
    }

    componentWillUnmount() {
        if (this.props.cy) {
        this.props.cy.removeListener("mouseover", this.props.elementType, this.handleMouseOver);
        this.props.cy.removeListener("mouseout", this.props.elementType, this.handleMouseOut);
        this.props.cy.removeListener("mousemove", this.handleMouseMove);
        }
        clearTimeout(this.toRef);
    }


    handleMouseOver(event) {
      const element = event.target;
      this.toRef.current = setTimeout(() => {
        this.tooltipRef.current.style.display = 'block';
        this.tooltipRef.current.innerText = element.data('tooltip');
      }, 1000);
    }

    handleMouseOut() {
      clearTimeout(this.toRef.current);
      this.tooltipRef.current.style.display = 'none';
    }

    handleMouseMove(event) {
      this.tooltipRef.current.style.left = `${event.originalEvent.pageX + 10}px`;
      this.tooltipRef.current.style.top = `${event.originalEvent.pageY + 10}px`;
    }

    

    render() {
        return <pre className="tooltip" ref={this.tooltipRef} ></pre>
    }
}
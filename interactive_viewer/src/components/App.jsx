import React from "react";
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';
import contextMenus from 'cytoscape-context-menus';

import layoutList from "../script/layout";
import * as style from "../script/defaultStyle"
import  { clusterStyleList, nodeStyleList, edgeStyleList } from '../script/defaultStyle';
import { itemOpenClose } from "../script/itemAndFunctionMenus";

import LayoutButtons from "./layout/LayoutButtons";
import SaveImgButtons from "./saver/SaveImgButtons";
import ToolTip from "./Tooltip/ToolTip";


cytoscape.use(dagre);
cytoscape.use(klay);
cytoscape.use(contextMenus);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {layoutList : layoutList, 
                  currentLayout : layoutList[0]};
    this.cyRef = React.createRef();
    this.tooltipRef = React.createRef();
    this.cy = null;
    this.readFileAndloadCytoscapeGraph = this.readFileAndloadCytoscapeGraph.bind(this);
    this.switch_layout = this.load_layout.bind(this);
  }

  /**
   * return a cytoscape graph.
   * @returns 
   */
  componentDidMount() {
  this.cy = cytoscape({
      container: this.cyRef.current,
      elements: undefined,
      hideEdgesOnViewport: true,
      pixelRatio: window.devicePixelRatio,
      style: [
          {
              selector: 'node',
              style: style.defaultGlobalNodeStyle
          },
          { 
              selector: 'node[group = "cluster"]',
              style: style.clusterOpenStyle
          },
          {
              selector: 'node[group = "node"]',
              style: style.defaultGroupNodeStyle
          },
          {
              selector: 'edge',
              style: style.defaultEdgeStyle
          },
          {
              selector: 'edge[dir = "forward"]',
              style: style.defaultEdgeDirForward
          },
          {
              selector: 'edge[dir = "back"]',
              style: style.defaultEdgeDirBack
          }
      ]
      });
      this.forceUpdate();
  }
  
  componentWillUnmount() {
      if (this.cy) {
      this.cy.destroy();
      }
  }

  /**
   * Read a dot_json file to add nodes and edges in a elements list used to load a cytoscape instance.
   * @param {*} event 
   */
  readFileAndloadCytoscapeGraph(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const elements = [];

    reader.onload = (e) => {
        let content = e.target.result;
        const json = JSON.parse(content);
        const nodes = json.objects;
        const edges = json.edges;
        this.addNodesElementsParsedFromNodesJson(elements, nodes);
        this.addNodesEdgesParsedFromEdgesJson(elements, edges);
        this.load_cytoscape(elements);
    };
    reader.readAsText(file); 
  }

  /**
   * Remove precedent elements before to add the new elements then create tool tip and context menus for the 
   * cytoscape instance. 
   * @param {*} elements 
   */
  load_cytoscape(elements) {
      this.cy.nodes().remove();
      this.cy.add(elements);
      this.createAndGetContextMenu(this.cy);
      this.cy.layout(this.state.currentLayout).run();
  }

  /**
   * Switch the current layout algorithm and reload the graph
   * @param {*} layout 
   */
  load_layout(layout) {
    this.setState({ currentLayout: layout }, () => {
      this.cy.layout(this.state.currentLayout).run();
    });
  }

  /**
   * Add nodes elements created from nodesJson data list in the elements list.
   * @param {*} elements 
   * @param {*} nodesJson - nodes data list 
   * @returns 
   */
  addNodesElementsParsedFromNodesJson(elements, nodesJson) {
    let parent = {};

    for (let i in nodesJson) {
        let node = {
            data: {
                id: nodesJson[i]._gvid, 
                group: (nodesJson[i].nodes) ? 'cluster' : 'node',
                isClose : false,
                label: (nodesJson[i].label.includes('<') && nodesJson[i].label.includes('>')) ? nodesJson[i].tooltip : nodesJson[i].label, 
                bs: this.getCorrespondingBorderStyle(nodesJson[i].style),
                bgcolor: nodesJson[i].bgcolor ?? 'blue',
                bc: nodesJson[i].pencolor ?? 'gray',
                parent: parent[nodesJson[i]._gvid] ?? '',
                fontsize: nodesJson[i].fontsize ?? '',
                fontfamily: nodesJson[i].fontname ?? '',
                fontcolor: nodesJson[i].fontcolor ?? '',
                image: (nodesJson[i].image) ? this.getURLImage(nodesJson[i].image) : '',
                tooltip: nodesJson[i].tooltip ?? ''
            }
        }

        if (nodesJson[i].nodes) {
            for (let child of nodesJson[i].nodes) {
                parent[child] = nodesJson[i]._gvid;
            }
        }

        if (nodesJson[i].subgraphs) {
            for (let sub of nodesJson[i].subgraphs) {
                parent[sub] = nodesJson[i]._gvid;
            }
        }
        this.addClassToElement(node);
        elements.push(node);
    }

    return elements;
  }

/**
  * Add nodes elements created from edgesJson data list in the elements list.
  * @param {*} elements 
  * @param {*} edgesJson 
  */
  addNodesEdgesParsedFromEdgesJson(elements, edgesJson) {
    for (let e in edgesJson) {
        let edge = {
            data: {
                id: 'e' + edgesJson[e]._gvid,
                group: 'edge',
                dir: edgesJson[e].dir,
                source: edgesJson[e].tail,
                target: edgesJson[e].head,
                color: edgesJson[e].color,
                line_style: edgesJson[e].style ?? 'solid',
                xlabel: edgesJson[e].xlabel ?? '',
                fontsize: edgesJson[e].fontsize ?? '',
                fontfamily: edgesJson[e].fontname ?? '',
                fontcolor: edgesJson[e].fontcolor ?? '',
                tooltip: edgesJson[e].tooltip ?? '',
            }
        }
        this.addClassToElement(edge);
        elements.push(edge);
    }
  }

/**
   * Get border style based on the what's in the style parameter.
   * @param {*} style 
   * @returns 
   */
  getCorrespondingBorderStyle(style) {
    if (style.includes('dashed')) {
        return 'dashed';
    }
    else {
        return 'solid';
    }
  }

/**
   * Get the corresponding url image based on the local url of the image parameter get from a dot_jon file. 
   * @param {*} image 
   * @returns 
   */
  getURLImage(image) {
    let idx = image.indexOf("resources/")
    if(idx !== -1) {
      return "https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/" + image.slice(image.indexOf("resources"))
    } else {
      idx = image.indexOf("bin/icons/")
      if(idx !== -1) {
        return "https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/" + image.slice(image.indexOf("bin/icons/"))
      } else {
        return image
      }
    }
  }

  /**
   * Create and return a context menus for the cytoscape instance 
   * @param {*} cy 
   * @returns 
   */
  createAndGetContextMenu(cy) {
      return this.cy.contextMenus({
          evtType: 'cxttap',
          menuItems: [itemOpenClose]
      })
  }

  /**
 * Check the element's group and then add a style class based on the group and his values.
 * @param {*} element 
 */
addClassToElement(element) {
    let classesName = [];
    let currentStyle; 
    if (element.data.group === "edge") {
        currentStyle = style.getDefaultEdgeStyleFromEdgeValues(element);
        classesName.push(this.findAndGetClassStyle(currentStyle, edgeStyleList).selector.replace(/^\./, ''));
    }
    else {
        currentStyle = style.getDefaultGlobalNodeStyleFromNodeValues(element);
        classesName.push(this.findAndGetClassStyle(currentStyle, nodeStyleList).selector.replace(/^\./, ''));
        if (element.data.group === "cluster") {
            currentStyle = style.getDefaultClusterStyleFromClusterValues(element);
            classesName.push(this.findAndGetClassStyle(currentStyle, clusterStyleList).selector.replace(/^\./, ''))
        }
    }
    element.classes = classesName.join(' ');
}

/**
 * Look for a style class similar to the styleTarget in the styleList. if a style class is founded, 
 * so the method return the style class founded otherwise add the styleTarget in the cytoscape instance and 
 * in the styleList then return the styleTarget
 * @param {*} styleTarget 
 * @param {*} styleList 
 * @returns 
 */
findAndGetClassStyle(styleTarget, styleList) {
    for (let style of styleList) {
        if (this.equals(styleTarget.style, style.style)) {
            return style;
        }
    }
    this.addStyleToCytoscapeGraph(styleTarget);
    styleList.push(styleTarget);
    return styleTarget;
}

/**
 * Add a new style in the style attribute of the cytoscape instance. 
 * @param {*} style 
 */
addStyleToCytoscapeGraph(style) {
    const existingStyle = this.cy.style().json();
    this.cy.style([...existingStyle, style]);
}

/**
 * Check if two object are similar.
 * @param {*} o1 
 * @param {*} o2 
 * @returns 
 */
equals(o1, o2) {
  if (o1 === o2) return true;
  if (typeof o1 !== "object" || typeof o2 !== "object" || o1 == null || o2 == null) {
    return false;
  }

  const k1 = Object.keys(o1);
  const k2 = Object.keys(o2);

  if (k1.length !== k2.length) return false;

  for (let k of k1) {
    if (!k2.includes(k) || !this.equals(o1[k], o2[k])) {
      return false;
    }
  }

  return true;
}

  render() {
    return (
      <div>
        <div className="buttons">
          Select a .dot_json file:
          <input type="file" onChange={this.readFileAndloadCytoscapeGraph} />
          Choose a layout
          <LayoutButtons layoutList={this.state.layoutList} switch_layout={this.switch_layout}/>
          Save as 
          {this.cy !== null &&  <SaveImgButtons cy={this.cy} /> }
        </div>
        <div id="paper" ref={this.cyRef}></div>
        {this.cy !== null && <ToolTip cy={this.cy} elementType="edge"/>}
        {this.cy !== null &&  <ToolTip cy={this.cy} elementType="node"/>}
      </div>
    );
  }
}

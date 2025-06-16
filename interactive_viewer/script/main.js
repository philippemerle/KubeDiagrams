cytoscape.use(cytoscapeDagre);
cytoscape.use(cytoscapeKlay);

let cy; 
let currentLayout;

/**
 * initialise a cytoscape instance, create layout selector buttons, add event listeners on save buttons and add
 * an event listener on the file input button to load the cytoscape graph. 
 */
function setUp() {
    cy = getCyGraph();
    currentLayout = layoutList[0];
    createLayoutSelectorButton();
    document.getElementById("savePNG").addEventListener("click", () => { saveFile("png")});
    document.getElementById("saveJPG").addEventListener("click", () => { saveFile("jpg")});
    document.getElementById('fileInput').addEventListener('change', readFileAndloadCytoscapeGraph);
}


/**
 * return a cytoscape graph.
 * @returns 
 */
function getCyGraph() {
    return cytoscape({
        container: document.getElementById('paper'),
        elements: undefined,
        hideEdgesOnViewport: true,
        pixelRatio: window.devicePixelRatio,
        style: [
            {
                selector: 'node',
                style: defaultGlobalNodeStyle
            },
            { 
                selector: 'node[group = "cluster"]',
                style: clusterOpenStyle
            },
            {
                selector: 'node[group = "node"]',
                style: defaultGroupNodeStyle
            },
            {
                selector: 'edge',
                style: defaultEdgeStyle
            },
            {
                selector: 'edge[dir = "forward"]',
                style: defaultEdgeDirForward
            },
            {
                selector: 'edge[dir = "back"]',
                style: defaultEdgeDirBack
            }
        ]
    });
}

/**
 * Read a dot_json file to add nodes and edges in a elements list used to load a cytoscape instance.
 * @param {*} event 
 */
function readFileAndloadCytoscapeGraph(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const elements = [];

    reader.onload = function(e) {
        let content = e.target.result;
        const json = JSON.parse(content);
        const nodes = json.objects;
        const edges = json.edges;
        addNodesElementsParsedFromNodesJson(elements, nodes);
        addNodesEdgesParsedFromEdgesJson(elements, edges);
        load_cytoscape(elements);
    };
    reader.readAsText(file); 
}

/**
 * Remove precedent elements before to add the new elements then create tool tip and context menus for the 
 * cytoscape instance. 
 * @param {*} elements 
 */
function load_cytoscape(elements) {
    cy.nodes().remove();
    cy.add(elements);
    createTooltip("node");
    createTooltip("edge");
    createAndGetContextMenu(cy);
    cy.layout(currentLayout).run();
}

function load_layout(layout) {
    currentLayout = layout;
    cy.layout(currentLayout).run();
}

/**
 * Add nodes elements created from nodesJson data list in the elements list.
 * @param {*} elements 
 * @param {*} nodesJson - nodes data list 
 * @returns 
 */
function addNodesElementsParsedFromNodesJson(elements, nodesJson) {
    let parent = {};

    for (let i in nodesJson) {
        let node = {
            data: {
                id: nodesJson[i]._gvid, 
                group: (nodesJson[i].nodes) ? 'cluster' : 'node',
                isClose : false,
                label: (nodesJson[i].label.includes('<') && nodesJson[i].label.includes('>')) ? nodesJson[i].tooltip : nodesJson[i].label, 
                bs: getCorrespondingBorderStyle(nodesJson[i].style),
                bgcolor: nodesJson[i].bgcolor ?? 'blue',
                bc: nodesJson[i].pencolor ?? 'gray',
                parent: parent[nodesJson[i]._gvid] ?? '',
                fontsize: nodesJson[i].fontsize ?? '',
                fontfamily: nodesJson[i].fontname ?? '',
                fontcolor: nodesJson[i].fontcolor ?? '',
                image: (nodesJson[i].image) ? getURLImage(nodesJson[i].image) : '',
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
        addClassToElement(node);
        elements.push(node);
    }

    return elements;
}

/**
 * Add nodes elements created from edgesJson data list in the elements list.
 * @param {*} elements 
 * @param {*} edgesJson 
 */
function addNodesEdgesParsedFromEdgesJson(elements, edgesJson) {
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
        addClassToElement(edge);
        elements.push(edge);
    }
}

/**
 * Get border style based on the what's in the style parameter.
 * @param {*} style 
 * @returns 
 */
function getCorrespondingBorderStyle(style) {
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
function getURLImage(image) {
    let idx = image.indexOf("resources\/")
    if(idx != -1) {
      return "https://raw.githubusercontent.com/mingrammer/diagrams/refs/heads/master/" + image.slice(image.indexOf("resources"))
    } else {
      idx = image.indexOf("bin\/icons\/")
      if(idx != -1) {
        return "https://raw.githubusercontent.com/philippemerle/KubeDiagrams/refs/heads/main/" + image.slice(image.indexOf("bin\/icons\/"))
      } else {
        return image
      }
    }
}

/**
 * Create a HTML tooltip with the events of the cytoscape instance 
 * @param {*} elementType 
 */
function createTooltip(elementType) {
    const tooltip = document.getElementById('tooltip');
    let to;

    cy.on('mouseover', elementType, function(event) {
    const element = event.target;
    to = setTimeout(() => {
        tooltip.style.display = 'block';
        tooltip.innerText = element.data('tooltip');
    }, 1000);
    });

    cy.on('mouseout', elementType, function(event) {
        clearTimeout(to);
        tooltip.style.display = 'none';
  });

    cy.on('mousemove', function(event) {
        tooltip.style.left = (event.originalEvent.pageX + 10) + 'px';
        tooltip.style.top = (event.originalEvent.pageY + 10) + 'px';
    });
}

/**
 * Create layout selector buttons after the fileInput
 */
function createLayoutSelectorButton() {
    const layoutButtons = document.getElementById("layoutButtons");
    for (let layout of layoutList) {
        let button = document.createElement("button")
        button.id = layout.name;
        button.textContent = layout.name;
        button.addEventListener("click", () => {load_layout(layout)} );
        layoutButtons.appendChild(button);
    }
}

/**
 * Save file in png or jpg format.
 * @param {*} format 
 */
function saveFile(format) {
    const img = getFileAs(format);

    const ele = document.createElement('a');
    ele.href = img;
    ele.download = 'graph.' + format;
    ele.click();
}

/**
 * Get a representation of the graph as an image of the requested format
 * @param {*} format 
 * @returns 
 */
function getFileAs(format) {
    switch (format) {
        case "png": return cy.png({full : true});
        case "jpg": return cy.jpg({full : true});
    }
}

/**
 * Create and return a context menus for the cytoscape instance 
 * @param {*} cy 
 * @returns 
 */
function createAndGetContextMenu(cy) {
    return cy.contextMenus({
        evtType: 'cxttap',
        menuItems: [itemOpenClose]
    })
}

/**
 * Check the element's group and then add a style class based on the group and his values.
 * @param {*} element 
 */
function addClassToElement(element) {
    let classesName = [];
    let style; 
    if (element.data.group == "edge") {
        style = getDefaultEdgeStyleFromEdgeValues(element);
        classesName.push(findAndGetClassStyle(style, edgeStyleList).selector.replace(/^\./, ''));
    }
    else {
        style = getDefaultGlobalNodeStyleFromNodeValues(element);
        classesName.push(findAndGetClassStyle(style, nodeStyleList).selector.replace(/^\./, ''));
        if (element.data.group == "cluster") {
            style = getDefaultClusterStyleFromClusterValues(element);
            classesName.push(findAndGetClassStyle(style, clusterStyleList).selector.replace(/^\./, ''))
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
function findAndGetClassStyle(styleTarget, styleList) {
    for (let style of styleList) {
        if (equals(styleTarget.style, style.style)) {
            return style;
        }
    }
    addStyleToCytoscapeGraph(styleTarget);
    styleList.push(styleTarget);
    return styleTarget;
}

/**
 * Add a new style in the style attribute of the cytoscape instance. 
 * @param {*} style 
 */
function addStyleToCytoscapeGraph(style) {
    const existingStyle = cy.style().json();
    cy.style([...existingStyle, style]);
}

/**
 * Check if two object are similar.
 * @param {*} o1 
 * @param {*} o2 
 * @returns 
 */
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (typeof o1 !== "object" || typeof o2 !== "object" || o1 == null || o2 == null) {
    return false;
  }

  const k1 = Object.keys(o1);
  const k2 = Object.keys(o2);

  if (k1.length !== k2.length) return false;

  for (let k of k1) {
    if (!k2.includes(k) || !equals(o1[k], o2[k])) {
      return false;
    }
  }

  return true;
}


window.addEventListener("load", setUp);
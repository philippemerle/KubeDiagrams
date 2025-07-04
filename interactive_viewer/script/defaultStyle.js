let clusterStyleList = [];
let nodeStyleList = [];
let edgeStyleList = [];

function getDefaultGlobalNodeStyleFromNodeValues(node) {
    return {
        selector : ".nodeStyle" + nodeStyleList.length,
        style : {
            'color': node.data.fontcolor,
            'font-size': node.data.fontsize,
            'font-family': node.data.fontfamily,
        }
    };
}

function getDefaultClusterStyleFromClusterValues(cluster) {
    return {
            selector : ".clusterStyle" + clusterStyleList.length, 
            style : {
                'border-style': cluster.data.bs,
                'border-color': cluster.data.bc,
                'background-color': cluster.data.bgcolor,
            }
        };
} 

function getDefaultEdgeStyleFromEdgeValues(edge) {
    return {
            selector : ".edgeStyle" + edgeStyleList.length, 
            style : {
                'line-color': edge.data.color,
                'target-arrow-color': edge.data.color,
                'source-arrow-color': edge.data.color,
                'line-style': edge.data.line_style,
                'color': edge.data.fontcolor,
                'font-size': edge.data.fontsize,
                'font-family': edge.data.fontfamily,
            }
        };
}

const clusterClosedStyle = {
                    'text-wrap': 'wrap',
                    'text-max-width': '100px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-margin-y': 0,
                    'width': 50,
                    'height': 20,
                }

const clusterOpenStyle = {
                    'text-valign': 'top',
                    'text-wrap': 'none',
                    'text-margin-y': 15, 
                    'padding': '15px',
                }

const defaultGroupNodeStyle = {
                    'background-fit': 'cover',
                    'background-image': 'data(image)',      
                    'background-opacity': 0,
                    'background-clip': 'node', 
                    'width': 100,
                    'height': 100,
                    'text-valign' : 'bottom',       
                    'text-wrap': 'wrap',
                }

const defaultGlobalNodeStyle = {
                    'content': 'data(label)',
                    'min-zoomed-font-size': '8'
                }

const defaultEdgeStyle = {
                    'source-endpoint': 'outside-to-node-or-label',
                    'target-endpoint': 'outside-to-node-or-label', 
                    'width': 1,
                    'curve-style': 'bezier',
                    'label': 'data(xlabel)',
                    'min-zoomed-font-size': '8',
                }

const defaultEdgeDirForward = {
                    'target-arrow-shape': 'triangle',
                    'target-arrow-fill': 'filled',
                }

const defaultEdgeDirBack = {
                    'source-arrow-shape': 'triangle',
                    'source-arrow-fill': 'filled',
                }
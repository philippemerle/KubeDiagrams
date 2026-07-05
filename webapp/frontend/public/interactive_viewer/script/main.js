cytoscape.use(cytoscapeDagre);
cytoscape.use(cytoscapeKlay);

let cy;
let currentLayout;

const RESOURCE_CATEGORIES = {
    'Workloads': ['Pod', 'Deployment', 'ReplicaSet', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob', 'ReplicationController', 'PodTemplate'],
    'Networking': ['Service', 'Ingress', 'IngressClass', 'NetworkPolicy', 'Endpoints', 'EndpointSlice', 'NetworkAttachmentDefinition'],
    'Storage': ['PersistentVolumeClaim', 'PersistentVolume', 'StorageClass', 'CSIDriver', 'CSINode', 'CSIStorageCapacity', 'VolumeAttachment'],
    'Configuration': ['ConfigMap', 'Secret'],
    'Access Control': ['ServiceAccount', 'Role', 'RoleBinding', 'ClusterRole', 'ClusterRoleBinding', 'PodSecurityPolicy', 'User', 'Group'],
    'Cluster & Ops': ['Node', 'Namespace', 'Event', 'HorizontalPodAutoscaler', 'VerticalPodAutoscaler', 'LimitRange', 'ResourceQuota', 'PodDisruptionBudget', 'PriorityClass', 'RuntimeClass', 'Lease'],
    'Extensions': ['CustomResourceDefinition', 'APIService', 'MutatingWebhookConfiguration', 'ValidatingWebhookConfiguration']
};

function closeAllFilterPanels(except) {
    document.querySelectorAll('.filter-dropdown.open').forEach(dropdown => {
        if (dropdown !== except) dropdown.classList.remove('open');
    });
}

function renderFilters() {
    const container = document.getElementById('categoryFilters');
    if (!container) return;
    container.innerHTML = '';

    for (const [category, kinds] of Object.entries(RESOURCE_CATEGORIES)) {
        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'filter-dropdown-toggle';
        toggleBtn.textContent = category + ' ▾';
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasOpen = dropdown.classList.contains('open');
            closeAllFilterPanels();
            dropdown.classList.toggle('open', !wasOpen);
        });

        const panel = document.createElement('div');
        panel.className = 'filter-dropdown-panel';
        panel.addEventListener('click', (e) => e.stopPropagation());

        const catLabel = document.createElement('label');
        catLabel.className = 'filter-category-label';

        const catCheck = document.createElement('input');
        catCheck.type = 'checkbox';
        catCheck.checked = true;
        catCheck.className = 'category-checkbox';
        catCheck.value = category;

        catLabel.appendChild(catCheck);
        catLabel.appendChild(document.createTextNode(' ' + category));
        panel.appendChild(catLabel);

        kinds.forEach(kind => {
            const label = document.createElement('label');
            label.className = 'filter-kind-label';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.value = kind.toLowerCase();
            cb.className = `kind-checkbox kind-${kind.toLowerCase()}`;
            cb.dataset.category = category;

            label.appendChild(cb);
            label.appendChild(document.createTextNode(' ' + kind));
            panel.appendChild(label);

            cb.addEventListener('change', () => {
                // If any child is unchecked, uncheck the parent. If all are checked, check it.
                const allChecked = Array.from(panel.querySelectorAll('.kind-checkbox')).every(c => c.checked);
                catCheck.checked = allChecked;
                updateCategoryFilters();
                updateDropdownToggleState(dropdown, toggleBtn, category, panel);
            });
        });

        catCheck.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            panel.querySelectorAll('.kind-checkbox').forEach(cb => {
                cb.checked = isChecked;
            });
            updateCategoryFilters();
            updateDropdownToggleState(dropdown, toggleBtn, category, panel);
        });

        dropdown.appendChild(toggleBtn);
        dropdown.appendChild(panel);
        container.appendChild(dropdown);
    }

    document.addEventListener('click', () => closeAllFilterPanels());
}

function updateDropdownToggleState(dropdown, toggleBtn, category, panel) {
    const checkboxes = panel.querySelectorAll('.kind-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    dropdown.classList.toggle('filter-dropdown-partial', checkedCount > 0 && checkedCount < checkboxes.length);
    dropdown.classList.toggle('filter-dropdown-empty', checkedCount === 0);
}

function updateCategoryFilters() {
    if (!cy) return;
    const kindCheckboxes = document.querySelectorAll('#categoryFilters .kind-checkbox');
    const visibleKinds = new Set();
    kindCheckboxes.forEach(cb => {
        if (cb.checked) visibleKinds.add(cb.value);
    });

    cy.batch(() => {
        cy.nodes().forEach(node => {
            if (node.data('group') === 'cluster') return;
            const kind = (node.data('kind') || '').toLowerCase();
            
            let isKnown = false;
            for (const kinds of Object.values(RESOURCE_CATEGORIES)) {
                if (kinds.some(k => k.toLowerCase() === kind)) {
                    isKnown = true;
                    break;
                }
            }
            
            if (isKnown) {
                if (visibleKinds.has(kind)) {
                    node.style('display', 'element');
                } else {
                    node.style('display', 'none');
                }
            } else {
                node.style('display', 'element');
            }
        });
    });
}

// Construit la liste d'éléments Cytoscape à partir d'un objet DOT_JSON
function buildElementsFromDotJson(json) {
  const elements = [];
  const nodes = json.objects || json.nodes || [];
  const edges = json.edges || [];

  const sortedNodes = [...nodes].sort((a, b) => {
    const aIsCluster = a.nodes || a.subgraphs;
    const bIsCluster = b.nodes || b.subgraphs;
    if (aIsCluster && !bIsCluster) return -1;
    if (!aIsCluster && bIsCluster) return 1;
    return 0;
  });

  addNodesElementsParsedFromNodesJson(elements, sortedNodes);
  addNodesEdgesParsedFromEdgesJson(elements, edges);
  return elements;
}

// Rend le graphe directement depuis un objet DOT_JSON 
window.renderFromDotJson = function (json) {
  try {
    const elements = buildElementsFromDotJson(json);
    load_cytoscape(elements);
  } catch (e) {
    console.error('renderFromDotJson failed:', e);
  }
};

/**
 * initialise a cytoscape instance, create layout selector buttons, add event listeners on save buttons and add
 * an event listener on the file input button to load the cytoscape graph. 
 */
function setUp() {
    renderFilters();
    cy = getCyGraph();
    currentLayout = layoutList[0];
    createLayoutSelectorButton();
    document.getElementById("savePNG").addEventListener("click", () => { saveFile("png")});
    document.getElementById("saveJPG").addEventListener("click", () => { saveFile("jpg")});

    document.getElementById('fileInput').addEventListener('change', readFileAndloadCytoscapeGraph);

    window.addEventListener('message', (e) => {
      const data = e && e.data;
      if (!data || data.type !== 'KD_LOAD_DOT_JSON' || !data.payload) return;
      try {
        window.renderFromDotJson(data.payload);
      } catch (err) {
        console.error('Failed to handle KD_LOAD_DOT_JSON:', err);
      }
    }, false);

    // === (Optionnel) Autoload via ?dataUrl=... ===
    try {
      const params = new URLSearchParams(location.search);
      const dataUrl = params.get('dataUrl');
      if (dataUrl) {
        fetch(dataUrl)
          .then(r => r.json())
          .then(json => window.renderFromDotJson(json))
          .catch(err => console.error('Failed to load DOT_JSON via dataUrl:', err));
      }
    } catch (_) { /* ignore */ }
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
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const json = JSON.parse(content);
            const elements = buildElementsFromDotJson(json);  
            load_cytoscape(elements);
        } catch (err) {
            console.error('Invalid DOT_JSON file:', err);
        }
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
    updateCategoryFilters();
    cy.layout(currentLayout).run();
}

function load_layout(layout) {
    currentLayout = layout;
    cy.layout(layout).run();
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
        let tooltip = nodesJson[i].tooltip ?? '';
        let kindMatch = tooltip.match(/kind:\s*([A-Za-z0-9_]+)/i);
        let kind = kindMatch ? kindMatch[1] : '';

        let image = nodesJson[i].image ?? '';
        let label = nodesJson[i].label ?? '';

        if (!image && typeof label === 'string' && label.includes('<img')) {
            let imgMatch = label.match(/<img[^>]+src="([^"]+)"/);
            if (imgMatch) {
                image = imgMatch[1];
            }

            // Try to extract only the text part from the table structure for the label
            let textMatch = label.match(/<tr><td>([^<]+)<\/td><\/tr><\/table>/) || label.match(/<td>([^<]+)<\/td>/g);
            if (textMatch) {
                if (textMatch.length > 0 && Array.isArray(textMatch) && textMatch[0].startsWith('<td>')) {
                    // It's the global match array
                    let lastMatch = textMatch[textMatch.length - 1];
                    let rawText = lastMatch.replace(/<\/?td>/g, '');
                    label = (nodesJson[i].tooltip && nodesJson[i].tooltip.includes(rawText))
                        ? nodesJson[i].tooltip.split('\n')[0] // Use first line of tooltip e.g. "Namespace: default"
                        : rawText;
                } else if (textMatch[1]) {
                    label = (nodesJson[i].tooltip && nodesJson[i].tooltip.includes(textMatch[1]))
                        ? nodesJson[i].tooltip.split('\n')[0]
                        : textMatch[1];
                }
            } else {
                // Fallback to tooltip if label is completely unparsable HTML
                if (label.includes('<') && label.includes('>') && tooltip) {
                    label = tooltip.split('\n')[0];
                }
            }
        } else if (label.includes('<') && label.includes('>')) {
            label = tooltip.split('\n')[0];
        }

        let node = {
            data: {
                id: nodesJson[i]._gvid, 
                group: (nodesJson[i].nodes) ? 'cluster' : 'node',
                isClose : false,
                label: label,
                bs: getCorrespondingBorderStyle(nodesJson[i].style),
                bgcolor: getCorrespondingColor(nodesJson[i].bgcolor ?? 'blue'),
                bc: nodesJson[i].pencolor ?? 'gray',
                parent: parent[nodesJson[i]._gvid] ?? '',
                fontsize: nodesJson[i].fontsize ?? '',
                fontfamily: nodesJson[i].fontname ?? '',
                fontcolor: nodesJson[i].fontcolor ?? '',
                image: image,
                tooltip: tooltip,
                kind: kind
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
 * Get the corresponding color.
 * @param {*} color
 * @returns 
 */
function getCorrespondingColor(color) {
  return (color == 'transparent') ? '#ffffff00' : color;
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
        let button = document.createElement("button");
        button.id = layout.name;
        button.textContent = layout.displayName || layout.name;
        button.addEventListener("click", () => { load_layout(layout); });
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
    case 'png': return cy.png({ full: true });
    case 'jpg': return cy.jpg({ full: true });
    //case 'svg': return cy.svg({ full: true, scale: 5});//
    default: throw new Error('Format inconnu: ' + format);
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
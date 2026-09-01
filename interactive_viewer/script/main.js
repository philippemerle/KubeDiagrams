// Modules in this directory use the Revealing Module Pattern (IIFE +
// shared `window.IV` namespace), loaded via classic <script> tags in
// index.html — not ES modules (`import`/`export`). This viewer is meant
// to be opened directly as `file://.../index.html` (documented in the
// project README), and `<script type="module">` fails there with a CORS
// error under Chrome. The IIFE pattern gives the same per-file isolation
// without that restriction.
cytoscape.use(cytoscapeDagre);
cytoscape.use(cytoscapeKlay);

/**
 * Remove previous elements, add the new ones, then (re)create tooltips,
 * context menu and filters for the cytoscape instance.
 * @param {*} elements
 */
function load_cytoscape(elements) {
    const cy = IV.state.getCy();
    cy.nodes().remove();
    cy.add(elements);
    IV.tooltip.createTooltip("node");
    IV.tooltip.createTooltip("edge");
    IV.state.createContextMenu(cy);
    IV.filters.updateCategoryFilters();
    cy.layout(IV.state.getCurrentLayout()).run();
}

// Render the graph directly from a DOT_JSON object
window.renderFromDotJson = function (json) {
    try {
        const elements = IV.elementsBuilder.buildElementsFromDotJson(json);
        load_cytoscape(elements);
    } catch (e) {
        console.error('renderFromDotJson failed:', e);
    }
};

/**
 * Read a dot_json file to build elements and load them into the cytoscape
 * instance.
 * @param {*} event
 */
function readFileAndloadCytoscapeGraph(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const json = JSON.parse(content);
            const elements = IV.elementsBuilder.buildElementsFromDotJson(json);
            load_cytoscape(elements);
        } catch (err) {
            console.error('Invalid DOT_JSON file:', err);
        }
    };
    reader.readAsText(file);
}

/**
 * Handle a DOT_JSON payload received from the parent window via postMessage.
 * @param {*} event
 */
function handlePostMessage(event) {
    const data = event && event.data;
    if (!data || data.type !== 'KD_LOAD_DOT_JSON' || !data.payload) return;
    try {
        window.renderFromDotJson(data.payload);
    } catch (err) {
        console.error('Failed to handle KD_LOAD_DOT_JSON:', err);
    }
}

/**
 * Autoload a DOT_JSON file referenced by the ?dataUrl=... query parameter.
 */
function autoloadFromDataUrl() {
    try {
        const params = new URLSearchParams(location.search);
        const dataUrl = params.get('dataUrl');
        if (!dataUrl) return;
        fetch(dataUrl)
            .then(r => r.json())
            .then(json => window.renderFromDotJson(json))
            .catch(err => console.error('Failed to load DOT_JSON via dataUrl:', err));
    } catch (_) { /* ignore */ }
}

/**
 * Initialize the cytoscape instance, create layout selector buttons, wire
 * save buttons and the file input, and set up autoload (postMessage /
 * ?dataUrl=...).
 */
function setUp() {
    IV.filters.renderFilters();
    IV.state.setCy(IV.state.createCyGraph());
    IV.state.setCurrentLayout(layoutList[0]);
    IV.fileIO.createLayoutSelectorButton();

    document.getElementById("savePNG").addEventListener("click", () => { IV.fileIO.saveFile("png"); });
    document.getElementById("saveJPG").addEventListener("click", () => { IV.fileIO.saveFile("jpg"); });
    document.getElementById('fileInput').addEventListener('change', readFileAndloadCytoscapeGraph);

    window.addEventListener('message', handlePostMessage, false);
    autoloadFromDataUrl();
}

window.addEventListener("load", setUp);
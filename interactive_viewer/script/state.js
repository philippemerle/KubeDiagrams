(function () {
  'use strict';

  // Single source of truth for the cytoscape instance and the currently
  // selected layout, so other modules don't each keep their own `let cy`.
  let cy = null;
  let currentLayout = null;

  function getCy() {
      return cy;
  }

  function setCy(instance) {
      cy = instance;
      return cy;
  }

  function getCurrentLayout() {
      return currentLayout;
  }

  function setCurrentLayout(layout) {
      currentLayout = layout;
      return currentLayout;
  }

  /**
   * Create a new cytoscape instance bound to #paper, styled from
   * defaultStyle.js.
   * @returns {*} cytoscape instance
   */
  function createCyGraph() {
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
   * Create and return a context menu for the given cytoscape instance.
   * @param {*} cyInstance
   * @returns {*}
   */
  function createContextMenu(cyInstance) {
      return cyInstance.contextMenus({
          evtType: 'cxttap',
          menuItems: [itemOpenClose]
      });
  }

  window.IV = window.IV || {};
  window.IV.state = {
      getCy,
      setCy,
      getCurrentLayout,
      setCurrentLayout,
      createCyGraph,
      createContextMenu,
  };
})();
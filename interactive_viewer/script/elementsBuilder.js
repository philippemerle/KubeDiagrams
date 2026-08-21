(function () {
  'use strict';

  /**
   * Get border style based on what's in the style parameter.
   * @param {*} style
   * @returns {string}
   */
  function getCorrespondingBorderStyle(style) {
      return style.includes('dashed') ? 'dashed' : 'solid';
  }

  /**
   * Get the corresponding color.
   * @param {*} color
   * @returns {string}
   */
  function getCorrespondingColor(color) {
      return (color == 'transparent') ? '#ffffff00' : color;
  }

  /**
   * Check if two objects are similar.
   * @param {*} o1
   * @param {*} o2
   * @returns {boolean}
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

  /**
   * Look for a style class similar to styleTarget in styleList. If found,
   * return it; otherwise add styleTarget to the cytoscape instance's style
   * and to styleList, then return it.
   * @param {*} styleTarget
   * @param {*} styleList
   * @returns {*}
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
   * Add a new style to the cytoscape instance's style attribute.
   * @param {*} style
   */
  function addStyleToCytoscapeGraph(style) {
      const cy = IV.state.getCy();
      const existingStyle = cy.style().json();
      cy.style([...existingStyle, style]);
  }

  /**
   * Check the element's group and add a style class based on the group and
   * its values.
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
              classesName.push(findAndGetClassStyle(style, clusterStyleList).selector.replace(/^\./, ''));
          }
      }
      element.classes = classesName.join(' ');
  }

  /**
   * Add node elements built from nodesJson data into the elements list.
   * @param {*} elements
   * @param {*} nodesJson - nodes data list
   * @returns {*}
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
   * Add edge elements built from edgesJson data into the elements list.
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
   * Build the cytoscape elements list from a DOT_JSON object.
   * @param {*} json
   * @returns {*[]}
   */
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

  window.IV = window.IV || {};
  window.IV.elementsBuilder = { buildElementsFromDotJson };
})();
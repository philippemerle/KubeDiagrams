(function () {
  'use strict';

  /**
   * Get a representation of the graph as an image of the requested format.
   * @param {*} format
   * @returns {*}
   */
  function getFileAs(format) {
      const cy = IV.state.getCy();
      switch (format) {
          case 'png': return cy.png({ full: true });
          case 'jpg': return cy.jpg({ full: true });
          default: throw new Error('Unknown format: ' + format);
      }
  }

  /**
   * Save the current graph as a PNG or JPG file.
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
   * Switch to the given layout and re-run it.
   * @param {*} layout
   */
  function loadLayout(layout) {
      const cy = IV.state.getCy();
      IV.state.setCurrentLayout(layout);
      cy.layout(layout).run();
  }

  /**
   * Create layout selector buttons in #layoutButtons.
   */
  function createLayoutSelectorButton() {
      const layoutButtons = document.getElementById("layoutButtons");
      for (let layout of layoutList) {
          let button = document.createElement("button");
          button.id = layout.name;
          button.textContent = layout.displayName || layout.name;
          button.addEventListener("click", () => { loadLayout(layout); });
          layoutButtons.appendChild(button);
      }
  }

  window.IV = window.IV || {};
  window.IV.fileIO = { saveFile, loadLayout, createLayoutSelectorButton };
})();
(function () {
  'use strict';

  /**
   * Create an HTML tooltip driven by the cytoscape instance's events.
   * @param {*} elementType
   */
  function createTooltip(elementType) {
      const cy = IV.state.getCy();
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

  window.IV = window.IV || {};
  window.IV.tooltip = { createTooltip };
})();
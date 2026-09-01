(function () {
  'use strict';

  function closeAllFilterPanels(except) {
      document.querySelectorAll('.filter-dropdown.open').forEach(dropdown => {
          if (dropdown !== except) dropdown.classList.remove('open');
      });
  }

  function updateDropdownToggleState(dropdown, toggleBtn, category, panel) {
      const checkboxes = panel.querySelectorAll('.kind-checkbox');
      const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
      dropdown.classList.toggle('filter-dropdown-partial', checkedCount > 0 && checkedCount < checkboxes.length);
      dropdown.classList.toggle('filter-dropdown-empty', checkedCount === 0);
  }

  /**
   * Show/hide graph nodes based on the checked resource-kind checkboxes.
   * Nodes whose kind isn't covered by RESOURCE_CATEGORIES stay visible.
   */
  function updateCategoryFilters() {
      const cy = IV.state.getCy();
      if (!cy) return;
      const { RESOURCE_CATEGORIES } = IV.resourceData;

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
                  node.style('display', visibleKinds.has(kind) ? 'element' : 'none');
              } else {
                  node.style('display', 'element');
              }
          });
      });
  }

  /**
   * Build the toolbar dropdown filters (one per resource category, with a
   * checkbox per kind) into #categoryFilters.
   */
  function renderFilters() {
      const { RESOURCE_CATEGORIES } = IV.resourceData;
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

  window.IV = window.IV || {};
  window.IV.filters = { renderFilters, updateCategoryFilters };
})();
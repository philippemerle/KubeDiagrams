import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';
import ManifestTab from '../tabs/ManifestTab/index.jsx';
import HelmTab from '../tabs/HelmTab/index.jsx';
import HelmFileTab from '../tabs/HelmFileTab/index.jsx';
import InteractiveViewerTab from '../tabs/InteractiveViewerTab/index.jsx';

function Tabs({ historyContext }) {
  const [activeTab, setActiveTab] = useState('manifest');

  // Auto-switch tab when restoring from history
  useEffect(() => {
    if (historyContext?.restoredItem) {
      const type = historyContext.restoredItem.type;
      if (type === 'manifest') setActiveTab('manifest');
      else if (type === 'helm') setActiveTab('helm');
      else if (type === 'helmfile') setActiveTab('helmfile');
    }
  }, [historyContext?.restoredItem]);

  const tabs = [
    { id: 'manifest', label: 'Manifest' },
    { id: 'helm', label: 'Helm Chart' },
    { id: 'helmfile', label: 'HelmFile' },
    { id: 'interactviewer', label: 'InteractiveViewer' },
  ];

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Onglets */}
      <div className="flex mb-4 space-x-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded transition-all duration-300
              ${
                activeTab === tab.id
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-panel)] text-[var(--color-text)]'
              }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Contenu des tabs */}
      <div className="flex-1">
        {activeTab === 'manifest' && <ManifestTab historyContext={historyContext} />}
        {activeTab === 'helm' && <HelmTab historyContext={historyContext} />}
        {activeTab === 'helmfile' && <HelmFileTab historyContext={historyContext} />}
        {activeTab === 'interactviewer' && <InteractiveViewerTab />}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    getHistoryItem: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default Tabs;

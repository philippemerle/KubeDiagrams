import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, X, Trash2, Clock, FileText, Download, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import toastUtil from '../../utils/toast.js';
import Tooltip from './Tooltip.jsx';
import { TOOLTIP_CONTENT } from '../../utils/tooltipContent.jsx';

/**
 * History Panel Component
 * Shows recent diagram generations with ability to restore and download
 */
const HistoryPanel = ({ history, onRestore, onRemove, onClear, isOpen, onToggle }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getTypeLabel = (type) => {
    const labels = {
      manifest: 'Manifest',
      helm: 'Helm',
      helmfile: 'Helmfile',
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      manifest: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      helm: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      helmfile: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[type] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`fixed top-20 right-4 z-40 p-3 rounded-lg backdrop-blur-sm border transition-colors ${
          isOpen
            ? 'bg-slate-800/90 border-slate-600 text-slate-300'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 text-white shadow-lg'
        }`}
        title="History - Access the 20 most recent generated diagrams"
      >
        <History className="w-5 h-5" />
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {history.length}
          </span>
        )}
      </motion.button>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-700 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <History className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Historique</h2>
                  </div>
                  <button
                    onClick={onToggle}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {history.length > 0 && (
                  <button
                    onClick={onClear}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Tout effacer
                  </button>
                )}
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">Aucun diagramme dans l&apos;historique</p>
                    <p className="text-xs text-center mt-2">
                      Les diagrammes générés apparaîtront ici
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-all cursor-pointer group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded border ${getTypeBadgeColor(item.type)}`}
                            >
                              {getTypeLabel(item.type)}
                            </span>
                            <span className="text-xs text-slate-500">
                              {item.outputFormat?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(item.timestamp)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(item.id);
                            }}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Preview */}
                      {item.preview && (
                        <div className="text-xs text-slate-400 mb-3 line-clamp-2 font-mono bg-slate-900/50 p-2 rounded">
                          {item.preview}
                        </div>
                      )}

                      {/* Restore Button */}
                      <button
                        onClick={() => {
                          onRestore(item);
                          toastUtil.success('Diagram restored');
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-sm font-medium text-white transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Restaurer
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

HistoryPanel.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      outputFormat: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      preview: PropTypes.string,
      diagram: PropTypes.string,
      mimeType: PropTypes.string,
      filename: PropTypes.string,
      input: PropTypes.object,
    })
  ).isRequired,
  onRestore: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default HistoryPanel;

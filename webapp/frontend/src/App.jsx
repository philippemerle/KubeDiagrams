import { useState, useMemo } from 'react';
import { Toaster } from 'sonner';
import Header from './components/common/Header.jsx';
import Tabs from './components/common/Tabs.jsx';
import HistoryPanel from './components/common/HistoryPanel.jsx';
import { useHistory } from './hooks/useHistory.js';

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [restoredItem, setRestoredItem] = useState(null);
  const { history, addToHistory, removeFromHistory, clearHistory, getHistoryItem } = useHistory();

  const handleRestoreFromHistory = (item) => {
    // Set the restored item to trigger restoration in the corresponding tab
    setRestoredItem(item);
    // Close the history panel
    setIsHistoryOpen(false);
  };

  const clearRestoredItem = () => {
    setRestoredItem(null);
  };

  // Mémoriser historyContext pour éviter de le recréer à chaque render
  const historyContext = useMemo(
    () => ({ addToHistory, getHistoryItem, restoredItem, clearRestoredItem }),
    [addToHistory, getHistoryItem, restoredItem]
  );

  return (
    <div className="min-h-screen bg-[#0a1128] text-white flex flex-col">
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <Header />
      <Tabs historyContext={historyContext} />
      <HistoryPanel
        history={history}
        onRestore={handleRestoreFromHistory}
        onRemove={removeFromHistory}
        onClear={clearHistory}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
      />
    </div>
  );
}

export default App;

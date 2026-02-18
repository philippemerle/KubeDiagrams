/**
 * Interactive Viewer Tab Container
 * Main component that orchestrates the interactive viewer for DOT JSON files
 */

import React from 'react';

const InteractiveViewerTab = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col bg-[var(--color-panel)] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Interactive Viewer</h2>
        <p className="text-sm text-gray-300 mb-4">
          Load your DOT JSON file and interact with the diagram using the controls below.
        </p>
        <div className="w-full h-[75vh] border rounded overflow-hidden bg-white">
          <iframe
            src="/interactive_viewer/index.html"
            title="Interactive Viewer"
            className="w-full h-full border-0"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveViewerTab;

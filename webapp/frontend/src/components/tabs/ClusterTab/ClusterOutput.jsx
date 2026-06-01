/**
 * Cluster Output Component
 * Displays the generated cluster diagram and command execution details
 */

import { motion } from 'motion/react';
import NotationOptions from '../../options/NotationOptions';
import DiagramViewer from '../../common/DiagramViewer.jsx';
import ErrorAlert from '../../common/ErrorAlert.jsx';
import DownloadButton from '../../common/DownloadButton.jsx';

function ClusterOutput({
  errorMessage,
  diagram,
  mimeType,
  filename,
  outputFormat,
  viewerKey,
  viewerRef,
  onViewerLoad,
  isSubmitting,
}) {
  return (
    <div className="w-full flex flex-col bg-white p-6 rounded-lg shadow-lg text-black space-y-4">
      <h2 className="text-2xl font-bold">Cluster Diagram</h2>

      {/* Error Alert */}
      <ErrorAlert message={errorMessage} />

      {/* Diagram Display */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <DiagramViewer
          diagram={diagram}
          mimeType={mimeType}
          outputFormat={outputFormat}
          viewerKey={viewerKey}
          viewerRef={viewerRef}
          onViewerLoad={onViewerLoad}
          isLoading={isSubmitting}
        />
      </motion.div>

      {/* Download Button */}
      <DownloadButton
        diagram={diagram}
        mimeType={mimeType}
        outputFormat={outputFormat}
        filename={filename}
        filenameFallback={`cluster-diagram.png`}
      />

      {/* Notation Options */}
      {diagram && <NotationOptions diagramType="cluster" />}
    </div>
  );
}

export default ClusterOutput;

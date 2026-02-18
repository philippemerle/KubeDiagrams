/**
 * Manifest Output Component
 * Displays the generated diagram and command execution details
 */

import { motion } from 'motion/react';
import NotationOptions from '../../options/NotationOptions';
import DiagramViewer from '../../common/DiagramViewer.jsx';
import ErrorAlert from '../../common/ErrorAlert.jsx';
import CommandDetails from '../../common/CommandDetails.jsx';
import DownloadButton from '../../common/DownloadButton.jsx';

function ManifestOutput({
  errorMessage,
  diagram,
  outputFormat,
  mimeType,
  filename,
  command,
  stdout,
  stderr,
  message,
  viewerKey,
  viewerRef,
  onViewerLoad,
  isSubmitting,
}) {
  return (
    <div className="w-full flex flex-col bg-white p-6 rounded-lg shadow-lg text-black space-y-4">
      <h2 className="text-2xl font-bold">Output</h2>

      {/* Error Alert */}
      <ErrorAlert message={errorMessage} showDetailsButton={!!(stderr || stdout)} />

      {/* Diagram Display */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <DiagramViewer
          diagram={diagram}
          outputFormat={outputFormat}
          mimeType={mimeType}
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
        filenameFallback={`manifest-diagram.${(outputFormat || 'png').toLowerCase()}`}
      />

      {/* Command Execution Details */}
      <CommandDetails command={command} stdout={stdout} stderr={stderr} message={message} />

      {/* Notation Options */}
      {diagram && <NotationOptions diagramType="manifest" />}
    </div>
  );
}

export default ManifestOutput;

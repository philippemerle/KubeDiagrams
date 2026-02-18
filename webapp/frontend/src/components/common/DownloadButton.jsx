/**
 * DownloadButton Component
 * Reusable download button for diagram files
 * Supports all output formats (PNG, SVG, PDF, DOT, DOT_JSON)
 */

import { Download } from 'lucide-react';
import { handleDownload } from '../../utils/download.js';

function DownloadButton({ diagram, mimeType, outputFormat, filename, filenameFallback }) {
  // Don't render if no diagram
  if (!diagram) {
    return null;
  }

  const finalFilename =
    filename || filenameFallback || `diagram.${(outputFormat || 'png').toLowerCase()}`;

  return (
    <div className="flex justify-center">
      <button
        onClick={() =>
          handleDownload({
            diagram,
            mimeType,
            outputFormat,
            filenameFallback: finalFilename,
          })
        }
        className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Download {outputFormat.toUpperCase()}
      </button>
    </div>
  );
}

export default DownloadButton;

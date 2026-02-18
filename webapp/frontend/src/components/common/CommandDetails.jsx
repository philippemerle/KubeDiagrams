/**
 * CommandDetails Component
 * Reusable component for displaying command execution details
 * Shows command, stdout, stderr, and messages from backend
 */

import AnsiText from './AnsiText.jsx';

function CommandDetails({ command, stdout, stderr, message }) {
  return (
    <div className="mt-6" id="command-details">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Command Execution Details</h3>
      <div className="bg-black text-white p-4 rounded-md text-sm space-y-4 overflow-x-auto">
        {command && (
          <div>
            <p className="text-blue-300 font-semibold">Command executed:</p>
            <pre className="whitespace-pre-wrap text-white">{command}</pre>
          </div>
        )}

        {stdout && (
          <div>
            <p className="text-green-400 font-semibold">stdout:</p>
            <AnsiText text={stdout} defaultColor="#16a34a" className="text-sm" />
          </div>
        )}

        {stderr && (
          <div>
            <p className="text-red-400 font-semibold">stderr:</p>
            <AnsiText text={stderr} defaultColor="#ef4444" className="text-sm" />
          </div>
        )}

        {message && (
          <div>
            <p className="text-green-400 font-semibold">Message:</p>
            <pre className="whitespace-pre-wrap text-green-200">{message}</pre>
          </div>
        )}

        {!command && !message && !stdout && !stderr && (
          <p className="text-gray-400">Waiting for command output...</p>
        )}
      </div>
    </div>
  );
}

export default CommandDetails;

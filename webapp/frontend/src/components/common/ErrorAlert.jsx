/**
 * ErrorAlert Component
 * Reusable error alert component with optional action button
 * Used to display backend errors and validation errors
 */

import { motion } from 'motion/react';
import { XCircle } from 'lucide-react';

function ErrorAlert({
  title = 'Error generating diagram',
  message,
  showDetailsButton = false,
  onDetailsClick,
}) {
  if (!message) return null;

  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick();
    } else {
      // Default behavior: scroll to command-details section
      const detailsSection = document.getElementById('command-details');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {showDetailsButton && (
            <div className="mt-3">
              <button
                onClick={handleDetailsClick}
                className="px-4 py-2 bg-[var(--color-accent)] hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                See command execution details below ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ErrorAlert;

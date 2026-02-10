import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logger from '../../utils/logger.js';
import { submitFeedback } from '../../services/diagramApi.js';

function NotationOptions({ diagramType = 'manifest' }) {
  const [note, setNote] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const sendFeedback = async () => {
    try {
      const response = await submitFeedback({
        note,
        comment,
        diagramType,
      });

      if (response.ok) {
        setSent(true);
        setNote(0);
        setComment('');
        setTimeout(() => setSent(false), 3000);
      }
    } catch (err) {
      logger.error('Error sending feedback', { error: err, diagramType, note });
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hovered || note);

      return (
        <motion.span
          key={starValue}
          whileHover={{ scale: 1.2 }}
          onClick={() => setNote(starValue)}
          onMouseEnter={() => setHovered(starValue)}
          onMouseLeave={() => setHovered(0)}
          className={`cursor-pointer text-2xl transition-colors ${
            isActive ? 'text-yellow-400' : 'text-gray-400'
          }`}
        >
          ★
        </motion.span>
      );
    });
  };

  return (
    <div className="flex flex-col space-y-3 border border-gray-300 p-4 rounded-md bg-gray-50 shadow-sm">
      <div>
        <label className="font-semibold text-gray-700">Rate the diagram:</label>
        <div className="flex space-x-1 mt-1">{renderStars()}</div>
      </div>

      <textarea
        className="p-2 border rounded bg-white text-sm resize-none"
        rows="3"
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={sendFeedback}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md self-start transition"
      >
        Send Feedback
      </button>

      <AnimatePresence>
        {sent && (
          <motion.span
            key="feedback-sent"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-green-600 text-sm"
          >
            Feedback sent successfully!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotationOptions;

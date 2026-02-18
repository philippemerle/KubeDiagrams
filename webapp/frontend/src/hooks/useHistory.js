/**
 * Hook for managing diagram generation history
 * Stores and retrieves recent diagrams from localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import logger from '../utils/logger.js';
import toastUtil from '../utils/toast.js';

const HISTORY_STORAGE_KEY = 'kubediagrams_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Custom hook for managing diagram history
 */
export function useHistory() {
  const [history, setHistory] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        logger.debug('History loaded from localStorage', { count: parsed.length });
      } else {
        logger.debug('No history found in localStorage');
      }
    } catch (error) {
      logger.error('Failed to load history from localStorage', { error });
    }
    // Mark as initialized after loading
    setIsInitialized(true);
  }, []);

  // Save history to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) {
      return; // Don't save during initial load
    }

    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      logger.debug('History saved to localStorage', { count: history.length });
    } catch (error) {
      logger.error('Failed to save history to localStorage', { error });
    }
  }, [history, isInitialized]);

  /**
   * Add a new item to history
   * @param {Object} item - History item
   * @param {string} item.id - Unique identifier (timestamp-based)
   * @param {string} item.type - Type of diagram (manifest, helm, helmfile)
   * @param {string} item.outputFormat - Output format used
   * @param {string} item.diagram - Generated diagram data
   * @param {string} item.mimeType - MIME type of diagram
   * @param {string} item.filename - Filename
   * @param {string} item.timestamp - ISO timestamp
   * @param {string} item.preview - Preview text or content snippet
   * @param {Object} item.input - Original input parameters
   */
  const addToHistory = useCallback((item) => {
    setHistory((prev) => {
      // Remove duplicates if same content exists
      const filtered = prev.filter((h) => h.id !== item.id);

      // Add new item at the beginning
      const newHistory = [item, ...filtered];

      // Keep only MAX_HISTORY_ITEMS
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });

    logger.info('Item added to history', {
      type: item.type,
      format: item.outputFormat,
      id: item.id,
    });

    // Show subtle toast
    toastUtil.info('Added to history', { duration: 2000 });
  }, []);

  /**
   * Remove an item from history by ID
   */
  const removeFromHistory = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    logger.info('Item removed from history', { id });
  }, []);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    logger.info('History cleared');
  }, []);

  /**
   * Get item by ID
   */
  const getHistoryItem = useCallback(
    (id) => {
      return history.find((item) => item.id === id);
    },
    [history]
  );

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryItem,
  };
}

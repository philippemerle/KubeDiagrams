/**
 * Custom hook for handling file uploads
 * Provides a clean interface for reading YAML/YML files
 */

import { useCallback } from 'react';
import { FILE_INPUT } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Hook to handle file upload and reading
 * @returns {Object} - handleFileUpload function and utility properties
 */
export function useFileUpload() {
  /**
   * Handle file selection and read its content
   * @param {File} file - The file to read
   * @param {Function} onSuccess - Callback with file content as string
   * @param {Function} onError - Optional error callback
   */
  const handleFileUpload = useCallback((file, onSuccess, onError) => {
    if (!file) {
      logger.warn('No file provided to handleFileUpload');
      return;
    }

    // Validate file extension
    const fileName = file.name.toLowerCase();
    const validExtensions = FILE_INPUT.ACCEPT.split(',').map((ext) => ext.trim());
    const hasValidExtension = validExtensions.some((ext) =>
      fileName.endsWith(ext.replace('*', ''))
    );

    if (!hasValidExtension) {
      const error = `Invalid file type. Expected: ${FILE_INPUT.ACCEPT}`;
      logger.warn('Invalid file extension', { fileName, expected: FILE_INPUT.ACCEPT });
      if (onError) {
        onError(error);
      }
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = FILE_INPUT.MAX_SIZE;
    if (file.size > maxSize) {
      const error = `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`;
      logger.warn('File too large', { size: file.size, maxSize });
      if (onError) {
        onError(error);
      }
      return;
    }

    logger.debug('Reading file', { fileName, size: file.size });

    // Read file using modern Blob.text() API
    file
      .text()
      .then((content) => {
        logger.debug('File read successfully', { fileName, contentLength: content.length });
        onSuccess(content);
      })
      .catch((err) => {
        logger.error('Error reading file', { error: err, fileName });
        if (onError) {
          onError(`Error reading file: ${err.message}`);
        }
      });
  }, []);

  /**
   * Create an onChange handler for file input elements
   * @param {Function} setContent - State setter for content
   * @param {Function} setError - Optional state setter for errors
   * @returns {Function} - onChange handler
   */
  const createFileInputHandler = useCallback(
    (setContent, setError) => {
      return (event) => {
        const file = event.target.files?.[0];
        if (file) {
          handleFileUpload(
            file,
            (content) => {
              setContent(content);
              if (setError) setError('');
            },
            (error) => {
              if (setError) setError(error);
            }
          );
        }
      };
    },
    [handleFileUpload]
  );

  return {
    handleFileUpload,
    createFileInputHandler,
    acceptedFormats: FILE_INPUT.ACCEPT,
    maxFileSize: FILE_INPUT.MAX_SIZE,
  };
}

/**
 * Toast notification utilities using Sonner
 * Provides consistent toast messages across the application
 */

import { toast } from 'sonner';

/**
 * Show a success toast notification
 * @param {string} message - Main message
 * @param {Object} options - Additional options
 */
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    duration: 4000,
    ...options,
  });
};

/**
 * Show an error toast notification
 * @param {string} message - Main message
 * @param {Object} options - Additional options
 */
export const showError = (message, options = {}) => {
  toast.error(message, {
    duration: 5000,
    ...options,
  });
};

/**
 * Show an info toast notification
 * @param {string} message - Main message
 * @param {Object} options - Additional options
 */
export const showInfo = (message, options = {}) => {
  toast.info(message, {
    duration: 4000,
    ...options,
  });
};

/**
 * Show a warning toast notification
 * @param {string} message - Main message
 * @param {Object} options - Additional options
 */
export const showWarning = (message, options = {}) => {
  toast.warning(message, {
    duration: 4000,
    ...options,
  });
};

/**
 * Show a loading toast notification
 * @param {string} message - Main message
 * @returns {string|number} Toast ID to dismiss later
 */
export const showLoading = (message) => {
  return toast.loading(message);
};

/**
 * Dismiss a specific toast by ID
 * @param {string|number} toastId - Toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Show a promise toast (loading → success/error)
 * @param {Promise} promise - Promise to track
 * @param {Object} messages - Messages for each state
 */
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Chargement...',
    success: messages.success || 'Terminé !',
    error: messages.error || 'Une erreur est survenue',
  });
};

/**
 * Show a custom toast with action button
 * @param {string} message - Main message
 * @param {Object} action - Action configuration
 */
export const showWithAction = (message, action) => {
  toast(message, {
    action: {
      label: action.label || 'Action',
      onClick: action.onClick || (() => {}),
    },
    duration: action.duration || 5000,
  });
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  loading: showLoading,
  dismiss: dismissToast,
  promise: showPromise,
  withAction: showWithAction,
};

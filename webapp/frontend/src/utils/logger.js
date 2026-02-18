/**
 * Centralized logging utility for the application
 * Provides consistent logging interface and can be extended for remote logging
 */

// Log levels
export const LogLevel = Object.freeze({
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
});

// Configuration
const config = {
  enableConsole: true,
  enableRemote: false, // Can be enabled for production monitoring
  minLevel: LogLevel.DEBUG,
  remoteEndpoint: '/api/client-logs', // Future: send logs to backend
};

/**
 * Format log message with timestamp and context
 * @private
 */
function formatMessage(level, message, context = {}) {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
}

/**
 * Send log to remote endpoint (future implementation)
 * @private
 */
async function sendToRemote(logData) {
  if (!config.enableRemote) return;

  try {
    await fetch(config.remoteEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });
  } catch (error) {
    // Silently fail to avoid infinite loop
  }
}

/**
 * Core logging function
 * @private
 */
function log(level, message, context = {}) {
  const logData = formatMessage(level, message, context);

  // Console logging
  if (config.enableConsole) {
    const consoleMethod = console[level] || console.log;
    if (Object.keys(context).length > 0) {
      consoleMethod(`[${level.toUpperCase()}]`, message, context);
    } else {
      consoleMethod(`[${level.toUpperCase()}]`, message);
    }
  }

  // Remote logging (future)
  if (config.enableRemote && level === LogLevel.ERROR) {
    sendToRemote(logData);
  }

  return logData;
}

/**
 * Logger interface
 */
export const logger = {
  /**
   * Log debug information
   * @param {string} message - The debug message
   * @param {Object} context - Additional context data
   */
  debug(message, context = {}) {
    return log(LogLevel.DEBUG, message, context);
  },

  /**
   * Log informational message
   * @param {string} message - The info message
   * @param {Object} context - Additional context data
   */
  info(message, context = {}) {
    return log(LogLevel.INFO, message, context);
  },

  /**
   * Log warning message
   * @param {string} message - The warning message
   * @param {Object} context - Additional context data
   */
  warn(message, context = {}) {
    return log(LogLevel.WARN, message, context);
  },

  /**
   * Log error message
   * @param {string} message - The error message
   * @param {Error|Object} errorOrContext - Error object or context data
   */
  error(message, errorOrContext = {}) {
    const context =
      errorOrContext instanceof Error
        ? {
            errorMessage: errorOrContext.message,
            errorStack: errorOrContext.stack,
            errorName: errorOrContext.name,
          }
        : errorOrContext;

    return log(LogLevel.ERROR, message, context);
  },

  /**
   * Configure logger settings
   * @param {Object} options - Configuration options
   */
  configure(options = {}) {
    Object.assign(config, options);
  },

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...config };
  },
};

// Export default for convenience
export default logger;

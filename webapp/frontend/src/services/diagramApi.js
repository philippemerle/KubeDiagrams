/**
 * Centralized API service for diagram generation
 * Handles all HTTP requests to the backend API
 */

import { API_ENDPOINTS } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Base fetch wrapper with error handling and logging
 * @private
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error(`API request failed: ${endpoint}`, {
        statusCode: response.status,
        error: data?.error,
        endpoint,
      });
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    logger.error(`Network error during API request: ${endpoint}`, {
      error,
      endpoint,
    });
    throw error;
  }
}

/**
 * Generate diagram from Kubernetes manifest
 * @param {Object} params - Request parameters
 * @param {string} params.manifest - Manifest content (YAML)
 * @param {string} params.outputFormat - Output format (png, jpg, svg, pdf, dot, dot_json)
 * @param {string} [params.extraArgs] - Additional CLI arguments
 * @param {boolean} [params.withoutNamespace] - Generate without namespace
 * @returns {Promise<Object>} Response with diagram data
 */
export async function generateManifestDiagram({
  manifest,
  outputFormat,
  extraArgs = '',
  withoutNamespace = false,
}) {
  logger.debug('Requesting manifest diagram generation', { outputFormat, withoutNamespace });

  const response = await apiFetch(API_ENDPOINTS.GENERATE_MANIFEST, {
    body: JSON.stringify({
      manifest,
      outputFormat,
      extraArgs,
      withoutNamespace,
    }),
  });

  if (response.ok && response.data.diagram) {
    logger.info('Manifest diagram generated successfully', {
      outputFormat,
      withoutNamespace,
      filename: response.data.filename,
    });
  }

  return response;
}

/**
 * Generate diagram from Helm chart
 * @param {Object} params - Request parameters
 * @param {string} params.chart - Helm chart URL
 * @param {string} params.outputFormat - Output format (png, jpg, svg, pdf, dot, dot_json)
 * @param {string} [params.extraArgs] - Additional CLI arguments
 * @returns {Promise<Object>} Response with diagram data
 */
export async function generateHelmDiagram({ chart, outputFormat, extraArgs = '' }) {
  logger.debug('Requesting Helm diagram generation', { chart, outputFormat });

  const response = await apiFetch(API_ENDPOINTS.GENERATE_HELM, {
    body: JSON.stringify({
      chart: chart.trim(),
      outputFormat,
      extraArgs,
    }),
  });

  if (response.ok && response.data.diagram) {
    logger.info('Helm diagram generated successfully', {
      outputFormat,
      chart,
      filename: response.data.filename,
    });
  }

  return response;
}

/**
 * Generate diagram from Helmfile
 * @param {Object} params - Request parameters
 * @param {string} params.helmfile - Helmfile content (YAML)
 * @param {string} params.outputFormat - Output format (png, jpg, svg, pdf, dot, dot_json)
 * @param {string} [params.extraArgs] - Additional CLI arguments
 * @param {boolean} [params.withoutNamespace] - Generate without namespace
 * @returns {Promise<Object>} Response with diagram data
 */
export async function generateHelmfileDiagram({
  helmfile,
  outputFormat,
  extraArgs = '',
  withoutNamespace = false,
}) {
  logger.debug('Requesting Helmfile diagram generation', { outputFormat, withoutNamespace });

  const response = await apiFetch(API_ENDPOINTS.GENERATE_HELMFILE, {
    body: JSON.stringify({
      content: helmfile,
      outputFormat,
      extraArgs,
      withoutNamespace,
    }),
  });

  if (response.ok && response.data.diagram) {
    logger.info('Helmfile diagram generated successfully', {
      outputFormat,
      withoutNamespace,
      filename: response.data.filename,
    });
  }

  return response;
}

/**
 * Submit user feedback
 * @param {Object} params - Feedback parameters
 * @param {number} params.note - Rating (1-5)
 * @param {string} params.comment - User comment
 * @param {string} params.diagramType - Type of diagram (manifest, helm, helmfile)
 * @returns {Promise<Object>} Response
 */
export async function submitFeedback({ note, comment, diagramType }) {
  logger.debug('Submitting feedback', { note, diagramType });

  const response = await apiFetch(API_ENDPOINTS.SUBMIT_FEEDBACK, {
    body: JSON.stringify({
      note,
      comment,
      diagramType,
    }),
  });

  if (response.ok) {
    logger.info('Feedback sent successfully', { diagramType, note });
  } else {
    logger.warn('Failed to send feedback - server returned error', {
      statusCode: response.status,
      diagramType,
      note,
    });
  }

  return response;
}

/**
 * Check if output contains fatal errors
 * @param {string} stdout - Standard output
 * @param {string} stderr - Standard error
 * @returns {boolean} True if fatal errors detected
 */
export function hasFatalErrors(stdout = '', stderr = '') {
  return /(^|\s)error:/i.test(stdout) || /(^|\s)error:/i.test(stderr);
}

/**
 * Export all API functions as default object
 */
export default {
  generateManifestDiagram,
  generateHelmDiagram,
  generateHelmfileDiagram,
  submitFeedback,
  hasFatalErrors,
};

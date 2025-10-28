import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';

/**
 * Format timestamp to readable string
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = typeof timestamp === 'string' 
      ? parseISO(timestamp.replace('Z', '+00:00'))
      : new Date(timestamp);
    
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  } catch (error) {
    console.warn('Failed to format timestamp:', timestamp, error);
    return timestamp;
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Class name utility function (re-export clsx for convenience)
 */
export const cn = clsx;

/**
 * Debounce function to limit rapid function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate user input
 * @param {string} input - Input to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateInput = (input, options = {}) => {
  const {
    required = false,
    minLength = 0,
    maxLength = Infinity,
    pattern = null,
  } = options;

  const errors = [];

  if (required && (!input || !input.trim())) {
    errors.push('This field is required');
  }

  if (input && input.length < minLength) {
    errors.push(`Minimum length is ${minLength} characters`);
  }

  if (input && input.length > maxLength) {
    errors.push(`Maximum length is ${maxLength} characters`);
  }

  if (input && pattern && !pattern.test(input)) {
    errors.push('Invalid format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get character count with color coding
 * @param {string} text - Text to count
 * @param {number} maxLength - Maximum allowed length
 * @returns {Object} Count info with styling
 */
export const getCharacterCount = (text = '', maxLength = 1000) => {
  const count = text.length;
  const percentage = (count / maxLength) * 100;
  
  let color = 'text-gray-500';
  if (count > maxLength) {
    color = 'text-red-500';
  } else if (percentage > 80) {
    color = 'text-orange-500';
  } else if (count > 0) {
    color = 'text-green-500';
  }
  
  return {
    count,
    maxLength,
    percentage,
    color,
    isOverLimit: count > maxLength,
  };
};

/**
 * Sleep function for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Handle async operations with error catching
 * @param {Function} asyncFn - Async function to execute
 * @returns {Array} [error, result] tuple
 */
export const safeAsync = async (asyncFn) => {
  try {
    const result = await asyncFn();
    return [null, result];
  } catch (error) {
    return [error, null];
  }
};
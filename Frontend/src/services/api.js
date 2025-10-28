import axios from 'axios';

const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: DEFAULT_API_BASE.replace(/\/$/, ''), // Remove trailing slash
  timeout: 180000, // 3 minutes timeout for research queries
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle common error cases
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The server might be overloaded.');
    }
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      let message = 'Server error occurred';
      
      if (error.response.data?.detail) {
        message = error.response.data.detail;
      } else if (status >= 500) {
        message = 'Internal server error. Please try again later.';
      } else if (status === 404) {
        message = 'Resource not found.';
      } else if (status === 400) {
        message = 'Invalid request. Please check your input.';
      }
      
      throw new Error(`${message} (${status})`);
    } else if (error.request) {
      // Network error
      throw new Error('Cannot connect to server. Please check if the server is running.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

/**
 * Fetch user's research history
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of session objects
 */
export const getHistory = async (userId) => {
  try {
    const response = await api.get(`/api/history/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch history:', error.message);
    throw error;
  }
};

/**
 * Submit a research query
 * @param {number} userId - User ID
 * @param {string} query - Research query
 * @returns {Promise<Object>} Response object with session_id
 */
export const postChat = async (userId, query) => {
  if (!query?.trim()) {
    throw new Error('Please enter a research query.');
  }
  
  if (query.length > 1000) {
    throw new Error('Query is too long. Please limit to 1000 characters.');
  }
  
  try {
    const response = await api.post('/api/chat', {
      user_id: userId,
      query: query.trim(),
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to submit chat:', error.message);
    throw error;
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw error;
  }
};

// Export the configured axios instance for custom requests
export { api };
export default api;
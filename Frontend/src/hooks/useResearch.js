import { useState, useEffect, useCallback } from 'react';
import { getHistory, postChat } from '../services/api';
import { safeAsync } from '../utils/helpers';

const DEFAULT_USER_ID = parseInt(import.meta.env.VITE_USER_ID || '1', 10);

/**
 * Custom hook for managing research sessions and chat functionality
 */
export const useResearch = () => {
  const [userId, setUserId] = useState(DEFAULT_USER_ID);
  const [history, setHistory] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Get selected session from history
  const selectedSession = history.find(session => session.session_id === selectedSessionId) || null;

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetch user's research history
   */
  const refreshHistory = useCallback(async (selectSessionId = null) => {
    setLoading(true);
    clearError();

    const [err, data] = await safeAsync(() => getHistory(userId));
    
    if (err) {
      setError(err.message);
      setHistory([]);
    } else {
      setHistory(data || []);
      
      // Auto-select session logic
      if (selectSessionId) {
        setSelectedSessionId(selectSessionId);
      } else if (!selectedSessionId && data?.length > 0) {
        setSelectedSessionId(data[0].session_id);
      } else if (selectedSessionId && !data?.find(s => s.session_id === selectedSessionId)) {
        // Selected session no longer exists, select first available
        setSelectedSessionId(data?.length > 0 ? data[0].session_id : null);
      }
    }
    
    setLoading(false);
  }, [userId, selectedSessionId, clearError]);

  /**
   * Submit a new research query
   */
  const submitQuery = useCallback(async (query) => {
    if (!query?.trim()) {
      setError('Please enter a research query.');
      return null;
    }

    setSubmitting(true);
    clearError();

    const [err, result] = await safeAsync(() => postChat(userId, query));
    
    if (err) {
      setError(err.message);
      setSubmitting(false);
      return null;
    }

    // Refresh history and select the new session
    await refreshHistory(result?.session_id);
    setSubmitting(false);
    
    return result;
  }, [userId, refreshHistory, clearError]);

  /**
   * Select a different session
   */
  const selectSession = useCallback((sessionId) => {
    setSelectedSessionId(sessionId);
    clearError();
  }, [clearError]);

  /**
   * Update user ID
   */
  const updateUserId = useCallback((newUserId) => {
    if (newUserId !== userId) {
      setUserId(newUserId);
      setHistory([]);
      setSelectedSessionId(null);
      clearError();
    }
  }, [userId, clearError]);

  // Auto-refresh history when user ID changes
  useEffect(() => {
    refreshHistory();
  }, [userId]); // Note: don't include refreshHistory to avoid infinite loop

  return {
    // State
    userId,
    history,
    selectedSession,
    selectedSessionId,
    loading,
    error,
    submitting,
    
    // Actions
    refreshHistory,
    submitQuery,
    selectSession,
    updateUserId,
    clearError,
  };
};
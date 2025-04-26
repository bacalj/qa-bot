import { useState } from 'react';
import { CONSTANTS } from '../utils/bot-utils';

/**
 * Custom hook to handle API queries and stream responses
 * @param {string} apiKey - API key for authentication
 * @returns {Object} - Query handling functions and state
 */
const useQueryHandler = (apiKey) => {
  const [hasApiError, setHasApiError] = useState(false);

  const fetchAndStreamResponse = async (params) => {
    // POST question to the QA API
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey
        },
        body: JSON.stringify({ query: params.userInput })
      };

      const response = await fetch(CONSTANTS.queryEndpointUrl, requestOptions);
      const body = await response.json();
      const text = body.response;

      for (let i = 0; i < text.length; i++) {
        await params.streamMessage(text.slice(0, i + 1));
        await new Promise(resolve => setTimeout(resolve, 2));
      }

      return { success: true };
    } catch (error) {
      console.error('Error fetching and streaming response:', error);
      setHasApiError(true);
      return { error: true };
    }
  };

  const resetError = () => setHasApiError(false);

  return {
    fetchAndStreamResponse,
    hasApiError,
    resetError
  };
};

export default useQueryHandler;
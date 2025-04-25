import { useState } from 'react';
import { CONSTANTS } from '../utils/bot-utils';

/**
 * Custom hook to handle API queries and stream responses
 * @param {string} apiKey - API key for authentication
 * @returns {Object} - Query handling functions and state
 */
const useQueryHandler = (apiKey) => {
  const [hasError, setHasError] = useState(false);

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

      const response = await fetch(CONSTANTS.queryEndpoint, requestOptions);
      const body = await response.json();
      const text = body.response;

      for (let i = 0; i < text.length; i++) {
        await params.streamMessage(text.slice(0, i + 1));
        await new Promise(resolve => setTimeout(resolve, 2));
      }
    } catch (error) {
      await params.injectMessage("Unable to contact the Q&A Bot. Please try again later.");
      setHasError(true);
    }
  };

  const resetError = () => setHasError(false);

  return {
    fetchAndStreamResponse,
    hasError,
    resetError
  };
};

export default useQueryHandler;
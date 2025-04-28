import { CONSTANTS } from '../utils/bot-utils';

/**
 * Custom hook to handle API queries and stream responses
 * @param {string} apiKey - API key for authentication
 * @returns {Object} - Query handling function
 */
const useQueryHandler = (apiKey) => {
  const fetchAndStreamResponse = async (params) => {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const body = await response.json();
      const text = body.response;

      for (let i = 0; i < text.length; i++) {
        await params.streamMessage(text.slice(0, i + 1));
        await new Promise(resolve => setTimeout(resolve, 2));
      }

      return text;
    } catch (error) {
      console.error('Error fetching and streaming response:', error);
      return { error: true };
    }
  };

  return { fetchAndStreamResponse };
};

export default useQueryHandler;
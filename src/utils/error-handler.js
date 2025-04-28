/**
 * Handles different types of errors that can occur in the bot flow
 * @param {Error|Object} error - The error object or API response
 * @returns {string} - User-friendly error message
 */
export const handleBotError = (error) => {
  // Handle API error response
  if (error?.error) {
    return "I'm having trouble connecting to the server.";
  }

  // TODO: we are optimistic that errors will come back to match this shape
  // But we need to confirm once we are talking to API
  // Handle empty or invalid response
  if (!error || typeof error !== 'string') {
    return "I received an unexpected response. Please try rephrasing your question.";
  }

  // Handle network errors
  if (error.message?.includes('Failed to fetch')) {
    return "I can't reach the server right now.";
  }

  // Handle HTTP errors
  if (error.message?.includes('HTTP error')) {
    return "The server returned an error.";
  }

  // Default error message for unexpected errors
  return "I encountered an unexpected error.";
};
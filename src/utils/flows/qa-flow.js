import { handleBotError } from '../error-handler';

/**
 * Creates the Q&A conversation flow
 *
 * @param {Object} params Configuration
 * @param {Function} params.fetchAndStreamResponse Function to fetch and stream responses
 * @returns {Object} Q&A flow configuration
 */
export const createQAFlow = ({ fetchAndStreamResponse }) => {
  return {
    go_ahead_and_ask: {
      message: "Great. Please type your question.",
      path: "qa_loop"
    },
    qa_loop: {
      message: async (chatState) => {
        try {
          const result = await fetchAndStreamResponse(chatState);

          // Handle API error response
          if (result?.error) {
            return handleBotError(result);
          }

          return result;
        } catch (error) {
          console.error('Error in bot flow:', error);
          return handleBotError(error);
        }
      },
      options: ["Back to Main Menu"],
      chatDisabled: true,
      path: "start"
    }
  };
};
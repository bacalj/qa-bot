/**
 * Defines the conversation flow for the QA Bot
 *
 * @param {Object} params Configuration parameters
 * @param {Function} params.fetchAndStreamResponse Function to fetch and stream API responses
 * @param {boolean} params.hasApiError Error state from the API handler
 * @param {string} params.welcome Welcome message text
 * @returns {Object} Flow configuration for the ChatBot component
 */
export const createBotFlow = ({ fetchAndStreamResponse, hasApiError, welcome }) => {
    const originalFlow = {
      start: {
        message: welcome,
        path: 'loop'
      },
      loop: {
        message: async (params) => {
          const result = await fetchAndStreamResponse(params);
          if (result?.error) {
            // Give user feedback, react state will have been updated in time for path computation
            return "Unable to contact the Q&A Bot. Please try again later.";
          } else {
            return result;
          }
        },
        path: () => {
          // now we have react state we can refer to
          if (hasApiError) {
            return 'start'
          }
          return 'loop'
        }
      },
    }
    return originalFlow;
  }
/**
 * Defines the conversation flow for the QA Bot
 *
 * @param {Object} params Configuration parameters
 * @param {Function} params.fetchAndStreamResponse Function to fetch and stream API responses
 * @param {boolean} params.hasError Error state from the API handler
 * @param {string} params.welcome Welcome message text
 * @returns {Object} Flow configuration for the ChatBot component
 */
export const createBotFlow = ({ fetchAndStreamResponse, hasError, welcome }) => {
    const originalFlow = {
      start: {
        message: welcome,
        path: 'loop'
      },
      loop: {
        message: async (params) => {
          await fetchAndStreamResponse(params);
        },
        path: () => {
          if (hasError) {
            return 'start'
          }
          return 'loop'
        }
      }
    }

    return originalFlow;
  // const optionsWithPaths = [
  //   {
  //     text: "Ask a question",
  //     path: "qa_loop"
  //   },
  //   {
  //     text: "Submit feedback",
  //     path: "feedback_form"
  //   },
  //   {
  //     text: "Report an issue",
  //     path: "issue_form"
  //   }
  // ];

  // const isExitCommand = (userInput) => {
  //   const input = userInput.toLowerCase();
  //   return input === "menu" || input === "back" || userInput === "Return to main menu";
  // };

  // return {
  //   start: {
  //     message: welcome,
  //     options: optionsWithPaths.map(option => option.text),
  //     path: "process_initial_choice"
  //   },

  //   process_initial_choice: {
  //     path: (params) => {
  //       const selectedOption = optionsWithPaths.find(
  //         option => option.text === params.userInput
  //       );
  //       return selectedOption ? selectedOption.path : "unknown_input";
  //     }
  //   },

  //   qa_loop: {
  //     message: async (params) => {
  //       if (isExitCommand(params.userInput)) {
  //         return "Going back to the main menu...";
  //       }
  //       await fetchAndStreamResponse(params);
  //     },
  //     path: (params) => {
  //       if (isExitCommand(params.userInput)) {
  //         return "start";
  //       }
  //       if (hasError) {
  //         return "start";
  //       }
  //       return "qa_loop";
  //     }
  //   },

  //   feedback_form: {
  //     message: "...implement feedback form...",
  //     options: ["Return to main menu"],
  //     path: (params) => {
  //       if (isExitCommand(params.userInput)) {
  //         return "start";
  //       }
  //       return "start";
  //     }
  //   },

  //   issue_form: {
  //     message: "...implement issue form...",
  //     options: ["Return to main menu"],
  //     path: (params) => {
  //       if (isExitCommand(params.userInput)) {
  //         return "start";
  //       }
  //       return "start";
  //     }
  //   },

  //   unknown_input: {
  //     message: "Does not compute. Returning to main menu...",
  //     transition: { duration: 1000 },
  //     path: "start"
  //   }
  // };
};
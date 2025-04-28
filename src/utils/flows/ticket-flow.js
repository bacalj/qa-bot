/**
 * Creates the help ticket conversation flow
 *
 * @param {Object} params Configuration
 * @param {Object} params.ticketForm Form state for help tickets
 * @param {Function} params.setTicketForm Function to update ticket form
 * @returns {Object} Help ticket flow configuration
 */
export const createTicketFlow = ({ ticketForm = {}, setTicketForm = () => {} }) => {
  return {
    help_ticket: {
      message: "I'll help you create a help ticket.",
      transition: { duration: 500 },
      path: "ask_name"
    },
    ask_name: {
      message: "What is your name?",
      function: (chatState) => {
        setTicketForm({...ticketForm, name: chatState.userInput});
      },
      path: "ask_color"
    },
    ask_color: {
      message: "What is your favorite color?",
      function: (chatState) => {
        setTicketForm({...ticketForm, color: chatState.userInput});
      },
      path: "submit_ticket"
    },
    submit_ticket: {
      message: () => {
        return `Thank you, I have submitted your help ticket with the following information:\nName: ${ticketForm.name}\nFavorite Color: ${ticketForm.color}`;
      },
      options: ["Back to Main Menu"],
      chatDisabled: true,
      path: "start"
    }
  };
};
import { createMainMenuFlow } from './flows/main-menu-flow';
import { createQAFlow } from './flows/qa-flow';
import { createTicketFlow } from './flows/ticket-flow';
import { createFeedbackFlow } from './flows/feedback-flow';
import { createDevTicketFlow } from './flows/dev-ticket-flow';

/**
 * Defines the conversation flow for the QA Bot
 *
 * @param {Object} params Configuration
 * @param {Function} params.fetchAndStreamResponse
 * @param {string} params.welcome Welcome text
 * @param {Object} params.ticketForm Form state for help tickets
 * @param {Function} params.setTicketForm Function to update ticket form
 * @param {Object} params.feedbackForm Form state for feedback
 * @param {Function} params.setFeedbackForm Function to update feedback form
 * @returns {Object} Flow configuration for the ChatBot component
 */
export const createBotFlow = ({
  fetchAndStreamResponse,
  welcome,
  ticketForm = {},
  setTicketForm = () => {},
  feedbackForm = {},
  setFeedbackForm = () => {}
}) => {
  const mainMenuFlow = createMainMenuFlow({
    welcome,
    setTicketForm,
    setFeedbackForm
  });

  const qaFlow = createQAFlow({
    fetchAndStreamResponse
  });

  const ticketFlow = createTicketFlow({
    ticketForm,
    setTicketForm
  });

  const feedbackFlow = createFeedbackFlow({
    feedbackForm,
    setFeedbackForm
  });

  const devTicketFlow = createDevTicketFlow({
    ticketForm,
    setTicketForm
  });

  const flow = {
    ...mainMenuFlow,
    ...qaFlow,
    ...ticketFlow,
    ...feedbackFlow,
    ...devTicketFlow
  };

  return flow;
}
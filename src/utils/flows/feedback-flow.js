/**
 * Creates the feedback conversation flow
 *
 * @param {Object} params Configuration
 * @param {Object} params.feedbackForm Form state for feedback
 * @param {Function} params.setFeedbackForm Function to update feedback form
 * @returns {Object} Feedback flow configuration
 */
import React from 'react';
import FileUploadComponent from '../../components/FileUploadComponent';

/**
 * Builds a Jira Service Desk URL based on form data
 * @param {Object} formData Form data for the ticket
 * @param {string} ticketType Type of ticket to create (default: support)
 * @returns {string} Complete URL for form submission
 */
export const buildServiceDeskUrl = (formData, ticketType = 'support') => {
  const baseUrl = 'https://access-ci.atlassian.net/servicedesk/customer';

  // Map ticket types to their URL segments
  const ticketSegments = {
    support: '/portal/2/group/3/create/17',
    loginAccess: '/portal/2/create/30',
    loginProvider: '/portal/2/create/31'
  };

  const segment = ticketSegments[ticketType] || ticketSegments.support;

  // Build query params from form data
  const params = new URLSearchParams();
  Object.entries(formData).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  return `${baseUrl}${segment}?${params.toString()}`;
};

/**
 * Prepares data for future API submission
 * @param {Object} formData Form data for the ticket
 * @param {string} ticketType Type of ticket to create
 * @returns {Object} Formatted data for API submission
 */
export const prepareApiSubmission = (formData, ticketType = 'support') => {
  // Map ticket types to their requestTypeId values
  const requestTypeIds = {
    support: 17,
    loginAccess: 30,
    loginProvider: 31
  };

  return {
    serviceDeskId: 2,
    requestTypeId: requestTypeIds[ticketType] || requestTypeIds.support,
    requestFieldValues: {
      ...formData
    }
  };
};

/**
 * TODO: For next task - Implement help request form submission
 *
 * This feedback form implementation uses a Google Forms technique where we:
 * 1. Generate the appropriate URL with form parameters
 * 2. Open it in a new tab or submit via fetch/UrlFetchApp
 *
 * For the help request form, we need to adapt this approach to work with Jira Service Desk:
 * - Base URL: https://access-ci.atlassian.net/servicedesk/customer/portal
 * - Different segments based on ticket type:
 *   - Support ticket: /2/group/3/create/17
 *   - Login ACCESS: /2/create/30
 *   - Login Resource Provider: /2/create/31
 *
 * Fields to map from our form to Jira form:
 * - customfield_10103: email address
 * - customfield_10108: user name
 * - summary: issue summary
 * - description: detailed description
 * - priority: ticket priority
 * - Other fields as needed
 *
 * Will need to identify all required fields and build URL parameters accordingly.
 */

export const createFeedbackFlow = ({
  feedbackForm = {},
  setFeedbackForm = () => {}
}) => {
  // Store the FileUploadComponent JSX in a variable for better readability
  const fileUploadElement = (
    <FileUploadComponent
      onFileUpload={(files) =>
        setFeedbackForm({
          ...feedbackForm,
          uploadedFiles: files
        })
      }
    />
  );

  return {
    feedback: {
      message: "We appreciate your feedback about ACCESS.",
      function: (chatState) => setFeedbackForm({...feedbackForm, feedback: chatState.userInput}),
      transition: { duration: 500 },
      path: "feedback_please_tell_us_more"
    },
    feedback_please_tell_us_more: {
      message: "Please provide your detailed feedback.",
      function: (chatState) => setFeedbackForm({...feedbackForm, feedback: chatState.userInput}),
      path: "feedback_upload"
    },
    feedback_upload: {
      message: "Would you like to upload a screenshot or file to help us better understand your feedback?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (chatState) => setFeedbackForm({...feedbackForm, upload: chatState.userInput}),
      path: (chatState) => chatState.userInput === "Yes"
        ? "feedback_upload_yes"
        : "feedback_contact"
    },
    feedback_upload_yes: {
      message: "Please upload a screenshot or file to help us better understand your feedback.",
      component: fileUploadElement,
      options: ["Continue"],
      chatDisabled: true,
      function: (chatState) => setFeedbackForm({...feedbackForm, uploadConfirmed: true}),
      path: "feedback_contact"
    },
    feedback_contact: {
      message: "Would you like to provide your name and email address for follow up?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (chatState) => setFeedbackForm({...feedbackForm, contact: chatState.userInput}),
      path: (chatState) => chatState.userInput === "Yes"
        ? "feedback_contact_yes"
        : "feedback_summary"
    },
    feedback_contact_yes: {
      message: "Please provide your name and email address.",
      function: (chatState) => setFeedbackForm({...feedbackForm, contact: chatState.userInput}),
      path: "feedback_summary"
    },
    feedback_summary: {
      message: () => {
        return `Thank you for sharing your feedback!`;
      },
      options: ["Submit Feedback", "Back to Main Menu"],
      chatDisabled: true,
      function: (chatState) => {
        if (chatState.userInput === "Submit Feedback") {
          // Prepare form data from feedback inputs
          const formData = {
            summary: "Feedback from ACCESS Help",
            description: feedbackForm.feedback || "",
            customfield_10103: feedbackForm.contact ? feedbackForm.contact.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) : "",
            customfield_10108: feedbackForm.contact ? feedbackForm.contact.replace(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, "").trim() : ""
          };

          // Build the URL
          const url = buildServiceDeskUrl(formData, 'support');

          // Log for debugging
          console.log("Form submission:", formData);
          console.log("Generated URL:", url);

          // Open in new tab
          window.open(url, '_blank');

          // Also prepare API data for future use
          const apiData = prepareApiSubmission(formData, 'support');
          console.log("API submission data:", apiData);
        }
      },
      path: "start"
    }
  };
};
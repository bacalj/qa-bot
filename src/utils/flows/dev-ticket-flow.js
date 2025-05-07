/**
 * Creates the dev ticket conversation flow
 *
 * @param {Object} params Configuration
 * @param {Object} params.ticketForm Form state for help tickets
 * @param {Function} params.setTicketForm Function to update ticket form
 * @returns {Object} Dev ticket flow configuration
 */
import React from 'react';
import FileUploadComponent from '../../components/FileUploadComponent';
import { prepareApiSubmission, sendPreparedDataToProxy } from '../bot-utils';
import { TICKET_FIELDS } from '../field-definitions';

export const createDevTicketFlow = ({ ticketForm = {}, setTicketForm = () => {} }) => {
  const fileUploadElement = (
    <FileUploadComponent
      onFileUpload={(files) =>
        setTicketForm({
          ...ticketForm,
          uploadedFiles: files
        })
      }
    />
  );

  return {
    dev_ticket_email: {
      message: "What is your email?",
      function: (chatState) => setTicketForm({...ticketForm, email: chatState.userInput}),
      path: "dev_ticket_accessid"
    },
    dev_ticket_accessid: {
      message: "What is your ACCESS ID?",
      function: (chatState) => setTicketForm({...ticketForm, accessid: chatState.userInput}),
      path: "dev_ticket_summary"
    },
    dev_ticket_summary: {
      message: "Please provide a summary of your issue.",
      function: (chatState) => setTicketForm({...ticketForm, summary: chatState.userInput}),
      path: "dev_ticket_description"
    },
    dev_ticket_description: {
      message: "Please describe your issue in detail.",
      function: (chatState) => setTicketForm({...ticketForm, description: chatState.userInput}),
      path: "dev_ticket_attachment"
    },
    dev_ticket_attachment: {
      message: "Would you like to attach a file?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (chatState) => setTicketForm({...ticketForm, wantsAttachment: chatState.userInput}),
      path: (chatState) => chatState.userInput === "Yes"
        ? "dev_ticket_upload"
        : "dev_ticket_summary"
    },
    dev_ticket_upload: {
      message: "Please upload your file.",
      component: fileUploadElement,
      options: ["Continue"],
      chatDisabled: true,
      function: () => setTicketForm({...ticketForm, uploadConfirmed: true}),
      path: "dev_ticket_summary"
    },
    dev_ticket_summary: {
      message: () => {
        let fileInfo = '';
        if (ticketForm.uploadedFiles && ticketForm.uploadedFiles.length > 0) {
          fileInfo = `\nAttachments: ${ticketForm.uploadedFiles.length} file(s) attached`;
        }

        return `Thank you for providing your issue details. Here's a summary:\n\n` +
               `Email: ${ticketForm.email || 'Not provided'}\n` +
               `ACCESS ID: ${ticketForm.accessid || 'Not provided'}\n` +
               `Summary: ${ticketForm.summary || 'Not provided'}\n` +
               `Description: ${ticketForm.description || 'Not provided'}${fileInfo}\n\n` +
               `Would you like to submit this ticket?`;
      },
      options: ["Submit Ticket", "Back to Main Menu"],
      chatDisabled: true,
      function: (chatState) => {
        if (chatState.userInput === "Submit Ticket") {
          // Prepare form data
          const formData = {
            email: ticketForm.email || "",
            accessid: ticketForm.accessid || "",
            summary: ticketForm.summary || "",
            description: ticketForm.description || ""
          };

          // Prepare API submission data
          const apiData = prepareApiSubmission(
            formData,
            'dev',
            ticketForm.uploadedFiles || []
          );
          console.log("| 🌎 API submission data for dev ticket:", apiData);

          // Convert to async IIFE to handle awaiting the Promise
          (async () => {
            try {
              const proxyResponse = await sendPreparedDataToProxy(apiData, 'dev-create-support-ticket');
              console.log("| 🌎 Dev ticket proxy response:", proxyResponse);
            } catch (error) {
              console.error("| ❌ Error sending dev ticket data to proxy:", error);
            }
          })();
        }
      },
      path: "start"
    }
  };
};
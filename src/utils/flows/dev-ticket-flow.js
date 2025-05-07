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
    dev_ticket: {
      message: "What type of development ticket would you like to create?",
      options: [
        "Bug Report",
        "Feature Request",
        "Other Development Issue"
      ],
      chatDisabled: true,
      function: (chatState) => {
        setTicketForm({...ticketForm, ticketType: chatState.userInput});
      },
      path: (chatState) => {
        if (chatState.userInput === "Bug Report") {
          return "dev_ticket_email";
        } else if (chatState.userInput === "Feature Request") {
          return "dev_ticket_email";
        } else if (chatState.userInput === "Other Development Issue") {
          return "dev_ticket_email";
        }
        return "dev_ticket";
      }
    },
    dev_ticket_email: {
      message: "What is your email?",
      function: (chatState) => setTicketForm({...ticketForm, email: chatState.userInput}),
      path: "dev_ticket_accessid"
    },
    dev_ticket_accessid: {
      message: "What is your ACCESS ID?",
      function: (chatState) => setTicketForm({...ticketForm, accessId: chatState.userInput}),
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
        : "dev_ticket_grand_summary"
    },
    dev_ticket_upload: {
      message: "Please upload your file.",
      component: fileUploadElement,
      options: ["Continue"],
      chatDisabled: true,
      function: () => setTicketForm({...ticketForm, uploadConfirmed: true}),
      path: "dev_ticket_grand_summary"
    },
    dev_ticket_grand_summary: {
      message: () => {
        let fileInfo = '';
        if (ticketForm.uploadedFiles && ticketForm.uploadedFiles.length > 0) {
          fileInfo = `\nAttachments: ${ticketForm.uploadedFiles.length} file(s) attached`;
        }

        return `Thank you for providing your issue details. Here's a summary:\n\n` +
               `Email: ${ticketForm.email || 'Not provided'}\n` +
               `ACCESS ID: ${ticketForm.accessId || 'Not provided'}\n` +
               `Summary: ${ticketForm.summary || 'Not provided'}\n` +
               `Description: ${ticketForm.description || 'Not provided'}${fileInfo}\n\n` +
               `Would you like to submit this ticket?`;
      },
      options: ["Submit Ticket", "Back to Main Menu"],
      chatDisabled: true,
      function: (chatState) => {
        if (chatState.userInput === "Submit Ticket") {
          // Prepare form data using JSM schema field IDs
          const formData = {
            summary: ticketForm.summary || "",
            description: ticketForm.description || "",
            customfield_10124: ticketForm.email || "", // TODO: send semantic keys - see TODO in other repo
            customfield_10091: ticketForm.accessId || "" // TODO: send semantic keys - see TODO in other repo
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
              console.log("| ...put this in the chat, like visit your ticket here... (we have info on ticket in)", proxyResponse.data.jsmResponse);
              // TODO pull the id from the response and construct a link like
              // https://digitalblockarea.atlassian.net/servicedesk/customer/portal/1/TJ-14
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
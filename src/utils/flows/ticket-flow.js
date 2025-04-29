/**
 * Creates the help ticket conversation flow
 *
 * @param {Object} params Configuration
 * @param {Object} params.ticketForm Form state for help tickets
 * @param {Function} params.setTicketForm Function to update ticket form
 * @returns {Object} Help ticket flow configuration
 */
import React from 'react';
import FileUploadComponent from '../../components/FileUploadComponent';
import { buildServiceDeskUrl, prepareApiSubmission } from '../bot-utils';

export const createTicketFlow = ({ ticketForm = {}, setTicketForm = () => {} }) => {
  // Store the FileUploadComponent JSX in a variable for better readability
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
    help_ticket: {
      message: "What is your help ticket related to?",
      options: [
        "Logging into ACCESS website",
        "Logging into affiliated infrastructure",
        "Another question"
      ],
      chatDisabled: true,
      function: (chatState) => {
        setTicketForm({...ticketForm, ticketType: chatState.userInput});
      },
      path: (chatState) => {
        if (chatState.userInput === "Logging into ACCESS website") {
          return "access_help";
        } else if (chatState.userInput === "Logging into affiliated infrastructure") {
          return "affiliated_help";
        } else if (chatState.userInput === "Another question") {
          return "general_help";
        }
        return "help_ticket";
      }
    },

    // ACCESS Login Help Path
    access_help: {
      message: "If you're having trouble logging into the ACCESS website, here are some common issues:\n\n" +
               "• Make sure you're using a supported browser (Chrome, Firefox, Safari)\n" +
               "• Clear your browser cookies and cache\n" +
               "• Check if you're using the correct identity provider\n\n" +
               "Would you like to submit a help ticket for ACCESS login issues?",
      options: ["Submit ACCESS Login Ticket", "Back to Main Menu"],
      chatDisabled: true,
      path: (chatState) =>
        chatState.userInput === "Submit ACCESS Login Ticket"
          ? "access_login_email"
          : "start"
    },

    // Affiliated/Resource Provider Login Help Path
    affiliated_help: {
      message: "If you're having trouble logging into an affiliated infrastructure or resource provider, here are some common issues:\n\n" +
               "• Ensure your allocation is active\n" +
               "• Confirm you have the correct username for that resource\n" +
               "• Check if the resource is undergoing maintenance\n\n" +
               "Would you like to submit a help ticket for resource provider login issues?",
      options: ["Submit Resource Login Ticket", "Back to Main Menu"],
      chatDisabled: true,
      path: (chatState) =>
        chatState.userInput === "Submit Resource Login Ticket"
          ? "affiliated_login_email"
          : "start"
    },

    // General Help Ticket Path
    general_help: {
      message: "I can help you create a general support ticket for any ACCESS-related questions or issues.\n\n" +
               "Would you like to submit a general help ticket?",
      options: ["Submit General Help Ticket", "Back to Main Menu"],
      chatDisabled: true,
      path: (chatState) =>
        chatState.userInput === "Submit General Help Ticket"
          ? "general_help_email"
          : "start"
    },

    // ACCESS Login Form Flow
    access_login_email: {
      message: "What is your email?",
      function: (chatState) => setTicketForm({...ticketForm, email: chatState.userInput}),
      path: "access_login_name"
    },
    access_login_name: {
      message: "What is your name?",
      function: (chatState) => setTicketForm({...ticketForm, name: chatState.userInput}),
      path: "access_login_accessid"
    },
    access_login_accessid: {
      message: "What is your ACCESS ID?",
      function: (chatState) => setTicketForm({...ticketForm, accessid: chatState.userInput}),
      path: "access_login_description"
    },
    access_login_description: {
      message: "Please describe the issue you're having logging in.",
      function: (chatState) => setTicketForm({...ticketForm, description: chatState.userInput}),
      path: "access_login_identity"
    },
    access_login_identity: {
      message: "Which identity provider were you using? (e.g., InCommon, Google, ORCID)",
      function: (chatState) => setTicketForm({...ticketForm, identityProvider: chatState.userInput}),
      path: "access_login_browser"
    },
    access_login_browser: {
      message: "Which browser were you using?",
      function: (chatState) => setTicketForm({...ticketForm, browser: chatState.userInput}),
      path: "access_login_attachment"
    },
    access_login_attachment: {
      message: "Would you like to attach a screenshot?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (chatState) => setTicketForm({...ticketForm, wantsAttachment: chatState.userInput}),
      path: (chatState) => chatState.userInput === "Yes"
        ? "access_login_upload"
        : "access_login_summary"
    },
    access_login_upload: {
      message: "Please upload your screenshot.",
      component: fileUploadElement,
      options: ["Continue"],
      chatDisabled: true,
      function: () => setTicketForm({...ticketForm, uploadConfirmed: true}),
      path: "access_login_summary"
    },
    access_login_summary: {
      message: () => {
        let fileInfo = '';
        if (ticketForm.uploadedFiles && ticketForm.uploadedFiles.length > 0) {
          fileInfo = `\nAttachments: ${ticketForm.uploadedFiles.length} file(s) attached`;
        }

        return `Thank you for providing your ACCESS login issue details. Here's a summary:\n\n` +
               `Name: ${ticketForm.name || 'Not provided'}\n` +
               `Email: ${ticketForm.email || 'Not provided'}\n` +
               `ACCESS ID: ${ticketForm.accessid || 'Not provided'}\n` +
               `Identity Provider: ${ticketForm.identityProvider || 'Not provided'}\n` +
               `Browser: ${ticketForm.browser || 'Not provided'}\n` +
               `Issue Description: ${ticketForm.description || 'Not provided'}${fileInfo}\n\n` +
               `Would you like to submit this ticket?`;
      },
      options: ["Submit Ticket", "Back to Main Menu"],
      chatDisabled: true,
      function: (chatState) => {
        if (chatState.userInput === "Submit Ticket") {
          // Prepare form data
          const formData = {
            email: ticketForm.email || "",
            customfield_10108: ticketForm.name || "",
            customfield_10103: ticketForm.accessid || "",
            description: ticketForm.description || "",
            summary: "ACCESS Login Issue",
            // Add proforma fields if they exist
            identity_provider: ticketForm.identityProvider || "",
            browser: ticketForm.browser || ""
          };

          // Build the URL
          const url = buildServiceDeskUrl(formData, 'loginAccess');

          // Log for debugging
          console.log("Form submission:", formData);
          console.log("Generated URL:", url);

          // Open in new tab
          window.open(url, '_blank');

          // Also prepare API submission data for future implementation
          const apiData = prepareApiSubmission(
            formData,
            'loginAccess',
            ticketForm.uploadedFiles || []
          );
          console.log("API submission data:", apiData);
        }
      },
      path: "start"
    },

    // Affiliated/Resource Provider Login Form Flow
    affiliated_login_email: {
      message: "What is your email?",
      function: (chatState) => setTicketForm({...ticketForm, email: chatState.userInput}),
      path: "affiliated_login_name"
    },
    affiliated_login_name: {
      message: "What is your name?",
      function: (chatState) => setTicketForm({...ticketForm, name: chatState.userInput}),
      path: "affiliated_login_accessid"
    },
    affiliated_login_accessid: {
      message: "What is your ACCESS ID?",
      function: (chatState) => setTicketForm({...ticketForm, accessid: chatState.userInput}),
      path: "affiliated_login_resource"
    },
    affiliated_login_resource: {
      message: "Which ACCESS resource are you trying to access?",
      function: (chatState) => setTicketForm({...ticketForm, resource: chatState.userInput}),
      path: "affiliated_login_userid"
    },
    affiliated_login_userid: {
      message: "What is your user ID at the resource?",
      function: (chatState) => setTicketForm({...ticketForm, userIdResource: chatState.userInput}),
      path: "affiliated_login_description"
    },
    affiliated_login_description: {
      message: "Please describe the issue you're having logging in.",
      function: (chatState) => setTicketForm({...ticketForm, description: chatState.userInput}),
      path: "affiliated_login_attachment"
    },
    affiliated_login_attachment: {
      message: "Would you like to attach a screenshot?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (chatState) => setTicketForm({...ticketForm, wantsAttachment: chatState.userInput}),
      path: (chatState) => chatState.userInput === "Yes"
        ? "affiliated_login_upload"
        : "affiliated_login_summary"
    },
    affiliated_login_upload: {
      message: "Please upload your screenshot.",
      component: fileUploadElement,
      options: ["Continue"],
      chatDisabled: true,
      function: () => setTicketForm({...ticketForm, uploadConfirmed: true}),
      path: "affiliated_login_summary"
    },
    affiliated_login_summary: {
      message: () => {
        let fileInfo = '';
        if (ticketForm.uploadedFiles && ticketForm.uploadedFiles.length > 0) {
          fileInfo = `\nAttachments: ${ticketForm.uploadedFiles.length} file(s) attached`;
        }

        return `Thank you for providing your resource login issue details. Here's a summary:\n\n` +
               `Name: ${ticketForm.name || 'Not provided'}\n` +
               `Email: ${ticketForm.email || 'Not provided'}\n` +
               `ACCESS ID: ${ticketForm.accessid || 'Not provided'}\n` +
               `Resource: ${ticketForm.resource || 'Not provided'}\n` +
               `Resource User ID: ${ticketForm.userIdResource || 'Not provided'}\n` +
               `Issue Description: ${ticketForm.description || 'Not provided'}${fileInfo}\n\n` +
               `Would you like to submit this ticket?`;
      },
      options: ["Submit Ticket", "Back to Main Menu"],
      chatDisabled: true,
      function: (chatState) => {
        if (chatState.userInput === "Submit Ticket") {
          // Prepare form data
          const formData = {
            email: ticketForm.email || "",
            customfield_10108: ticketForm.name || "",
            customfield_10103: ticketForm.accessid || "",
            customfield_10110: ticketForm.resource || "",
            description: ticketForm.description || "",
            summary: "Resource Provider Login Issue",
            // Add proforma fields if they exist
            user_id_resource: ticketForm.userIdResource || ""
          };

          // Build the URL
          const url = buildServiceDeskUrl(formData, 'loginProvider');

          // Log for debugging
          console.log("Form submission:", formData);
          console.log("Generated URL:", url);

          // Open in new tab
          window.open(url, '_blank');

          // Also prepare API submission data for future implementation
          const apiData = prepareApiSubmission(
            formData,
            'loginProvider',
            ticketForm.uploadedFiles || []
          );
          console.log("API submission data:", apiData);
        }
      },
      path: "start"
    },

    // General Help Ticket Form Flow
    general_help_email: {
      message: "What is your email address?",
      function: (chatState) => setTicketForm({...ticketForm, email: chatState.userInput}),
      path: "general_help_accessid"
    },
    general_help_accessid: {
      message: "What is your ACCESS ID?",
      function: (chatState) => setTicketForm({...ticketForm, accessid: chatState.userInput}),
      path: "general_help_name"
    },
    general_help_name: {
      message: "What is your name?",
      function: (chatState) => setTicketForm({...ticketForm, name: chatState.userInput}),
      path: "general_help_summary"
    },
    general_help_summary: {
      message: "Please summarize your issue.",
      function: (chatState) => setTicketForm({...ticketForm, summary: chatState.userInput}),
      path: "general_help_category"
    },
    general_help_category: {
      message: "What type of issue are you experiencing?",
      options: [
        "User Account Question",
        "Allocation Question",
        "User Support Question",
        "CSSN/CCEP Question",
        "Training Question",
        "Metrics Question",
        "OnDemand Question",
        "Pegasus Question",
        "XDMOD Question"
      ],
      chatDisabled: true,
      function: (chatState) => setTicketForm({...ticketForm, category: chatState.userInput}),
      path: "general_help_description"
    },
    general_help_description: {
      message: "Please provide significant details about your issue.",
      function: (chatState) => setTicketForm({...ticketForm, description: chatState.userInput}),
      path: "general_help_priority"
    },
    general_help_priority: {
      message: "Please select a priority for your issue:",
      options: ["Lowest", "Low", "Medium", "High", "Highest"],
      chatDisabled: true,
      function: (chatState) => setTicketForm({...ticketForm, priority: chatState.userInput.toLowerCase()}),
      path: "general_help_attachment"
    },
    general_help_attachment: {
      message: "Would you like to attach a file to your ticket?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (chatState) => setTicketForm({...ticketForm, wantsAttachment: chatState.userInput}),
      path: (chatState) => chatState.userInput === "Yes"
        ? "general_help_upload"
        : "general_help_resource"
    },
    general_help_upload: {
      message: "Please upload your file.",
      component: fileUploadElement,
      options: ["Continue"],
      chatDisabled: true,
      function: () => setTicketForm({...ticketForm, uploadConfirmed: true}),
      path: "general_help_resource"
    },
    general_help_resource: {
      message: "Does your problem involve an ACCESS Resource?",
      options: ["Yes", "No"],
      chatDisabled: true,
      function: (chatState) => setTicketForm({...ticketForm, involvesResource: chatState.userInput.toLowerCase()}),
      path: "general_help_keywords"
    },
    general_help_keywords: {
      message: "Please select any relevant keywords to help us direct your ticket (select one or type your own):",
      options: [
        "C, C++",
        "Abaqus",
        "Algorithms",
        "API",
        "Bash",
        "CloudLab",
        "Docker",
        "Hadoop",
        "Jupyter",
        "MatLab",
        "VPN",
        "XML",
        "None of the above"
      ],
      chatDisabled: false,
      function: (chatState) => setTicketForm({...ticketForm, keywords: chatState.userInput}),
      path: "general_help_ticket_summary"
    },
    general_help_ticket_summary: {
      message: () => {
        let fileInfo = '';
        if (ticketForm.uploadedFiles && ticketForm.uploadedFiles.length > 0) {
          fileInfo = `\nAttachments: ${ticketForm.uploadedFiles.length} file(s) attached`;
        }

        return `Thank you for providing your issue details. Here's a summary:\n\n` +
               `Name: ${ticketForm.name || 'Not provided'}\n` +
               `Email: ${ticketForm.email || 'Not provided'}\n` +
               `ACCESS ID: ${ticketForm.accessid || 'Not provided'}\n` +
               `Issue Summary: ${ticketForm.summary || 'Not provided'}\n` +
               `Category: ${ticketForm.category || 'Not provided'}\n` +
               `Priority: ${ticketForm.priority || 'Not provided'}\n` +
               `Keywords: ${ticketForm.keywords || 'Not provided'}\n` +
               `Issue Description: ${ticketForm.description || 'Not provided'}${fileInfo}\n\n` +
               `Would you like to submit this ticket?`;
      },
      options: ["Submit Ticket", "Back to Main Menu"],
      chatDisabled: true,
      function: (chatState) => {
        if (chatState.userInput === "Submit Ticket") {
          // Prepare form data
          const formData = {
            email: ticketForm.email || "",
            customfield_10103: ticketForm.accessid || "",
            customfield_10108: ticketForm.name || "",
            summary: ticketForm.summary || "General Support Ticket",
            customfield_10111: ticketForm.category || "",
            description: ticketForm.description || "",
            priority: ticketForm.priority || "medium",
            access_resource: ticketForm.involvesResource || "no",
            direct_ticket: ticketForm.keywords === "None of the above" ? "" : ticketForm.keywords || ""
          };

          // Build the URL
          const url = buildServiceDeskUrl(formData, 'support');

          // Log for debugging
          console.log("Form submission:", formData);
          console.log("Generated URL:", url);

          // Open in new tab
          window.open(url, '_blank');

          // Also prepare API submission data for future implementation
          const apiData = prepareApiSubmission(
            formData,
            'support',
            ticketForm.uploadedFiles || []
          );
          console.log("API submission data:", apiData);
        }
      },
      path: "start"
    }
  };
};
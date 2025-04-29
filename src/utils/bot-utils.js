// Constants for the QA Bot
export const CONSTANTS = {
  // URLs
  queryEndpointUrl: 'https://access-ai.ccs.uky.edu/api/query',
  avatarUrl: 'https://support.access-ci.org/themes/contrib/asp-theme/images/icons/ACCESS-arrrow.svg',
  aboutToolUrl: 'https://support.access-ci.org/tools/access-qa-tool',
  feedbackUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeWnE1r738GU1u_ri3TRpw9dItn6JNPi7-FH7QFB9bAHSVN0w/viewform',

  // Text content
  aboutToolText: 'about this tool',
  feedbackText: 'give us feedback',
  headerTitleText: 'ACCESS Q&A Bot',
  disabledPlaceholderText: 'Please log in to ask questions.',
  tooltipText: 'Ask me about ACCESS! 😊',

  // component strings for composing form link urls
  serviceFormBaseUrl: "https://access-ci.atlassian.net/servicedesk/customer/portal",
  supportTicketSegment: "/2/group/3/create/17",
  cantLoginAccessSegment: "/2/create/30",
  cantLoginResourceProviderSegment: "/2/create/31",
  // TODO: I think we need a dedicated path for feedbackSegment
  // As a workaround we route feedback data to corresponding fields
  // in the standard support ticket form
  feedbackSegment: "/2/group/3/create/17"
};


// Default props for the QA Bot
export const DEFAULTS = {
  welcome: 'Hello! What can I help you with?',
  prompt: 'Questions should stand alone and not refer to previous ones.',
  embedded: false,
  isLoggedIn: false,
  isAnonymous: true,
  disabled: true,
  isOpen: false,
};

/**
 * Builds a Jira Service Desk URL based on form data
 * @param {Object} formData Form data for the ticket
 * @param {string} ticketType Type of ticket to create (default: support)
 * @returns {string} Complete URL for form submission
 */
export const buildServiceDeskUrl = (formData, ticketType = 'support') => {
  // Map ticket types to their URL segments from CONSTANTS
  const ticketSegments = {
    support: CONSTANTS.supportTicketSegment,
    loginAccess: CONSTANTS.cantLoginAccessSegment,
    loginProvider: CONSTANTS.cantLoginResourceProviderSegment,
    feedback: CONSTANTS.feedbackSegment
  };

  const segment = ticketSegments[ticketType] || ticketSegments.support;

  // Build query params from form data
  const params = new URLSearchParams();
  Object.entries(formData).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  return `${CONSTANTS.serviceFormBaseUrl}${segment}?${params.toString()}`;
};

/**
 * Prepares data for future API submission
 * @param {Object} formData Form data for the ticket
 * @param {string} ticketType Type of ticket to create
 * @param {Array} uploadedFiles Files uploaded by the user (if any)
 * @returns {Object} Formatted data for API submission
 */
export const prepareApiSubmission = (formData, ticketType = 'support', uploadedFiles = []) => {
  // Map ticket types to their requestTypeId values
  const requestTypeIds = {
    support: 17,
    loginAccess: 30,
    loginProvider: 31
  };

  // Basic submission data
  const submissionData = {
    serviceDeskId: 2,
    requestTypeId: requestTypeIds[ticketType] || requestTypeIds.support,
    requestFieldValues: {
      ...formData
    }
  };

  // Add file information if any files were uploaded
  if (uploadedFiles && uploadedFiles.length > 0) {
    submissionData.attachments = uploadedFiles.map(file => ({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      // We would handle the actual file data when we implement the API
      // This is just for demonstration/testing
      fileData: {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      }
    }));
  }

  return submissionData;
};

/**
 * JIRA Service Desk File Upload API Process Documentation
 *
 * File uploads to Jira Service Desk API are a two-step process:
 *
 * STEP 1: Upload Temporary File
 * POST /rest/servicedeskapi/servicedesk/{serviceDeskId}/attachTemporaryFile
 *
 * - Must be sent as multipart/form-data
 * - Include file in form field named "file"
 * - Required headers:
 *   - X-Atlassian-Token: nocheck
 *   - X-ExperimentalApi: opt-in
 *
 * Response will include a temporary attachment ID:
 * {
 *   "temporaryAttachments": [
 *     {
 *       "temporaryAttachmentId": "5ad41f7b-882a-4f12-8a08-9b401d6dd3bf",
 *       "fileName": "example.jpg"
 *     }
 *   ]
 * }
 *
 * STEP 2: Attach to Request
 * POST /rest/servicedeskapi/request/{issueIdOrKey}/attachment
 *
 * - Content-Type: application/json
 * - Body:
 * {
 *   "public": true,
 *   "temporaryAttachmentIds": ["5ad41f7b-882a-4f12-8a08-9b401d6dd3bf"],
 *   "additionalComment": { "body": "Adding an attachment" }
 * }
 *
 * Implementation Notes:
 * When API access is granted, we'll need to:
 * 1. Upload each file to get temporary attachment IDs
 * 2. Create the request/ticket
 * 3. Attach the temporary files to the created request
 */

/**
 * Uploads a temporary file to Jira Service Desk
 * Note: This function is not currently used and is in place for future implementation
 *
 * @param {File} file File to upload
 * @param {string} apiKey API key for authentication
 * @param {string} serviceDeskId Service desk ID (default: 2)
 * @returns {Promise<string>} Temporary attachment ID
 */
export const uploadTemporaryFile = async (file, apiKey, serviceDeskId = 2) => {
  // This function will be implemented when API access is granted
  // For now, it's a placeholder to show the pattern
  console.log('Placeholder for uploadTemporaryFile:', { file, apiKey, serviceDeskId });

  // Example implementation for future reference
  /*
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${CONSTANTS.serviceFormBaseUrl}/rest/servicedeskapi/servicedesk/${serviceDeskId}/attachTemporaryFile`,
    {
      method: 'POST',
      headers: {
        'X-Atlassian-Token': 'nocheck',
        'X-ExperimentalApi': 'opt-in',
        'X-API-KEY': apiKey
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.temporaryAttachments[0].temporaryAttachmentId;
  */

  // Mock response
  return 'mock-temporary-id-' + Math.random().toString(36).substring(2);
};

/**
 * Attaches temporary files to a Jira Service Desk request
 * Note: This function is not currently used and is in place for future implementation
 *
 * @param {string[]} temporaryAttachmentIds Array of temporary attachment IDs
 * @param {string} issueKey The issue key or ID
 * @param {string} apiKey API key for authentication
 * @param {string} comment Optional comment to include with the attachment
 * @returns {Promise<Object>} Attachment data
 */
export const attachTemporaryFilesToRequest = async (temporaryAttachmentIds, issueKey, apiKey, comment = '') => {
  // This function will be implemented when API access is granted
  // For now, it's a placeholder to show the pattern
  console.log('Placeholder for attachTemporaryFilesToRequest:', { temporaryAttachmentIds, issueKey, apiKey, comment });

  // Example implementation for future reference
  /*
  const response = await fetch(
    `${CONSTANTS.serviceFormBaseUrl}/rest/servicedeskapi/request/${issueKey}/attachment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ExperimentalApi': 'opt-in',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({
        public: true,
        temporaryAttachmentIds,
        additionalComment: comment ? { body: comment } : undefined
      })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
  */

  // Mock response
  return { success: true, message: 'Attachments added successfully (mock)' };
};

/**
 * Creates footer JSX for the chatbot
 * @returns {JSX.Element} Footer content
 */
export const createFooterContent = () => {
  return (
    <div>
      Find out more <a href={CONSTANTS.aboutToolUrl}>{CONSTANTS.aboutToolText}</a> or <a href={CONSTANTS.feedbackUrl}>{CONSTANTS.feedbackText}</a>.
    </div>
  );
};

/**
 * Creates settings configuration for ChatBot component
 * @param {Object} config - Configuration options
 * @param {Function} config.getThemeColors - Function to get theme colors
 * @param {string} config.prompt - Prompt text for enabled state
 * @param {boolean} config.disabled - Whether the input is disabled
 * @returns {Object} Complete settings object for ChatBot
 */
export const createChatBotSettings = ({ getThemeColors, prompt, disabled }) => {
  return {
    general: getThemeColors(),
    header: {
      title: CONSTANTS.headerTitleText,
      avatar: CONSTANTS.avatarUrl,
    },
    chatInput: {
      enabledPlaceholderText: prompt,
      disabledPlaceholderText: CONSTANTS.disabledPlaceholderText,
      disabled: disabled
    },
    chatHistory: { disabled: true },
    botBubble: {
      simStream: true,
      dangerouslySetInnerHtml: true
    },
    chatButton: {
      icon: CONSTANTS.avatarUrl,
    },
    tooltip: {
      text: CONSTANTS.tooltipText,
    },
    audio: {
      disabled: true,
    },
    emoji: {
      disabled: true,
    },
    fileAttachment: {
      disabled: true,
    },
    notification: {
      disabled: true,
    },
    footer: {
      text: createFooterContent(),
    },
  };
};

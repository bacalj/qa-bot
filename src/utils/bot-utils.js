// Constants for the QA Bot
export const CONSTANTS = {
  // URLs
  queryEndpointUrl: 'https://access-ai.ccs.uky.edu/api/query',
  avatarUrl: 'https://support.access-ci.org/themes/contrib/asp-theme/images/icons/ACCESS-arrrow.svg',
  aboutToolUrl: 'https://support.access-ci.org/tools/access-qa-tool',
  feedbackUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeWnE1r738GU1u_ri3TRpw9dItn6JNPi7-FH7QFB9bAHSVN0w/viewform',
  proxyBaseUrl: process.env.REACT_APP_NETLIFY_PROXY_BASE_URL || 'https://access-serverless-api.netlify.app/.netlify/functions/',

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
 * Prepares data for future API submission
 * @param {Object} formData Form data for the ticket
 * @param {string} ticketType Type of ticket to create
 * @param {Array} uploadedFiles Files uploaded by the user (if any)
 * @returns {Object} Formatted data for API submission
 */
export const prepareApiSubmission = (formData, ticketType = 'support', uploadedFiles = []) => {
  console.log("| 2 🌎 prepareApiSubmission preparing data...");
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

export const sendPreparedDataToProxy = async (submissionData) => {
  console.log("| 4 🌎 Sending prepared data to proxy:", submissionData);

  try {
    const proxyEndpoint = `${CONSTANTS.proxyBaseUrl}test-create-one`;

    const response = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('| ❌ Post data to proxy failed:', response.status, errorText);
      return {
        success: false,
        status: response.status,
        error: errorText
      };
    }

    const data = await response.json();
    console.log('| ✅ Post data to proxy successful:', data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('| ❌ Post data to proxy exception:', error);
    return {
      success: false,
      error: error.message
    };
  }
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

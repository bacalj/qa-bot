import React, { useRef } from 'react';
import ChatBot from "react-chatbotify";
import '../App.css';
import { DEFAULTS, CONSTANTS } from '../utils/bot-utils';
import useQueryHandler from '../hooks/useQueryHandler';
import useThemeHandler from '../hooks/useThemeHandler';

const QABot = (props) => {
  // Set relevant vars to incoming props or defaults
  const welcome = props.welcome || DEFAULTS.welcome;
  const prompt = props.prompt || DEFAULTS.prompt;
  const embedded = props.embedded || DEFAULTS.embedded;
  const isLoggedIn = props.isLoggedIn !== undefined ? props.isLoggedIn : DEFAULTS.isLoggedIn;
  const isAnonymous = props.isAnonymous !== undefined ? props.isAnonymous : !isLoggedIn;
  const disabled = props.disabled !== undefined ? props.disabled : isAnonymous;
  const isOpen = props.isOpen !== undefined ? props.isOpen : DEFAULTS.isOpen;
  const onClose = props.onClose;
  const apiKey = props.apiKey || process.env.REACT_APP_API_KEY;

  // local react state
  const containerRef = useRef(null);

  // Custom hooks
  const { fetchAndStreamResponse, hasError } = useQueryHandler(apiKey);
  const getThemeColors = useThemeHandler(containerRef, embedded);

  const flow = {
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

  return (
    <div className="access-qa-bot" ref={containerRef}>
      <ChatBot
        settings={{
          general: getThemeColors(),
          header: {
            title: 'ACCESS Q&A Bot',
            avatar: CONSTANTS.avatarUrl,
          },
          chatInput: {
            enabledPlaceholderText: prompt,
            disabledPlaceholderText: 'Please log in to ask questions.',
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
            text: 'Ask me about ACCESS! 😊',
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
            text: (<div>Find out more <a href="https://support.access-ci.org/tools/access-qa-tool">about this tool</a> or <a href="https://docs.google.com/forms/d/e/1FAIpQLSeWnE1r738GU1u_ri3TRpw9dItn6JNPi7-FH7QFB9bAHSVN0w/viewform">give us feedback</a>.</div>),
          },
        }}
        isOpen={isOpen}
        onClose={onClose}
        flow={flow}
      />
    </div>
  );
}

export default QABot;
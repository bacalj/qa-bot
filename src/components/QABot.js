import React, { useRef } from 'react';
import ChatBot from "react-chatbotify";
import { DEFAULTS, createChatBotSettings } from '../utils/bot-utils';
import useQueryHandler from '../hooks/useQueryHandler';
import useThemeHandler from '../hooks/useThemeHandler';

import '../App.css';

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

  // Create settings for ChatBot
  const settings = createChatBotSettings({
    getThemeColors,
    prompt,
    disabled
  });

  return (
    <div className="access-qa-bot" ref={containerRef}>
      <ChatBot
        settings={settings}
        isOpen={isOpen}
        onClose={onClose}
        flow={flow}
      />
    </div>
  );
}

export default QABot;
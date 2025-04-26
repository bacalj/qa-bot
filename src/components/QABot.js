import React, { useRef, useMemo } from 'react';
import ChatBot from "react-chatbotify";
import { DEFAULTS, createChatBotSettings } from '../utils/bot-utils';
import { createBotFlow } from '../utils/bot-flow';
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
  const { fetchAndStreamResponse, hasApiError } = useQueryHandler(apiKey);
  const getThemeColors = useThemeHandler(containerRef, embedded);

  // Create flow configuration with memoization
  const flow = useMemo(() => {
    return createBotFlow({
      fetchAndStreamResponse,
      hasApiError,
      welcome
    });
  }, [fetchAndStreamResponse, hasApiError, welcome]);

  // Create settings for ChatBot with memoization
  const settings = useMemo(() => {
    return createChatBotSettings({
      getThemeColors,
      prompt,
      disabled
    });
  }, [getThemeColors, prompt, disabled]);

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
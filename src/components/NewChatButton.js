import React from 'react';
import { useFlow } from 'react-chatbotify';

const NewChatButton = () => {
  const { restartFlow } = useFlow();

  const handleNewChat = () => {
    restartFlow();
  };

  return (
    <button
      onClick={handleNewChat}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: '#666',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#f0f0f0';
        e.target.style.color = '#333';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = '#666';
      }}
    >
      New Chat
    </button>
  );
};

export default NewChatButton;
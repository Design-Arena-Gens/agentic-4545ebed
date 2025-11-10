'use client';

import React, { useMemo, useState } from 'react';
import { usePlatform } from './PlatformContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const generateReply = (input: string, moduleName: string) => {
  const normalized = input.toLowerCase();
  if (normalized.includes('hello') || normalized.includes('hi')) {
    return `Hello! I'm the AssureSphere co-pilot for ${moduleName}. How can I help today?`;
  }
  if (normalized.includes('status')) {
    return `Latest status insights for ${moduleName} are pinned in the metrics tiles. Ask me about renewals, claims, or analytics to dive deeper.`;
  }
  if (normalized.includes('help')) {
    return `Here are a few things I can assist with:\n• Explain how to configure fields in the no-code builder\n• Guide you through bulk import/export\n• Summarize potential duplicate records`;
  }
  return `I'll route this to the right module intelligence. Meanwhile, review the AI prompts to spark the workflow you need.`;
};

export const ChatbotConsole = () => {
  const { modules, activeModuleId } = usePlatform();
  const activeModule = useMemo(
    () => modules.find((item) => item.id === activeModuleId),
    [modules, activeModuleId]
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to AssureSphere. Ask me anything about your insurance operations.'
    }
  ]);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    if (!draft.trim() || !activeModule) return;
    const userMessage: Message = { role: 'user', content: draft };
    const assistantMessage: Message = {
      role: 'assistant',
      content: generateReply(draft, activeModule.name)
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraft('');
  };

  return (
    <section className="chatbot card">
      <header>
        <div>
          <span className="badge">Conversational AI</span>
          <h3>Broker Copilot</h3>
        </div>
      </header>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={draft}
          placeholder="Ask about renewals at risk, claims in progress, etc."
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="cta" type="button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </section>
  );
};

export default ChatbotConsole;

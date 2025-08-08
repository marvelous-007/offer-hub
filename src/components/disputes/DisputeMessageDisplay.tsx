'use client';

import { useEffect, useRef } from 'react';
import { DisputeMessage } from '@/lib/mockData/dispute-messages-mock';

interface DisputeMessageDisplayProps {
  messages: DisputeMessage[];
}

export function DisputeMessageDisplay({ messages }: DisputeMessageDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.isOutgoing
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-900 rounded-bl-none'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p
              className={`text-xs mt-1 ${
                message.isOutgoing ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              {message.timestamp}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
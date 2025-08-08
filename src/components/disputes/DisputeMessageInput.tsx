'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Image } from 'lucide-react';

interface DisputeMessageInputProps {
  onSendMessage: (content: string, file?: File) => void;
}

export function DisputeMessageInput({ onSendMessage }: DisputeMessageInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSendMessage(`Shared file: ${file.name}`, file);
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      {/* File upload buttons */}
      <div className="flex gap-1">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </label>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <Image className="h-4 w-4" />
          </Button>
        </label>
      </div>

      {/* Message input */}
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full"
          disabled={isUploading}
        />
      </div>

      {/* Send button */}
      <Button
        type="submit"
        size="sm"
        className="h-10 w-10 p-0 bg-black hover:bg-gray-800 text-white rounded-full"
        disabled={!message.trim() || isUploading}
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
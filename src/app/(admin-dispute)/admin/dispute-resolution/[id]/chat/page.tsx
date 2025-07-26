'use client';

import { Button } from '@/components/ui/button';
import CloseConflictModal from '@/components/dispute-resolution/close-conflict-modal';
import Link from 'next/link';
import { MdGavel } from 'react-icons/md';
import { MessagesMain } from '@/components/messages/messages-main';
import { MessagesSidebar } from '@/components/messages/messages-sidebar';
import { useMessages } from '@/hooks/useMessages';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DisputeChat() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    handleSendMessage,
  } = useMessages();

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleConfirm = () => {
    setModalOpen(false);
  };

  const closeDisputeButton = (
    <Button
      className="py-5 text-white rounded-full bg-secondary-500"
      onClick={handleOpenModal}
    >
      <MdGavel /> Close conflict
    </Button>
  );

  return (
    <>
      <div className="inline-flex justify-start w-full gap-2 p-4 mb-6 bg-transparent bg-white border-b">
        <Link href="/admin/dispute-resolution">Back</Link>
      </div>
      <div className="flex h-full w-full lg:w-[714px] mx-auto bg-white rounded-lg">
        <MessagesMain
          activeConversation={activeConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          chatHeaderItem={closeDisputeButton}
        />
        <CloseConflictModal
          open={modalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
        />
      </div>
    </>
  );
}

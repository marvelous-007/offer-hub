'use client'
import { useMessages } from "@/hooks/useMessages";
import { MessagesSidebar } from "@/components/messages/messages-sidebar";
import { MessagesMain } from "@/components/messages/messages-main";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { MdGavel } from "react-icons/md";
import { useState } from "react";
import CloseConflictModal from "@/components/dispute-resolution/close-conflict-modal";


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
    <Button className="bg-secondary-500 py-5 text-white rounded-full" onClick={handleOpenModal}>
      <MdGavel /> Close conflict
    </Button>
  );

  return (
    <div className="flex h-full w-full lg:w-[714px] mx-auto bg-white rounded-md">
      <MessagesMain
        activeConversation={activeConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        chatHeaderItem={closeDisputeButton}
      />
      <CloseConflictModal open={modalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} />
    </div>
  );
}
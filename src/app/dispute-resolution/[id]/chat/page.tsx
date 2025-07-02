'use client'
import { useMessages } from "@/hooks/useMessages";
import { MessagesMain } from "@/components/messages/messages-main";
import { Button } from "@/components/ui/button";
import { MdGavel, MdArrowBack } from "react-icons/md";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CloseConflictModal from "@/components/dispute-resolution/close-conflict-modal";
import Link from "next/link";

export default function DisputeChat() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params?.id as string;
  
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
  const handleConfirm = (recipient: string, message: string) => {
    console.log('Closing dispute:', { disputeId, recipient, message });
    setModalOpen(false);
    // Redirect back to dispute resolution after closing
    router.push('/dispute-resolution');
  };

  const chatHeader = (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <Link href="/dispute-resolution" className="p-2 hover:bg-gray-100 rounded-lg">
          <MdArrowBack className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="font-semibold text-gray-900">Dispute #{disputeId}</h2>
          <p className="text-sm text-gray-500">Customer support conversation</p>
        </div>
      </div>
      <Button 
        className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 flex items-center gap-2" 
        onClick={handleOpenModal}
      >
        <MdGavel className="w-4 h-4" />
        Close conflict
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        {chatHeader}
        <div className="h-[calc(100vh-200px)]">
          <MessagesMain
            activeConversation={activeConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
      <CloseConflictModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirm} 
      />
    </div>
  );
} 
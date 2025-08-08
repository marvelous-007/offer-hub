'use client';

import { DisputeConversation } from '@/components/disputes/DisputeConversation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function DisputeConversationPage() {
  const router = useRouter();
  const params = useParams();
  const disputeId = params.id as string;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Mobile App UI/UX design</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-80px)]">
        <DisputeConversation disputeId={disputeId} />
      </div>
    </div>
  );
}
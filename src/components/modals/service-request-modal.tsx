import React, { useState } from 'react';
import { useServiceRequestsApi } from '@/hooks/api-connections/use-service-requests-api';

//import { useUser } from '@/providers/user-context';

interface ServiceRequestModalProps {
  open: boolean;
  onClose: () => void;
  serviceId: string;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ open, onClose, serviceId }) => {
  // const { user } = useUser(); // Get client_id from authenticated user context
  const user = { id: 'client-id-placeholder' }; // TODO: Replace with real user context
  const { createServiceRequest, loading, error } = useServiceRequestsApi();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!message.trim()) return;
    try {
      await createServiceRequest({
        service_id: serviceId,
        client_id: user.id,
        message: message.trim(),
      });
      setSuccess(true);
      setMessage('');
    } catch {}
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Request Service</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border rounded p-2 mb-2"
            placeholder="Write your message for the freelancer..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            minLength={5}
            required
          />
          {error && (
            <div className="text-red-500 text-sm mb-2">{error.message || 'Error sending request'}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm mb-2">Request sent successfully!</div>
          )}
          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading || !message.trim()}
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestModal;

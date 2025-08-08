import { useState } from 'react';
import type { ServiceRequest, CreateServiceRequestDTO, UpdateServiceRequestDTO, RequestStatus } from '@/types/service-request-types';

interface ApiError {
  status: number;
  message: string;
}

export function useServiceRequestsApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createServiceRequest = async (data: CreateServiceRequestDTO) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw { status: res.status, message: result?.message || 'Error al crear solicitud' };
      return result as ServiceRequest;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFreelancerRequests = async (freelancerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/service-requests/${freelancerId}`);
      const result = await res.json();
      if (!res.ok) throw { status: res.status, message: result?.message || 'Error al obtener solicitudes' };
      return result as ServiceRequest[];
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServiceRequestStatus = async (id: string, status: RequestStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/service-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!res.ok) throw { status: res.status, message: result?.message || 'Error al actualizar estado' };
      return result as ServiceRequest;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createServiceRequest,
    getFreelancerRequests,
    updateServiceRequestStatus,
  };
}

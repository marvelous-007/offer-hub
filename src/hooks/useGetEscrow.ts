import { useState } from 'react';
import { useGetEscrow as usePackageGetEscrow } from '@trustless-work/escrow/dist/hooks';
import { GetEscrowParams } from '@trustless-work/escrow/dist/types';

class EscrowError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'EscrowError';
  }
}

/**
 * Hook to fetch escrow details using the @trustless-work/escrow package.
 * @Note:
 * - This hook fetches the details of an existing escrow contract
 * - It requires a contractId and signer address
 */
export const useGetEscrow = () => {
  const { getEscrow, escrow, isPending, isError, isSuccess } = usePackageGetEscrow();
  const [error, setError] = useState<EscrowError | null>(null);

  const handleGetEscrow = async (contractId: string, signer: string) => {
    try {
      if (!contractId) {
        throw new EscrowError('Contract ID is required', 'MISSING_CONTRACT_ID');
      }
      if (!signer) {
        throw new EscrowError('Signer address is required', 'MISSING_SIGNER');
      }

      const payload: GetEscrowParams = {
        contractId,
        signer,
      };

      await getEscrow({ 
        payload, 
        type: 'multi-release' 
      });
    } catch (err) {
      const escrowError = err instanceof EscrowError 
        ? err 
        : new EscrowError(
            err instanceof Error ? err.message : 'Failed to fetch escrow',
            'FETCH_ERROR'
          );
      setError(escrowError);
      throw escrowError;
    }
  };

  return {
    handleGetEscrow,
    data: escrow,
    loading: isPending,
    error: isError ? new EscrowError('Failed to fetch escrow', 'API_ERROR') : error,
    isSuccess,
  };
};
import { useState } from 'react';
import { useGetEscrow as usePackageGetEscrow } from '@trustless-work/escrow/dist/hooks';
import { GetEscrowParams } from '@trustless-work/escrow/dist/types';

/**
 * Hook to fetch escrow details using the @trustless-work/escrow package.
 * @Note:
 * - This hook fetches the details of an existing escrow contract
 * - It requires a contractId and signer address
 */
export const useGetEscrow = () => {
  const { getEscrow, escrow, isPending, isError, isSuccess } = usePackageGetEscrow();
  const [error, setError] = useState<Error | null>(null);

  const handleGetEscrow = async (contractId: string, signer: string) => {
    if (!contractId || !signer) {
      throw new Error('Contract ID and signer are required');
    }

    const payload: GetEscrowParams = {
      contractId,
      signer,
    };

    try {
      await getEscrow({ 
        payload, 
        type: 'multi-release' 
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch escrow'));
      throw err;
    }
  };

  return {
    handleGetEscrow,
    data: escrow,
    loading: isPending,
    error: error || (isError ? new Error('Trustless Work error occurred') : null),
    isSuccess,
  };
};
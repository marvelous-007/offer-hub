import { useState } from 'react';
import { useUpdateEscrow as usePackageUpdateEscrow, useSendTransaction, UpdateEscrowPayload, UpdateEscrowResponse } from '@trustless-work/escrow';

/**
 * Hook to update escrow details using the @trustless-work/escrow package.
 * @Note:
 * - This hook updates the details of an existing escrow contract
 * - It requires a contractId and signer address
 * - Updates can include milestone information, amounts, and other escrow parameters
 */
export const useUpdateEscrow = () => {
    const { updateEscrow, isPending, isError, isSuccess } = usePackageUpdateEscrow();
    const { sendTransaction } = useSendTransaction();
    const [error, setError] = useState<Error | null>(null);
    const [response, setResponse] = useState<UpdateEscrowResponse | null>(null);

    /**
     * @Note:
     * - We need to pass the payload to the updateEscrow function
     * - The result will be an unsigned transaction
     */
    const handleUpdateEscrow = async (payload: UpdateEscrowPayload) => {
        if (!payload.contractId || !payload.signer) {
            throw new Error('Contract ID and signer are required');
        }

        try {
            const { unsignedTransaction } = await updateEscrow({
                payload,
                type: 'multi-release' // for multiple releases of funds
            });

            if (!unsignedTransaction) {
                throw new Error('Unsigned transaction is missing from updateEscrow response.');
            }

            /**
             * @Note:
             * - We need to sign the transaction using your private key, can be suppllied from stellar-wallet-kit or env variable
             * - The result will be a signed transaction
             */

            //   const signedXdr = await signTransaction({
            //     unsignedTransaction,
            //     address: payload.signer || walletAddress || '',
            //   });

            // For now, we'll just use the unsigned transaction as an example
            const signedXdr = unsignedTransaction;

            if (!signedXdr) {
                throw new Error('Signed transaction is missing.');
              }

            /**
             * @Note:
             * - We need to send the signed transaction to the API network
             * - The result will be a SendTransactionResponse
             */

            const data = await sendTransaction(signedXdr);

            if (data.status === 'SUCCESS') {
                /**
                 * @Note:
                 * - The escrow was updated successfully
                 * - Save the response in your global state
                 * - Here, you can save the escrow in your database as the contract between client and freelancer
                 * - You can also show a success toast
                 */
                setResponse(data as UpdateEscrowResponse);
            } else {
                throw new Error('Failed to update escrow');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update escrow'));
            throw err;
        }
    };

    return {
        handleUpdateEscrow,
        loading: isPending,
        error: error || (isError ? new Error('Trustless Work error occurred') : null),
        isSuccess,
        response,
    };
};

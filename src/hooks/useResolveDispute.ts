"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useWalletContext } from "@/providers/wallet.provider"
import { signTransaction } from "../auth/helpers/stellar-wallet-kit.hellper"
import { handleError } from "@/errors/utils/handle-errors"
import type { AxiosError } from "axios"
import type { WalletError } from "@/types/errors.entity"
import type { EscrowRequestResponse, ResolveDisputePayload } from "@trustless-work/escrow/types"
import { useResolveDispute as useResolveDisputeAPI, useSendTransaction } from "@trustless-work/escrow/hooks"

export const useResolveDispute = () => {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<EscrowRequestResponse | null>(null)
  const { walletAddress } = useWalletContext()
  const { resolveDispute: resolveDisputeAPI } = useResolveDisputeAPI()
  const { sendTransaction } = useSendTransaction()

  const resolveDispute = async (payload: ResolveDisputePayload) => {
    setLoading(true)
    setResponse(null)

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the resolveDispute function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await resolveDisputeAPI(payload)

      if (!unsignedTransaction) {
        throw new Error("Unsigned transaction is missing from resolveDispute response.")
      }

      /**
       * @Note:
       * - We need to sign the transaction using your private key
       * - The result will be a signed transaction
       */
      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: walletAddress || "",
      })

      if (!signedXdr) {
        throw new Error("Signed transaction is missing.")
      }

      /**
       * @Note:
       * - We need to send the signed transaction to the API
       * - The data will be an SendTransactionResponse
       */
      const data = await sendTransaction({
        signedXdr,
        returnEscrowDataIsRequired: false,
      })

      /**
       * @Responses:
       * data.status === "SUCCESS"
       * - Escrow updated successfully
       * - Show a success toast
       *
       * data.status == "ERROR"
       * - Show an error toast
       */
      if (data.status === "SUCCESS") {
        toast.success("Dispute resolved successfully", {
          description: "The dispute has been resolved and funds have been distributed.",
        })
        setResponse(data)
      } else {
        throw new Error("Transaction failed or returned an error status")
      }

      return data
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError)
      console.error("Error resolving dispute:", mappedError.message)

      toast.error("Failed to resolve dispute", {
        description: mappedError ? mappedError.message : "An unknown error occurred",
      })

      throw mappedError
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResponse(null)
    setLoading(false)
  }

  return {
    resolveDispute,
    loading,
    response,
    reset,
    isResolving: loading,
  }
}

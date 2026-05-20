import {
  appendTransactionMessageInstruction,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit'
import { useMutation } from '@tanstack/react-query'
import { type UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'

import type { SolanaClient } from '@/solana/data-access/solana-client'

import type { OutlierforgeSelection } from '../util/outlierforge-catalog'

import { createOutlierforgeMetadata } from '../util/outlierforge-metadata'
import { getOutlierforgeCreateInstruction } from './outlierforge-mint'

export interface OutlierforgeMintResult {
  asset: string
  explorer: string
  metadata: string
  tx: string
}

export function useOutlierforgeMint({
  account,
  client,
  origin,
}: {
  account: UiWalletAccount
  client: SolanaClient
  origin: string
}) {
  const walletSigner = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async (selection: OutlierforgeSelection): Promise<OutlierforgeMintResult> => {
      const asset = await generateKeyPairSigner()
      const metadata = createOutlierforgeMetadata({ domain: origin, selection })
      const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
      const instruction = getOutlierforgeCreateInstruction({
        asset,
        metadata,
        owner: walletSigner.address,
        payer: walletSigner,
      })
      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (transactionMessage) => setTransactionMessageFeePayerSigner(walletSigner, transactionMessage),
        (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
        (transactionMessage) => appendTransactionMessageInstruction(instruction, transactionMessage),
      )
      const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
      const tx = getBase58Decoder().decode(signatureBytes)

      if (!tx) {
        throw new Error('Wallet submitted the mint but returned no signature.')
      }

      return {
        asset: asset.address,
        explorer: `https://explorer.solana.com/address/${asset.address}?cluster=devnet`,
        metadata: metadata.uri,
        tx,
      }
    },
  })
}

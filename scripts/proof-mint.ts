import {
  type Address,
  appendTransactionMessageInstruction,
  assertIsTransactionWithBlockhashLifetime,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'

import { getOutlierforgeCreateInstruction } from '../src/outlierforge/data-access/outlierforge-mint'
import { defaultOutlierforgeSelection } from '../src/outlierforge/util/outlierforge-catalog'
import { createOutlierforgeMetadata } from '../src/outlierforge/util/outlierforge-metadata'

const keypairPath = '/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json'
const rpc = createSolanaRpc('https://api.devnet.solana.com')
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com')
const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })

async function loadSigner(path: string) {
  const secret = JSON.parse(await Bun.file(path).text()) as number[]
  const { createKeyPairSignerFromBytes } = await import('@solana/kit')

  return createKeyPairSignerFromBytes(Uint8Array.from(secret))
}

async function main() {
  const payer = await loadSigner(keypairPath)
  const asset = await generateKeyPairSigner()
  const balance = await rpc.getBalance(payer.address, { commitment: 'confirmed' }).send()

  if (balance.value < 50_000_000n) {
    await rpc.requestAirdrop(payer.address, lamports(1_000_000_000n)).send()
    await waitForBalance(payer.address, 50_000_000n)
  }

  const { value: latestBlockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
  const metadata = createOutlierforgeMetadata({
    domain: 'https://outlierforge090.colmena.dev',
    selection: defaultOutlierforgeSelection,
  })
  const instruction = getOutlierforgeCreateInstruction({
    asset,
    metadata,
    owner: payer.address,
    payer,
  })
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (transactionMessage) => setTransactionMessageFeePayerSigner(payer, transactionMessage),
    (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
    (transactionMessage) => appendTransactionMessageInstruction(instruction, transactionMessage),
  )
  const transaction = await signTransactionMessageWithSigners(message)
  assertIsTransactionWithBlockhashLifetime(transaction)

  await sendAndConfirmTransaction(transaction, { commitment: 'confirmed' })

  console.log(`asset=${asset.address}`)
  console.log(`tx=${getSignatureFromTransaction(transaction)}`)
  console.log(`explorer=https://explorer.solana.com/address/${asset.address}?cluster=devnet`)
}

async function waitForBalance(address: Address, minimumLamports: bigint) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1_500))
    const balance = await rpc.getBalance(address, { commitment: 'confirmed' }).send()
    if (balance.value >= minimumLamports) {
      return
    }
  }
}

await main()

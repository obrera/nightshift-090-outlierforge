import { ExternalLink, Hammer, Wallet } from 'lucide-react'

import { Button } from '@/core/ui/button'
import { SolanaUiWalletDialog } from '@/solana/ui/solana-ui-wallet-dialog'

import type { OutlierforgeMintResult } from '../data-access/use-outlierforge-mint'

export function OutlierforgeMintPanel({
  connected,
  error,
  isPending,
  metadataUrl,
  onMint,
  result,
}: {
  connected: boolean
  error?: string
  isPending: boolean
  metadataUrl: string
  onMint: () => void
  result?: OutlierforgeMintResult
}) {
  return (
    <section aria-label="Mint and verify" className="of-panel of-mint">
      <div className="of-panel-title">
        <span>Wallet mint</span>
        <span>Devnet MPL Core</span>
      </div>
      {connected ? (
        <Button className="of-mint-button" disabled={isPending} onClick={onMint}>
          <Hammer size={18} />
          {isPending ? 'Awaiting wallet signature' : 'Mint character'}
        </Button>
      ) : (
        <div className="of-wallet-empty">
          <Wallet size={20} />
          <span>No wallet connected</span>
          <SolanaUiWalletDialog className="h-9" />
        </div>
      )}
      <div className="of-link-list">
        <a href={metadataUrl} rel="noreferrer" target="_blank">
          Metadata JSON <ExternalLink size={14} />
        </a>
        {result ? (
          <>
            <a href={result.explorer} rel="noreferrer" target="_blank">
              Asset explorer <ExternalLink size={14} />
            </a>
            <a href={`https://explorer.solana.com/tx/${result.tx}?cluster=devnet`} rel="noreferrer" target="_blank">
              Transaction <ExternalLink size={14} />
            </a>
          </>
        ) : null}
      </div>
      {error ? <div className="of-error">{error}</div> : null}
      {result ? (
        <div className="of-proof">
          <span>asset={result.asset}</span>
          <span>tx={result.tx}</span>
        </div>
      ) : null}
    </section>
  )
}

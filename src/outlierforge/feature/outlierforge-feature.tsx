import { useWalletUi } from '@wallet-ui/react'
import { useMemo, useState } from 'react'

import { useSolanaClient } from '@/solana/data-access/use-solana-client'

import { useOutlierforgeMint } from '../data-access/use-outlierforge-mint'
import { OutlierforgeMintPanel } from '../ui/outlierforge-mint-panel'
import { OutlierforgePreview } from '../ui/outlierforge-preview'
import { OutlierforgeStatsPanel } from '../ui/outlierforge-stats-panel'
import { OutlierforgeTraitComposer } from '../ui/outlierforge-trait-composer'
import { OutlierforgeVerifierPanel } from '../ui/outlierforge-verifier-panel'
import {
  defaultOutlierforgeSelection,
  type OutlierforgeSelection,
  type OutlierforgeTraitCategory,
} from '../util/outlierforge-catalog'
import { analyzeOutlierforgeSelection } from '../util/outlierforge-domain'
import { createOutlierforgeMetadata } from '../util/outlierforge-metadata'

export function OutlierforgeFeature() {
  const [selection, setSelection] = useState<OutlierforgeSelection>(defaultOutlierforgeSelection)
  const { account, cluster } = useWalletUi()
  const client = useSolanaClient()
  const origin = typeof window === 'undefined' ? 'https://outlierforge090.colmena.dev' : window.location.origin
  const analysis = useMemo(() => analyzeOutlierforgeSelection(selection), [selection])
  const metadata = useMemo(() => createOutlierforgeMetadata({ domain: origin, selection }), [origin, selection])

  function handleSelect(category: OutlierforgeTraitCategory, traitId: string) {
    setSelection((current) => ({ ...current, [category]: traitId }))
  }

  return (
    <div className="of-root">
      <div className="of-workbench">
        <div className="of-titlebar">
          <div>
            <span className="of-kicker">Solana week / playable identity forge</span>
            <h1>OutlierForge 090</h1>
          </div>
          <div className="of-network">Cluster: {cluster.id}</div>
        </div>
        <div className="of-layout">
          <div className="of-left">
            <OutlierforgeTraitComposer onSelect={handleSelect} selection={selection} />
          </div>
          <div className="of-center">
            <OutlierforgePreview selection={selection} />
          </div>
          <div className="of-right">
            <OutlierforgeStatsPanel analysis={analysis} />
            {account ? (
              <OutlierforgeConnectedMint
                account={account}
                client={client}
                metadataUrl={metadata.uri}
                origin={origin}
                selection={selection}
              />
            ) : (
              <OutlierforgeMintPanel
                connected={false}
                isPending={false}
                metadataUrl={metadata.uri}
                onMint={() => undefined}
              />
            )}
          </div>
        </div>
        <OutlierforgeVerifierPanel analysis={analysis} imageUrl={metadata.image} metadataUrl={metadata.uri} />
      </div>
    </div>
  )
}

function OutlierforgeConnectedMint({
  account,
  client,
  metadataUrl,
  origin,
  selection,
}: {
  account: NonNullable<ReturnType<typeof useWalletUi>['account']>
  client: ReturnType<typeof useSolanaClient>
  metadataUrl: string
  origin: string
  selection: OutlierforgeSelection
}) {
  const mint = useOutlierforgeMint({ account, client, origin })

  return (
    <OutlierforgeMintPanel
      connected
      error={mint.error instanceof Error ? mint.error.message : undefined}
      isPending={mint.isPending}
      metadataUrl={metadataUrl}
      onMint={() => mint.mutate(selection)}
      result={mint.data}
    />
  )
}

export { OutlierforgeFeature as Component }

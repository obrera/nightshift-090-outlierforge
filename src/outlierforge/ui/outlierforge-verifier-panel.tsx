import { ExternalLink } from 'lucide-react'

import type { OutlierforgeAnalysis } from '../util/outlierforge-domain'

export function OutlierforgeVerifierPanel({
  analysis,
  imageUrl,
  metadataUrl,
}: {
  analysis: OutlierforgeAnalysis
  imageUrl: string
  metadataUrl: string
}) {
  return (
    <section aria-label="Public verifier" className="of-panel of-verifier">
      <div className="of-panel-title">
        <span>Verifier</span>
        <span>{analysis.slug}</span>
      </div>
      <div className="of-url-grid">
        <span>metadata</span>
        <a href={metadataUrl} rel="noreferrer" target="_blank">
          {metadataUrl} <ExternalLink size={13} />
        </a>
        <span>image</span>
        <a href={imageUrl} rel="noreferrer" target="_blank">
          {imageUrl} <ExternalLink size={13} />
        </a>
      </div>
      <p className="of-explorer-note">Explorer checks should use devnet and the minted asset address.</p>
    </section>
  )
}

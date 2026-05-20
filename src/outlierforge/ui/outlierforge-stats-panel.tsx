import { AlertTriangle, CheckCircle2, SlidersHorizontal } from 'lucide-react'

import type { OutlierforgeAnalysis } from '../util/outlierforge-domain'

export function OutlierforgeStatsPanel({ analysis }: { analysis: OutlierforgeAnalysis }) {
  const stats = [
    ['Power', analysis.stats.power],
    ['Defense', analysis.stats.defense],
    ['Agility', analysis.stats.agility],
    ['Signal', analysis.stats.signal],
  ] as const

  return (
    <section aria-label="Stats and rules" className="of-panel of-stats">
      <div className="of-panel-title">
        <span>Rules terminal</span>
        <span>{analysis.rarityLabel}</span>
      </div>
      <div className="of-readiness">
        <div>
          <span>Mint readiness</span>
          <strong>{analysis.readiness}%</strong>
        </div>
        <meter max="100" min="0" value={analysis.readiness} />
      </div>
      <div className="of-stat-grid">
        {stats.map(([label, value]) => (
          <div className="of-stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className={analysis.conflicts.length ? 'of-rule of-rule-warn' : 'of-rule'}>
        {analysis.conflicts.length ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
        <span>{analysis.conflicts.length ? analysis.conflicts.join(' / ') : 'Trait rules clear for devnet mint.'}</span>
      </div>
      <div className="of-operator">
        <div className="of-operator-head">
          <SlidersHorizontal size={17} />
          <span>Operator supply gate</span>
        </div>
        <div className="of-supply-grid">
          <span>Devnet batch</span>
          <strong>090 / 300</strong>
          <span>Rule lock</span>
          <strong>{analysis.conflicts.length ? 'Hold' : 'Ready'}</strong>
          <span>Artwork mode</span>
          <strong>First-party SVG</strong>
        </div>
      </div>
    </section>
  )
}

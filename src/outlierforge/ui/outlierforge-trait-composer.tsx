import type { CSSProperties } from 'react'

import type { OutlierforgeSelection, OutlierforgeTraitCategory } from '../util/outlierforge-catalog'

import { outlierforgeCategories, outlierforgeTraits } from '../util/outlierforge-catalog'

export function OutlierforgeTraitComposer({
  onSelect,
  selection,
}: {
  onSelect: (category: OutlierforgeTraitCategory, traitId: string) => void
  selection: OutlierforgeSelection
}) {
  return (
    <section aria-label="Trait composer" className="of-panel of-composer">
      <div className="of-panel-title">
        <span>Trait forge</span>
        <span>5 slots</span>
      </div>
      <div className="of-trait-stack">
        {outlierforgeCategories.map((category) => (
          <div className="of-trait-row" key={category.id}>
            <div className="of-trait-label">{category.label}</div>
            <div className="of-trait-options">
              {outlierforgeTraits[category.id].map((trait) => (
                <button
                  className={selection[category.id] === trait.id ? 'of-chip of-chip-active' : 'of-chip'}
                  key={trait.id}
                  onClick={() => onSelect(category.id, trait.id)}
                  style={{ '--trait-color': trait.accent } as CSSProperties}
                  type="button"
                >
                  <span>{trait.label}</span>
                  <small>{trait.rarity}</small>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

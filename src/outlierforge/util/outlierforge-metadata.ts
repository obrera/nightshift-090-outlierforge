import type { OutlierforgeSelection } from './outlierforge-catalog'

import { defaultOutlierforgeSelection, outlierforgeCategories, outlierforgeTraits } from './outlierforge-catalog'
import { analyzeOutlierforgeSelection } from './outlierforge-domain'

export interface OutlierforgeMetadata {
  attributes: { trait_type: string; value: number | string }[]
  description: string
  image: string
  name: string
  properties: {
    category: string
    files: { type: string; uri: string }[]
  }
  symbol: string
  uri: string
}

export function createOutlierforgeMetadata({
  domain,
  selection,
}: {
  domain: string
  selection: OutlierforgeSelection
}): OutlierforgeMetadata {
  const analysis = analyzeOutlierforgeSelection(selection)
  const image = `${domain}/metadata/${analysis.slug}.svg`
  const uri = `${domain}/metadata/${analysis.slug}.json`

  return {
    attributes: [
      ...analysis.traits.map((trait) => ({ trait_type: trait.category, value: trait.label })),
      { trait_type: 'Readiness', value: analysis.readiness },
      { trait_type: 'Rarity band', value: analysis.rarityLabel },
      { trait_type: 'Power', value: analysis.stats.power },
      { trait_type: 'Signal', value: analysis.stats.signal },
    ],
    description:
      'A first-party generated OutlierForge playable character identity with holder-verifiable trait composition.',
    image,
    name: `OutlierForge 090 ${analysis.traits[0].label}`,
    properties: {
      category: 'image',
      files: [{ type: 'image/svg+xml', uri: image }],
    },
    symbol: 'OF090',
    uri,
  }
}

export function parseOutlierforgeSelectionSlug(slug: string): OutlierforgeSelection {
  const selection = parseOutlierforgeSlugCategory(slug, 0)

  return selection ? normalizeOutlierforgeSelection(selection) : { ...defaultOutlierforgeSelection }
}

function normalizeOutlierforgeSelection(selection: Partial<OutlierforgeSelection>): OutlierforgeSelection {
  return {
    armor: selection.armor ?? defaultOutlierforgeSelection.armor,
    body: selection.body ?? defaultOutlierforgeSelection.body,
    companion: selection.companion ?? defaultOutlierforgeSelection.companion,
    headgear: selection.headgear ?? defaultOutlierforgeSelection.headgear,
    weapon: selection.weapon ?? defaultOutlierforgeSelection.weapon,
  }
}

function parseOutlierforgeSlugCategory(
  remaining: string,
  categoryIndex: number,
): null | Partial<OutlierforgeSelection> {
  const category = outlierforgeCategories[categoryIndex]

  if (!category) {
    return remaining ? null : {}
  }

  for (const trait of [...outlierforgeTraits[category.id]].sort((a, b) => b.id.length - a.id.length)) {
    if (remaining !== trait.id && !remaining.startsWith(`${trait.id}-`)) {
      continue
    }

    const nextRemaining = remaining.slice(trait.id.length).replace(/^-/, '')
    const nextSelection = parseOutlierforgeSlugCategory(nextRemaining, categoryIndex + 1)

    if (nextSelection) {
      return { ...nextSelection, [category.id]: trait.id }
    }
  }

  return null
}

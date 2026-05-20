import {
  getOutlierforgeSelectedTraits,
  outlierforgeCategories,
  type OutlierforgeSelection,
  type OutlierforgeTrait,
} from './outlierforge-catalog'

export interface OutlierforgeAnalysis {
  conflicts: string[]
  rarityLabel: string
  readiness: number
  slug: string
  stats: {
    agility: number
    defense: number
    power: number
    signal: number
  }
  traits: OutlierforgeTrait[]
}

const rarityWeights: Record<OutlierforgeTrait['rarity'], number> = {
  Common: 1,
  Epic: 4,
  Mythic: 6,
  Rare: 3,
  Uncommon: 2,
}

export function analyzeOutlierforgeSelection(selection: OutlierforgeSelection): OutlierforgeAnalysis {
  const traits = getOutlierforgeSelectedTraits(selection)
  const stats = traits.reduce(
    (total, trait) => ({
      agility: total.agility + trait.stats.agility,
      defense: total.defense + trait.stats.defense,
      power: total.power + trait.stats.power,
      signal: total.signal + trait.stats.signal,
    }),
    { agility: 0, defense: 0, power: 0, signal: 0 },
  )
  const conflicts = getOutlierforgeConflicts(selection, traits)
  const rarityScore = traits.reduce((total, trait) => total + rarityWeights[trait.rarity], 0)
  const readiness = Math.max(
    0,
    Math.min(100, 40 + stats.power + stats.signal + Math.floor((stats.agility + stats.defense) / 2) + rarityScore * 2),
  )

  return {
    conflicts,
    rarityLabel: getRarityLabel(rarityScore),
    readiness: conflicts.length ? Math.max(0, readiness - conflicts.length * 18) : readiness,
    slug: createOutlierforgeSlug(selection),
    stats,
    traits,
  }
}

export function createOutlierforgeSlug(selection: OutlierforgeSelection) {
  return outlierforgeCategories.map((category) => selection[category.id]).join('-')
}

function getOutlierforgeConflicts(selection: OutlierforgeSelection, traits: OutlierforgeTrait[]) {
  const conflicts: string[] = []

  for (const trait of traits) {
    for (const category of outlierforgeCategories) {
      const blocked = trait.conflicts?.[category.id]
      if (blocked?.includes(selection[category.id])) {
        conflicts.push(`${trait.label} conflicts with ${selection[category.id].replaceAll('-', ' ')}`)
      }
    }
  }

  return conflicts
}

function getRarityLabel(score: number) {
  if (score >= 17) {
    return 'Mythic build'
  }
  if (score >= 13) {
    return 'Epic build'
  }
  if (score >= 9) {
    return 'Rare build'
  }
  return 'Field common'
}

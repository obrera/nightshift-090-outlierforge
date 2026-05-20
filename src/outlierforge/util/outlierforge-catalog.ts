export type OutlierforgeSelection = Record<OutlierforgeTraitCategory, string>

export interface OutlierforgeTrait {
  accent: string
  category: OutlierforgeTraitCategory
  conflicts?: Partial<Record<OutlierforgeTraitCategory, string[]>>
  id: string
  label: string
  rarity: 'Common' | 'Epic' | 'Mythic' | 'Rare' | 'Uncommon'
  stats: {
    agility: number
    defense: number
    power: number
    signal: number
  }
}

export type OutlierforgeTraitCategory = 'armor' | 'body' | 'companion' | 'headgear' | 'weapon'

export const outlierforgeCategories: { id: OutlierforgeTraitCategory; label: string }[] = [
  { id: 'body', label: 'Body class' },
  { id: 'headgear', label: 'Headgear' },
  { id: 'armor', label: 'Armor' },
  { id: 'weapon', label: 'Weapon' },
  { id: 'companion', label: 'Aura companion' },
]

export const outlierforgeTraits: Record<OutlierforgeTraitCategory, OutlierforgeTrait[]> = {
  armor: [
    {
      accent: '#53ff8f',
      category: 'armor',
      id: 'vector-mail',
      label: 'Vector Mail',
      rarity: 'Common',
      stats: { agility: 2, defense: 7, power: 2, signal: 3 },
    },
    {
      accent: '#ff3bd5',
      category: 'armor',
      id: 'null-plating',
      label: 'Null Plating',
      rarity: 'Rare',
      stats: { agility: -1, defense: 11, power: 5, signal: 2 },
    },
    {
      accent: '#f8ff5a',
      category: 'armor',
      conflicts: { body: ['drift-runner'] },
      id: 'overclock-rig',
      label: 'Overclock Rig',
      rarity: 'Epic',
      stats: { agility: 4, defense: 3, power: 8, signal: 5 },
    },
  ],
  body: [
    {
      accent: '#52ff86',
      category: 'body',
      id: 'drift-runner',
      label: 'Drift Runner',
      rarity: 'Common',
      stats: { agility: 9, defense: 3, power: 4, signal: 5 },
    },
    {
      accent: '#f742d0',
      category: 'body',
      id: 'hex-warden',
      label: 'Hex Warden',
      rarity: 'Rare',
      stats: { agility: 4, defense: 8, power: 6, signal: 6 },
    },
    {
      accent: '#46d7ff',
      category: 'body',
      id: 'void-striker',
      label: 'Void Striker',
      rarity: 'Epic',
      stats: { agility: 6, defense: 4, power: 10, signal: 4 },
    },
  ],
  companion: [
    {
      accent: '#57ff9a',
      category: 'companion',
      id: 'bit-orbit',
      label: 'Bit Orbit',
      rarity: 'Common',
      stats: { agility: 2, defense: 2, power: 2, signal: 5 },
    },
    {
      accent: '#ff42d4',
      category: 'companion',
      id: 'ghost-pulse',
      label: 'Ghost Pulse',
      rarity: 'Rare',
      stats: { agility: 3, defense: 1, power: 5, signal: 7 },
    },
    {
      accent: '#f6ff4a',
      category: 'companion',
      id: 'oracle-spark',
      label: 'Oracle Spark',
      rarity: 'Mythic',
      stats: { agility: 2, defense: 4, power: 5, signal: 11 },
    },
  ],
  headgear: [
    {
      accent: '#50ff88',
      category: 'headgear',
      id: 'visor-prime',
      label: 'Visor Prime',
      rarity: 'Common',
      stats: { agility: 3, defense: 2, power: 2, signal: 6 },
    },
    {
      accent: '#ff36d2',
      category: 'headgear',
      id: 'crown-breaker',
      label: 'Crown Breaker',
      rarity: 'Rare',
      stats: { agility: 1, defense: 3, power: 7, signal: 5 },
    },
    {
      accent: '#43d9ff',
      category: 'headgear',
      conflicts: { companion: ['oracle-spark'] },
      id: 'echo-halo',
      label: 'Echo Halo',
      rarity: 'Epic',
      stats: { agility: 3, defense: 2, power: 4, signal: 10 },
    },
  ],
  weapon: [
    {
      accent: '#51ff8c',
      category: 'weapon',
      id: 'pulse-blade',
      label: 'Pulse Blade',
      rarity: 'Common',
      stats: { agility: 5, defense: 1, power: 6, signal: 2 },
    },
    {
      accent: '#ff3bd5',
      category: 'weapon',
      conflicts: { armor: ['null-plating'] },
      id: 'rift-hammer',
      label: 'Rift Hammer',
      rarity: 'Rare',
      stats: { agility: -2, defense: 3, power: 12, signal: 1 },
    },
    {
      accent: '#f6ff4f',
      category: 'weapon',
      id: 'ion-lance',
      label: 'Ion Lance',
      rarity: 'Epic',
      stats: { agility: 3, defense: 2, power: 9, signal: 5 },
    },
  ],
}

export const defaultOutlierforgeSelection: OutlierforgeSelection = {
  armor: 'vector-mail',
  body: 'drift-runner',
  companion: 'bit-orbit',
  headgear: 'visor-prime',
  weapon: 'pulse-blade',
}

export function getOutlierforgeSelectedTraits(selection: OutlierforgeSelection) {
  return outlierforgeCategories.map((category) => getOutlierforgeTrait(category.id, selection[category.id]))
}

export function getOutlierforgeTrait(category: OutlierforgeTraitCategory, id: string) {
  return outlierforgeTraits[category].find((trait) => trait.id === id) ?? outlierforgeTraits[category][0]
}

export const TRAITS = ['brave', 'curious', 'kind', 'loyal', 'clever', 'calm', 'playful', 'ambitious'] as const

export type Trait = (typeof TRAITS)[number]

export type TraitVector = Record<Trait, number>

export interface Answer {
  label: string
  traitDeltas: Partial<TraitVector>
}

export interface Question {
  id: string
  prompt: string
  answers: Answer[]
}

export interface Character {
  id: string
  name: string
  image: string
  tagline: string
  bio: string
  weights: TraitVector
}

export interface Theme {
  id: string
  title: string
  subtitle: string
  image: string
  traits: Trait[]
  questions: Question[]
  questionSets?: Question[][]
  characters: Character[]
}

export interface RankingEntry {
  character: Character
  score: number
}

export interface ScoreResult {
  winner: RankingEntry
  runnerUp: RankingEntry | null
  ranked: RankingEntry[]
}

export interface SavedResult {
  id: string
  themeId: string
  winnerId: string
  runnerUpId: string | null
  topTraits: Trait[]
  traitTotals: TraitVector
  ranked: { id: string; score: number }[]
  timestamp: number
}

export interface AppSettings {
  enabledThemes: string[]
  quickMode: boolean
}

export interface LastResultRef {
  lastResultId: string
  themeId: string
}

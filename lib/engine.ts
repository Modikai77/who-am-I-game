import type { Trait, TraitVector, Theme, ScoreResult } from './types'
import { TRAITS } from './types'
import type { Question } from './types'

const INITIAL: TraitVector = {
  brave: 0,
  curious: 0,
  kind: 0,
  loyal: 0,
  clever: 0,
  calm: 0,
  playful: 0,
  ambitious: 0,
}

function clampAdd(total: TraitVector, delta: Partial<TraitVector>) {
  return TRAITS.reduce((acc, trait) => {
    acc[trait] = (acc[trait] ?? 0) + (delta[trait] ?? 0)
    return acc
  }, { ...total })
}

function topTraitsFromTotals(traitTotals: TraitVector, limit: number) {
  const entries = TRAITS.map((trait) => ({ trait, score: traitTotals[trait] ?? 0 })).sort((a, b) => b.score - a.score)
  const used = new Set<Trait>()
  const sorted: Trait[] = []

  for (const entry of entries) {
    if (entry.score <= 0) continue
    if (used.size >= limit) break
    used.add(entry.trait)
    sorted.push(entry.trait)
  }

  if (sorted.length < limit) {
    for (const entry of entries) {
      if (used.has(entry.trait)) continue
      sorted.push(entry.trait)
      if (sorted.length >= limit) break
    }
  }

  return sorted
}

export function explainResult(traitTotals: TraitVector, limit = 3): Trait[] {
  return topTraitsFromTotals(traitTotals, limit)
}

export function scoreTheme(theme: Theme, traitTotals: TraitVector): ScoreResult {
  const ranked = theme.characters.map((character) => {
    const score = TRAITS.reduce((sum, trait) => sum + (traitTotals[trait] ?? 0) * (character.weights[trait] ?? 0), 0)
    return { character, score }
  })

  ranked.sort((a, b) => b.score - a.score)
  const bestScore = ranked[0].score
  const topCandidates = ranked.filter((entry) => entry.score === bestScore)

  const traitOrder = explainResult(traitTotals, 1)
  const topTrait = traitOrder[0]

  let winner = topCandidates[0]
  if (topCandidates.length > 1) {
    const topByTrait = topCandidates.map((entry) => ({ ...entry, topTraitWeight: entry.character.weights[topTrait] ?? 0 }))
    const topTraitWeight = Math.max(...topByTrait.map((item) => item.topTraitWeight))
    const finalCandidates = topByTrait.filter((entry) => entry.topTraitWeight === topTraitWeight)
    winner = finalCandidates.length === 1 ? finalCandidates[0] : finalCandidates[Math.floor(Math.random() * finalCandidates.length)]
  }

  const runnerUp = ranked.find((entry) => entry.character.id !== winner.character.id) ?? null
  const topTraits = explainResult(traitTotals, 3)

  return {
    winner,
    runnerUp,
    ranked: ranked.map((entry) => ({ ...entry, score: Number(entry.score.toFixed(2)) })),
  }
}

export class QuizEngine {
  currentQuestionIndex: number
  traitTotals: TraitVector

  private questions: Question[]

  constructor(private theme: Theme, questions?: Question[]) {
    this.currentQuestionIndex = 0
    this.traitTotals = { ...INITIAL }
    this.questions = questions ?? theme.questions
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex]
  }

  get isComplete() {
    return this.currentQuestionIndex >= this.questions.length
  }

  answer(questionId: string, answerIndex: number) {
    if (this.isComplete) return false
    const question = this.currentQuestion
    if (!question || question.id !== questionId) {
      throw new Error('Question mismatch')
    }

    const answer = question.answers[answerIndex]
    if (!answer) {
      throw new Error('Invalid answer index')
    }

    this.traitTotals = clampAdd(this.traitTotals, answer.traitDeltas)
    this.currentQuestionIndex += 1
    return this.isComplete
  }
}

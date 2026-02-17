import pokemon from '@/data/themes/pokemon.json'
import animals from '@/data/themes/animals.json'
import mythical from '@/data/themes/mythical.json'
import minecraft from '@/data/themes/minecraft.json'
import type { Question, Theme } from './types'

const QUESTION_SET_COUNT = 5

function hydrateTheme(theme: Theme): Theme & { questionSets: Question[][] } {
  const providedSets = theme.questionSets?.filter((set) => set?.length === 8)
  if (providedSets && providedSets.length === QUESTION_SET_COUNT) {
    return {
      ...theme,
      questionSets: providedSets,
    }
  }

  const fallback = theme.questions.map((question) => ({ ...question, id: question.id, answers: [...question.answers] }))
  const fallbackSets = Array.from({ length: QUESTION_SET_COUNT }, () => fallback)

  return {
    ...theme,
    questionSets: fallbackSets,
  }
}

const THEMES = {
  pokemon: hydrateTheme(pokemon as Theme),
  animals: hydrateTheme(animals as Theme),
  mythical: hydrateTheme(mythical as Theme),
  minecraft: hydrateTheme(minecraft as Theme),
}

export type ThemeId = keyof typeof THEMES

export function loadTheme(themeId: string): Theme & { questionSets: Question[][] } {
  const theme = (THEMES as Record<string, Theme & { questionSets: Question[][] }>)[themeId]
  if (!theme) {
    throw new Error(`Unknown themeId: ${themeId}`)
  }
  return theme
}

export function getAllThemes(): (Theme & { questionSets: Question[][] })[] {
  return Object.values(THEMES)
}

export function getRandomQuestionSet(theme: Theme & { questionSets: Question[][] }) {
  const setIndex = Math.floor(Math.random() * QUESTION_SET_COUNT)
  return getQuestionSet(theme, setIndex)
}

export function getQuestionSet(theme: Theme & { questionSets: Question[][] }, setIndex?: number) {
  if (Number.isInteger(setIndex) && (setIndex as number) >= 0 && (setIndex as number) < QUESTION_SET_COUNT) {
    return theme.questionSets[setIndex as number]
  }
  const fallback = Math.floor(Math.random() * QUESTION_SET_COUNT)
  return theme.questionSets[fallback]
}

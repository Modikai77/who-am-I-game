'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getQuestionSet, loadTheme } from '@/lib/theme'
import { QuizEngine, explainResult, scoreTheme } from '@/lib/engine'
import { addHistory, saveLastResult } from '@/lib/storage'
import { default as CharacterResultCard } from '@/components/QuestionCard'

export default function QuizPage() {
  const { themeId } = useParams() as { themeId: string }
  const router = useRouter()
  const searchParams = useSearchParams()
  const setParam = searchParams.get('set')

  const theme = useMemo(() => {
    try {
      return loadTheme(themeId)
    } catch {
      return null
    }
  }, [themeId])

  const selectedQuestions = useMemo(() => {
    if (!theme) return []
    const setIndex = setParam ? Number.parseInt(setParam, 10) : undefined
    return getQuestionSet(theme, setIndex)
  }, [theme, setParam])

  const [engine, setEngine] = useState<QuizEngine | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [questionKey, setQuestionKey] = useState(0)

  useEffect(() => {
    if (!theme || selectedQuestions.length === 0) {
      setEngine(null)
      return
    }

    setEngine(new QuizEngine(theme, selectedQuestions))
    setSelected(null)
    setQuestionKey(0)
  }, [theme, selectedQuestions, setParam])

  if (!theme || !engine) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center p-4">
        <div className="text-center rounded-2xl card-float border border-white/70 p-6">
          <p className="text-xl font-bold">That theme is unavailable.</p>
          <button
            className="mt-4 rounded-xl bg-accent-sky px-4 py-3 text-white font-bold"
            onClick={() => router.push('/')}
          >
            Back home
          </button>
        </div>
      </main>
    )
  }

  if (!engine || engine.isComplete || selectedQuestions.length === 0) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center p-4">
        <p>Loading...</p>
      </main>
    )
  }

  const question = selectedQuestions[engine.currentQuestionIndex]

  function onContinue() {
    if (selected === null) return
    const complete = engine.answer(question.id, selected)
    if (complete) {
      const scored = scoreTheme(theme, engine.traitTotals)
      const topTraits = explainResult(engine.traitTotals, 3)

      const result = {
        id: `${theme.id}-${Date.now()}`,
        themeId: theme.id,
        winnerId: scored.winner.character.id,
        runnerUpId: scored.runnerUp?.character.id ?? null,
        topTraits,
        traitTotals: engine.traitTotals,
        ranked: scored.ranked.map((entry) => ({ id: entry.character.id, score: entry.score })),
        timestamp: Date.now(),
      }

      addHistory(result)
      saveLastResult({ themeId: theme.id, lastResultId: result.id })
      router.push('/result')
      return
    }

    setSelected(null)
    setQuestionKey((prev) => prev + 1)
  }

  return (
    <main className="min-h-[100dvh] p-4">
      <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col gap-3 py-4">
        <p className="text-sm font-bold text-accent-coral">Question {engine.currentQuestionIndex + 1} / {selectedQuestions.length}</p>
        <CharacterResultCard
          key={questionKey}
          question={question}
          selectedIndex={selected}
          onSelect={setSelected}
          onContinue={onContinue}
        />
      </div>
    </main>
  )
}

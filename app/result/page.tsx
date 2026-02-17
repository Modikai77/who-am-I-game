'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { loadTheme } from '@/lib/theme'
import { readHistory, readLastResult, readLastTheme } from '@/lib/storage'
import ResultCard from '@/components/ResultCard'

function randomSetIndex() {
  return Math.floor(Math.random() * 5)
}

export default function ResultPage() {
  const ref = useMemo(() => readLastResult(), [])
  const themeId = ref?.themeId ?? readLastTheme() ?? ''
  const theme = useMemo(() => {
    if (!themeId) return null
    try {
      return loadTheme(themeId)
    } catch {
      return null
    }
  }, [themeId])

  const history = useMemo(() => readHistory(), [])
  const result = useMemo(() => {
    if (!ref) return null
    return history.find((entry) => entry.id === ref.lastResultId) ?? null
  }, [history, ref])

  if (!theme || !result) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center p-4">
        <div className="text-center rounded-2xl card-float p-5">
          <p className="text-xl font-bold">No result ready yet.</p>
          <Link href="/" className="mt-4 inline-block rounded-xl bg-accent-sky px-4 py-3 text-white font-bold">
            Back to themes
          </Link>
        </div>
      </main>
    )
  }

  const winner = theme.characters.find((item) => item.id === result.winnerId)
  const runnerUp = theme.characters.find((item) => item.id === result.runnerUpId)

  const topTraits = result.topTraits
  const explanation = topTraits
    .slice(0, 3)
    .map((item) => item)
    .join(', ')

  return (
    <main className="min-h-[100dvh] p-4">
      <div className="mx-auto max-w-lg">
        <p className="text-sm font-bold text-accent-coral">Result</p>
        {winner ? (
          <ResultCard
            character={winner}
            explanation={explanation}
            topTraits={topTraits}
            runnerUp={runnerUp ?? null}
          />
        ) : null}
        <div className="mt-4 flex gap-3">
          <Link href={`/quiz/${theme.id}?set=${randomSetIndex()}`} className="flex-1 rounded-xl bg-accent-coral py-3 text-center text-white font-black">
            Retake
          </Link>
          <Link href="/" className="flex-1 rounded-xl bg-slate-700 py-3 text-center text-white font-black">
            Pick another theme
          </Link>
        </div>
      </div>
    </main>
  )
}

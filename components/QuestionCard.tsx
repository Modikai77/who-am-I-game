'use client'

import type { Question } from '@/lib/types'

interface Props {
  question: Question
  selectedIndex: number | null
  onSelect: (index: number) => void
  onContinue: () => void
}

export default function QuestionCard({ question, selectedIndex, onSelect, onContinue }: Props) {
  const canContinue = selectedIndex !== null

  return (
    <section className="h-[100dvh] w-full px-4 py-5 flex flex-col card-float rounded-3xl border border-white/50 shadow-xl">
      <h2 className="text-2xl font-extrabold leading-tight text-slate-900">{question.prompt}</h2>
      <div className="mt-6 grid gap-4 flex-1">
        {question.answers.map((answer, index) => {
          const active = selectedIndex === index
          return (
            <button
              key={answer.label}
              aria-label={answer.label}
              onClick={() => onSelect(index)}
              className={`answer-enter text-left rounded-2xl border-2 px-4 py-4 text-lg font-bold min-h-24 transition-all ${
                active
                  ? 'border-accent-coral bg-accent-coral/20 text-slate-900'
                  : 'border-slate-200 bg-white/80 hover:border-accent-sky'
              }`}
            >
              {answer.label}
            </button>
          )
        })}
      </div>
      <button
        disabled={!canContinue}
        onClick={onContinue}
        className={`mt-4 rounded-2xl py-4 text-xl font-black tracking-wide disabled:opacity-40 disabled:cursor-not-allowed ${
          canContinue
            ? 'bg-accent-sky text-white shadow-lg shadow-accent-sky/30'
            : 'bg-slate-300 text-slate-600'
        }`}
      >
        Continue
      </button>
    </section>
  )
}

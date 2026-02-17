'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { getAllThemes } from '@/lib/theme'
import { DEFAULT_SETTINGS, readSettings, saveSettings, saveLastTheme, resetHistory } from '@/lib/storage'
import type { AppSettings, Theme } from '@/lib/types'

function randomInt() {
  const min = 2
  const max = 10
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function ParentGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [a, setA] = useState(() => randomInt())
  const [b, setB] = useState(() => randomInt())
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  return (
    <div className="mt-3 rounded-2xl border border-white/70 p-4 card-float">
      <p className="font-black">Parent check: {a} + {b} = ?</p>
      <input
        type="number"
        aria-label="Parent math answer"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg"
      />
      <button
        onClick={() => {
          if (Number(input) === a + b) {
            setError('')
            onUnlocked()
          } else {
            setError('Try again, that is not right')
            setA(randomInt())
            setB(randomInt())
            setInput('')
          }
        }}
        className="mt-3 w-full rounded-xl bg-accent-sky py-3 text-white font-bold"
      >
        Enter
      </button>
      {error ? <p className="mt-2 text-sm text-accent-coral">{error}</p> : null}
    </div>
  )
}

export default function HomePage() {
  const themes = useMemo(() => getAllThemes(), [])
  const [parentModeOpen, setParentModeOpen] = useState(false)
  const [parentUnlocked, setParentUnlocked] = useState(false)
  const [settings, setSettings] = useState<AppSettings>(readSettings())

  const enabledThemes = themes.filter((theme) => settings.enabledThemes.includes(theme.id))
  const randomSetIndex = () => Math.floor(Math.random() * 5)

  return (
    <main className="min-h-[100dvh] p-4">
      <div className="mx-auto max-w-lg pt-6">
        <header className="rounded-3xl card-float border border-white/60 p-5">
          <p className="text-sm font-bold text-accent-coral">Kid-friendly quiz</p>
          <h1 className="mt-1 text-4xl font-black leading-tight">Who Are You?</h1>
          <p className="mt-2 text-base text-slate-700">Pick a theme and answer 8 questions to discover your match.</p>
        </header>

        <div className="mt-6 grid gap-3">
          {enabledThemes.length === 0 ? (
            <p className="rounded-xl border border-accent-coral/50 bg-accent-coral/10 p-3 font-bold">No themes are enabled. Enable one in Parent mode.</p>
          ) : null}
          {enabledThemes.map((theme: Theme) => (
            <Link
              key={theme.id}
              href={`/quiz/${theme.id}?set=${randomSetIndex()}`}
              onClick={() => {
                saveLastTheme(theme.id)
              }}
              className="flex items-center justify-between rounded-2xl card-float border border-white/60 p-4 hover:shadow-xl"
            >
              <div>
                <p className="text-sm font-semibold text-accent-coral">Theme</p>
                <p className="mt-1 text-2xl font-extrabold">{theme.title}</p>
                <p className="mt-1 text-sm text-slate-600">{theme.subtitle}</p>
              </div>
              <span className="text-4xl" aria-hidden>
                {theme.image}
              </span>
            </Link>
          ))}
        </div>

        <footer className="mt-6 space-y-2">
          <button
            onClick={() => {
              setParentModeOpen((open) => !open)
              if (!parentModeOpen) {
                setParentUnlocked(false)
              }
            }}
            className="text-sm font-bold text-slate-500 underline"
          >
            Parent settings
          </button>

          {parentModeOpen && (
            <div>
              {parentUnlocked ? (
                <div className="rounded-2xl border border-white/70 p-4 card-float">
                  <p className="font-black">Theme controls</p>
                  <div className="mt-2 space-y-2">
                    {themes.map((theme) => {
                      const enabled = settings.enabledThemes.includes(theme.id)
                      return (
                        <label
                          key={theme.id}
                          className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2"
                        >
                          <span>{theme.title}</span>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => {
                              const nextEnabled = e.target.checked
                                ? [...settings.enabledThemes, theme.id]
                                : settings.enabledThemes.filter((id) => id !== theme.id)
                              const next: AppSettings = {
                                ...settings,
                                enabledThemes: nextEnabled,
                              }
                              setSettings(next)
                              saveSettings(next)
                            }}
                          />
                        </label>
                      )
                    })}
                  </div>

                  <label className="mt-3 flex items-center justify-between rounded-lg bg-white/60 px-3 py-2">
                    <span>Quick mode (future use)</span>
                    <input
                      type="checkbox"
                      checked={settings.quickMode}
                      onChange={(e) => {
                        const next: AppSettings = {
                          ...settings,
                          quickMode: e.target.checked,
                        }
                        setSettings(next)
                        saveSettings(next)
                      }}
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (confirm('Reset quiz history now?')) {
                        resetHistory()
                      }
                    }}
                    className="mt-4 w-full rounded-xl bg-accent-coral py-3 font-black text-white"
                  >
                    Reset history
                  </button>
                  <button
                    onClick={() => {
                      const merged = {
                        ...DEFAULT_SETTINGS,
                        enabledThemes: settings.enabledThemes.length > 0 ? settings.enabledThemes : DEFAULT_SETTINGS.enabledThemes,
                        quickMode: settings.quickMode,
                      }
                      setSettings(merged)
                      saveSettings(merged)
                    }}
                    className="mt-2 w-full rounded-xl bg-slate-700 py-2 text-white"
                  >
                    Ensure defaults
                  </button>
                </div>
              ) : (
                <ParentGate onUnlocked={() => setParentUnlocked(true)} />
              )}
            </div>
          )}
        </footer>
      </div>
    </main>
  )
}

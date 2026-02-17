import type { AppSettings, SavedResult } from './types'
import { getAllThemes } from './theme'

const KEYS = {
  settings: 'who-are-you-settings',
  history: 'who-are-you-history',
  lastResult: 'who-are-you-last-result',
  lastTheme: 'who-are-you-last-theme',
  kidResults: 'who-are-you-kid-results',
}

export const DEFAULT_SETTINGS: AppSettings = {
  enabledThemes: getAllThemes().map((theme) => theme.id),
  quickMode: false,
}

function isBrowser() {
  return typeof window !== 'undefined'
}

export function readSettings(): AppSettings {
  if (!isBrowser()) return { ...DEFAULT_SETTINGS }
  const raw = window.localStorage.getItem(KEYS.settings)
  if (!raw) return { ...DEFAULT_SETTINGS }
  try {
    const parsed = JSON.parse(raw) as AppSettings
    if (!parsed.enabledThemes?.length) {
      return { ...DEFAULT_SETTINGS }
    }
    return {
      enabledThemes: parsed.enabledThemes,
      quickMode: parsed.quickMode ?? false,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AppSettings) {
  if (!isBrowser()) return
  window.localStorage.setItem(KEYS.settings, JSON.stringify(settings))
}

export function readHistory(): SavedResult[] {
  if (!isBrowser()) return []
  const raw = window.localStorage.getItem(KEYS.history)
  if (!raw) return []
  try {
    return JSON.parse(raw) as SavedResult[]
  } catch {
    return []
  }
}

export function saveHistory(history: SavedResult[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(KEYS.history, JSON.stringify(history.slice(0, 20)))
}

export function addHistory(result: SavedResult) {
  const history = readHistory()
  saveHistory([result, ...history.filter((entry) => entry.id !== result.id)])
}

export function saveLastResult(ref: { themeId: string; lastResultId: string }) {
  if (!isBrowser()) return
  window.localStorage.setItem(KEYS.lastResult, JSON.stringify(ref))
  window.localStorage.setItem(KEYS.lastTheme, ref.themeId)
}

export function readLastResult(): { themeId: string; lastResultId: string } | null {
  if (!isBrowser()) return null
  const raw = window.localStorage.getItem(KEYS.lastResult)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { themeId: string; lastResultId: string }
  } catch {
    return null
  }
}

export function readResultById(lastResultId: string): SavedResult | null {
  const history = readHistory()
  return history.find((result) => result.id === lastResultId) ?? null
}

export function readLastTheme(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(KEYS.lastTheme)
}

export function saveLastTheme(themeId: string) {
  if (!isBrowser()) return
  window.localStorage.setItem(KEYS.lastTheme, themeId)
}

export function resetHistory() {
  if (!isBrowser()) return
  window.localStorage.removeItem(KEYS.history)
  window.localStorage.removeItem(KEYS.lastResult)
}

export function saveKidResult(kidName: string, result: SavedResult) {
  if (!isBrowser()) return
  const raw = window.localStorage.getItem(KEYS.kidResults)
  const map: Record<string, SavedResult[]> = raw ? (() => {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  })() : {}
  const kidHistory = map[kidName] ?? []
  map[kidName] = [result, ...kidHistory.filter((entry) => entry.id !== result.id)].slice(0, 20)
  window.localStorage.setItem(KEYS.kidResults, JSON.stringify(map))
}

import { describe, it, expect, beforeEach } from 'vitest'
import {
  setHistoryEnabled,
  getHistory,
  recordAnalysisEntry,
  clearHistory,
  generateMarkdownReport,
} from '../services/historyStorage'
import { analyzePassword } from '../services/analyzerEngine'

describe('Privacy Guarantees & Non-Retention Policy', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('never stores plaintext passwords or hashes in audit history', () => {
    setHistoryEnabled(true)

    const secretPassword = 'UltraSecretPassword2026!XYZ'
    const analysis = analyzePassword(secretPassword)

    recordAnalysisEntry(analysis)

    const storedHistory = getHistory()
    expect(storedHistory).toHaveLength(1)

    const entry = storedHistory[0]

    // Verify metadata was captured
    expect(entry.passwordLength).toBe(secretPassword.length)
    expect(entry.score).toBe(analysis.score)

    // Verify plaintext password does NOT exist anywhere in stored object
    const serialized = JSON.stringify(entry)
    expect(serialized).not.toContain(secretPassword)
    expect(serialized).not.toContain('UltraSecret')

    // Verify raw localStorage does not contain secret password
    const allStorage = JSON.stringify(localStorage)
    expect(allStorage).not.toContain(secretPassword)
  })

  it('exported markdown report does not contain sensitive password data', () => {
    setHistoryEnabled(true)
    const secret = 'TopSecretCorporateAccess123!'
    const analysis = analyzePassword(secret)
    recordAnalysisEntry(analysis)

    const history = getHistory()
    const markdown = generateMarkdownReport(history)

    expect(markdown).toContain('PassSecure — Password Hygiene Audit Report')
    expect(markdown).toContain('Executive Summary')
    // Must NOT contain the plaintext password
    expect(markdown).not.toContain(secret)
  })

  it('respects opt-out preference and ignores recording when disabled', () => {
    setHistoryEnabled(false)

    const analysis = analyzePassword('TestPassword123!')
    recordAnalysisEntry(analysis)

    const history = getHistory()
    expect(history).toHaveLength(0)
  })

  it('clearHistory completely wipes all history records', () => {
    setHistoryEnabled(true)
    const analysis = analyzePassword('SampleTest999!')
    recordAnalysisEntry(analysis)
    expect(getHistory().length).toBeGreaterThan(0)

    clearHistory()
    expect(getHistory()).toHaveLength(0)
  })
})

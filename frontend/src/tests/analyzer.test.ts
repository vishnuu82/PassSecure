import { describe, it, expect } from 'vitest'
import { analyzePassword } from '../services/analyzerEngine'

describe('Password Analyzer Engine', () => {
  it('handles empty input gracefully', () => {
    const result = analyzePassword('')
    expect(result.score).toBe(0)
    expect(result.length).toBe(0)
    expect(result.entropyBits).toBe(0)
    expect(result.patterns).toHaveLength(0)
    expect(result.isBreachedInLocalDb).toBe(false)
  })

  it('identifies very short passwords with critical length pattern', () => {
    const result = analyzePassword('abc')
    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.length).toBe(3)
    const lenPattern = result.patterns.find((p) => p.type === 'length')
    expect(lenPattern).toBeDefined()
    expect(lenPattern?.severity).toBe('critical')
  })

  it('detects sequential alphabetic and numeric patterns', () => {
    const resSeqNum = analyzePassword('test1234test')
    expect(resSeqNum.patterns.some((p) => p.type === 'sequential')).toBe(true)

    const resSeqAlpha = analyzePassword('myabcdpass')
    expect(resSeqAlpha.patterns.some((p) => p.type === 'sequential')).toBe(true)
  })

  it('detects repeated characters', () => {
    const result = analyzePassword('aaaa1234')
    expect(result.patterns.some((p) => p.type === 'repetition')).toBe(true)
  })

  it('detects keyboard walk sequences', () => {
    const result = analyzePassword('myqwerty99')
    expect(result.patterns.some((p) => p.type === 'keyboard')).toBe(true)
  })

  it('detects corporate seasonal templates (Season + Year + !)', () => {
    const result = analyzePassword('Summer2024!')
    expect(result.patterns.some((p) => p.type === 'prefix_suffix' || p.type === 'date')).toBe(true)
    expect(result.isBreachedInLocalDb).toBe(true)
    expect(result.score).toBe(0) // Capped because in known breach db
  })

  it('recognizes high-entropy long passphrases as strong', () => {
    const result = analyzePassword('cobalt-falcon-granite-summit')
    expect(result.score).toBeGreaterThanOrEqual(3)
    expect(result.entropyBits).toBeGreaterThan(50)
    expect(result.length).toBe(28)
  })

  it('properly evaluates unicode input', () => {
    const result = analyzePassword('Pässwörd123!🛡️')
    expect(result.length).toBeGreaterThan(10)
    expect(result.hasSymbols).toBe(true)
    expect(result.entropyBits).toBeGreaterThan(0)
  })

  it('provides illustrative crack times without empty crash', () => {
    const result = analyzePassword('RandomKey99!')
    expect(result.crackTimes).toBeDefined()
    expect(result.crackTimes.onlineThrottled).toBeTruthy()
    expect(result.crackTimes.offlineSlowHash).toBeTruthy()
    expect(result.crackTimes.offlineFastHash).toBeTruthy()
  })
})

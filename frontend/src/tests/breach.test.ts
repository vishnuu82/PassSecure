import { describe, it, expect, vi } from 'vitest'
import {
  computeSha1Hex,
  checkBreachLocalOnly,
  checkBreachKAnonymity,
} from '../services/breachService'
import { checkLocalBreachDb } from '../services/localBreachDb'

describe('Breach Checker & k-Anonymity Protocol', () => {
  it('computes correct standard SHA-1 hex hash', async () => {
    // Known test vector: "password" -> 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    const hash = await computeSha1Hex('password')
    expect(hash).toBe('5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8')
    expect(hash.length).toBe(40)
    expect(hash.slice(0, 5)).toBe('5BAA6')
  })

  it('detects known breached passwords in local offline dataset', () => {
    const res1 = checkLocalBreachDb('123456')
    expect(res1.breached).toBe(true)
    expect(res1.count).toBeGreaterThan(1000000)

    const res2 = checkLocalBreachDb('Summer2024!')
    expect(res2.breached).toBe(true)

    const cleanRes = checkLocalBreachDb('xK9#mQ4vL7!zR2bE8yW1')
    expect(cleanRes.breached).toBe(false)
    expect(cleanRes.count).toBe(0)
  })

  it('checkBreachLocalOnly correctly constructs result without network', async () => {
    const res = await checkBreachLocalOnly('password')
    expect(res.checked).toBe(true)
    expect(res.source).toBe('local_dataset')
    expect(res.breached).toBe(true)
    expect(res.hashPrefix).toBe('5BAA6')
  })

  it('handles empty input gracefully in checkBreachKAnonymity', async () => {
    const res = await checkBreachKAnonymity('')
    expect(res.checked).toBe(false)
    expect(res.breached).toBe(false)
  })

  it('falls back safely to local dataset when external network fails', async () => {
    // Mock fetch to simulate network error
    const originalFetch = global.fetch
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'))

    const res = await checkBreachKAnonymity('123456')
    expect(res.checked).toBe(true)
    expect(res.source).toBe('local_dataset')
    expect(res.breached).toBe(true)
    expect(res.notice).toContain('External k-anonymity service unreachable')

    global.fetch = originalFetch
  })
})

import { describe, it, expect } from 'vitest'
import {
  generateSecurePassword,
  generateSecurePassphrase,
  getSecureRandomInt,
} from '../services/cryptoGenerator'

describe('Secure Cryptographic Generator', () => {
  it('getSecureRandomInt produces values in bounded range [0, max-1]', () => {
    for (let i = 0; i < 50; i++) {
      const val = getSecureRandomInt(10)
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(10)
    }
  })

  it('throws when getSecureRandomInt is passed non-positive max', () => {
    expect(() => getSecureRandomInt(0)).toThrow()
    expect(() => getSecureRandomInt(-5)).toThrow()
  })

  it('generates passwords satisfying character-set constraints', () => {
    const pwd = generateSecurePassword({
      mode: 'password',
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeDigits: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      passphraseWords: 4,
      passphraseSeparator: '-',
      passphraseCapitalize: true,
      passphraseIncludeNumber: true,
    })

    expect(pwd.length).toBe(20)
    expect(/[A-Z]/.test(pwd)).toBe(true)
    expect(/[a-z]/.test(pwd)).toBe(true)
    expect(/[0-9]/.test(pwd)).toBe(true)
    expect(/[^a-zA-Z0-9]/.test(pwd)).toBe(true)
  })

  it('enforces exclusion of ambiguous characters', () => {
    const ambiguousChars = ['0', 'O', 'o', '1', 'l', 'I', '|']

    for (let i = 0; i < 20; i++) {
      const pwd = generateSecurePassword({
        mode: 'password',
        length: 32,
        includeUppercase: true,
        includeLowercase: true,
        includeDigits: true,
        includeSymbols: true,
        excludeAmbiguous: true,
        passphraseWords: 4,
        passphraseSeparator: '-',
        passphraseCapitalize: true,
        passphraseIncludeNumber: true,
      })

      for (const char of ambiguousChars) {
        expect(pwd.includes(char)).toBe(false)
      }
    }
  })

  it('prevents empty or impossible configuration', () => {
    expect(() =>
      generateSecurePassword({
        mode: 'password',
        length: 16,
        includeUppercase: false,
        includeLowercase: false,
        includeDigits: false,
        includeSymbols: false,
        excludeAmbiguous: false,
        passphraseWords: 4,
        passphraseSeparator: '-',
        passphraseCapitalize: true,
        passphraseIncludeNumber: true,
      })
    ).toThrow('At least one character set must be selected.')
  })

  it('clamps length between 12 and 64', () => {
    const shortPwd = generateSecurePassword({
      mode: 'password',
      length: 5,
      includeUppercase: true,
      includeLowercase: true,
      includeDigits: true,
      includeSymbols: false,
      excludeAmbiguous: false,
      passphraseWords: 4,
      passphraseSeparator: '-',
      passphraseCapitalize: true,
      passphraseIncludeNumber: true,
    })
    expect(shortPwd.length).toBe(12) // Clamped to minimum 12

    const longPwd = generateSecurePassword({
      mode: 'password',
      length: 100,
      includeUppercase: true,
      includeLowercase: true,
      includeDigits: true,
      includeSymbols: false,
      excludeAmbiguous: false,
      passphraseWords: 4,
      passphraseSeparator: '-',
      passphraseCapitalize: true,
      passphraseIncludeNumber: true,
    })
    expect(longPwd.length).toBe(64) // Clamped to maximum 64
  })

  it('generates memorable Diceware passphrases with custom separators', () => {
    const passphrase = generateSecurePassphrase({
      mode: 'passphrase',
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeDigits: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      passphraseWords: 5,
      passphraseSeparator: '#',
      passphraseCapitalize: true,
      passphraseIncludeNumber: false,
    })

    const parts = passphrase.split('#')
    expect(parts).toHaveLength(5)
    // Check capitalization
    for (const word of parts) {
      expect(word[0]).toBe(word[0].toUpperCase())
    }
  })

  it('correctly appends random number to passphrase when enabled', () => {
    const passphrase = generateSecurePassphrase({
      mode: 'passphrase',
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeDigits: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      passphraseWords: 3,
      passphraseSeparator: '-',
      passphraseCapitalize: false,
      passphraseIncludeNumber: true,
    })

    const parts = passphrase.split('-')
    expect(parts).toHaveLength(4) // 3 words + 1 number
    const lastPart = parts[3]
    expect(/^\d+$/.test(lastPart)).toBe(true)
  })
})

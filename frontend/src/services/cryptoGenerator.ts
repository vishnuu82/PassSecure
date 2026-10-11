import type { GeneratorOptions } from '../types'
import { PASSPHRASE_WORDLIST } from './wordlist'

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~',
}

const AMBIGUOUS_CHARS = new Set(['0', 'O', 'o', '1', 'l', 'I', '|'])

/**
 * Generate a cryptographically secure, unbiased random integer in [0, max - 1].
 * Uses rejection sampling over 32-bit unsigned integers to eliminate modulo bias.
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) {
    throw new Error('Max must be greater than 0')
  }
  if (max === 1) return 0

  const UINT32_MAX = 0xffffffff
  const limit = UINT32_MAX - (UINT32_MAX % max)
  const buffer = new Uint32Array(1)

  let randomVal: number
  do {
    window.crypto.getRandomValues(buffer)
    randomVal = buffer[0]
  } while (randomVal >= limit)

  return randomVal % max
}

/**
 * Filter character set removing ambiguous characters if requested
 */
function sanitizeCharset(charset: string, excludeAmbiguous: boolean): string {
  if (!excludeAmbiguous) return charset
  return charset
    .split('')
    .filter((char) => !AMBIGUOUS_CHARS.has(char))
    .join('')
}

/**
 * Secure Fisher-Yates array shuffle using getSecureRandomInt
 */
function secureShuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

/**
 * Generate a cryptographically secure random password
 */
export function generateSecurePassword(options: GeneratorOptions): string {
  if (options.mode === 'passphrase') {
    return generateSecurePassphrase(options)
  }

  // Length constraints
  const length = Math.max(12, Math.min(64, options.length))

  // Build active pools
  const activeSets: string[] = []
  if (options.includeUppercase) {
    const set = sanitizeCharset(CHARSETS.uppercase, options.excludeAmbiguous)
    if (set.length > 0) activeSets.push(set)
  }
  if (options.includeLowercase) {
    const set = sanitizeCharset(CHARSETS.lowercase, options.excludeAmbiguous)
    if (set.length > 0) activeSets.push(set)
  }
  if (options.includeDigits) {
    const set = sanitizeCharset(CHARSETS.digits, options.excludeAmbiguous)
    if (set.length > 0) activeSets.push(set)
  }
  if (options.includeSymbols) {
    const set = sanitizeCharset(CHARSETS.symbols, options.excludeAmbiguous)
    if (set.length > 0) activeSets.push(set)
  }

  if (activeSets.length === 0) {
    throw new Error('At least one character set must be selected.')
  }

  const combinedCharset = activeSets.join('')
  const passwordChars: string[] = []

  // Ensure at least one character from each selected set is included
  for (const set of activeSets) {
    const idx = getSecureRandomInt(set.length)
    passwordChars.push(set[idx])
  }

  // Fill remaining slots uniformly from combined charset
  while (passwordChars.length < length) {
    const idx = getSecureRandomInt(combinedCharset.length)
    passwordChars.push(combinedCharset[idx])
  }

  // Cryptographically shuffle the result to avoid predictable initial positions
  return secureShuffle(passwordChars).join('')
}

/**
 * Generate a memorable, high-entropy Diceware passphrase
 */
export function generateSecurePassphrase(options: GeneratorOptions): string {
  const wordCount = Math.max(3, Math.min(8, options.passphraseWords))
  const separator = options.passphraseSeparator ?? '-'
  const words: string[] = []

  const listSize = PASSPHRASE_WORDLIST.length
  if (listSize === 0) {
    throw new Error('Wordlist is empty.')
  }

  for (let i = 0; i < wordCount; i++) {
    const idx = getSecureRandomInt(listSize)
    let word = PASSPHRASE_WORDLIST[idx]
    if (options.passphraseCapitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    words.push(word)
  }

  let passphrase = words.join(separator)

  // Optionally append random digit
  if (options.passphraseIncludeNumber) {
    const randomDigit = getSecureRandomInt(10)
    passphrase += `${separator}${randomDigit}`
  }

  return passphrase
}

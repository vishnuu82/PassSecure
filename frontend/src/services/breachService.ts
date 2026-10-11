import type { BreachCheckResult } from '../types'
import { checkLocalBreachDb } from './localBreachDb'

/**
 * Computes SHA-1 hash locally in the browser using the Web Crypto API.
 * Note: SHA-1 is strictly used here to conform to the Have I Been Pwned
 * k-anonymity protocol and is NOT recommended for secure password storage.
 */
export async function computeSha1Hex(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

/**
 * Perform a privacy-preserving k-anonymity check using the HIBP range API.
 * Only the first 5 hexadecimal characters of the SHA-1 hash are transmitted.
 */
export async function checkBreachKAnonymity(
  password: string,
  proxyUrl?: string
): Promise<BreachCheckResult> {
  if (!password) {
    return {
      checked: false,
      source: 'hibp_k_anonymity',
      breached: false,
      breachCount: 0,
      hashPrefix: '',
      timestamp: new Date().toISOString(),
      notice: 'No password provided.',
    }
  }

  const startTime = performance.now()
  const fullHash = await computeSha1Hex(password)
  const prefix = fullHash.slice(0, 5)
  const suffix = fullHash.slice(5)

  // Target endpoint: direct to HIBP or through local FastAPI proxy if provided
  const targetUrl = proxyUrl
    ? `${proxyUrl}?prefix=${prefix}`
    : `https://api.pwnedpasswords.com/range/${prefix}`

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Add-Padding': 'true', // Requests random dummy records to mitigate response-length side channels
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded from HIBP API. Please wait a few seconds and try again.')
      }
      throw new Error(`HIBP API responded with HTTP status ${response.status}`)
    }

    const text = await response.text()
    const lines = text.split('\r\n').filter(Boolean)

    let matchCount = 0
    let found = false

    for (const line of lines) {
      const parts = line.split(':')
      if (parts.length >= 2) {
        const itemSuffix = parts[0].trim().toUpperCase()
        const count = parseInt(parts[1].trim(), 10)
        if (itemSuffix === suffix) {
          found = true
          matchCount = isNaN(count) ? 1 : count
          break
        }
      }
    }

    const duration = Math.round(performance.now() - startTime)

    return {
      checked: true,
      source: 'hibp_k_anonymity',
      breached: found,
      breachCount: matchCount,
      hashPrefix: prefix,
      hashSuffixPreview: `${suffix.slice(0, 4)}...${suffix.slice(-4)}`,
      timestamp: new Date().toISOString(),
      responseTimeMs: duration,
      notice: found
        ? `ALERT: This password appears in ${matchCount.toLocaleString()} known breach compromises in the Have I Been Pwned database.`
        : 'Good news: No matches found in the Have I Been Pwned breach database. (Note: This does not guarantee safety if the password is simple).',
    }
  } catch (error) {
    // If external network fails, fall back to local dataset check with a clear notice
    const local = checkLocalBreachDb(password)
    return {
      checked: true,
      source: 'local_dataset',
      breached: local.breached,
      breachCount: local.count,
      hashPrefix: prefix,
      hashSuffixPreview: `${suffix.slice(0, 4)}...`,
      timestamp: new Date().toISOString(),
      responseTimeMs: Math.round(performance.now() - startTime),
      notice: `External k-anonymity service unreachable (${(error as Error).message}). Evaluated against bundled local breach database instead.`,
    }
  }
}

/**
 * Perform a strictly local breach check without any network communication
 */
export async function checkBreachLocalOnly(password: string): Promise<BreachCheckResult> {
  const fullHash = await computeSha1Hex(password)
  const prefix = fullHash.slice(0, 5)
  const suffix = fullHash.slice(5)
  const local = checkLocalBreachDb(password)

  return {
    checked: true,
    source: 'local_dataset',
    breached: local.breached,
    breachCount: local.count,
    hashPrefix: prefix,
    hashSuffixPreview: `${suffix.slice(0, 4)}...${suffix.slice(-4)}`,
    timestamp: new Date().toISOString(),
    notice: local.breached
      ? `Identified in offline breach database with approximately ${local.count.toLocaleString()} occurrences.`
      : 'No match in local top-breach dataset. (Note: Offline dataset contains a curated top sample, not exhaustive records).',
  }
}

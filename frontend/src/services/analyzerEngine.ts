import zxcvbn from 'zxcvbn'
import type {
  PasswordAnalysisResult,
  PasswordScore,
  ScoreLabel,
  DetectedPattern,
  CrackTimeEstimates
} from '../types'
import { checkLocalBreachDb } from './localBreachDb'

const SCORE_LABELS: Record<PasswordScore, ScoreLabel> = {
  0: 'Very Weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Strong',
  4: 'Very Strong',
}

/**
 * Format raw seconds into clear human-readable timeframes
 */
function formatDuration(seconds: number): string {
  if (seconds <= 0.001) return 'Instantly'
  if (seconds < 1) return '< 1 second'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
  if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`
  if (seconds < 31536000 * 1000000) return `${(seconds / 31536000).toExponential(1)} years`
  return 'Centuries'
}

/**
 * Calculate illustrative crack times across 4 realistic threat scenarios
 */
function calculateCrackTimes(guesses: number): CrackTimeEstimates {
  // Scenario 1: Online Throttled (100 guesses/hour = ~0.0278/sec)
  const onlineThrottledSec = guesses / (100 / 3600)
  // Scenario 2: Online Unthrottled API (10 guesses/sec)
  const onlineFastSec = guesses / 10
  // Scenario 3: Offline Slow Hashing (Argon2id, bcrypt: 10,000 hashes/sec on multi-core GPU)
  const offlineSlowSec = guesses / 10000
  // Scenario 4: Fast unsalted hash (MD5, NTLM on high-performance multi-GPU rig: 10 billion/sec)
  const offlineFastSec = guesses / 10000000000

  return {
    onlineThrottled: formatDuration(onlineThrottledSec),
    onlineFast: formatDuration(onlineFastSec),
    offlineSlowHash: formatDuration(offlineSlowSec),
    offlineFastHash: formatDuration(offlineFastSec),
  }
}

/**
 * Calculate Shannon Information Entropy in bits:
 * H = L * log2(R) where R is the size of the active character pool
 */
function calculateEntropy(password: string): { bits: number; charsetSize: number } {
  if (!password) return { bits: 0, charsetSize: 0 }

  let charset = 0
  if (/[a-z]/.test(password)) charset += 26
  if (/[A-Z]/.test(password)) charset += 26
  if (/[0-9]/.test(password)) charset += 10
  if (/[^a-zA-Z0-9]/.test(password)) charset += 33

  if (charset === 0) return { bits: 0, charsetSize: 0 }
  const bits = Math.round(password.length * Math.log2(charset) * 10) / 10
  return { bits, charsetSize: charset }
}

/**
 * Pattern detection engine: analyzes passwords for structural predictability
 */
function detectPatterns(password: string, zxResult: zxcvbn.ZXCVBNResult): DetectedPattern[] {
  const patterns: DetectedPattern[] = []
  const len = password.length

  if (len === 0) return patterns

  // 1. Length Evaluation
  if (len < 8) {
    patterns.push({
      id: 'len-crit',
      type: 'length',
      name: 'Extremely Short Length',
      description: `Only ${len} characters. Passwords shorter than 8 characters can be brute-forced within seconds regardless of character diversity.`,
      severity: 'critical',
    })
  } else if (len < 12) {
    patterns.push({
      id: 'len-warn',
      type: 'length',
      name: 'Short to Moderate Length',
      description: `${len} characters. NIST SP 800-63B recommends at least 12–16 characters to resist modern offline GPU-accelerated hash cracking.`,
      severity: 'warning',
    })
  } else if (len >= 16) {
    patterns.push({
      id: 'len-good',
      type: 'length',
      name: 'Excellent Length',
      description: `${len} characters provides strong combinatorial resilience against automated guessing.`,
      severity: 'good',
    })
  }

  // 2. Character Set Diversity
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasDigit = /[0-9]/.test(password)
  const hasSymbol = /[^a-zA-Z0-9]/.test(password)
  const classCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length

  if (classCount <= 1 && len >= 4) {
    patterns.push({
      id: 'div-single',
      type: 'diversity',
      name: 'Single Character Class',
      description: 'Password uses only one character set, dramatically reducing the search space for automated brute-force attacks.',
      severity: 'warning',
    })
  }

  // 3. Repeated Characters (e.g. 'aaa', '1111')
  const repeatRegex = /(.)\1{2,}/i
  const repeatMatch = password.match(repeatRegex)
  if (repeatMatch) {
    patterns.push({
      id: 'rep-consecutive',
      type: 'repetition',
      name: 'Consecutive Repeated Characters',
      description: `Detected repeating character sequence "${repeatMatch[0]}". Repeated characters provide minimal entropy.`,
      severity: 'warning',
      match: repeatMatch[0],
    })
  }

  // Repetition ratio
  const uniqueChars = new Set(password).size
  if (len >= 6 && uniqueChars / len < 0.45) {
    patterns.push({
      id: 'rep-ratio',
      type: 'repetition',
      name: 'High Character Redundancy',
      description: `Over ${(100 - (uniqueChars / len) * 100).toFixed(0)}% of the password consists of duplicated characters.`,
      severity: 'warning',
    })
  }

  // 4. Sequential Characters (abc, 123)
  const sequentialPatterns = [
    '0123456789',
    '9876543210',
    'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba',
  ]
  const lowerPwd = password.toLowerCase()

  for (const seq of sequentialPatterns) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const slice = seq.slice(i, i + 3)
      if (lowerPwd.includes(slice)) {
        patterns.push({
          id: `seq-${slice}`,
          type: 'sequential',
          name: 'Predictable Sequential Pattern',
          description: `Detected sequential pattern "${slice}". Standard rule-based attack engines prioritize sequential sequences.`,
          severity: 'warning',
          match: slice,
        })
        break
      }
    }
  }

  // 5. Keyboard Walk / Spatial Patterns
  const keyboardRows = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
    '1qaz2wsx3edc',
  ]
  for (const row of keyboardRows) {
    for (let i = 0; i <= row.length - 4; i++) {
      const slice = row.slice(i, i + 4)
      if (lowerPwd.includes(slice)) {
        patterns.push({
          id: `kb-${slice}`,
          type: 'keyboard',
          name: 'Keyboard Walk Sequence',
          description: `Detected physical keyboard sequence "${slice}". Keyboard patterns are indexed at high priority in cracking dictionaries.`,
          severity: 'critical',
          match: slice,
        })
        break
      }
    }
  }

  // 6. Predictable L33t Substitutions
  const leetPatterns = [
    { target: 'p@ss', original: 'pass' },
    { target: 'p@$$', original: 'pass' },
    { target: 'w0rd', original: 'word' },
    { target: 'adm!n', original: 'admin' },
    { target: 's3cur', original: 'secur' },
  ]
  for (const { target, original } of leetPatterns) {
    if (lowerPwd.includes(target)) {
      patterns.push({
        id: `leet-${target}`,
        type: 'leet',
        name: 'Predictable Leet Substitution',
        description: `Common substitution "${target}" for "${original}". Modern hash-cracking tools (e.g., Hashcat) automatically expand leet-speak masks.`,
        severity: 'warning',
        match: target,
      })
      break
    }
  }

  // 7. Years & Calendar Dates (1940-2035)
  const yearMatch = password.match(/\b(19\d\d|20[0-3]\d)\b/) || password.match(/(19\d\d|20[0-3]\d)/)
  if (yearMatch) {
    patterns.push({
      id: 'date-year',
      type: 'date',
      name: 'Detected 4-Digit Year',
      description: `Contains year "${yearMatch[0]}". Year suffixes and birth years are among the first mutations tested in credential attacks.`,
      severity: 'warning',
      match: yearMatch[0],
    })
  }

  // 8. Predictable Prefix / Suffix Padding
  if (/^[A-Za-z]+[0-9]{1,4}[!@#$%^&*]$/.test(password)) {
    patterns.push({
      id: 'pad-corp',
      type: 'prefix_suffix',
      name: 'Common "Word + Numbers + Symbol" Template',
      description: 'Matches the predictable corporate mask: Word + Number + Symbol (e.g., Summer2024!). Attackers target this structure with hybrid mask attacks.',
      severity: 'warning',
    })
  }

  // 9. zxcvbn match analysis
  if (zxResult.sequence && Array.isArray(zxResult.sequence)) {
    for (const seq of zxResult.sequence) {
      if (seq.pattern === 'dictionary' && seq.matched_word) {
        if (!patterns.some((p) => p.match?.toLowerCase() === seq.matched_word.toLowerCase())) {
          patterns.push({
            id: `dict-${seq.matched_word}`,
            type: 'dictionary',
            name: 'Dictionary Word Match',
            description: `Identified common dictionary word or name "${seq.matched_word}" in dictionary "${seq.dictionary_name || 'english'}".`,
            severity: seq.rank && seq.rank < 1000 ? 'critical' : 'warning',
            match: seq.matched_word,
          })
        }
      }
    }
  }

  return patterns
}

/**
 * Generate evidence-based recommendations
 */
function generateRecommendations(
  password: string,
  patterns: DetectedPattern[],
  score: PasswordScore,
  isBreached: boolean
): string[] {
  const recommendations: string[] = []

  if (isBreached) {
    recommendations.push(
      'URGENT: This password is known to appear in public breach datasets. Change it immediately on all services where it is used.'
    )
  }

  if (password.length < 12) {
    recommendations.push(
      'Increase length to at least 14–16 characters. Length provides far greater cryptographic search resistance than symbol substitution.'
    )
  }

  if (patterns.some((p) => p.type === 'prefix_suffix')) {
    recommendations.push(
      'Avoid predictable corporate formats like "Word + Year + !". Use a 4–5 word random passphrase instead (e.g., "cobalt-falcon-granite-summit").'
    )
  }

  if (patterns.some((p) => p.type === 'sequential' || p.type === 'keyboard')) {
    recommendations.push(
      'Remove sequential letters, numbers, or keyboard walks (such as "123", "abc", or "qwerty").'
    )
  }

  if (patterns.some((p) => p.type === 'date')) {
    recommendations.push(
      'Eliminate birth years, anniversary dates, or current years from your password.'
    )
  }

  if (patterns.some((p) => p.type === 'dictionary' || p.type === 'leet')) {
    recommendations.push(
      'Do not rely on leet-speak (like "@" for "a" or "0" for "o"). Attack tools test these rule substitutions in milliseconds.'
    )
  }

  // General hygiene recommendations
  if (score >= 3) {
    recommendations.push(
      'Store this in a dedicated password manager and ensure multi-factor authentication (TOTP or FIDO2) is enabled on the account.'
    )
  } else {
    recommendations.push(
      'Use a unique password for every account. Never reuse passwords between personal and work services.'
    )
    recommendations.push(
      'Consider switching to a generated 4-word Diceware passphrase for high memorability and entropy.'
    )
  }

  return recommendations
}

/**
 * Main password analysis function
 */
export function analyzePassword(password: string): PasswordAnalysisResult {
  if (!password) {
    return {
      score: 0,
      scoreLabel: 'Very Weak',
      length: 0,
      entropyBits: 0,
      charsetSize: 0,
      hasUppercase: false,
      hasLowercase: false,
      hasDigits: false,
      hasSymbols: false,
      guesses: 0,
      guessesLog10: 0,
      crackTimes: {
        onlineThrottled: '0 seconds',
        onlineFast: '0 seconds',
        offlineSlowHash: '0 seconds',
        offlineFastHash: '0 seconds',
      },
      patterns: [],
      recommendations: ['Enter a password above to evaluate its strength and security patterns.'],
      isBreachedInLocalDb: false,
      feedback: {
        warning: null,
        suggestions: ['Enter at least 12 characters or a 4-word passphrase.'],
      },
    }
  }

  // Run zxcvbn documented estimator
  const zxResult = zxcvbn(password)

  // Local breach check
  const localBreach = checkLocalBreachDb(password)

  // If password appears in top breach database, cap score at 0
  let adjustedScore = zxResult.score as PasswordScore
  if (localBreach.breached && adjustedScore > 0) {
    adjustedScore = 0
  }

  // Calculate Shannon entropy & charset size
  const { bits: entropyBits, charsetSize } = calculateEntropy(password)

  // Detect patterns
  const patterns = detectPatterns(password, zxResult)

  // Add breach pattern if found locally
  if (localBreach.breached) {
    patterns.unshift({
      id: 'breach-local',
      type: 'common_password',
      name: 'Known Leaked Credential',
      description: `This password matches a known breached password observed over ${localBreach.count.toLocaleString()} times in public compromise dumps.`,
      severity: 'critical',
    })
  }

  // Calculate crack time estimates
  const crackTimes = calculateCrackTimes(zxResult.guesses)

  // Generate actionable recommendations
  const recommendations = generateRecommendations(
    password,
    patterns,
    adjustedScore,
    localBreach.breached
  )

  return {
    score: adjustedScore,
    scoreLabel: SCORE_LABELS[adjustedScore],
    length: password.length,
    entropyBits,
    charsetSize,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasDigits: /[0-9]/.test(password),
    hasSymbols: /[^a-zA-Z0-9]/.test(password),
    guesses: zxResult.guesses,
    guessesLog10: zxResult.guesses_log10,
    crackTimes,
    patterns,
    recommendations,
    isBreachedInLocalDb: localBreach.breached,
    localBreachCount: localBreach.count,
    feedback: {
      warning: zxResult.feedback.warning || (localBreach.breached ? 'This is a widely breached password' : null),
      suggestions: zxResult.feedback.suggestions.length > 0 ? zxResult.feedback.suggestions : recommendations.slice(0, 2),
    },
  }
}

export type PasswordScore = 0 | 1 | 2 | 3 | 4

export type ScoreLabel = 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'

export type PatternSeverity = 'critical' | 'warning' | 'info' | 'good'

export type PatternType =
  | 'length'
  | 'repetition'
  | 'sequential'
  | 'dictionary'
  | 'common_password'
  | 'leet'
  | 'keyboard'
  | 'date'
  | 'prefix_suffix'
  | 'diversity'

export interface DetectedPattern {
  id: string
  type: PatternType
  name: string
  description: string
  severity: PatternSeverity
  match?: string
}

export interface CrackTimeEstimates {
  onlineThrottled: string // 100/hour
  onlineFast: string // 10/sec
  offlineSlowHash: string // 10,000/sec (bcrypt/argon2)
  offlineFastHash: string // 10,000,000,000/sec (MD5/GPU rig)
}

export interface PasswordAnalysisResult {
  score: PasswordScore
  scoreLabel: ScoreLabel
  length: number
  entropyBits: number
  charsetSize: number
  hasUppercase: boolean
  hasLowercase: boolean
  hasDigits: boolean
  hasSymbols: boolean
  guesses: number
  guessesLog10: number
  crackTimes: CrackTimeEstimates
  patterns: DetectedPattern[]
  recommendations: string[]
  isBreachedInLocalDb: boolean
  localBreachCount?: number
  feedback: {
    warning: string | null
    suggestions: string[]
  }
}

export interface GeneratorOptions {
  mode: 'password' | 'passphrase'
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeDigits: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean
  passphraseWords: number
  passphraseSeparator: string
  passphraseCapitalize: boolean
  passphraseIncludeNumber: boolean
}

export interface BreachCheckResult {
  checked: boolean
  source: 'hibp_k_anonymity' | 'local_dataset'
  breached: boolean
  breachCount: number
  hashPrefix: string
  hashSuffixPreview?: string
  timestamp: string
  notice: string
  responseTimeMs?: number
}

export interface SyntheticAccount {
  id: string
  service: string
  category: 'Enterprise' | 'Financial' | 'Developer' | 'Social' | 'Cloud'
  username: string
  maskedPassword: string
  samplePassword: string
  length: number
  score: PasswordScore
  scoreLabel: ScoreLabel
  isReused: boolean
  reusedAccounts?: string[]
  hasMfa: boolean
  mfaType?: 'None' | 'SMS' | 'Authenticator App (TOTP)' | 'Hardware Key (FIDO2)'
  lastChangedMonths: number
  isBreachedDemo: boolean
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
  findings: string[]
}

export interface AuditSessionEntry {
  id: string
  timestamp: number
  passwordLength: number
  score: PasswordScore
  scoreLabel: ScoreLabel
  entropyBits: number
  detectedWeaknessCount: number
  weaknessTypes: string[]
}

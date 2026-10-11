import type { SyntheticAccount } from '../types'

export const ENTERPRISE_SIMULATION_ACCOUNTS: SyntheticAccount[] = [
  {
    id: 'sim-1',
    service: 'Acme Work Email & SSO',
    category: 'Enterprise',
    username: 'alex.chen@acmecorp.internal',
    maskedPassword: '••••••••••••',
    samplePassword: 'Summer2024!',
    length: 11,
    score: 1,
    scoreLabel: 'Weak',
    isReused: true,
    reusedAccounts: ['Acme Jira & Confluence', 'Internal VPN Portal'],
    hasMfa: false,
    mfaType: 'None',
    lastChangedMonths: 4,
    isBreachedDemo: true,
    riskLevel: 'Critical',
    findings: [
      'Matches common predictable corporate pattern ("Season + Year + !").',
      'Password reused across 3 internal corporate systems.',
      'No multi-factor authentication enforced on primary SSO identity.',
      'Appears in breach wordlists for seasonal brute-force dictionaries.',
    ],
  },
  {
    id: 'sim-2',
    service: 'Acme Jira & Confluence',
    category: 'Enterprise',
    username: 'alex.chen',
    maskedPassword: '••••••••••••',
    samplePassword: 'Summer2024!',
    length: 11,
    score: 1,
    scoreLabel: 'Weak',
    isReused: true,
    reusedAccounts: ['Acme Work Email & SSO', 'Internal VPN Portal'],
    hasMfa: false,
    mfaType: 'None',
    lastChangedMonths: 4,
    isBreachedDemo: true,
    riskLevel: 'Critical',
    findings: [
      'Exact password reused from primary email login.',
      'Lack of MFA exposes proprietary issue tracker and internal roadmaps.',
    ],
  },
  {
    id: 'sim-3',
    service: 'Internal VPN Portal',
    category: 'Enterprise',
    username: 'achen_vpn',
    maskedPassword: '••••••••••••',
    samplePassword: 'Summer2024!',
    length: 11,
    score: 1,
    scoreLabel: 'Weak',
    isReused: true,
    reusedAccounts: ['Acme Work Email & SSO', 'Acme Jira & Confluence'],
    hasMfa: true,
    mfaType: 'SMS',
    lastChangedMonths: 14,
    isBreachedDemo: true,
    riskLevel: 'High',
    findings: [
      'VPN password has not been rotated in over 14 months.',
      'SMS-based MFA is vulnerable to SIM-swapping and SS7 interception.',
      'Reuses credential from external web accounts.',
    ],
  },
  {
    id: 'sim-4',
    service: 'AWS Production Console',
    category: 'Cloud',
    username: 'iam_admin_achen',
    maskedPassword: '••••••••••••••••••••••••',
    samplePassword: 'k9#Qz$7Lp!vR4wM@tX2y*bE8',
    length: 24,
    score: 4,
    scoreLabel: 'Very Strong',
    isReused: false,
    hasMfa: true,
    mfaType: 'Hardware Key (FIDO2)',
    lastChangedMonths: 2,
    isBreachedDemo: false,
    riskLevel: 'Low',
    findings: [
      'High entropy 24-character random credential.',
      'Hardware security key (FIDO2/WebAuthn) strictly enforced.',
      'Unique isolated credential without reuse.',
    ],
  },
  {
    id: 'sim-5',
    service: 'GitHub Enterprise',
    category: 'Developer',
    username: 'alexchen-dev',
    maskedPassword: '••••••••••••••••',
    samplePassword: 'cobalt-falcon-granite-summit',
    length: 28,
    score: 4,
    scoreLabel: 'Very Strong',
    isReused: false,
    hasMfa: true,
    mfaType: 'Authenticator App (TOTP)',
    lastChangedMonths: 6,
    isBreachedDemo: false,
    riskLevel: 'Low',
    findings: [
      'Diceware 4-word passphrase with high combinatorial entropy.',
      'Protected with TOTP authenticator app.',
      'Never reused on personal repositories.',
    ],
  },
  {
    id: 'sim-6',
    service: 'Corporate Payroll & HR Portal',
    category: 'Financial',
    username: 'achen@payroll.acme',
    maskedPassword: '••••••••',
    samplePassword: 'P@ssw0rd',
    length: 8,
    score: 0,
    scoreLabel: 'Very Weak',
    isReused: false,
    hasMfa: false,
    mfaType: 'None',
    lastChangedMonths: 22,
    isBreachedDemo: true,
    riskLevel: 'Critical',
    findings: [
      'Classic leet-speak dictionary password easily cracked in milliseconds.',
      'Unchanged for 22 months.',
      'Direct risk of direct-deposit account hijacking and sensitive tax document theft.',
      'Missing MFA on high-value financial system.',
    ],
  },
  {
    id: 'sim-7',
    service: 'Workplace Slack Channel',
    category: 'Enterprise',
    username: 'alex.chen',
    maskedPassword: '••••••••••••••••',
    samplePassword: 'WelcomeSlack2022!',
    length: 17,
    score: 2,
    scoreLabel: 'Fair',
    isReused: false,
    hasMfa: true,
    mfaType: 'Authenticator App (TOTP)',
    lastChangedMonths: 18,
    isBreachedDemo: false,
    riskLevel: 'Medium',
    findings: [
      'Decent length (17 chars) but predictable dictionary phrase format.',
      'Credential has not been reviewed or rotated in 18 months.',
    ],
  },
  {
    id: 'sim-8',
    service: 'Stripe Merchant Dashboard',
    category: 'Financial',
    username: 'finance@acmecorp.internal',
    maskedPassword: '••••••••••••••••••••',
    samplePassword: '7u!P$9eL#2vK*8xQ@5mA',
    length: 20,
    score: 4,
    scoreLabel: 'Very Strong',
    isReused: false,
    hasMfa: true,
    mfaType: 'Hardware Key (FIDO2)',
    lastChangedMonths: 1,
    isBreachedDemo: false,
    riskLevel: 'Low',
    findings: [
      'Excellent random complexity and length.',
      'Phishing-resistant WebAuthn security key required.',
    ],
  },
]

export const STARTUP_SIMULATION_ACCOUNTS: SyntheticAccount[] = [
  {
    id: 'sup-1',
    service: 'Google Workspace',
    category: 'Enterprise',
    username: 'founder@startup.io',
    maskedPassword: '••••••••••',
    samplePassword: 'Password123!',
    length: 12,
    score: 1,
    scoreLabel: 'Weak',
    isReused: true,
    reusedAccounts: ['Notion Knowledge Base', 'Docker Hub'],
    hasMfa: false,
    mfaType: 'None',
    lastChangedMonths: 8,
    isBreachedDemo: true,
    riskLevel: 'Critical',
    findings: [
      'Default dictionary password with trivial punctuation suffix.',
      'Reused across startup document repositories and container registries.',
    ],
  },
  {
    id: 'sup-2',
    service: 'Notion Knowledge Base',
    category: 'Enterprise',
    username: 'founder@startup.io',
    maskedPassword: '••••••••••',
    samplePassword: 'Password123!',
    length: 12,
    score: 1,
    scoreLabel: 'Weak',
    isReused: true,
    reusedAccounts: ['Google Workspace', 'Docker Hub'],
    hasMfa: false,
    mfaType: 'None',
    lastChangedMonths: 8,
    isBreachedDemo: true,
    riskLevel: 'Critical',
    findings: [
      'Shares identical password with primary Google admin account.',
    ],
  },
  {
    id: 'sup-3',
    service: 'Vercel Deployment Platform',
    category: 'Developer',
    username: 'startup-deployer',
    maskedPassword: '••••••••••••••••••••••',
    samplePassword: 'timber-glacier-matrix-solar',
    length: 27,
    score: 4,
    scoreLabel: 'Very Strong',
    isReused: false,
    hasMfa: true,
    mfaType: 'Authenticator App (TOTP)',
    lastChangedMonths: 3,
    isBreachedDemo: false,
    riskLevel: 'Low',
    findings: [
      'Strong passphrase with TOTP protection.',
    ],
  },
]

/**
 * Calculate comprehensive hygiene metrics for an account list
 */
export function calculateHygieneMetrics(accounts: SyntheticAccount[]) {
  const total = accounts.length
  if (total === 0) {
    return {
      hygieneScore: 100,
      weakCount: 0,
      reusedCount: 0,
      noMfaCount: 0,
      breachedCount: 0,
      outdatedCount: 0,
      criticalRiskCount: 0,
    }
  }

  const weakCount = accounts.filter((a) => a.score <= 1).length
  const reusedCount = accounts.filter((a) => a.isReused).length
  const noMfaCount = accounts.filter((a) => !a.hasMfa || a.mfaType === 'None').length
  const breachedCount = accounts.filter((a) => a.isBreachedDemo).length
  const outdatedCount = accounts.filter((a) => a.lastChangedMonths >= 12).length
  const criticalRiskCount = accounts.filter((a) => a.riskLevel === 'Critical').length

  // Penalty-based hygiene score (starts at 100)
  let score = 100
  score -= (weakCount / total) * 35
  score -= (reusedCount / total) * 25
  score -= (noMfaCount / total) * 20
  score -= (breachedCount / total) * 15
  score -= (outdatedCount / total) * 5

  const finalScore = Math.max(5, Math.min(100, Math.round(score)))

  return {
    hygieneScore: finalScore,
    weakCount,
    reusedCount,
    noMfaCount,
    breachedCount,
    outdatedCount,
    criticalRiskCount,
  }
}

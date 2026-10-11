import type { AuditSessionEntry, PasswordAnalysisResult } from '../types'

const STORAGE_KEY = 'passsecure_audit_history_v1'
const OPT_IN_KEY = 'passsecure_history_optin'

/**
 * Check if history logging is enabled by the user
 */
export function isHistoryEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(OPT_IN_KEY) === 'true'
}

/**
 * Update user opt-in status
 */
export function setHistoryEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(OPT_IN_KEY, enabled ? 'true' : 'false')
  if (!enabled) {
    clearHistory()
  }
}

/**
 * Retrieve saved metadata-only session history
 */
export function getHistory(): AuditSessionEntry[] {
  if (typeof window === 'undefined' || !isHistoryEnabled()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Record analysis metadata ONLY.
 * Guaranteed never to receive or store the actual password, salt, or hash.
 */
export function recordAnalysisEntry(result: PasswordAnalysisResult): void {
  if (!isHistoryEnabled()) return

  // Extract distinct weakness names
  const weaknessTypes = result.patterns
    .filter((p) => p.severity === 'critical' || p.severity === 'warning')
    .map((p) => p.name)

  const entry: AuditSessionEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    passwordLength: result.length,
    score: result.score,
    scoreLabel: result.scoreLabel,
    entropyBits: result.entropyBits,
    detectedWeaknessCount: weaknessTypes.length,
    weaknessTypes,
  }

  const current = getHistory()
  const updated = [entry, ...current].slice(0, 50) // retain max 50 entries
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Gracefully handle storage quota or privacy mode errors
  }
}

/**
 * Completely purge all stored audit metadata
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Generate a downloadable non-sensitive markdown report
 */
export function generateMarkdownReport(history: AuditSessionEntry[]): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  let report = `# PassSecure — Password Hygiene Audit Report
Generated on: ${dateStr}

> **Privacy Notice**: This report contains non-sensitive metadata only. Actual passwords, hashes, and account identifiers are never recorded or exported by PassSecure.

---

## 1. Executive Summary
- Total Sessions Evaluated: **${history.length}**
- High/Very Strong Assessments: **${history.filter((h) => h.score >= 3).length}**
- Critical/Weak Assessments: **${history.filter((h) => h.score < 2).length}**

---

## 2. Session Metadata Log

| Timestamp | Length | Strength Category | Entropy (bits) | Weakness Count | Identified Issues |
| :--- | :---: | :--- | :---: | :---: | :--- |
`

  for (const item of history) {
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const weaknesses = item.weaknessTypes.length > 0 ? item.weaknessTypes.join(', ') : 'None detected'
    report += `| ${time} | ${item.passwordLength} chars | ${item.scoreLabel} | ${item.entropyBits} | ${item.detectedWeaknessCount} | ${weaknesses} |\n`
  }

  report += `
---

## 3. Recommended Remediation Guidelines
1. **Adopt Passphrases**: Prefer 4 to 5 random words (e.g. EFF Diceware) instead of complex short passwords.
2. **Eliminate Password Reuse**: Maintain isolated, unique credentials per service to prevent credential stuffing cascades.
3. **Hardware & App MFA**: Enable FIDO2/WebAuthn or TOTP authenticator apps. Avoid SMS-based 2FA where possible due to SIM swapping vulnerabilities.
4. **Use a Password Manager**: Leverage encrypted zero-knowledge password vaults to generate and store 20+ character random secrets.
`

  return report
}

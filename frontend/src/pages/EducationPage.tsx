import React, { useState } from 'react'
import {
  BookOpenCheck,
  Shield,
  KeyRound,
  Lock,
  Layers,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Database,
  Cpu,
  RefreshCw,
  Terminal,
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  category: string
  summary: string
  diagramTitle?: string
  diagramContent?: string
  content: string[]
  takeaway: string
}

export const EducationPage: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string>('reuse')

  const lessons: Lesson[] = [
    {
      id: 'reuse',
      title: 'Why Password Reuse is Lethal: Credential Stuffing',
      category: 'Threat Vectors',
      summary: 'How attackers weaponize a breach on a minor site to take over your bank and work email.',
      content: [
        'Over 80% of data breaches involve stolen or reused credentials. When a low-security website (like a gaming forum or retail store) gets breached, attackers dump its username-password combinations into automated tools like OpenBullet and Sentry MBA.',
        'These tools perform "Credential Stuffing" — blasting thousands of automated login requests across major identity providers, cloud consoles, banking portals, and email services within minutes.',
        'If you use the same password across multiple platforms, a breach at any single vendor creates an immediate cascade that compromises all your digital identities.',
      ],
      diagramTitle: 'Credential Stuffing Cascade Workflow',
      diagramContent: `[Forum Breached: user@acme.com / Summer2024!]
       │
       ▼ (Automated Botnet with Proxy Rotation)
 ┌─────┴──────────────────┬──────────────────┐
 ▼                        ▼                  ▼
[Banking Portal]       [Work SSO]      [Crypto Vault]
  ❌ SUCCESS!            ❌ SUCCESS!        ❌ SUCCESS!
  (Full Takeover)        (Data Exfiltration) (Asset Loss)`,
      takeaway: 'Never reuse passwords. Maintain mathematically distinct passwords for every service, managed by an encrypted vault.',
    },
    {
      id: 'entropy',
      title: 'The Mathematics of Password Entropy: Length vs Complexity',
      category: 'Cryptographic Foundations',
      summary: 'Why an 18-character simple phrase is trillions of times stronger than an 8-character symbol puzzle.',
      content: [
        'Information entropy measures the unpredictability of a password in bits. The formula for uniformly chosen characters is H = L × log2(R), where L is length and R is the character set size.',
        'Notice that length (L) multiplies the total bits linearly, while character pool size (R) is inside a logarithm! Adding numbers and symbols only slightly increases R, but doubling the length squares the entire brute-force search space.',
        'Consider "P@ssw0rd!": Length 9, R ~ 94. Bits = 9 × log2(94) ≈ 59 bits in theory, but in practice rule-based dictionary attacks test this specific template in under 1 second.',
        'Now consider "cobalt-falcon-granite-summit": 4 words picked from a 7,776-word dictionary. Search space = 7776⁴ ≈ 3.6 × 10¹⁵ combinations (52 bits of pure, uncheatable entropy). It is vastly easier to remember and impervious to dictionary rules.',
      ],
      diagramTitle: 'Combinatorial Search Space Comparison',
      diagramContent: `Complexity (8 chars):  94⁸  = 6.09 × 10¹⁵ guesses
Length (16 chars):      26¹⁶ = 4.36 × 10²² guesses (7 BILLION times harder!)
Passphrase (5 words):  7776⁵ = 2.84 × 10¹⁹ guesses (Diceware)`,
      takeaway: 'Length trumps complexity every time. A 4-word Diceware passphrase is both effortless to type and cryptographically resilient.',
    },
    {
      id: 'diceware',
      title: 'The Diceware Revolution: Memorable Passphrases',
      category: 'Practical Defense',
      summary: 'Invented in 1995 by Arnold Reinhold, Diceware provides high entropy without impossible mnemonics.',
      content: [
        'For decades, corporate IT rules forced users to create passwords with uppercase, lowercase, numbers, and symbols that change every 90 days. Research by NIST and Microsoft proved this actually DEGRADED security: users simply used predictable patterns like "Spring2024!" or wrote passwords on sticky notes.',
        'Diceware solves this by selecting words at random from a numbered list using cryptographic randomness (or physical dice).',
        'Because each word represents an independent uniform selection from thousands of candidates, attackers cannot use grammar, syllable, or mask shortcuts.',
      ],
      takeaway: 'Use 4 to 5 random words separated by hyphens for your master passwords and disk encryption keys.',
    },
    {
      id: 'vaults',
      title: 'Zero-Knowledge Password Managers',
      category: 'Tooling & Architecture',
      summary: 'How end-to-end encrypted vaults protect your credentials without the provider ever seeing them.',
      content: [
        'A reputable password manager (such as Bitwarden, 1Password, or KeePassXC) uses a Zero-Knowledge Architecture.',
        'When you enter your Master Password, the application runs a memory-hard key derivation function (like Argon2id or PBKDF2 with 600,000+ rounds) on your local device to generate a 256-bit symmetric encryption key.',
        'All your passwords are encrypted locally using AES-256-GCM before syncing to the cloud. Even if the vault provider experiences a breach, attackers obtain only ciphertext blobs that cannot be decrypted without your local master secret.',
      ],
      takeaway: 'Memorize only one strong 5-word master passphrase. Let your vault generate and store unique 20-character passwords everywhere else.',
    },
    {
      id: 'mfa',
      title: 'Multi-Factor Authentication (MFA) Hierarchy',
      category: 'Authentication Protocols',
      summary: 'Not all 2FA is created equal: understanding SMS vs TOTP apps vs FIDO2 WebAuthn keys.',
      content: [
        'Tier 1 (Weakest): SMS Verification. Vulnerable to SIM swapping (social engineering cell carriers), SS7 protocol telecom attacks, and rogue cell towers.',
        'Tier 2 (Good): Authenticator Apps (TOTP - RFC 6238). Generates time-based 6-digit codes locally on your phone (Google Authenticator, Aegis). Immune to telecom interception, but still vulnerable to real-time reverse-proxy phishing (Adversary-in-the-Middle).',
        'Tier 3 (Gold Standard): FIDO2 / WebAuthn & Passkeys. Hardware security keys (YubiKey) or device passkeys. Uses public-key cryptography bound directly to the browser origin URL. Fully immune to phishing and credential theft.',
      ],
      takeaway: 'Migrate away from SMS 2FA to TOTP apps immediately. Deploy FIDO2 hardware keys or Passkeys for critical email and banking accounts.',
    },
    {
      id: 'kanonymity',
      title: 'How k-Anonymity Breach Checks Work',
      category: 'Privacy Engineering',
      summary: 'How PassSecure checks Have I Been Pwned without ever exposing your password or full hash.',
      content: [
        'Historically, checking if a password was breached required sending the password or full hash to a server — a terrible security risk.',
        'In 2018, Troy Hunt and Cloudflare introduced the k-Anonymity protocol for HIBP:',
        '1. PassSecure computes the SHA-1 hash of the password locally: 35F64...370B',
        '2. The application takes ONLY the first 5 hexadecimal characters: "35F64"',
        '3. It queries the public API for all hashes starting with "35F64"',
        '4. The API returns roughly 500 to 1,000 matching hash suffixes',
        '5. PassSecure searches locally inside your browser memory for the remaining 35 characters',
        'Mathematically, a 5-hex prefix represents 16⁵ = 1,048,576 buckets. The server has no way to determine which of the ~800 returned candidates you were interested in!',
      ],
      takeaway: 'k-Anonymity provides mathematical privacy by hiding your target among a crowd of candidate results.',
    },
    {
      id: 'incident',
      title: 'Compromised Account Incident Response Checklist',
      category: 'Defensive Operations',
      summary: 'Step-by-step containment protocol when one of your credentials has been leaked.',
      content: [
        'Step 1 (Immediate Containment): Log in to the compromised service and change the password to a newly generated 20+ character random string or 4-word passphrase.',
        'Step 2 (Session Revocation): Use "Log out of all other sessions / devices" in account security settings to terminate active adversary sessions.',
        'Step 3 (MFA Verification): Review and re-verify multi-factor authentication methods. Generate fresh backup recovery codes.',
        'Step 4 (Radius of Blast): Check if this password was ever reused on other accounts. Immediately rotate all matching accounts, prioritizing primary email (which controls password resets).',
        'Step 5 (Audit Third-Party Apps): Inspect connected OAuth integrations, API tokens, and forwarding rules (especially on Gmail/Outlook).',
      ],
      takeaway: 'Act swiftly: disconnect active sessions, rotate credentials, and verify email forwarding rules.',
    },
  ]

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Education Header */}
      <div className="p-5 rounded-2xl bg-[#0c1527] border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Password Security Engineering & Threat Literacy
            </h2>
            <p className="text-xs text-slate-400">
              Rigorous, evidence-based principles aligned with NIST SP 800-63B and modern offensive telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar of Lessons + Active Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lesson Index Column */}
        <div className="lg:col-span-4 space-y-2">
          <div className="px-2 py-1 text-xs font-mono uppercase text-slate-400 font-semibold">
            Curriculum Lessons ({lessons.length})
          </div>

          <div className="space-y-1.5">
            {lessons.map((lesson) => {
              const isActive = activeLessonId === lesson.id
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-200 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase mb-1">
                    <span className={isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
                      {lesson.category}
                    </span>
                    <ChevronRight className={`w-3 h-3 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-xs font-bold leading-snug">{lesson.title}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Lesson Display Column */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 shadow-xl space-y-5">
            {/* Title & Badge */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {activeLesson.category}
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {activeLesson.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeLesson.summary}
              </p>
            </div>

            {/* Structured Paragraphs */}
            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              {activeLesson.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Diagram / Terminal Graphic if available */}
            {activeLesson.diagramContent && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                <div className="text-[11px] text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{activeLesson.diagramTitle || 'Architectural Representation'}</span>
                </div>
                <pre className="text-xs text-slate-300 overflow-x-auto p-2 bg-slate-900/80 rounded border border-slate-800 leading-relaxed">
                  {activeLesson.diagramContent}
                </pre>
              </div>
            )}

            {/* Key Takeaway Callout */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3 text-xs text-cyan-200">
              <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-cyan-300 font-semibold uppercase font-mono text-[11px]">
                  Core Defensive Takeaway:
                </strong>
                <p className="mt-0.5 leading-relaxed">{activeLesson.takeaway}</p>
              </div>
            </div>
          </div>

          {/* Official Standards Reference Cards */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Official Cybersecurity Standards & Guidance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <a
                href="https://pages.nist.gov/800-63-3/sp800-63b.html"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">NIST SP 800-63B</div>
                  <div className="text-[11px] text-slate-400">Digital Identity Guidelines</div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
              </a>

              <a
                href="https://www.cisa.gov/secure-our-world/use-strong-passwords"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">CISA Guidance</div>
                  <div className="text-[11px] text-slate-400">Secure Our World Campaign</div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
              </a>

              <a
                href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">OWASP Auth Guide</div>
                  <div className="text-[11px] text-slate-400">Authentication Cheat Sheet</div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

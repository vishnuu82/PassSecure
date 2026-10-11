import React, { useState, useEffect } from 'react'
import {
  computeSha1Hex,
  checkBreachKAnonymity,
  checkBreachLocalOnly,
} from '../services/breachService'
import type { BreachCheckResult } from '../types'
import {
  Database,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Lock,
  ArrowRight,
  Globe,
  HardDrive,
  Eye,
  EyeOff,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'

export const BreachCheckPage: React.FC = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [checkMode, setCheckMode] = useState<'kanon' | 'local'>('kanon')
  const [hasOptedIn, setHasOptedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<BreachCheckResult | null>(null)
  const [computedHash, setComputedHash] = useState<string>('')

  // Clean memory on unmount
  useEffect(() => {
    return () => {
      setPassword('')
      setComputedHash('')
    }
  }, [])

  // Calculate live SHA-1 hash for educational visualization
  useEffect(() => {
    if (!password) {
      setComputedHash('')
      setResult(null)
      return
    }
    let isCancelled = false
    computeSha1Hex(password).then((hex) => {
      if (!isCancelled) {
        setComputedHash(hex)
      }
    })
    return () => {
      isCancelled = true
    }
  }, [password])

  const handleRunCheck = async () => {
    if (!password) return
    setIsLoading(true)
    setResult(null)

    try {
      if (checkMode === 'kanon') {
        // k-anonymity over network
        const res = await checkBreachKAnonymity(password)
        setResult(res)
      } else {
        // local offline dataset check
        const res = await checkBreachLocalOnly(password)
        setResult(res)
      }
    } catch (err) {
      setResult({
        checked: true,
        source: checkMode === 'kanon' ? 'hibp_k_anonymity' : 'local_dataset',
        breached: false,
        breachCount: 0,
        hashPrefix: computedHash.slice(0, 5),
        timestamp: new Date().toISOString(),
        notice: `Check failed: ${(err as Error).message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setPassword('')
    setComputedHash('')
    setResult(null)
  }

  const prefix = computedHash.slice(0, 5)
  const suffix = computedHash.slice(5)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 glow-cyan-sm flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-300">
          <span className="font-semibold text-cyan-300 text-sm block">
            Mathematical Zero-Knowledge Privacy Architecture
          </span>
          <p className="leading-relaxed">
            PassSecure implements the cryptographic <strong>k-Anonymity protocol</strong>. Your plaintext password is never sent to any server. Only the first 5 hexadecimal characters of its SHA-1 hash are transmitted. The server returns hundreds of candidate hash suffixes, and matching is completed purely inside your browser memory.
          </p>
        </div>
      </div>

      {/* Main Breach Checker Panel */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 shadow-xl space-y-6">
        {/* Mode Selector */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setCheckMode('kanon')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              checkMode === 'kanon'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Mode 1: k-Anonymity Cloud API (HIBP)</span>
          </button>
          <button
            onClick={() => setCheckMode('local')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              checkMode === 'local'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Mode 2: Local Offline Dataset (Zero Network)</span>
          </button>
        </div>

        {/* Input Field */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Password to Check
            </label>
            {password && (
              <button
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check for known compromises..."
              className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white font-mono-code text-base placeholder-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Sample Selector */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
            <span className="text-slate-400">Try sample:</span>
            <button
              onClick={() => setPassword('123456')}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700"
            >
              "123456" (Highly Breached)
            </button>
            <button
              onClick={() => setPassword('Summer2024!')}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700"
            >
              "Summer2024!" (Seasonal Breach)
            </button>
            <button
              onClick={() => setPassword('cobalt-falcon-granite-summit')}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700"
            >
              "cobalt-falcon-granite-summit" (Unique Clean)
            </button>
          </div>
        </div>

        {/* Live Cryptographic Hash Decomposition Visualizer */}
        {computedHash && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Client-Side SHA-1 Decomposition:</span>
              </span>
              <span className="text-[11px] text-slate-400">
                (SHA-1 is required by HIBP API specification; not for password storage)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono-code text-xs sm:text-sm break-all flex flex-wrap items-center gap-1">
              <span
                className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold"
                title="Only this 5-char prefix is sent over the network"
              >
                {prefix}
              </span>
              <span
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 select-none"
                title="This 35-char suffix NEVER leaves your browser"
              >
                {suffix}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-300">
                <strong className="block text-cyan-200">Public Prefix (5 hex):</strong>
                Sent to HIBP API (<code className="text-white">/range/{prefix}</code>). Matches ~500+ different passwords. The server cannot know which password you hold.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                <strong className="block text-slate-200">Private Suffix (35 hex):</strong>
                Retained strictly in client memory. Compared locally against returned candidates.
              </div>
            </div>
          </div>
        )}

        {/* Opt-in Confirmation for k-Anonymity Cloud Mode */}
        {checkMode === 'kanon' && (
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={hasOptedIn}
              onChange={(e) => setHasOptedIn(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4 mt-0.5"
            />
            <div className="text-xs text-slate-300 space-y-0.5">
              <span className="font-semibold text-slate-200 block">
                Opt-in Consent for External Range Query
              </span>
              <p className="text-slate-400">
                I authorize PassSecure to query the Have I Been Pwned API with the 5-character prefix <code className="text-cyan-300 font-mono">{prefix || 'XXXXX'}</code>. My plaintext password and full hash will remain strictly local.
              </p>
            </div>
          </label>
        )}

        {/* Action Button */}
        <div>
          <button
            onClick={handleRunCheck}
            disabled={!password || (checkMode === 'kanon' && !hasOptedIn) || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg glow-cyan-sm"
          >
            {isLoading ? (
              <span>Auditing Breach Datasets...</span>
            ) : (
              <>
                <Database className="w-4 h-4 text-slate-950" />
                <span>
                  {checkMode === 'kanon'
                    ? 'Execute Privacy-Preserving k-Anonymity Audit'
                    : 'Execute Offline Local Dataset Audit'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Audit Results Panel */}
        {result && (
          <div
            className={`p-5 rounded-xl border space-y-3 transition-all ${
              result.breached
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {result.breached ? (
                  <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-base font-bold tracking-tight">
                    {result.breached
                      ? 'COMPROMISED: Password Found in Known Breaches'
                      : 'NO MATCH FOUND in Breach Records'}
                  </h4>
                  <div className="text-xs font-mono opacity-80">
                    Source:{' '}
                    {result.source === 'hibp_k_anonymity'
                      ? 'Have I Been Pwned API (k-Anonymity)'
                      : 'Bundled Local Corpus'}{' '}
                    • Response time: {result.responseTimeMs || '< 1'} ms
                  </div>
                </div>
              </div>

              {result.breached && (
                <div className="text-right">
                  <span className="text-xs font-mono uppercase block text-rose-400">
                    Observed Occurrences:
                  </span>
                  <span className="text-xl font-bold font-mono text-white">
                    {result.breachCount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs leading-relaxed opacity-95">{result.notice}</p>

            <div className="pt-2 border-t border-slate-700/50 text-[11px] opacity-80 leading-relaxed">
              <strong>Cryptographic Disclaimer:</strong>{' '}
              {result.breached
                ? 'Automated credential-stuffing botnets continuously cycle this password. You should immediately rotate it on all associated online accounts and activate 2-factor authentication.'
                : 'A clean breach check indicates that this password has not been cataloged in historical public compromise dumps. It does not mean the password is intrinsically secure if it has low entropy or follows a simple pattern.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

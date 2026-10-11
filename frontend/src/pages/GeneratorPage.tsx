import React, { useState, useEffect, useMemo, useCallback } from 'react'
import type { GeneratorOptions } from '../types'
import {
  generateSecurePassword,
  generateSecurePassphrase,
} from '../services/cryptoGenerator'
import { analyzePassword } from '../services/analyzerEngine'
import {
  Copy,
  Check,
  RefreshCw,
  KeyRound,
  Sliders,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Cpu,
} from 'lucide-react'

export const GeneratorPage: React.FC = () => {
  const [options, setOptions] = useState<GeneratorOptions>({
    mode: 'password',
    length: 16,
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

  const [generatedSecret, setGeneratedSecret] = useState('')
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Generate new secret
  const handleGenerate = useCallback(() => {
    try {
      setErrorMessage(null)
      const secret = generateSecurePassword(options)
      setGeneratedSecret(secret)
    } catch (err) {
      setErrorMessage((err as Error).message)
    }
  }, [options])

  // Initial generation
  useEffect(() => {
    handleGenerate()
  }, [handleGenerate])

  // Clean memory on unmount
  useEffect(() => {
    return () => {
      setGeneratedSecret('')
    }
  }, [])

  // Analyze generated password strength in real time
  const analysis = useMemo(() => {
    return analyzePassword(generatedSecret)
  }, [generatedSecret])

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedSecret) return
    try {
      await navigator.clipboard.writeText(generatedSecret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea')
      textarea.value = generatedSecret
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Check if at least one charset is checked in password mode
  const noCharsetSelected =
    options.mode === 'password' &&
    !options.includeUppercase &&
    !options.includeLowercase &&
    !options.includeDigits &&
    !options.includeSymbols

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top cryptographic assurance banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              CSPRNG Powered Generation (Web Crypto API)
            </h2>
            <p className="text-xs text-slate-400">
              Entropy generated via <code className="text-cyan-300">window.crypto.getRandomValues()</code> with rejection sampling to eliminate modulo bias.
            </p>
          </div>
        </div>
      </div>

      {/* Main Generator Card */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 shadow-xl space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setOptions({ ...options, mode: 'password' })}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              options.mode === 'password'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Random Password</span>
          </button>
          <button
            onClick={() => setOptions({ ...options, mode: 'passphrase' })}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              options.mode === 'passphrase'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Memorable Passphrase (Diceware)</span>
          </button>
        </div>

        {/* Generated Secret Display Box */}
        <div className="relative p-5 rounded-xl bg-slate-950 border border-slate-700/80 glow-cyan-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Generated Secret ({generatedSecret.length} characters)</span>
            <span className="text-cyan-400 font-bold">
              ~{analysis.entropyBits} bits of entropy
            </span>
          </div>

          <div className="font-mono-code text-lg sm:text-2xl text-cyan-300 break-all select-all font-semibold tracking-wide min-h-[2rem]">
            {generatedSecret || (
              <span className="text-slate-600 text-sm">Select options to generate</span>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Assessed:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  analysis.score >= 3
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                }`}
              >
                {analysis.scoreLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={noCharsetSelected}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Regenerate new secret"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleCopy}
                disabled={!generatedSecret}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-950" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Configuration Controls */}
        {options.mode === 'password' ? (
          /* Random Password Mode Controls */
          <div className="space-y-5 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
            {/* Length Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-semibold uppercase">Password Length</span>
                <span className="text-cyan-400 font-bold px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                  {options.length} characters
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="64"
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>12 (Minimum recommended)</span>
                <span>32 (Strong)</span>
                <span>64 (Maximum vault)</span>
              </div>
            </div>

            {/* Character Set Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs text-slate-200">Uppercase Letters (A-Z)</span>
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs text-slate-200">Lowercase Letters (a-z)</span>
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs text-slate-200">Numbers (0-9)</span>
                <input
                  type="checkbox"
                  checked={options.includeDigits}
                  onChange={(e) => setOptions({ ...options, includeDigits: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs text-slate-200">Special Symbols (!@#$...)</span>
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
              </label>

              <label className="sm:col-span-2 flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <span className="text-xs text-slate-200 block">Exclude Ambiguous Characters</span>
                  <span className="text-[11px] text-slate-500">
                    Removes easily confused characters (0, O, o, 1, l, I, |)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
              </label>
            </div>
          </div>
        ) : (
          /* Memorable Passphrase Mode Controls */
          <div className="space-y-5 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
            {/* Word Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-semibold uppercase">Number of Words</span>
                <span className="text-cyan-400 font-bold px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                  {options.passphraseWords} words
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={options.passphraseWords}
                onChange={(e) =>
                  setOptions({ ...options, passphraseWords: parseInt(e.target.value, 10) })
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>3 words (~38 bits)</span>
                <span>4 words (~51 bits - Recommended)</span>
                <span>8 words (~103 bits - Paranoia grade)</span>
              </div>
            </div>

            {/* Separator and Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                <label className="text-xs text-slate-300 block">Word Separator</label>
                <select
                  value={options.passphraseSeparator}
                  onChange={(e) => setOptions({ ...options, passphraseSeparator: e.target.value })}
                  className="w-full py-1.5 px-2 rounded bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=".">Period (.)</option>
                  <option value=" ">Space ( )</option>
                  <option value="#">Hash (#)</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs text-slate-200">Capitalize Words</span>
                <input
                  type="checkbox"
                  checked={options.passphraseCapitalize}
                  onChange={(e) =>
                    setOptions({ ...options, passphraseCapitalize: e.target.checked })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <span className="text-xs text-slate-200">Append Number</span>
                <input
                  type="checkbox"
                  checked={options.passphraseIncludeNumber}
                  onChange={(e) =>
                    setOptions({ ...options, passphraseIncludeNumber: e.target.checked })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import React from 'react'
import type { PasswordAnalysisResult, PasswordScore } from '../../types'
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Zap, Hash } from 'lucide-react'

interface StrengthMeterProps {
  result: PasswordAnalysisResult
}

const SCORE_CONFIG: Record<
  PasswordScore,
  { label: string; color: string; bgColor: string; borderColor: string; barColor: string }
> = {
  0: {
    label: 'Very Weak',
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-900/60',
    barColor: 'bg-rose-500',
  },
  1: {
    label: 'Weak',
    color: 'text-orange-400',
    bgColor: 'bg-orange-950/40',
    borderColor: 'border-orange-900/60',
    barColor: 'bg-orange-500',
  },
  2: {
    label: 'Fair',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-900/60',
    barColor: 'bg-amber-500',
  },
  3: {
    label: 'Strong',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-900/60',
    barColor: 'bg-blue-500',
  },
  4: {
    label: 'Very Strong',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-900/60',
    barColor: 'bg-emerald-500',
  },
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ result }) => {
  const current = SCORE_CONFIG[result.score]
  const isFilled = result.length > 0

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono uppercase text-slate-400">Strength Evaluation:</span>
          <span
            className={`text-sm font-bold font-mono px-3 py-1 rounded-full border ${current.bgColor} ${current.color} ${current.borderColor}`}
          >
            {isFilled ? current.label : 'Awaiting Input'}
          </span>
        </div>

        {/* Shannon Entropy & Guesses Badges */}
        {isFilled && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Entropy: {result.entropyBits} bits</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>~10^{result.guessesLog10.toFixed(1)} guesses</span>
            </div>
          </div>
        )}
      </div>

      {/* 5-segment strength meter bar */}
      <div className="grid grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((step) => {
          const active = isFilled && step <= result.score
          return (
            <div
              key={step}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                active ? current.barColor : 'bg-slate-800'
              }`}
            />
          )
        })}
      </div>

      {/* Character Class Composition Pills */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 text-[11px] font-mono mr-1">Character Sets:</span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
              result.hasUppercase
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
            }`}
          >
            {result.hasUppercase ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : '•'}
            A-Z Upper
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
              result.hasLowercase
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
            }`}
          >
            {result.hasLowercase ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : '•'}
            a-z Lower
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
              result.hasDigits
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
            }`}
          >
            {result.hasDigits ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : '•'}
            0-9 Numbers
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
              result.hasSymbols
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50'
            }`}
          >
            {result.hasSymbols ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : '•'}
            Symbols
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Pool: {result.charsetSize} possible chars
        </div>
      </div>
    </div>
  )
}

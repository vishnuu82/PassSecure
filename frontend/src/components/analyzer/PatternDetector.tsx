import React from 'react'
import type { DetectedPattern, PatternSeverity } from '../../types'
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react'

interface PatternDetectorProps {
  patterns: DetectedPattern[]
  isBreached: boolean
  breachCount?: number
}

const SEVERITY_CONFIG: Record<
  PatternSeverity,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  critical: {
    label: 'Critical Vulnerability',
    bg: 'bg-rose-950/30',
    text: 'text-rose-400',
    border: 'border-rose-900/60',
    icon: AlertOctagon,
  },
  warning: {
    label: 'Predictable Pattern',
    bg: 'bg-amber-950/30',
    text: 'text-amber-400',
    border: 'border-amber-900/60',
    icon: AlertTriangle,
  },
  info: {
    label: 'Informational',
    bg: 'bg-blue-950/30',
    text: 'text-blue-400',
    border: 'border-blue-900/60',
    icon: Info,
  },
  good: {
    label: 'Hardened Strength',
    bg: 'bg-emerald-950/30',
    text: 'text-emerald-400',
    border: 'border-emerald-900/60',
    icon: CheckCircle2,
  },
}

export const PatternDetector: React.FC<PatternDetectorProps> = ({
  patterns,
  isBreached,
  breachCount,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Structural Pattern Analysis ({patterns.length})</span>
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          Detects dictionary, repetition & keyboard walks
        </span>
      </div>

      {patterns.length === 0 ? (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">
            No predictable patterns or repetitions detected yet.
          </p>
          <p className="text-xs text-slate-400">
            High randomness and lack of sequential templates significantly slows automated attacks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patterns.map((pattern) => {
            const config = SEVERITY_CONFIG[pattern.severity]
            const Icon = config.icon

            return (
              <div
                key={pattern.id}
                className={`p-4 rounded-xl border ${config.bg} ${config.border} space-y-2.5 transition-all`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${config.text} shrink-0`} />
                    <span className="text-sm font-semibold text-slate-100">
                      {pattern.name}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border ${config.bg} ${config.text} ${config.border}`}
                  >
                    {config.label}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {pattern.description}
                </p>

                {pattern.match && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                    <span className="text-[11px] font-mono text-slate-400">Target Match:</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      "{pattern.match}"
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

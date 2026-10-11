import React from 'react'
import { ShieldCheck, ArrowRight, Lightbulb, Lock } from 'lucide-react'

interface RecommendationsListProps {
  recommendations: string[]
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <span>Evidence-Based Remediation Guidance</span>
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          NIST SP 800-63B Alignment
        </span>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed"
          >
            <div className="p-1 rounded-md bg-cyan-950/60 text-cyan-400 shrink-0 mt-0.5 border border-cyan-800/40">
              <ArrowRight className="w-3 h-3" />
            </div>
            <span>{rec}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

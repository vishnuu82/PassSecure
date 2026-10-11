import React from 'react'
import { ShieldCheck, Lock } from 'lucide-react'

export const PrivacyBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>100% Client-Side Privacy</span>
      </div>
    )
  }

  return (
    <div className="flex items-start sm:items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 glow-cyan-sm">
      <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
        <Lock className="w-4 h-4" />
      </div>
      <div className="text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-cyan-300 block sm:inline mr-1">Privacy Guarantee:</span>
        Your password is analyzed locally in this browser and is not stored or transmitted by PassSecure.
      </div>
    </div>
  )
}

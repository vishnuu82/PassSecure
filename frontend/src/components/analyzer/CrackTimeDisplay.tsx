import React from 'react'
import type { CrackTimeEstimates } from '../../types'
import { Clock, ShieldAlert, Cpu, Globe, Server, Terminal } from 'lucide-react'

interface CrackTimeDisplayProps {
  crackTimes: CrackTimeEstimates
  isFilled: boolean
}

export const CrackTimeDisplay: React.FC<CrackTimeDisplayProps> = ({
  crackTimes,
  isFilled,
}) => {
  const scenarios = [
    {
      title: 'Online Throttled Attack',
      rate: '100 guesses / hour',
      description: 'Web login with account lockout policies and IP rate limiting.',
      time: isFilled ? crackTimes.onlineThrottled : '—',
      icon: Globe,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20',
      borderColor: 'border-emerald-900/40',
    },
    {
      title: 'Online Unthrottled API',
      rate: '10 guesses / sec',
      description: 'Misconfigured service API without captcha or rate limiting.',
      time: isFilled ? crackTimes.onlineFast : '—',
      icon: Server,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/20',
      borderColor: 'border-cyan-900/40',
    },
    {
      title: 'Offline Slow KDF Hash',
      rate: '10,000 hashes / sec',
      description: 'Leaked database using modern Argon2id or bcrypt (cost 12+).',
      time: isFilled ? crackTimes.offlineSlowHash : '—',
      icon: Terminal,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/20',
      borderColor: 'border-amber-900/40',
    },
    {
      title: 'Offline Fast Hash / GPU Cluster',
      rate: '10 Billion hashes / sec',
      description: 'Unsalted MD5 / NTLM / SHA-1 attacked on multi-GPU cracking cluster.',
      time: isFilled ? crackTimes.offlineFastHash : '—',
      icon: Cpu,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/20',
      borderColor: 'border-rose-900/40',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Illustrative Attack Time Models</span>
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          Theoretical brute-force resistance
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const Icon = sc.icon
          return (
            <div
              key={sc.title}
              className={`p-4 rounded-xl border ${sc.bgColor} ${sc.borderColor} space-y-2 flex flex-col justify-between`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{sc.title}</span>
                  <Icon className={`w-4 h-4 ${sc.color}`} />
                </div>
                <div className="text-[11px] font-mono text-slate-400">{sc.rate}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-mono uppercase text-slate-400">Estimated Duration:</div>
                <div className={`text-base font-bold font-mono tracking-tight ${sc.color}`}>
                  {sc.time}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Critical Assumption Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 mr-1">Engineering Model Disclaimer:</span>
          These figures are illustrative mathematical bounds based on exhaustive combinatorial search space and documented guessing models. In practice, attackers utilize targeted credential stuffing, password spray dictionaries, breached corpora, and social engineering. A strong offline estimate does not guarantee security if the password is reused or phished.
        </div>
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import {
  ENTERPRISE_SIMULATION_ACCOUNTS,
  STARTUP_SIMULATION_ACCOUNTS,
  calculateHygieneMetrics,
} from '../services/auditSimulationData'
import type { SyntheticAccount } from '../types'
import {
  Building2,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  KeyRound,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react'

export const AuditSimulationPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'enterprise' | 'startup'>('enterprise')
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null)

  const accounts = useMemo<SyntheticAccount[]>(() => {
    return selectedScenario === 'enterprise'
      ? ENTERPRISE_SIMULATION_ACCOUNTS
      : STARTUP_SIMULATION_ACCOUNTS
  }, [selectedScenario])

  const metrics = useMemo(() => {
    return calculateHygieneMetrics(accounts)
  }, [accounts])

  const toggleExpand = (id: string) => {
    setExpandedAccountId(expandedAccountId === id ? null : id)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-950/40'
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40'
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Educational Simulation Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-500/40 shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-300">
          <span className="font-semibold text-blue-300 text-sm block">
            Educational Hygiene Simulation (Synthetic Data Only)
          </span>
          <p className="leading-relaxed">
            This module illustrates real-world organizational credential risks using 100% synthetic fictional data. PassSecure does not request, ingest, or scan your real personal accounts, saved browser passwords, or password manager vaults.
          </p>
        </div>
      </div>

      {/* Scenario Selector & Controls */}
      <div className="p-5 rounded-2xl bg-[#0c1527] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Select Fictional Profile Scenario</span>
            </h2>
            <p className="text-xs text-slate-400">
              Load different synthetic enterprise environments to study attack paths
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setSelectedScenario('enterprise')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedScenario === 'enterprise'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Enterprise Corp Vault ({ENTERPRISE_SIMULATION_ACCOUNTS.length} accts)
            </button>
            <button
              onClick={() => setSelectedScenario('startup')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedScenario === 'startup'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tech Startup Vault ({STARTUP_SIMULATION_ACCOUNTS.length} accts)
            </button>
          </div>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Overall Score */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${getScoreColor(metrics.hygieneScore)}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
              Hygiene Score
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight mt-1">
              {metrics.hygieneScore}/100
            </div>
          </div>

          {/* Accounts */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Total Accounts
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {accounts.length}
            </div>
          </div>

          {/* Weak Passwords */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-rose-400">
              Weak Passwords
            </span>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {metrics.weakCount}
            </div>
          </div>

          {/* Reused Credentials */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400">
              Reused Passwords
            </span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {metrics.reusedCount}
            </div>
          </div>

          {/* Missing MFA */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-blue-400">
              Missing MFA
            </span>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
              {metrics.noMfaCount}
            </div>
          </div>

          {/* Outdated (>12m) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Age &gt; 12 Months
            </span>
            <div className="text-2xl font-bold font-mono text-slate-200 mt-1">
              {metrics.outdatedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Synthetic Account Inventory */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Fictional Account Inventory & Threat Analysis</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Click any account to inspect findings
          </span>
        </div>

        <div className="space-y-3">
          {accounts.map((acc) => {
            const isExpanded = expandedAccountId === acc.id

            return (
              <div
                key={acc.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all hover:border-slate-700"
              >
                {/* Account Header Row */}
                <div
                  onClick={() => toggleExpand(acc.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0">
                      {acc.service.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{acc.service}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {acc.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {acc.username}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Masked Password */}
                    <div className="font-mono text-slate-400 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                      {acc.maskedPassword} ({acc.length}ch)
                    </div>

                    {/* Risk Badge */}
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${
                        acc.riskLevel === 'Critical'
                          ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                          : acc.riskLevel === 'High'
                          ? 'bg-orange-950/60 text-orange-400 border-orange-800'
                          : acc.riskLevel === 'Medium'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800'
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      {acc.riskLevel} Risk
                    </span>

                    {/* MFA Badge */}
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                        acc.hasMfa
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950/40 text-rose-300 border-rose-800'
                      }`}
                    >
                      MFA: {acc.mfaType || 'None'}
                    </span>

                    {/* Expand icon */}
                    <button className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-1 bg-slate-950/60 border-t border-slate-800/80 space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 font-mono">Simulated Password Sample:</span>
                      <code className="text-cyan-300 font-mono font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {acc.samplePassword}
                      </code>
                    </div>

                    {acc.isReused && (
                      <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/60 text-amber-200">
                        <strong className="block text-amber-300 font-mono text-[11px] uppercase">
                          Credential Stuffing Cascade Risk:
                        </strong>
                        This exact password is shared with{' '}
                        <strong>{acc.reusedAccounts?.join(', ')}</strong>. A compromise of any one service exposes all three.
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="font-mono text-[11px] uppercase text-slate-400 font-semibold block">
                        Detailed Audit Findings:
                      </span>
                      <ul className="space-y-1 list-disc list-inside text-slate-300">
                        {acc.findings.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

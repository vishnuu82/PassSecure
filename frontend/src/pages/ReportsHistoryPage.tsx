import React, { useState, useEffect } from 'react'
import {
  isHistoryEnabled,
  setHistoryEnabled,
  getHistory,
  clearHistory,
  generateMarkdownReport,
} from '../services/historyStorage'
import type { AuditSessionEntry } from '../types'
import {
  FileText,
  Download,
  Trash2,
  ShieldCheck,
  Lock,
  BarChart2,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

export const ReportsHistoryPage: React.FC = () => {
  const [enabled, setEnabled] = useState(false)
  const [history, setHistory] = useState<AuditSessionEntry[]>([])

  useEffect(() => {
    setEnabled(isHistoryEnabled())
    setHistory(getHistory())
  }, [])

  const handleToggleOptIn = (checked: boolean) => {
    setEnabled(checked)
    setHistoryEnabled(checked)
    setHistory(getHistory())
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  const handleDownloadMarkdown = () => {
    const reportText = generateMarkdownReport(history)
    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PassSecure-Audit-Report-${new Date().toISOString().slice(0, 10)}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadJson = () => {
    const jsonBlob = new Blob([JSON.stringify(history, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(jsonBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PassSecure-Audit-Metadata-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Aggregate stats for chart
  const chartData = [
    { name: 'Very Weak', count: history.filter((h) => h.score === 0).length, color: '#f43f5e' },
    { name: 'Weak', count: history.filter((h) => h.score === 1).length, color: '#f97316' },
    { name: 'Fair', count: history.filter((h) => h.score === 2).length, color: '#f59e0b' },
    { name: 'Strong', count: history.filter((h) => h.score === 3).length, color: '#3b82f6' },
    { name: 'Very Strong', count: history.filter((h) => h.score === 4).length, color: '#10b981' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Privacy Guarantee Notice */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-300">
          <span className="font-semibold text-cyan-300 text-sm block">
            Zero Credential Retention Architecture
          </span>
          <p className="leading-relaxed">
            PassSecure strictly isolates session history to non-sensitive mathematical metadata (length, entropy, score, and detected vulnerability categories). Plaintext passwords, generated secrets, and full hashes are strictly prohibited from entering the persistence layer.
          </p>
        </div>
      </div>

      {/* Main Settings & Controls Card */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 shadow-xl space-y-6">
        {/* Opt-in Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-white block">
              Enable Local Session Audit Logging
            </span>
            <p className="text-xs text-slate-400">
              When enabled, non-sensitive audit metrics are retained in browser localStorage for this device only.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggleOptIn(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            Recorded Sessions: <strong className="text-cyan-400">{history.length}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              disabled={history.length === 0}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
              title="Download detailed markdown report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown Report</span>
            </button>

            <button
              onClick={handleDownloadJson}
              disabled={history.length === 0}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
              title="Export structured JSON metadata"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className="px-3.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 border border-rose-900/50 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40"
              title="Purge all audit metadata"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge History</span>
            </button>
          </div>
        </div>

        {/* Recharts Analytics Chart */}
        {history.length > 0 && (
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-300 font-semibold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Audited Password Strength Distribution</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Sample Size: {history.length} tests
              </span>
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1527',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold">
            Audit Metadata Log Table
          </h3>

          {history.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-900/30 border border-slate-800/80 text-center space-y-2">
              <Info className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                {enabled
                  ? 'No audit sessions recorded yet. Analyze a password to populate session metadata.'
                  : 'Session history is disabled. Turn on the toggle above to retain non-sensitive audit metadata.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Evaluation</th>
                    <th className="p-3">Entropy</th>
                    <th className="p-3">Detected Weaknesses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {history.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-900/40">
                      <td className="p-3 text-slate-400">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="p-3 text-slate-200">{entry.passwordLength} chars</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            entry.score >= 3
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                              : entry.score >= 2
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {entry.scoreLabel}
                        </span>
                      </td>
                      <td className="p-3 text-cyan-300">{entry.entropyBits} bits</td>
                      <td className="p-3 text-slate-400">
                        {entry.weaknessTypes.length > 0
                          ? entry.weaknessTypes.join(', ')
                          : 'None detected'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect, useMemo } from 'react'
import { PasswordInput } from '../components/analyzer/PasswordInput'
import { StrengthMeter } from '../components/analyzer/StrengthMeter'
import { PatternDetector } from '../components/analyzer/PatternDetector'
import { CrackTimeDisplay } from '../components/analyzer/CrackTimeDisplay'
import { RecommendationsList } from '../components/analyzer/RecommendationsList'
import { PrivacyBadge } from '../components/layout/PrivacyBadge'
import { analyzePassword } from '../services/analyzerEngine'
import { recordAnalysisEntry } from '../services/historyStorage'
import { ShieldCheck, Database, RefreshCw, AlertTriangle } from 'lucide-react'

export const AnalyzerPage: React.FC = () => {
  const [password, setPassword] = useState('')

  // Clean memory state on unmount
  useEffect(() => {
    return () => {
      setPassword('')
    }
  }, [])

  // Immediate local analysis
  const analysisResult = useMemo(() => {
    return analyzePassword(password)
  }, [password])

  // Optional: record analysis metadata if user opted into session history
  useEffect(() => {
    if (password.length >= 4) {
      const timer = setTimeout(() => {
        recordAnalysisEntry(analysisResult)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [password, analysisResult])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Privacy Banner */}
      <PrivacyBadge />

      {/* Main Analysis Card */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 shadow-xl space-y-6">
        <PasswordInput
          value={password}
          onChange={setPassword}
          onClear={() => setPassword('')}
        />

        {/* Local breach warning banner if detected */}
        {analysisResult.isBreachedInLocalDb && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 flex items-start gap-3 text-xs text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-300 block text-sm">
                CRITICAL WARNING: Known Public Breached Credential
              </span>
              <p>
                This password exists in the curated public breach dataset (observed{' '}
                <strong className="text-white">
                  {analysisResult.localBreachCount?.toLocaleString()}
                </strong>{' '}
                times). Automated credential-stuffing bots routinely test this in initial dictionary waves.
              </p>
            </div>
          </div>
        )}

        {/* Strength Meter & Shannon Entropy */}
        <StrengthMeter result={analysisResult} />

        {/* Multi-Threat Model Crack Times */}
        <CrackTimeDisplay
          crackTimes={analysisResult.crackTimes}
          isFilled={password.length > 0}
        />

        {/* Pattern Detection Breakdown */}
        <PatternDetector
          patterns={analysisResult.patterns}
          isBreached={analysisResult.isBreachedInLocalDb}
          breachCount={analysisResult.localBreachCount}
        />

        {/* Recommendations */}
        <RecommendationsList recommendations={analysisResult.recommendations} />
      </div>
    </div>
  )
}

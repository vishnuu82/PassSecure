import React, { useState } from 'react'
import { Eye, EyeOff, RotateCcw, Sparkles, Shield, AlertCircle } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (val: string) => void
  onClear: () => void
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onClear,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const samplePresets = [
    { label: 'Common Breached', sample: '123456' },
    { label: 'Predictable Corp', sample: 'Summer2024!' },
    { label: 'Trivial Leet', sample: 'P@ssw0rd' },
    { label: 'Diceware Passphrase', sample: 'cobalt-falcon-granite-summit' },
    { label: 'High Random (24ch)', sample: 'k9#Qz$7Lp!vR4wM@tX2y*bE8' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <span>Enter Password to Audit</span>
          <span className="text-slate-500 text-[11px] font-normal lowercase">(zero transmission guarantee)</span>
        </label>
        {value.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              Length: {value.length} {value.length === 1 ? 'char' : 'chars'}
            </span>
            <button
              onClick={onClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/40 hover:bg-rose-950/80 border border-rose-900/50 transition-colors"
              title="Purge password from UI memory state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type or paste a password to analyze..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-500 font-mono-code text-base sm:text-lg tracking-wide transition-all shadow-inner"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
          title={showPassword ? 'Hide password characters' : 'Show password characters'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Preset Buttons for Educational Testing */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Test Sample:</span>
        </span>
        {samplePresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.sample)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}

import React from 'react'
import {
  ShieldCheck,
  Lock,
  Cpu,
  Terminal,
  Database,
  Code2,
  FileCheck2,
  ExternalLink,
  Layers,
} from 'lucide-react'

export const AboutPrivacyPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold glow-cyan-sm">
            <Lock className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">PassSecure</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                v2.0 Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Intelligent Password Security Auditor • B.Tech Artificial Intelligence and Data Science
            </p>
          </div>
        </div>
      </div>

      {/* Core Privacy Specification Card */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-cyan-500/30 glow-cyan-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Privacy Specification & Threat Boundary
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          PassSecure is engineered from the ground up under the principle of <strong>Zero Credential Retention</strong>. Plaintext passwords, master keys, and reversible hashes represent high-liability attack surfaces that must never leave client execution boundaries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono text-[11px] uppercase block">
              1. Local-First Analysis
            </strong>
            <p className="text-slate-400 leading-relaxed">
              Password strength evaluation, Shannon entropy calculations, and dictionary heuristic analyses run 100% inside your local browser JavaScript engine.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono text-[11px] uppercase block">
              2. k-Anonymity Range Queries
            </strong>
            <p className="text-slate-400 leading-relaxed">
              External breach lookups utilize the SHA-1 k-Anonymity range protocol. Only 5 hex characters are queried, ensuring your target password is mathematically indistinguishable among ~800+ candidates.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono text-[11px] uppercase block">
              3. Ephemeral Memory Life
            </strong>
            <p className="text-slate-400 leading-relaxed">
              Passwords exist only as transient component state. Entering a new password or clicking "Clear" immediately disposes of UI references.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <strong className="text-cyan-300 font-mono text-[11px] uppercase block">
              4. Zero Telemetry & Tracking
            </strong>
            <p className="text-slate-400 leading-relaxed">
              No Google Analytics, tracking beacons, error monitoring loggers, or remote telemetry scripts are integrated.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack & Cryptographic Primitives */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Technology Stack & Cryptographic Standards</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Frontend Platform</span>
            </div>
            <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
              <li>• React 19 + TypeScript</li>
              <li>• Vite 8 Build Tooling</li>
              <li>• Tailwind CSS v4 Engine</li>
              <li>• Lucide React Cyber Icons</li>
              <li>• Recharts Telemetry Visualizer</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security Libraries</span>
            </div>
            <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
              <li>• zxcvbn Estimator Heuristics</li>
              <li>• Web Crypto API (SubtleCrypto)</li>
              <li>• EFF Diceware Wordlist (CC-BY)</li>
              <li>• HIBP Pwned Passwords API</li>
              <li>• Unbiased Rejection Sampling</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Backend & Testing</span>
            </div>
            <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
              <li>• Python 3.14 + FastAPI</li>
              <li>• Uvicorn ASGI Server</li>
              <li>• Pydantic Strict Schemas</li>
              <li>• Vitest Browser Engine Tests</li>
              <li>• Pytest API Test Suite</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Windows 11 Running Instructions */}
      <div className="p-6 rounded-2xl bg-[#0c1527] border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-white font-bold">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Windows 11 PowerShell Quickstart</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-slate-300">
          <div>
            <div className="text-slate-500 text-[11px]"># 1. Start Frontend (Vite)</div>
            <div className="text-cyan-300">cd frontend; npm.cmd run dev</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]"># 2. Start Backend (Optional FastAPI proxy)</div>
            <div className="text-cyan-300">cd backend; py -m uvicorn app.main:app --reload --port 8000</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]"># 3. Execute Automated Tests</div>
            <div className="text-cyan-300">cd frontend; npx.cmd vitest run</div>
            <div className="text-cyan-300">cd backend; py -m pytest</div>
          </div>
        </div>
      </div>
    </div>
  )
}

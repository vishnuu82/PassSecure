import React from 'react'
import { Menu, ShieldCheck, Terminal, HelpCircle } from 'lucide-react'
import type { PageId } from './Sidebar'

interface HeaderProps {
  activePage: PageId
  setActivePage: (page: PageId) => void
  setIsMobileOpen: (open: boolean) => void
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  analyzer: {
    title: 'Password Security Analyzer',
    subtitle: 'Evaluate structural guessability, entropy, and predictability using documented heuristics.',
  },
  generator: {
    title: 'Cryptographic Generator',
    subtitle: 'Generate high-entropy random passwords and memorable Diceware passphrases locally.',
  },
  breach: {
    title: 'Breached Password Auditor',
    subtitle: 'Zero-knowledge verification using the k-anonymity protocol and local datasets.',
  },
  audit: {
    title: 'Enterprise Hygiene Audit Simulation',
    subtitle: 'Educational demonstration evaluating credential reuse and MFA posture with synthetic data.',
  },
  education: {
    title: 'Security Curriculum & Principles',
    subtitle: 'Interactive cybersecurity lessons on entropy, credential stuffing, and modern authentication.',
  },
  reports: {
    title: 'Audit Reports & Session History',
    subtitle: 'Privacy-preserving metadata logs and exportable markdown security assessments.',
  },
  about: {
    title: 'Architecture & Privacy Specification',
    subtitle: 'Technical overview of zero-knowledge client boundaries and cryptographic models.',
  },
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  setIsMobileOpen,
}) => {
  const current = PAGE_TITLES[activePage]

  return (
    <header className="sticky top-0 z-30 bg-[#070d19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{current.title}</span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>Local-First Sandbox</span>
        </div>

        <button
          onClick={() => setActivePage('about')}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors"
          title="About & Privacy details"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

import React from 'react'
import {
  ShieldCheck,
  KeyRound,
  Database,
  Building2,
  BookOpenCheck,
  FileText,
  Info,
  Lock,
  Cpu,
} from 'lucide-react'

export type PageId =
  | 'analyzer'
  | 'generator'
  | 'breach'
  | 'audit'
  | 'education'
  | 'reports'
  | 'about'

interface SidebarProps {
  activePage: PageId
  setActivePage: (page: PageId) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems: { id: PageId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'analyzer', label: 'Password Analyzer', icon: ShieldCheck },
    { id: 'generator', label: 'Secure Generator', icon: KeyRound },
    { id: 'breach', label: 'Breach Check (k-Anon)', icon: Database },
    { id: 'audit', label: 'Audit Simulation', icon: Building2, badge: 'Demo' },
    { id: 'education', label: 'Security Education', icon: BookOpenCheck },
    { id: 'reports', label: 'Reports & History', icon: FileText },
    { id: 'about', label: 'About & Privacy', icon: Info },
  ]

  const handleSelect = (page: PageId) => {
    setActivePage(page)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0c1527] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelect('analyzer')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold glow-cyan-sm shadow-lg">
              <Lock className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>PassSecure</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  v2.0
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Security Auditor</div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Privacy & B.Tech Footer Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-medium">
              <Cpu className="w-3.5 h-3.5" />
              <span>B.Tech AI & Data Science</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Designed with strict client-side cryptography. Never transmits plaintext credentials.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

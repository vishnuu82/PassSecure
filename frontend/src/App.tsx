import React, { useState } from 'react'
import { Sidebar, type PageId } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { AnalyzerPage } from './pages/AnalyzerPage'
import { GeneratorPage } from './pages/GeneratorPage'
import { BreachCheckPage } from './pages/BreachCheckPage'
import { AuditSimulationPage } from './pages/AuditSimulationPage'
import { EducationPage } from './pages/EducationPage'
import { ReportsHistoryPage } from './pages/ReportsHistoryPage'
import { AboutPrivacyPage } from './pages/AboutPrivacyPage'

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('analyzer')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const renderActivePage = () => {
    switch (activePage) {
      case 'analyzer':
        return <AnalyzerPage />
      case 'generator':
        return <GeneratorPage />
      case 'breach':
        return <BreachCheckPage />
      case 'audit':
        return <AuditSimulationPage />
      case 'education':
        return <EducationPage />
      case 'reports':
        return <ReportsHistoryPage />
      case 'about':
        return <AboutPrivacyPage />
      default:
        return <AnalyzerPage />
    }
  }

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PassSecure — Intelligent Password Security Auditor • B.Tech AI & Data Science
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            NIST SP 800-63B • k-Anonymity SHA-1 • Zero Credential Retention
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App

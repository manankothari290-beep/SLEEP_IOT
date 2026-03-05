import React from 'react'
import Dashboard from './components/Dashboard'
import AuthPage from './components/AuthPage'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050b1a',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '40px' }}>🌙</div>
        <div className="gradient-text" style={{ fontSize: '16px', fontWeight: 600 }}>
          Loading SleepGuard...
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div style={{ minHeight: '100vh', background: '#050b1a' }}>
      {/* ── Header ──────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(5, 11, 26, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.08)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(167,139,250,0.15))',
                border: '1px solid rgba(56,189,248,0.2)',
              }}
            >
              🌙
            </div>
            <div>
              <h1 className="gradient-text" style={{ fontSize: '16px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                SleepGuard
              </h1>
              <p style={{ fontSize: '10px', color: '#475569', margin: 0 }}>
                Smart Sleep Monitoring
              </p>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '999px',
                background: 'rgba(74,222,128,0.06)',
                border: '1px solid rgba(74,222,128,0.15)',
                color: '#4ade80',
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={user.email}
            >
              {user.email}
            </span>
            <button
              onClick={signOut}
              style={{
                padding: '5px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(248,113,113,0.2)',
                background: 'rgba(248,113,113,0.06)',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Dashboard ──────────────────────────────── */}
      <main>
        <Dashboard />
      </main>
    </div>
  )
}

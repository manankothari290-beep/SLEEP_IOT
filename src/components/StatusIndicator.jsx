import React from 'react'

const CFG = {
    live: { dot: '#4ade80', label: 'Live', sub: 'Realtime streaming', glow: 'rgba(74,222,128,0.5)' },
    connecting: { dot: '#fbbf24', label: 'Connecting', sub: 'Establishing connection…', glow: 'rgba(251,191,36,0.5)' },
    offline: { dot: '#f87171', label: 'Offline', sub: 'No data received', glow: 'rgba(248,113,113,0.5)' },
}

export default function StatusIndicator({ status }) {
    const c = CFG[status] ?? CFG.connecting

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
                className="pulse-dot"
                style={{ backgroundColor: c.dot, boxShadow: `0 0 8px ${c.glow}` }}
            />
            <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: c.dot, lineHeight: 1, margin: 0 }}>
                    {c.label}
                </p>
                <p style={{ fontSize: '10px', color: '#334155', margin: '2px 0 0 0' }}>
                    {c.sub}
                </p>
            </div>
        </div>
    )
}

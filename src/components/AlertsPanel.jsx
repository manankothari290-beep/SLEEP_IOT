import React, { useRef, useEffect } from 'react'

function formatTime(isoStr) {
    if (!isoStr) return ''
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const SEV = {
    critical: { color: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.15)', icon: '🚨' },
    warning: { color: '#fbbf24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.15)', icon: '⚠️' },
    info: { color: '#38bdf8', bg: 'rgba(56,189,248,0.06)', border: 'rgba(56,189,248,0.1)', icon: 'ℹ️' },
}

export default function AlertsPanel({ alerts }) {
    const bottomRef = useRef(null)
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [alerts])

    const reversed = [...alerts].reverse()

    return (
        <div
            style={{
                background: 'rgba(13, 26, 50, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🔔</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Alerts</span>
                </div>
                <span
                    style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: alerts.length > 0 ? 'rgba(248,113,113,0.08)' : 'rgba(74,222,128,0.08)',
                        color: alerts.length > 0 ? '#f87171' : '#4ade80',
                        border: `1px solid ${alerts.length > 0 ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.2)'}`,
                    }}
                >
                    {alerts.length}
                </span>
            </div>

            {/* List */}
            <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reversed.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <p style={{ fontSize: '28px', marginBottom: '8px' }}>✅</p>
                        <p style={{ fontSize: '12px', color: '#334155' }}>All conditions normal</p>
                    </div>
                ) : (
                    reversed.map((alert, idx) => {
                        const s = SEV[alert.severity] ?? SEV.info
                        return (
                            <div
                                key={alert.id ?? idx}
                                className={idx === 0 ? 'alert-new' : ''}
                                style={{
                                    background: s.bg,
                                    border: `1px solid ${s.border}`,
                                    borderRadius: '10px',
                                    padding: '10px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <span style={{ fontSize: '14px', flexShrink: 0 }}>{s.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: s.color, margin: 0 }}>
                                        {alert.message}
                                    </p>
                                    <p style={{ fontSize: '10px', color: '#334155', margin: '2px 0 0 0' }}>
                                        {formatTime(alert.timestamp)}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

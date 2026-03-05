import React from 'react'

const STATUS_COLORS = {
    normal: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.25)', text: '#4ade80', glow: 'rgba(74, 222, 128, 0.4)' },
    warning: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.25)', text: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' },
    critical: { bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.25)', text: '#f87171', glow: 'rgba(248, 113, 113, 0.4)' },
    neutral: { bg: 'rgba(56, 189, 248, 0.08)', border: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)' },
}

function getStatus(type, value) {
    if (value == null || value === '—') return 'neutral'
    switch (type) {
        case 'oxygen':
            if (value < 92) return 'critical'
            if (value < 95) return 'warning'
            return 'normal'
        case 'heart_rate':
            if (value < 50 || value > 100) return 'critical'
            if (value < 55 || value > 90) return 'warning'
            return 'normal'
        case 'temperature':
            if (value < 18 || value > 30) return 'critical'
            if (value < 22 || value > 26) return 'warning'
            return 'normal'
        case 'humidity':
            if (value < 30 || value > 70) return 'critical'
            if (value < 40 || value > 60) return 'warning'
            return 'normal'
        case 'position':
            return value === 'Back' ? 'warning' : 'normal'
        case 'snoring':
            return value === 'Heavy' ? 'critical' : value === 'Mild' ? 'warning' : 'normal'
        case 'light':
            return value === 'Bright' ? 'critical' : value === 'Dim' ? 'warning' : 'normal'
        case 'breathing':
            return value === 'Stopped' ? 'critical' : value === 'Irregular' ? 'warning' : 'normal'
        default:
            return 'neutral'
    }
}

export default function SensorCard({ icon, label, value, unit, type, rawValue }) {
    const statusKey = getStatus(type, rawValue ?? value)
    const colors = STATUS_COLORS[statusKey]
    const displayValue = value != null && value !== '—' ? value : '—'
    const hasData = displayValue !== '—'

    return (
        <div
            style={{
                background: 'rgba(13, 26, 50, 0.6)',
                border: `1px solid ${hasData ? colors.border : 'rgba(56, 189, 248, 0.08)'}`,
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle top accent line */}
            {hasData && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '20%',
                        right: '20%',
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${colors.text}, transparent)`,
                        opacity: 0.6,
                    }}
                />
            )}

            {/* Icon + Status dot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        background: hasData ? colors.bg : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${hasData ? colors.border : 'rgba(255,255,255,0.05)'}`,
                    }}
                >
                    {icon}
                </div>
                <div
                    style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: hasData ? colors.text : '#334155',
                        boxShadow: hasData ? `0 0 8px ${colors.glow}` : 'none',
                        animation: hasData ? 'pulse-live 2s infinite' : 'none',
                    }}
                />
            </div>

            {/* Label */}
            <p
                style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#475569',
                    marginBottom: '8px',
                }}
            >
                {label}
            </p>

            {/* Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span
                    key={String(value)}
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: hasData ? '28px' : '24px',
                        fontWeight: 700,
                        color: hasData ? colors.text : '#1e293b',
                        animation: hasData ? 'count-up 0.3s ease-out' : 'none',
                        lineHeight: 1,
                    }}
                >
                    {displayValue}
                </span>
                {unit && (
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    )
}

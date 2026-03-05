import React from 'react'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const POSITIONS = ['Left', 'Right', 'Back', 'Stomach']
const POSITION_COLORS = {
    Left: 'rgba(56, 189, 248, 0.8)',
    Right: 'rgba(167, 139, 250, 0.8)',
    Back: 'rgba(251, 191, 36, 0.8)',
    Stomach: 'rgba(74, 222, 128, 0.8)',
}

export default function PositionChart({ history }) {
    const counts = { Left: 0, Right: 0, Back: 0, Stomach: 0 }
    history.forEach((r) => {
        if (r.position && counts[r.position] != null) counts[r.position]++
    })

    const data = {
        labels: POSITIONS,
        datasets: [
            {
                data: POSITIONS.map((p) => counts[p]),
                backgroundColor: POSITIONS.map((p) => POSITION_COLORS[p]),
                borderColor: POSITIONS.map((p) => POSITION_COLORS[p].replace('0.8', '1')),
                borderWidth: 1,
                hoverOffset: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#94a3b8',
                    padding: 12,
                    font: { size: 12 },
                    usePointStyle: true,
                    pointStyleWidth: 8,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(10, 22, 40, 0.9)',
                titleColor: '#94a3b8',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(56, 189, 248, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: (ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                        const pct = total ? ((ctx.parsed / total) * 100).toFixed(1) : 0
                        return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`
                    },
                },
            },
        },
        animation: { duration: 300 },
    }

    const total = history.length

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Sleep Position <span style={{ color: 'var(--text-muted)' }}>Distribution (session)</span>
                </h4>
            </div>
            <div style={{ height: '180px' }}>
                {total === 0 ? (
                    <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
                        No data yet
                    </div>
                ) : (
                    <Doughnut data={data} options={options} />
                )}
            </div>
        </div>
    )
}

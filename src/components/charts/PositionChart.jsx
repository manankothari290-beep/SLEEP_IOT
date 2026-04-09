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
    Left: 'rgba(72, 72, 74, 0.7)',       // Charcoal
    Right: 'rgba(142, 142, 147, 0.7)',    // Gray
    Back: 'rgba(255, 159, 10, 0.7)',      // Amber
    Stomach: 'rgba(163, 177, 138, 0.7)',  // Muted green
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
                borderColor: '#FFFFFF',
                borderWidth: 2,
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
                    color: '#86868B',
                    padding: 12,
                    font: { size: 12 },
                    usePointStyle: true,
                    pointStyleWidth: 8,
                },
            },
            tooltip: {
                backgroundColor: '#FFFFFF',
                titleColor: '#86868B',
                bodyColor: '#1D1D1F',
                borderColor: '#E5E5E7',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#48484A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <h4 className="font-semibold text-sm" style={{ color: '#1D1D1F' }}>
                    Sleep Position <span style={{ color: '#86868B', fontWeight: 400 }}>Distribution</span>
                </h4>
            </div>
            <div style={{ height: '180px' }}>
                {total === 0 ? (
                    <div className="flex items-center justify-center h-full" style={{ color: '#AEAEB2' }}>
                        No data yet
                    </div>
                ) : (
                    <Doughnut data={data} options={options} />
                )}
            </div>
        </div>
    )
}

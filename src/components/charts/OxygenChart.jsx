import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function OxygenChart({ history }) {
    const slice = history.slice(-20)
    const labels = slice.map((r) => format(new Date(r.created_at), 'HH:mm:ss'))
    const values = slice.map((r) => r.oxygen_level ?? 0)

    // Color points red if < 92%
    const pointColors = values.map((v) => (v < 92 ? '#f87171' : '#22d3ee'))

    const data = {
        labels,
        datasets: [
            {
                label: 'SpO2',
                data: values,
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.07)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: pointColors,
                borderWidth: 2,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10, 22, 40, 0.9)',
                titleColor: '#94a3b8',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(34, 211, 238, 0.2)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#475569', maxTicksLimit: 8, font: { size: 11 } },
            },
            y: {
                min: 85,
                max: 101,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#475569', font: { size: 11 } },
            },
        },
        animation: { duration: 300 },
    }

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🩸</span>
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Oxygen Level <span style={{ color: 'var(--text-muted)' }}>(SpO2 %)</span>
                    </h4>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '10px' }}>
                    ⚠️ &lt;92% critical
                </span>
            </div>
            <div style={{ height: '180px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

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

export default function TemperatureChart({ history }) {
    const slice = history.slice(-20)
    const labels = slice.map((r) => format(new Date(r.created_at), 'HH:mm:ss'))
    const values = slice.map((r) => r.temperature ?? 0)

    const data = {
        labels,
        datasets: [
            {
                label: 'Temperature',
                data: values,
                borderColor: '#fb923c',
                backgroundColor: 'rgba(251, 146, 60, 0.07)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#fb923c',
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
                borderColor: 'rgba(251, 146, 60, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: (ctx) => `${ctx.parsed.y}°C`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#475569', maxTicksLimit: 8, font: { size: 11 } },
            },
            y: {
                min: 10,
                max: 40,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#475569', font: { size: 11 }, callback: (v) => `${v}°` },
            },
        },
        animation: { duration: 300 },
    }

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <span className="text-lg">🌡️</span>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Temperature <span style={{ color: 'var(--text-muted)' }}>(°C)</span>
                </h4>
            </div>
            <div style={{ height: '180px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

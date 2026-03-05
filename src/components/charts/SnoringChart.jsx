import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { format } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const SNORING_MAP = { None: 0, Mild: 1, Heavy: 2 }
const SNORING_COLOR = {
    0: 'rgba(74, 222, 128, 0.7)',
    1: 'rgba(251, 191, 36, 0.7)',
    2: 'rgba(248, 113, 113, 0.7)',
}

export default function SnoringChart({ history }) {
    const slice = history.slice(-20)
    const labels = slice.map((r) => format(new Date(r.created_at), 'HH:mm:ss'))
    const values = slice.map((r) => SNORING_MAP[r.snoring_level] ?? 0)
    const colors = values.map((v) => SNORING_COLOR[v] ?? 'rgba(56,189,248,0.5)')

    const data = {
        labels,
        datasets: [
            {
                label: 'Snoring',
                data: values,
                backgroundColor: colors,
                borderColor: colors.map((c) => c.replace('0.7', '1')),
                borderWidth: 1,
                borderRadius: 4,
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
                borderColor: 'rgba(56, 189, 248, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: (ctx) => {
                        const labels = ['None', 'Mild', 'Heavy']
                        return `Snoring: ${labels[ctx.parsed.y]}`
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#475569', maxTicksLimit: 8, font: { size: 11 } },
            },
            y: {
                min: 0,
                max: 2,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#475569',
                    font: { size: 11 },
                    stepSize: 1,
                    callback: (v) => ['None', 'Mild', 'Heavy'][v] ?? '',
                },
            },
        },
        animation: { duration: 300 },
    }

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <span className="text-lg">😤</span>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Snoring Level <span style={{ color: 'var(--text-muted)' }}>(Intensity)</span>
                </h4>
            </div>
            <div style={{ height: '180px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    )
}

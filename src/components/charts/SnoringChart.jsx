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
    0: 'rgba(163, 177, 138, 0.7)',   // Muted green = None
    1: 'rgba(255, 159, 10, 0.6)',     // Amber = Mild
    2: 'rgba(255, 59, 48, 0.6)',      // Red = Heavy
}

export default function SnoringChart({ history }) {
    const slice = history.slice(-20)
    const labels = slice.map((r) => format(new Date(r.created_at), 'HH:mm:ss'))
    const values = slice.map((r) => SNORING_MAP[r.snoring_level] ?? 0)
    const colors = values.map((v) => SNORING_COLOR[v] ?? 'rgba(134,134,139,0.4)')

    const data = {
        labels,
        datasets: [
            {
                label: 'Snoring',
                data: values,
                backgroundColor: colors,
                borderColor: colors.map((c) => c.replace(/[\d.]+\)$/, '1)')),
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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
                        const labels = ['None', 'Mild', 'Heavy']
                        return `Snoring: ${labels[ctx.parsed.y]}`
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                ticks: { color: '#AEAEB2', maxTicksLimit: 8, font: { size: 10 } },
                border: { display: false },
            },
            y: {
                min: 0,
                max: 2,
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                ticks: {
                    color: '#AEAEB2',
                    font: { size: 10 },
                    stepSize: 1,
                    callback: (v) => ['None', 'Mild', 'Heavy'][v] ?? '',
                },
                border: { display: false },
            },
        },
        animation: { duration: 300 },
    }

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#48484A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                <h4 className="font-semibold text-sm" style={{ color: '#1D1D1F' }}>
                    Snoring Level <span style={{ color: '#86868B', fontWeight: 400 }}>(Intensity)</span>
                </h4>
            </div>
            <div style={{ height: '180px' }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    )
}

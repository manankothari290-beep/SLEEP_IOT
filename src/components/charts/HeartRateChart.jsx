import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const CHART_OPTIONS = {
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            titleFont: { size: 11 },
            bodyFont: { size: 12, weight: 600 },
        },
    },
    scales: {
        x: {
            grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
            ticks: { color: '#AEAEB2', maxTicksLimit: 8, font: { size: 10 } },
            border: { display: false },
        },
        y: {
            min: 40,
            max: 110,
            grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
            ticks: { color: '#AEAEB2', font: { size: 10 } },
            border: { display: false },
        },
    },
    animation: { duration: 300 },
}

export default function HeartRateChart({ history }) {
    const slice = history.slice(-20)
    const labels = slice.map((r) => format(new Date(r.created_at), 'HH:mm:ss'))
    const values = slice.map((r) => r.heart_rate ?? 0)

    const data = {
        labels,
        datasets: [
            {
                label: 'Heart Rate',
                data: values,
                borderColor: '#FF3B30',
                backgroundColor: 'rgba(255, 59, 48, 0.04)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#FF3B30',
                borderWidth: 2,
            },
        ],
    }

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <h4 className="font-semibold text-sm" style={{ color: '#1D1D1F' }}>
                    Heart Rate <span style={{ color: '#86868B', fontWeight: 400 }}>(BPM)</span>
                </h4>
            </div>
            <div style={{ height: '180px' }}>
                <Line data={data} options={CHART_OPTIONS} />
            </div>
        </div>
    )
}

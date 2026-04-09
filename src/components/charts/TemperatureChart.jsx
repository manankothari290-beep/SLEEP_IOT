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
                borderColor: '#FF9F0A',
                backgroundColor: 'rgba(255, 159, 10, 0.04)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#FF9F0A',
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
                backgroundColor: '#FFFFFF',
                titleColor: '#86868B',
                bodyColor: '#1D1D1F',
                borderColor: '#E5E5E7',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
                callbacks: {
                    label: (ctx) => `${ctx.parsed.y}\u00B0C`,
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
                min: 10,
                max: 40,
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                ticks: { color: '#AEAEB2', font: { size: 10 }, callback: (v) => `${v}\u00B0` },
                border: { display: false },
            },
        },
        animation: { duration: 300 },
    }

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9F0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                </svg>
                <h4 className="font-semibold text-sm" style={{ color: '#1D1D1F' }}>
                    Temperature <span style={{ color: '#86868B', fontWeight: 400 }}>({'\u00B0C'})</span>
                </h4>
            </div>
            <div style={{ height: '180px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

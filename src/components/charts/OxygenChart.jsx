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
    const pointColors = values.map((v) => (v < 92 ? '#FF3B30' : '#48484A'))

    const data = {
        labels,
        datasets: [
            {
                label: 'SpO2',
                data: values,
                borderColor: '#48484A',
                backgroundColor: 'rgba(72, 72, 74, 0.04)',
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
                backgroundColor: '#FFFFFF',
                titleColor: '#86868B',
                bodyColor: '#1D1D1F',
                borderColor: '#E5E5E7',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                ticks: { color: '#AEAEB2', maxTicksLimit: 8, font: { size: 10 } },
                border: { display: false },
            },
            y: {
                min: 85,
                max: 101,
                grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                ticks: { color: '#AEAEB2', font: { size: 10 } },
                border: { display: false },
            },
        },
        animation: { duration: 300 },
    }

    return (
        <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#48484A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <h4 className="font-semibold text-sm" style={{ color: '#1D1D1F' }}>
                        Oxygen Level <span style={{ color: '#86868B', fontWeight: 400 }}>(SpO2 %)</span>
                    </h4>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,59,48,0.06)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.12)', fontSize: '10px' }}>
                    &lt;92% critical
                </span>
            </div>
            <div style={{ height: '180px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

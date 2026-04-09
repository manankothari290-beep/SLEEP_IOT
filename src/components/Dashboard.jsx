import React, { useMemo } from 'react'
import { useSensorData } from '../hooks/useSensorData'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'
import {
    Heart, Wind, Thermometer, Droplets, Activity,
    Moon, Ear, Sun, AlertTriangle
} from 'lucide-react'

/* ── MetricCard ─────────────────────────────────────── */
function MetricCard({ title, value, unit, icon, description, valueColor, iconBg }) {
    return (
        <Card className="flex flex-col justify-between p-6">
            <div className="flex justify-between items-start w-full">
                {/* Icon box */}
                <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: iconBg || '#F5F5F7' }}>
                    {icon}
                </div>
                {/* Title */}
                <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#86868B] mt-2">
                    {title}
                </span>
            </div>

            <div className="flex flex-col mt-6">
                <div className="flex items-baseline gap-1">
                    <span className={`text-[32px] font-bold leading-none tracking-tight ${valueColor || 'text-[#1D1D1F]'}`}>
                        {value != null && value !== '—' ? value : '—'}
                    </span>
                    {unit && value !== '—' && (
                        <span className="text-[13px] font-semibold text-[#86868B]">{unit}</span>
                    )}
                </div>
                {description && (
                    <span className="text-[12px] font-medium text-[#AEAEB2] mt-2">
                        {description}
                    </span>
                )}
            </div>
        </Card>
    )
}

/* ── RealtimeChart ──────────────────────────────────── */
const RealtimeChart = React.memo(function RealtimeChart({ data, title, dataKey, lineColor, unit, legendName }) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return []
        return data.slice(-30).map((d) => ({
            time: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
            [dataKey]: d[dataKey],
        }))
    }, [data, dataKey])

    return (
        <Card className="flex-1 min-w-[300px] flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[14px] font-bold text-[#1D1D1F] tracking-tight">{title}</h3>
            </div>
            <div style={{ width: '100%', height: '220px' }}>
                {chartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[#AEAEB2] text-sm">
                        Waiting for data...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="time"
                                stroke="transparent"
                                fontSize={10}
                                tick={{ fill: '#AEAEB2', fontSize: 10 }}
                                tickFormatter={(t) => { const p = t.split(':'); return p.length >= 3 ? `${p[1]}:${p[2]}` : t; }}
                            />
                            <YAxis
                                stroke="transparent"
                                fontSize={10}
                                tick={{ fill: '#AEAEB2', fontSize: 10 }}
                                tickFormatter={(v) => v}
                            />
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#F0F0F2',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                }}
                                itemStyle={{ color: '#1D1D1F' }}
                                labelStyle={{ color: '#86868B', fontWeight: 500, marginBottom: '4px' }}
                                formatter={(value) => [`${value}${unit || ''}`, legendName]}
                            />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={lineColor}
                                strokeWidth={2.5}
                                dot={false}
                                name={legendName}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    )
})

/* ── Dashboard ──────────────────────────────────────── */
export default function Dashboard() {
    const { latestReading: d, history, alerts, status } = useSensorData()

    const statusColor = status === 'live' ? 'text-[#1D1D1F]' : status === 'connecting' ? 'text-[#FF9F0A]' : 'text-[#FF3B30]'
    const statusLabel = status === 'live' ? 'Live' : status === 'connecting' ? 'Connecting' : 'Offline'

    return (
        <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 max-w-[1200px] mx-auto pb-20">
            {/* ── Title Area ───────────────────────────── */}
            <div className="pt-10 pb-12 text-center flex flex-col items-center">
                <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight leading-[1.1]" style={{ letterSpacing: '-0.04em' }}>
                    <span className="text-[#1D1D1F]">Sleep Health.</span>
                    <br />
                    <span className="text-[#86868B]">Perfectly tracked.</span>
                </h1>
                <p className="text-[#86868B] text-[15px] max-w-[500px] mt-6 leading-relaxed font-medium">
                    Real-time telemetry and environmental analysis for optimized recovery.
                </p>
            </div>

            {/* ── First Row of Metrics ─────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    title="Heart Rate"
                    value={d?.heart_rate ?? '—'}
                    unit="BPM"
                    icon={<Heart className="h-5 w-5 text-[#FF3B30]" />}
                    iconBg="rgba(255,59,48,0.06)"
                    description="Real-time cardiac monitor"
                />
                <MetricCard
                    title="Oxygen Level"
                    value={d?.oxygen_level ?? '—'}
                    unit="%"
                    icon={<Wind className="h-5 w-5 text-[#007AFF]" />}
                    iconBg="rgba(0,122,255,0.06)"
                    description="SpO2 saturation"
                />
                <MetricCard
                    title="Temperature"
                    value={d?.temperature ?? '—'}
                    unit={'\u00B0C'}
                    icon={<Thermometer className="h-5 w-5 text-[#FF9F0A]" />}
                    iconBg="rgba(255,159,10,0.06)"
                    description="Room temperature"
                />
                <Card className="flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start w-full">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(52,199,89,0.06)]">
                            <Activity className="h-5 w-5 text-[#34C759]" />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-[#86868B] mt-2">
                            Activity
                        </span>
                    </div>

                    <div className="flex flex-col mt-6">
                        <div className="flex items-center gap-3">
                            {status === 'live' && (
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34C759]" />
                                </span>
                            )}
                            <span className={`text-[32px] font-bold leading-none tracking-tight ${statusColor}`}>
                                {statusLabel}
                            </span>
                        </div>
                        <span className="text-[12px] font-medium text-[#AEAEB2] mt-2">
                            {status === 'live' ? 'Data streaming in real-time' : 'Waiting for sensor data'}
                        </span>
                    </div>
                </Card>
            </div>

            {/* ── Second Row of Metrics ─────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    title="Position"
                    value={d?.position ?? '—'}
                    icon={<Moon className="h-5 w-5 text-[#5E5CE6]" />}
                    iconBg="rgba(94,92,230,0.06)"
                    description="Current orientation"
                />
                <MetricCard
                    title="Snoring"
                    value={d?.snoring_level ?? '—'}
                    icon={<Ear className="h-5 w-5 text-[#D57FF5]" />}
                    iconBg="rgba(213,127,245,0.08)"
                    description="Acoustic analysis"
                />
                <MetricCard
                    title="Humidity"
                    value={d?.humidity ?? '—'}
                    unit="%"
                    icon={<Droplets className="h-5 w-5 text-[#32ADE6]" />}
                    iconBg="rgba(50,173,230,0.08)"
                    description="Environmental moisture"
                />
                <MetricCard
                    title="Light"
                    value={d?.light_level ?? '—'}
                    icon={<Sun className="h-5 w-5 text-[#FFCC00]" />}
                    iconBg="rgba(255,204,0,0.12)"
                    description="Ambient illumination"
                />
            </div>

            {/* ── Charts Grid ──────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
                <RealtimeChart
                    data={history}
                    title="Heart Rate Trend"
                    dataKey="heart_rate"
                    lineColor="#FF3B30"
                    unit=" BPM"
                    legendName="Heart Rate"
                />
                <RealtimeChart
                    data={history}
                    title="Oxygen Level Trend"
                    dataKey="oxygen_level"
                    lineColor="#007AFF"
                    unit="%"
                    legendName="SpO2"
                />
                <RealtimeChart
                    data={history}
                    title="Temperature Trend"
                    dataKey="temperature"
                    lineColor="#FF9F0A"
                    unit={'\u00B0C'}
                    legendName="Temperature"
                />
                <RealtimeChart
                    data={history}
                    title="Humidity Trend"
                    dataKey="humidity"
                    lineColor="#32ADE6"
                    unit="%"
                    legendName="Humidity"
                />
            </div>

            {/* ── Latest Info area ─────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
                <Card className="max-h-[400px] flex flex-col overflow-hidden">
                    <CardHeader className="px-6 py-5 border-b border-[#F0F0F2]">
                        <CardTitle className="text-[14px] font-bold text-[#1D1D1F] tracking-tight">
                            Latest Readings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto">
                        <div className="divide-y divide-[#F0F0F2]">
                            {history.length === 0 ? (
                                <p className="p-6 text-center text-[#AEAEB2]">Waiting for data...</p>
                            ) : (
                                [...history].reverse().slice(0, 15).map((r, idx) => (
                                    <div key={r.id || idx} className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFAFA] transition-colors">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold text-[15px] text-[#1D1D1F] w-[70px]">
                                                    {r.heart_rate}<span className="text-xs text-[#86868B] ml-1 font-normal">BPM</span>
                                                </span>
                                                <span className="font-semibold text-[15px] text-[#1D1D1F] w-[60px]">
                                                    {r.oxygen_level}<span className="text-xs text-[#86868B] ml-1 font-normal">%</span>
                                                </span>
                                                <span className="font-semibold text-[15px] text-[#1D1D1F] w-[60px]">
                                                    {r.temperature}<span className="text-xs text-[#86868B] ml-1 font-normal">{'\u00B0C'}</span>
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#86868B]">
                                                <span className="bg-[#F5F5F7] px-2 py-0.5 rounded-md">{r.position}</span>
                                                <span className="bg-[#F5F5F7] px-2 py-0.5 rounded-md">{r.snoring_level} snoring</span>
                                                <span className="bg-[#F5F5F7] px-2 py-0.5 rounded-md">{r.breathing_status}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 text-right w-[140px] shrink-0">
                                            <span className="text-xs font-medium text-[#AEAEB2]">
                                                {r.created_at ? new Date(r.created_at).toLocaleTimeString() : ''}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {alerts.length > 0 ? (
                    <Card className="flex flex-col overflow-hidden max-h-[400px]">
                        <CardHeader className="px-6 py-5 border-b border-[#F0F0F2]">
                            <CardTitle className="text-[14px] font-bold text-[#1D1D1F] tracking-tight flex items-center justify-between">
                                System Alerts
                                <span className="text-[11px] font-bold bg-[rgba(255,59,48,0.08)] text-[#FF3B30] px-2.5 py-0.5 rounded-full border border-[rgba(255,59,48,0.15)]">
                                    {alerts.length}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto">
                            <div className="divide-y divide-[#F0F0F2]">
                                {[...alerts].reverse().map((a, i) => (
                                    <div key={a.id || i} className="flex items-start lg:items-center justify-between px-6 py-4 hover:bg-[#FAFAFA] transition-colors gap-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`p-1.5 rounded-lg ${a.severity === 'critical' ? 'bg-[rgba(255,59,48,0.08)] text-[#FF3B30]' : 'bg-[rgba(255,159,10,0.08)] text-[#FF9F0A]'}`}>
                                                <AlertTriangle className="h-4 w-4" />
                                            </div>
                                            <span className={`text-[14px] font-medium leading-tight ${a.severity === 'critical' ? 'text-[#FF3B30]' : 'text-[#FF9F0A]'}`}>
                                                {a.message}
                                            </span>
                                        </div>
                                        <span className="text-[12px] font-medium text-[#AEAEB2] whitespace-nowrap shrink-0 mt-1 lg:mt-0">
                                            {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="flex flex-col items-center justify-center p-6 text-[#86868B]">
                        <div className="p-3 rounded-full bg-[#F5F5F7] mb-3">
                            <AlertTriangle className="h-6 w-6 text-[#AEAEB2]" />
                        </div>
                        <span className="text-sm font-medium">No active alerts</span>
                    </Card>
                )}
            </div>

            {/* ── Footer ────────────────────────────────── */}
            <div className="text-center text-[#AEAEB2] text-xs py-8 mt-4">
                SleepGuard IoT · Real-time data every 5s · Powered by Supabase
            </div>
        </div>
    )
}

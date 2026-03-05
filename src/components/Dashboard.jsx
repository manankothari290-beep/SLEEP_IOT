import React, { useMemo } from 'react'
import { useSensorData } from '../hooks/useSensorData'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
    Heart, Wind, Thermometer, Droplets, Activity,
    Clock, Moon, Ear, Sun, AlertTriangle, BarChart3
} from 'lucide-react'

/* ── MetricCard ─────────────────────────────────────── */
function MetricCard({ title, value, unit, icon, description, valueColor }) {
    return (
        <Card className="flex-1 min-w-[200px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${valueColor || 'text-white'}`}>
                    {value != null && value !== '—' ? value : '—'}{unit && value !== '—' ? <span className="text-base font-normal text-gray-500 ml-1">{unit}</span> : ''}
                </div>
                {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
            </CardContent>
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
        <Card className="flex-1 min-w-[300px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ width: '100%', height: '280px' }}>
                    {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                            Waiting for data...
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.8} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#4b5563"
                                    fontSize={10}
                                    interval="preserveStartEnd"
                                    tickFormatter={(t) => { const p = t.split(':'); return p.length >= 3 ? `${p[1]}:${p[2]}` : t; }}
                                />
                                <YAxis
                                    stroke="#4b5563"
                                    fontSize={11}
                                    tickFormatter={(v) => unit ? `${v}${unit}` : v}
                                />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        borderColor: '#374151',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                    }}
                                    itemStyle={{ color: '#f9fafb' }}
                                    labelStyle={{ color: '#9ca3af' }}
                                    formatter={(value) => [`${value}${unit || ''}`, legendName]}
                                />
                                <Legend wrapperStyle={{ color: '#9ca3af', paddingTop: '8px', fontSize: '12px' }} />
                                <Line
                                    type="monotone"
                                    dataKey={dataKey}
                                    stroke={lineColor}
                                    strokeWidth={2}
                                    dot={false}
                                    name={legendName}
                                    isAnimationActive={chartData.length <= 1}
                                    animationDuration={600}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
})

/* ── Dashboard ──────────────────────────────────────── */
export default function Dashboard() {
    const { latestReading: d, history, alerts, status } = useSensorData()

    const statusColor = status === 'live' ? 'text-green-500' : status === 'connecting' ? 'text-yellow-400' : 'text-red-400'
    const statusLabel = status === 'live' ? 'Live' : status === 'connecting' ? 'Connecting' : 'Offline'

    return (
        <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8 max-w-[1400px] mx-auto">
            {/* ── Title ────────────────────────────────── */}
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                    SleepGuard Monitor
                </h1>
                <p className="text-gray-500 text-sm md:text-base mt-2">
                    Real-time insights into your sleep health & environment.
                </p>
            </div>

            {/* ── Top Metric Cards ─────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Heart Rate"
                    value={d?.heart_rate ?? '—'}
                    unit="BPM"
                    icon={<Heart className="h-4 w-4 text-red-400" />}
                    description="Real-time cardiac monitor"
                    valueColor="text-red-400"
                />
                <MetricCard
                    title="Oxygen Level"
                    value={d?.oxygen_level ?? '—'}
                    unit="%"
                    icon={<Wind className="h-4 w-4 text-blue-400" />}
                    description="SpO2 saturation"
                    valueColor="text-blue-400"
                />
                <MetricCard
                    title="Temperature"
                    value={d?.temperature ?? '—'}
                    unit="°C"
                    icon={<Thermometer className="h-4 w-4 text-amber-400" />}
                    description="Room temperature"
                    valueColor="text-amber-400"
                />
                <Card className="flex-1 min-w-[200px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Activity Status</CardTitle>
                        <Clock className="h-4 w-4 text-gray-500 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {status === 'live' && (
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                                </span>
                            )}
                            <span className={statusColor}>{statusLabel}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {status === 'live' ? 'Data streaming in real-time' : 'Waiting for sensor data'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* ── Secondary Metrics ────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MetricCard
                    title="Sleep Position"
                    value={d?.position ?? '—'}
                    icon={<Moon className="h-4 w-4 text-purple-400" />}
                    valueColor="text-purple-400"
                />
                <MetricCard
                    title="Snoring"
                    value={d?.snoring_level ?? '—'}
                    icon={<Ear className="h-4 w-4 text-orange-400" />}
                    valueColor="text-orange-400"
                />
                <MetricCard
                    title="Humidity"
                    value={d?.humidity ?? '—'}
                    unit="%"
                    icon={<Droplets className="h-4 w-4 text-cyan-400" />}
                    valueColor="text-cyan-400"
                />
                <MetricCard
                    title="Light Level"
                    value={d?.light_level ?? '—'}
                    icon={<Sun className="h-4 w-4 text-yellow-400" />}
                    valueColor="text-yellow-400"
                />
            </div>

            {/* ── Charts ────────────────────────────────── */}
            <div className="flex flex-wrap gap-4 justify-center">
                <RealtimeChart
                    data={history}
                    title="Heart Rate Trend"
                    dataKey="heart_rate"
                    lineColor="#f87171"
                    unit=" BPM"
                    legendName="Heart Rate"
                />
                <RealtimeChart
                    data={history}
                    title="Oxygen Level Trend"
                    dataKey="oxygen_level"
                    lineColor="#60a5fa"
                    unit="%"
                    legendName="SpO2"
                />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <RealtimeChart
                    data={history}
                    title="Temperature Trend"
                    dataKey="temperature"
                    lineColor="#fbbf24"
                    unit="°C"
                    legendName="Temperature"
                />
                <RealtimeChart
                    data={history}
                    title="Humidity Trend"
                    dataKey="humidity"
                    lineColor="#22d3ee"
                    unit="%"
                    legendName="Humidity"
                />
            </div>

            {/* ── Latest Readings (like Latest Payments) ── */}
            <Card className="max-h-[400px] overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Latest Readings
                    </CardTitle>
                    <CardDescription>Most recent sensor readings, updated live.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[280px] overflow-y-auto">
                        <div className="divide-y divide-white/5">
                            {history.length === 0 ? (
                                <p className="p-6 text-center text-gray-600">No readings yet... start the simulator.</p>
                            ) : (
                                [...history].reverse().slice(0, 15).map((r, idx) => (
                                    <div key={r.id || idx} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-lg text-red-400">{r.heart_rate}<span className="text-xs text-gray-500 ml-0.5">BPM</span></span>
                                                <span className="text-gray-600">|</span>
                                                <span className="font-bold text-blue-400">{r.oxygen_level}<span className="text-xs text-gray-500 ml-0.5">%</span></span>
                                                <span className="text-gray-600">|</span>
                                                <span className="font-bold text-amber-400">{r.temperature}<span className="text-xs text-gray-500 ml-0.5">°C</span></span>
                                            </div>
                                            <span className="text-sm text-gray-500 mt-0.5">
                                                {r.position} · {r.snoring_level} snoring · {r.breathing_status}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-gray-600">
                                                {r.created_at ? new Date(r.created_at).toLocaleTimeString() : ''}
                                            </span>
                                            {r.alert_status && r.alert_status !== 'Normal' && (
                                                <span className="flex items-center gap-1 text-xs text-red-400">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {r.alert_status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-white/5">
                    <p className="text-sm text-gray-600">Displaying the 15 most recent readings · {history.length} total</p>
                </CardFooter>
            </Card>

            {/* ── Alerts ────────────────────────────────── */}
            {alerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            Alerts
                            <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">{alerts.length}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5 max-h-[200px] overflow-y-auto">
                            {[...alerts].reverse().map((a, i) => (
                                <div key={a.id || i} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-lg ${a.severity === 'critical' ? '🚨' : '⚠️'}`}>
                                            {a.severity === 'critical' ? '🚨' : '⚠️'}
                                        </span>
                                        <span className={`text-sm font-medium ${a.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {a.message}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Footer ────────────────────────────────── */}
            <div className="text-center text-gray-700 text-xs py-4 border-t border-white/5">
                SleepGuard IoT · Real-time data every 5s · Powered by Supabase
            </div>
        </div>
    )
}

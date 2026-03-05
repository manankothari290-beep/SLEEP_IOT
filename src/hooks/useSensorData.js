import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

const HISTORY_LIMIT = 50

export function useSensorData() {
    const [latestReading, setLatestReading] = useState(null)
    const [history, setHistory] = useState([])
    const [alerts, setAlerts] = useState([])
    const [status, setStatus] = useState('connecting') // 'connecting' | 'live' | 'offline'
    const channelRef = useRef(null)

    const hasCredentials = Boolean(
        import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
    )

    useEffect(() => {
        if (!hasCredentials) {
            setStatus('offline')
            return
        }

        let isMounted = true

        // ── Fetch last 50 readings ──────────────────────────────
        async function fetchHistory() {
            try {
                const { data, error } = await supabase
                    .from('sensor_data')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(HISTORY_LIMIT)

                if (error) {
                    console.error('Error fetching sensor history:', error)
                    if (isMounted) setStatus('offline')
                    return
                }

                if (isMounted && data && data.length > 0) {
                    const sorted = [...data].reverse()
                    setHistory(sorted)
                    setLatestReading(sorted[sorted.length - 1])
                    // Populate alerts from existing data
                    const existingAlerts = sorted
                        .filter((r) => r.alert_status && r.alert_status !== 'Normal')
                        .map((r) => ({
                            id: r.id,
                            message: r.alert_status,
                            timestamp: r.created_at,
                            severity: getSeverity(r),
                        }))
                        .slice(-10)
                    setAlerts(existingAlerts)
                    setStatus('live')
                }
            } catch (err) {
                console.error('Supabase fetch error:', err)
                if (isMounted) setStatus('offline')
            }
        }

        fetchHistory()

        // ── Subscribe to realtime inserts ───────────────────────
        let channel
        try {
            channel = supabase
                .channel('sensor_data_realtime')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'sensor_data' },
                    (payload) => {
                        if (!isMounted) return
                        const newRow = payload.new
                        setLatestReading(newRow)
                        setHistory((prev) => {
                            const updated = [...prev, newRow]
                            return updated.slice(-HISTORY_LIMIT)
                        })
                        if (newRow.alert_status && newRow.alert_status !== 'Normal') {
                            setAlerts((prev) => {
                                const newAlert = {
                                    id: newRow.id,
                                    message: newRow.alert_status,
                                    timestamp: newRow.created_at,
                                    severity: getSeverity(newRow),
                                }
                                return [...prev.slice(-9), newAlert]
                            })
                        }
                        setStatus('live')
                    }
                )
                .subscribe((subStatus) => {
                    if (subStatus === 'SUBSCRIBED') setStatus('live')
                    if (subStatus === 'CLOSED' || subStatus === 'CHANNEL_ERROR') setStatus('offline')
                })

            channelRef.current = channel
        } catch (err) {
            console.error('Supabase realtime error:', err)
            setStatus('offline')
        }

        return () => {
            isMounted = false
            if (channelRef.current) {
                try { supabase.removeChannel(channelRef.current) } catch (_) { }
            }
        }
    }, [hasCredentials])

    return { latestReading, history, alerts, status }
}

function getSeverity(row) {
    if (row.oxygen_level < 92 || row.breathing_status === 'Stopped') return 'critical'
    if (row.position === 'Back' && row.snoring_level === 'Heavy') return 'warning'
    return 'info'
}

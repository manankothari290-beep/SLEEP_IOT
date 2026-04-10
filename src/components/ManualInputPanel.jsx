import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Card } from './ui/card'
import { Zap } from 'lucide-react'

const POSITION_OPTIONS = ['Left', 'Right', 'Back', 'Stomach']
const SNORING_OPTIONS = ['None', 'Mild', 'Heavy']
const BREATHING_OPTIONS = ['Normal', 'Irregular', 'Stopped']
const LIGHT_OPTIONS = ['Dark', 'Dim', 'Bright']

const defaultValues = {
    heart_rate: 72,
    oxygen_level: 97,
    temperature: 24,
    humidity: 50,
    position: 'Back',
    snoring_level: 'None',
    breathing_status: 'Normal',
    light_level: 'Dark',
}

function computeAlerts(data) {
    const reasons = []
    if (data.position === 'Back' && data.snoring_level === 'Heavy') {
        reasons.push('Unsafe sleeping posture')
    }
    if (data.oxygen_level < 92) {
        reasons.push('Low oxygen level')
    }
    if (data.breathing_status === 'Stopped') {
        reasons.push('Breathing interruption detected')
    }
    if (data.light_level === 'Bright') {
        reasons.push('Room too bright for sleep')
    }
    return reasons.length > 0 ? reasons.join(' | ') : 'Normal'
}

/* ── Styles ─────────────────────────────────────────── */
const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#86868B',
    marginBottom: '6px',
}

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #E5E5E7',
    background: '#FAFAFA',
    fontSize: '15px',
    fontWeight: 600,
    color: '#1D1D1F',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
}

const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2386868B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
}

export default function ManualInputPanel() {
    const [values, setValues] = useState(defaultValues)
    const [sending, setSending] = useState(false)
    const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', text }

    function handleChange(field, raw) {
        let val = raw
        if (['heart_rate', 'oxygen_level', 'temperature', 'humidity'].includes(field)) {
            val = raw === '' ? '' : Number(raw)
        }
        setValues((prev) => ({ ...prev, [field]: val }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSending(true)
        setFeedback(null)

        // Validate numeric fields
        for (const f of ['heart_rate', 'oxygen_level', 'temperature', 'humidity']) {
            if (values[f] === '' || isNaN(values[f])) {
                setFeedback({ type: 'error', text: `Please enter a valid number for ${f.replace('_', ' ')}` })
                setSending(false)
                return
            }
        }

        const alert_status = computeAlerts(values)
        const payload = { ...values, alert_status }

        try {
            const { error } = await supabase.from('sensor_data').insert([payload])
            if (error) throw error
            setFeedback({ type: 'success', text: 'Data submitted — dashboard updated!' })
        } catch (err) {
            console.error('Submit error:', err)
            setFeedback({ type: 'error', text: err.message || 'Failed to submit' })
        } finally {
            setSending(false)
            setTimeout(() => setFeedback(null), 4000)
        }
    }

    const previewAlert = computeAlerts(values)
    const isAlert = previewAlert !== 'Normal'

    return (
        <Card className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ background: 'rgba(94,92,230,0.06)' }}
                >
                    <Zap className="h-5 w-5 text-[#5E5CE6]" />
                </div>
                <div>
                    <h3 className="text-[14px] font-bold text-[#1D1D1F] tracking-tight">
                        Manual Sensor Input
                    </h3>
                    <p className="text-[11px] text-[#86868B] mt-0.5">
                        Enter custom values to simulate a reading
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* ── Number inputs row ──────────────── */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '16px',
                    }}
                >
                    <div>
                        <label style={labelStyle}>Heart Rate</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                min="30"
                                max="200"
                                value={values.heart_rate}
                                onChange={(e) => handleChange('heart_rate', e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#5E5CE6'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(94,92,230,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E5E5E7'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#AEAEB2',
                                }}
                            >
                                BPM
                            </span>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Oxygen Level</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                min="70"
                                max="100"
                                value={values.oxygen_level}
                                onChange={(e) => handleChange('oxygen_level', e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#5E5CE6'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(94,92,230,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E5E5E7'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#AEAEB2',
                                }}
                            >
                                %
                            </span>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Temperature</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={values.temperature}
                                onChange={(e) => handleChange('temperature', e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#5E5CE6'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(94,92,230,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E5E5E7'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#AEAEB2',
                                }}
                            >
                                °C
                            </span>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Humidity</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={values.humidity}
                                onChange={(e) => handleChange('humidity', e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#5E5CE6'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(94,92,230,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E5E5E7'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#AEAEB2',
                                }}
                            >
                                %
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Dropdown inputs row ──────────────── */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '16px',
                        marginTop: '16px',
                    }}
                >
                    <div>
                        <label style={labelStyle}>Position</label>
                        <select
                            value={values.position}
                            onChange={(e) => handleChange('position', e.target.value)}
                            style={selectStyle}
                        >
                            {POSITION_OPTIONS.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Snoring</label>
                        <select
                            value={values.snoring_level}
                            onChange={(e) => handleChange('snoring_level', e.target.value)}
                            style={selectStyle}
                        >
                            {SNORING_OPTIONS.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Breathing</label>
                        <select
                            value={values.breathing_status}
                            onChange={(e) => handleChange('breathing_status', e.target.value)}
                            style={selectStyle}
                        >
                            {BREATHING_OPTIONS.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Light Level</label>
                        <select
                            value={values.light_level}
                            onChange={(e) => handleChange('light_level', e.target.value)}
                            style={selectStyle}
                        >
                            {LIGHT_OPTIONS.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Live alert preview ──────────────── */}
                <div
                    style={{
                        marginTop: '20px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: isAlert ? 'rgba(255,59,48,0.04)' : 'rgba(52,199,89,0.04)',
                        border: `1px solid ${isAlert ? 'rgba(255,59,48,0.12)' : 'rgba(52,199,89,0.12)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <span style={{ fontSize: '16px' }}>{isAlert ? '🚨' : '✅'}</span>
                    <div>
                        <div
                            style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: '#86868B',
                                marginBottom: '2px',
                            }}
                        >
                            Alert Preview
                        </div>
                        <div
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: isAlert ? '#FF3B30' : '#34C759',
                            }}
                        >
                            {previewAlert}
                        </div>
                    </div>
                </div>

                {/* ── Submit button + feedback ──────────── */}
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        type="submit"
                        disabled={sending}
                        style={{
                            padding: '12px 28px',
                            borderRadius: '14px',
                            border: 'none',
                            background: sending ? '#86868B' : '#1D1D1F',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                            cursor: sending ? 'not-allowed' : 'pointer',
                            transition: 'all 0.25s',
                            letterSpacing: '-0.01em',
                            transform: 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                            if (!sending) e.target.style.transform = 'scale(1.02)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)'
                        }}
                    >
                        {sending ? 'Submitting…' : 'Submit Reading'}
                    </button>

                    {feedback && (
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: feedback.type === 'success' ? '#34C759' : '#FF3B30',
                                animation: 'fadeIn 0.3s ease',
                            }}
                        >
                            {feedback.type === 'success' ? '✓' : '✗'} {feedback.text}
                        </span>
                    )}
                </div>
            </form>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Card>
    )
}

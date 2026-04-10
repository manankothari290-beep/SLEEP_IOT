// SleepGuard – IoT Simulator
// Simulates an ESP32 sleep monitoring device sending sensor data to Supabase
// Run: node simulator.js

import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const INTERVAL_MS = 5000 // Send data every 5 seconds

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials. Please create a .env file from .env.example')
    process.exit(1)
}

// ── Sensor value generators ──────────────────────────────
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateSensorData() {
    const position = randomChoice(['Left', 'Right', 'Back', 'Stomach'])
    const heart_rate = randomInt(55, 95)
    const oxygen_level = randomInt(88, 100) // Can dip below 92 for simulation
    const snoring_level = randomChoice(['None', 'None', 'Mild', 'Mild', 'Heavy']) // Weighted
    const temperature = randomInt(20, 30)
    const humidity = randomInt(35, 70)
    const light_level = randomChoice(['Dark', 'Dark', 'Dark', 'Dim', 'Bright']) // Weighted dark

    // Breathing: mostly normal, occasionally irregular or stopped
    const breathingRoll = Math.random()
    let breathing_status = 'Normal'
    if (breathingRoll > 0.93) breathing_status = 'Stopped'
    else if (breathingRoll > 0.80) breathing_status = 'Irregular'

    // ── Alert detection logic ───────────────────────────────
    const alertReasons = []

    if (position === 'Back' && snoring_level === 'Heavy') {
        alertReasons.push('Unsafe sleeping posture')
    }
    if (oxygen_level < 92) {
        alertReasons.push('Low oxygen level')
    }
    if (breathing_status === 'Stopped') {
        alertReasons.push('Breathing interruption detected')
    }
    if (light_level === 'Bright') {
        alertReasons.push('Room too bright for sleep')
    }

    const alert_status = alertReasons.length > 0 ? alertReasons.join(' | ') : 'Normal'

    return {
        position,
        heart_rate,
        oxygen_level,
        snoring_level,
        breathing_status,
        temperature,
        humidity,
        light_level,
        alert_status,
    }
}

// ── Send data to Supabase ────────────────────────────────
async function sendToSupabase(payload) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sensor_data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Supabase error ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    if (data.length === 0) {
        throw new Error('Supabase returned 201 but inserted 0 rows. This is likely an RLS (Row Level Security) policy issue on the sensor_data table.')
    }
}

// ── Pretty console log ───────────────────────────────────
function logReading(payload, count) {
    const alertIcon = payload.alert_status === 'Normal' ? '✅' : '🚨'
    const timeStr = new Date().toLocaleTimeString()

    console.log(`\n[${timeStr}] Reading #${count}`)
    console.log(`  🛌 Position    : ${payload.position}`)
    console.log(`  ❤️  Heart Rate  : ${payload.heart_rate} BPM`)
    console.log(`  🩸 Oxygen      : ${payload.oxygen_level}%`)
    console.log(`  😤 Snoring     : ${payload.snoring_level}`)
    console.log(`  💨 Breathing   : ${payload.breathing_status}`)
    console.log(`  🌡️  Temperature : ${payload.temperature}°C`)
    console.log(`  💧 Humidity    : ${payload.humidity}%`)
    console.log(`  💡 Light       : ${payload.light_level}`)
    console.log(`  ${alertIcon} Alert       : ${payload.alert_status}`)
}

// ── Main loop ────────────────────────────────────────────
let count = 0

async function tick() {
    count++
    const payload = generateSensorData()
    logReading(payload, count)

    try {
        await sendToSupabase(payload)
        console.log('  📡 Sent to Supabase ✓')
    } catch (err) {
        console.error('  ❌ Send failed:', err.message)
    }
}

console.log('🌙 SleepGuard IoT Simulator starting...')
console.log(`📡 Supabase URL: ${SUPABASE_URL}`)
console.log(`⏱️  Sending data every ${INTERVAL_MS / 1000} seconds`)
console.log('─────────────────────────────────────────')

// Send immediately then every 5 seconds
tick()
setInterval(tick, INTERVAL_MS)

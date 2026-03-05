# 🌙 SleepGuard – Smart Sleep Monitoring System

A production-ready, full-stack IoT monitoring web application that simulates a Sleep Positional Therapy IoT device. Monitors sleep posture, physiological signals, and environmental conditions in real time using Supabase Realtime and a React dashboard.

```
Simulator (Node.js) → Supabase (PostgreSQL + Realtime) → React Dashboard
        ↓  [Later]
ESP32 Hardware → Supabase → Dashboard (no code changes needed)
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS v4 |
| Charts | Chart.js + react-chartjs-2 |
| Backend | Supabase (PostgreSQL + Realtime) |
| Simulator | Node.js ESM |
| Deployment | Vercel (frontend) + Supabase (backend) |

---

## 🚀 Quick Start

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. In the SQL Editor, run the schema from [`supabase/schema.sql`](./supabase/schema.sql)
3. Enable Realtime:  
   - Go to **Database → Replication → supabase_realtime** publication  
   - Toggle on `sensor_data` table
4. Copy your **Project URL** and **anon public key** from **Settings → API**

### 2. Dashboard Setup

```bash
# Clone / navigate to the project
cd /path/to/sleep_IOT

# Create your .env file
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Install dependencies (already done if scaffolded)
npm install

# Start dev server
npm run dev
```

Open → http://localhost:5173

### 3. IoT Simulator Setup

```bash
cd simulator

# Install simulator dependencies
npm install

# Create simulator env file
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_ANON_KEY

# Start simulator (sends data every 5 seconds)
npm start
```

Watch the dashboard update live! 🎉

---

## 📊 Database Schema

```sql
create table sensor_data (
  id             uuid        primary key default gen_random_uuid(),
  position       text,        -- Left | Right | Back | Stomach
  heart_rate     integer,     -- BPM
  oxygen_level   integer,     -- SpO2 %
  snoring_level  text,        -- None | Mild | Heavy
  breathing_status text,      -- Normal | Irregular | Stopped
  temperature    integer,     -- °C
  humidity       integer,     -- %
  light_level    text,        -- Dark | Dim | Bright
  alert_status   text,        -- "Normal" or alert message
  created_at     timestamptz  default now()
);
```

---

## 🚨 Alert Logic

| Condition | Alert |
|-----------|-------|
| Position = Back AND Snoring = Heavy | Unsafe sleeping posture |
| oxygen_level < 92 | Low oxygen level |
| breathing_status = Stopped | Breathing interruption detected |
| light_level = Bright | Room too bright for sleep |

---

## 📡 IoT Simulator Payload (JSON)

```json
{
  "position": "Back",
  "heart_rate": 78,
  "oxygen_level": 95,
  "snoring_level": "Heavy",
  "breathing_status": "Normal",
  "temperature": 26,
  "humidity": 60,
  "light_level": "Dim",
  "alert_status": "Unsafe sleeping posture"
}
```

---

## 🔧 ESP32 Hardware Integration

When ready for hardware, the ESP32 sends the **exact same JSON payload** to Supabase. **Zero changes** needed to the dashboard or backend.

### Arduino / ESP32 Code Skeleton

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const char* SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

void sendToSupabase(float heartRate, int oxygen, String position, ...) {
  HTTPClient http;
  http.begin(String(SUPABASE_URL) + "/rest/v1/sensor_data");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
  http.addHeader("Prefer", "return=minimal");

  StaticJsonDocument<256> doc;
  doc["position"] = position;
  doc["heart_rate"] = (int)heartRate;
  doc["oxygen_level"] = oxygen;
  // ... rest of fields

  String body;
  serializeJson(doc, body);
  http.POST(body);
  http.end();
}
```

### Sensors → ESP32 Pins

| Sensor | Model | Gets |
|--------|-------|------|
| Position | MPU6050 (I2C) | Accelerometer → posture |
| Pulse Oximeter | MAX30102 (I2C) | HR + SpO2 |
| Temperature/Humidity | DHT11 | Temp (°C) + Humidity (%) |
| Snoring | Microphone module | Audio level |
| Light | LDR (analog) | Ambient brightness |

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

---

## 📁 Project Structure

```
sleep_IOT/
├── src/
│   ├── lib/
│   │   └── supabaseClient.js      # Supabase singleton
│   ├── hooks/
│   │   └── useSensorData.js       # Realtime data hook
│   ├── components/
│   │   ├── SensorCard.jsx         # Sensor value card
│   │   ├── AlertsPanel.jsx        # Alert log panel
│   │   ├── StatusIndicator.jsx    # Live/Offline status
│   │   ├── Dashboard.jsx          # Main dashboard page
│   │   └── charts/
│   │       ├── HeartRateChart.jsx
│   │       ├── OxygenChart.jsx
│   │       ├── TemperatureChart.jsx
│   │       ├── HumidityChart.jsx
│   │       ├── SnoringChart.jsx
│   │       └── PositionChart.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── simulator/
│   ├── simulator.js               # Node.js IoT simulator
│   ├── package.json
│   └── .env.example
├── supabase/
│   └── schema.sql                 # SQL table creation script
├── .env.example
└── README.md
```

---

## 🔬 Architecture Diagram

```
Phase 1 (Current) — Software Simulation:

  ┌─────────────────┐
  │  Node.js        │
  │  Simulator      │──── POST /rest/v1/sensor_data ──▶ ┌──────────────┐
  │  (every 5s)     │                                    │   Supabase   │
  └─────────────────┘                                    │  PostgreSQL  │
                                                         │  + Realtime  │
  ┌─────────────────┐                                    └──────┬───────┘
  │  React Dashboard│◀─── Supabase Realtime WebSocket ─────────┘
  │  (Vite)         │
  └─────────────────┘

Phase 2 (Hardware) — No code changes needed:

  ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
  │  Sensors     │───▶│    ESP32    │───▶│   Supabase   │───▶│  Dashboard   │
  │  MPU6050     │    │  WiFi POST  │    │  (unchanged) │    │ (unchanged)  │
  │  MAX30102    │    └─────────────┘    └──────────────┘    └──────────────┘
  │  DHT11, LDR  │
  └──────────────┘
```

---

*SleepGuard IoT Monitoring System — Built with React, Supabase, and ❤️*

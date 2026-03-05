-- SleepGuard sensor_data table
-- Run this in your Supabase SQL Editor

create table if not exists sensor_data (
  id uuid primary key default gen_random_uuid(),
  position text,
  heart_rate integer,
  oxygen_level integer,
  snoring_level text,
  breathing_status text,
  temperature integer,
  humidity integer,
  light_level text,
  alert_status text,
  created_at timestamptz default now()
);

-- Required for Supabase Realtime change detection
alter table sensor_data replica identity full;

-- Optional: clear old data (useful for testing)
-- truncate table sensor_data;

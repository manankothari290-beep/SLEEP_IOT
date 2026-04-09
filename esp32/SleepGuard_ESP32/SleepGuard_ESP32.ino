#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ==========================================
// 1. WIFI SETTINGS
// ==========================================
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ==========================================
// 2. SUPABASE SETTINGS (From your .env file)
// ==========================================
// E.g., "https://xyz.supabase.co/rest/v1/sensor_data"
const char* SUPABASE_URL = "YOUR_SUPABASE_URL/rest/v1/sensor_data";

// Your Supabase Anon Key
const char* SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// ==========================================
// SENSOR PINS (Example mappings)
// ==========================================
#define HEART_RATE_PIN 34
#define TEMP_SENSOR_PIN 35
#define MIC_PIN 32 // For snoring detection

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Connect to WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 1. Read real sensors (Simulated here for the example structure)
  int heartRate = readHeartRateSensor();
  int oxygenLevel = readSpO2Sensor();
  float temp = readTemperatureSensor();
  int humidity = 45; // Simulated
  
  String position = detectPosition();
  String snoring = detectSnoring();
  String breathing = "Normal";
  String light = "Dark";

  // 2. Send Data to Supabase
  if (WiFi.status() == WL_CONNECTED) {
    sendDataToSupabase(heartRate, oxygenLevel, temp, humidity, position, snoring, breathing, light);
  } else {
    Serial.println("WiFi Disconnected. Cannot send data.");
  }

  // Wait 5 seconds before next reading
  delay(5000);
}

// ==========================================
// HTTP POST TO SUPABASE
// ==========================================
void sendDataToSupabase(int hr, int spo2, float temp, int hum, String pos, String snore, String breath, String light) {
  HTTPClient http;
  
  http.begin(SUPABASE_URL);
  
  // Supabase required headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  
  // "Bearer " + ANON_KEY
  String authHeader = String("Bearer ") + SUPABASE_ANON_KEY;
  http.addHeader("Authorization", authHeader);
  http.addHeader("Prefer", "return=minimal");

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["heart_rate"] = hr;
  doc["oxygen_level"] = spo2;
  doc["temperature"] = temp;
  doc["humidity"] = hum;
  doc["position"] = pos;
  doc["snoring_level"] = snore;
  doc["breathing_status"] = breath;
  doc["light_level"] = light;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.println("Sending data: " + jsonPayload);

  // Send POST request
  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}

// ==========================================
// DUMMY SENSOR FUNCTIONS (Replace with real libraries)
// ==========================================
int readHeartRateSensor() {
  // In reality: wire up MAX30102 via I2C and read it here
  return random(60, 85); 
}

int readSpO2Sensor() {
  // In reality: wire up MAX30102 via I2C
  return random(95, 100);
}

float readTemperatureSensor() {
  // In reality: wire up DHT11 or DS18B20
  return 22.0 + (random(-10, 10) / 10.0);
}

String detectPosition() {
  // In reality: wire up MPU6050 accelerometer
  int r = random(0, 4);
  if (r == 0) return "Back";
  if (r == 1) return "Left Side";
  if (r == 2) return "Right Side";
  return "Stomach";
}

String detectSnoring() {
  // In reality: read analog microphone module
  int r = random(0, 10);
  if (r > 8) return "Heavy";
  if (r > 6) return "Light";
  return "None";
}

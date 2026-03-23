"use server"

import type { Alert, SmartwatchData } from "./types"

export async function createAlert(
  userId: string,
  data: {
    alert_type: Alert["alert_type"]
    latitude?: number
    longitude?: number
    location_address?: string
    message?: string
    is_test?: boolean
    is_stealth?: boolean
    voice_activated?: boolean
    auto_call_911?: boolean
  },
) {
  console.log("[v0] Creating alert for user:", userId, data)

  const alert: Alert = {
    id: `alert-${Date.now()}`,
    user_id: userId,
    alert_type: data.alert_type,
    status: data.is_test ? "test" : "active",
    latitude: data.latitude,
    longitude: data.longitude,
    location_address: data.location_address,
    message: data.message,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (data.auto_call_911 && !data.is_test) {
    console.log("[v0] Auto-calling 911 for alert:", alert.id)
    // TODO: Integrate with phone system to auto-dial 911
  }

  if (!data.is_test) {
    console.log("[v0] Notifying emergency contacts via SMS/Email")
    // TODO: Send SMS and Email notifications
  }

  if (!data.is_test && !data.is_stealth) {
    console.log("[v0] Starting audio/video recording")
    // TODO: Start recording
  }

  return { success: true, alert }
}

export async function cancelAlert(alertId: string) {
  // TODO: Replace with actual database update
  console.log("[v0] Cancelling alert:", alertId)

  return { success: true }
}

export async function saveSmartwatchData(userId: string, data: Partial<SmartwatchData>) {
  // TODO: Replace with actual database insert
  console.log("[v0] Saving smartwatch data:", userId, data)

  const smartwatchData: SmartwatchData = {
    id: `sw-${Date.now()}`,
    user_id: userId,
    heart_rate: data.heart_rate,
    steps: data.steps,
    fall_detected: data.fall_detected || false,
    movement_intensity: data.movement_intensity,
    battery_level: data.battery_level,
    recorded_at: new Date().toISOString(),
  }

  // Check for automatic alert triggers
  if (data.fall_detected) {
    await createAlert(userId, {
      alert_type: "fall_detection",
      message: "Caída detectada automáticamente por smartwatch",
    })
  }

  if (data.heart_rate && (data.heart_rate > 150 || data.heart_rate < 40)) {
    await createAlert(userId, {
      alert_type: "heart_rate",
      message: `Ritmo cardíaco anormal detectado: ${data.heart_rate} BPM`,
    })
  }

  return { success: true, data: smartwatchData }
}

export async function getUserAlerts(userId: string): Promise<Alert[]> {
  // TODO: Replace with actual database query
  console.log("[v0] Fetching alerts for user:", userId)
  return []
}

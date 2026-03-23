"use server"

import type { Responder } from "./types"

export async function saveResponderProfile(userId: string, data: Partial<Responder>) {
  // TODO: Replace with actual database insert/update
  console.log("[v0] Saving responder profile for user:", userId, data)

  const profile: Responder = {
    id: `responder-${Date.now()}`,
    user_id: userId,
    organization_name: data.organization_name || "",
    responder_type: data.responder_type || "police",
    badge_number: data.badge_number,
    service_area: data.service_area,
    is_verified: false, // Requires admin verification
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return { success: true, profile }
}

export async function getResponderProfile(userId: string): Promise<Responder | null> {
  // TODO: Replace with actual database query
  console.log("[v0] Fetching responder profile for user:", userId)
  return null
}

export async function getActiveAlerts() {
  // TODO: Replace with actual database query filtering by responder's service area
  console.log("[v0] Fetching active alerts")

  // Simulated alerts data
  return [
    {
      id: "alert-1",
      user_id: "user-123",
      user_name: "María González",
      alert_type: "sos" as const,
      status: "active" as const,
      latitude: 20.6597,
      longitude: -103.3496,
      location_address: "Av. Chapultepec 123, Col. Americana, Guadalajara",
      message: "Alerta SOS activada manualmente",
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      medical_info: {
        blood_type: "O+",
        allergies: "Penicilina",
        emergency_contact: "+52 333 123 4567",
      },
    },
    {
      id: "alert-2",
      user_id: "user-456",
      user_name: "Juan Pérez",
      alert_type: "fall_detection" as const,
      status: "responding" as const,
      latitude: 20.6736,
      longitude: -103.3444,
      location_address: "Calle Morelos 456, Col. Centro, Guadalajara",
      message: "Caída detectada automáticamente por smartwatch",
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      medical_info: {
        blood_type: "A+",
        allergies: "Ninguna",
        emergency_contact: "+52 333 987 6543",
      },
    },
    {
      id: "alert-3",
      user_id: "user-789",
      user_name: "Ana Martínez",
      alert_type: "heart_rate" as const,
      status: "active" as const,
      latitude: 20.6668,
      longitude: -103.3918,
      location_address: "Av. Patria 789, Col. Jardines del Valle, Zapopan",
      message: "Ritmo cardíaco anormal detectado: 165 BPM",
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      medical_info: {
        blood_type: "B+",
        allergies: "Aspirina, mariscos",
        emergency_contact: "+52 333 555 1234",
      },
    },
  ]
}

export async function respondToAlert(alertId: string, responderId: string, responseType: string) {
  console.log("[v0] Responding to alert:", alertId, responderId, responseType)

  // TODO: Update alert status and create alert_response record
  return { success: true }
}

export async function getAlertDetails(alertId: string) {
  console.log("[v0] Fetching alert details:", alertId)

  // TODO: Replace with actual database query joining users and medical_profiles
  return {
    id: alertId,
    user_name: "María González",
    alert_type: "sos",
    status: "active",
    location_address: "Av. Chapultepec 123, Col. Americana, Guadalajara",
    created_at: new Date().toISOString(),
    medical_profile: {
      blood_type: "O+",
      allergies: "Penicilina",
      medical_conditions: "Diabetes tipo 2",
      imss_number: "12345678901",
      emergency_contact_name: "Pedro González",
      emergency_contact_phone: "+52 333 123 4567",
    },
  }
}

// User types
export type UserType = "citizen" | "responder"

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  user_type: UserType
  created_at: string
  updated_at: string
}

// Medical profile
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"

export interface MedicalProfile {
  id: string
  user_id: string
  imss_number?: string
  blood_type?: BloodType
  allergies?: string
  medical_conditions?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  created_at: string
  updated_at: string
}

// Responder types
export type ResponderType = "police" | "private_security" | "medical"

export interface Responder {
  id: string
  user_id: string
  organization_name: string
  responder_type: ResponderType
  badge_number?: string
  service_area?: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// Alert types
export type AlertType = "manual" | "fall_detection" | "heart_rate" | "sos"
export type AlertStatus = "active" | "responding" | "resolved" | "cancelled"

export interface Alert {
  id: string
  user_id: string
  alert_type: AlertType
  status: AlertStatus
  latitude?: number
  longitude?: number
  location_address?: string
  message?: string
  responder_id?: string
  created_at: string
  resolved_at?: string
  updated_at: string
}

// Smartwatch data
export type MovementIntensity = "low" | "moderate" | "high" | "sudden"

export interface SmartwatchData {
  id: string
  user_id: string
  heart_rate?: number
  steps?: number
  fall_detected: boolean
  movement_intensity?: MovementIntensity
  battery_level?: number
  recorded_at: string
}

// Alert response
export type ResponseType = "acknowledged" | "en_route" | "arrived" | "completed"

export interface AlertResponse {
  id: string
  alert_id: string
  responder_id: string
  response_type: ResponseType
  notes?: string
  created_at: string
}

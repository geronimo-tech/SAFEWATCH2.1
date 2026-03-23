export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  user_type: 'citizen' | 'emergency_service'
  created_at: string
  updated_at: string
}

export interface MedicalProfile {
  id: string
  user_id: string
  blood_type: string
  allergies: string[]
  chronic_conditions: string[]
  medications: string[]
  emergency_contacts: EmergencyContact[]
  imss_number?: string
  insurance_provider?: string
  insurance_number?: string
  height?: number
  weight?: number
  created_at: string
  updated_at: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface EmergencyService {
  id: string
  user_id: string
  service_name: string
  service_type: 'police' | 'medical' | 'fire' | 'private_security'
  license_number: string
  coverage_areas: string[]
  phone: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  alert_type: 'manual' | 'fall_detected' | 'heart_rate_anomaly' | 'sos' | 'low_oxygen'
  status: 'active' | 'responding' | 'resolved' | 'cancelled'
  latitude: number
  longitude: number
  address?: string
  notes?: string
  smartwatch_data?: SmartwatchReading
  created_at: string
  updated_at: string
}

export interface AlertResponse {
  id: string
  alert_id: string
  responder_id: string
  response_type: 'acknowledged' | 'en_route' | 'on_scene' | 'completed'
  estimated_arrival?: string
  notes?: string
  created_at: string
}

export interface SmartwatchReading {
  id: string
  user_id: string
  heart_rate?: number
  heart_rate_variability?: number // HRV
  blood_oxygen?: number // SpO2
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  ecg_data?: string // ECG reading JSON
  stress_level?: number // 0-100 scale
  calories?: number
  steps?: number
  distance?: number // in meters
  sleep_light_minutes?: number
  sleep_deep_minutes?: number
  sleep_rem_minutes?: number
  respiratory_rate?: number // breaths per minute
  body_temperature?: number // in Celsius
  skin_temperature?: number // in Celsius
  fall_detected?: boolean
  acceleration_x?: number
  acceleration_y?: number
  acceleration_z?: number
  timestamp: string
}

export interface SafetyPoint {
  id: string
  name: string
  type: 'police_station' | 'hospital' | 'fire_station' | 'safe_point' | 'emergency_center'
  address: string
  latitude: number
  longitude: number
  phone?: string
  hours_24?: boolean
  services: string[]
  created_at: string
}

export type CreateAlertPayload = Omit<Alert, 'id' | 'created_at' | 'updated_at'>
export type CreateMedicalProfilePayload = Omit<MedicalProfile, 'id' | 'created_at' | 'updated_at'>
export type CreateEmergencyServicePayload = Omit<EmergencyService, 'id' | 'created_at' | 'updated_at' | 'verified'>

/**
 * MODELOS DE BASE DE DATOS NOSQL - MONGODB
 * =========================================
 * 
 * Modelo de datos para SAFEWATCH 2.0
 * Base de datos: MongoDB Atlas (NoSQL)
 * 
 * Ventajas de MongoDB para este proyecto:
 * - Flexibilidad en esquema para datos médicos variables
 * - Geolocalización nativa para puntos de seguridad
 * - Alto rendimiento en lecturas para alertas en tiempo real
 * - Escalabilidad horizontal para crecimiento futuro
 */

import { ObjectId } from 'mongodb';

// ============================================
// INTERFACES DE DOCUMENTOS
// ============================================

/**
 * Usuario del sistema
 * Almacena información de ciudadanos que usan la app
 */
export interface UserDocument {
  _id?: ObjectId;
  
  // Información personal
  email: string;
  password_hash: string; // Nunca texto plano - bcrypt
  full_name: string;
  phone: string;
  
  // Rol y permisos
  role: 'citizen' | 'responder' | 'admin';
  is_verified: boolean;
  is_active: boolean;
  
  // Configuración
  preferences: {
    notifications_enabled: boolean;
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'system';
    emergency_voice_enabled: boolean;
  };
  
  // Suscripción premium
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'family';
    expires_at: Date | null;
    features: string[];
  };
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  login_attempts: number;
  locked_until: Date | null;
}

/**
 * Perfil médico del usuario
 * Información crítica para emergencias
 */
export interface MedicalProfileDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  
  // Información básica
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
  date_of_birth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer_not_say';
  height_cm: number | null;
  weight_kg: number | null;
  
  // Condiciones médicas
  medical_conditions: {
    name: string;
    diagnosed_date: Date | null;
    severity: 'mild' | 'moderate' | 'severe';
    notes: string;
  }[];
  
  // Alergias
  allergies: {
    allergen: string;
    reaction_type: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  }[];
  
  // Medicamentos actuales
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    start_date: Date;
    prescribing_doctor: string | null;
  }[];
  
  // Contacto médico de emergencia
  emergency_medical_contact: {
    doctor_name: string;
    specialty: string;
    phone: string;
    hospital: string;
  } | null;
  
  // Número de seguro social mexicano
  imss_number: string | null;
  
  // Notas adicionales para paramédicos
  emergency_notes: string;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  last_reviewed: Date | null;
}

/**
 * Alerta de emergencia
 * Registro de cada alerta generada
 */
export interface AlertDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  
  // Tipo de alerta
  alert_type: 'medical' | 'security' | 'accident' | 'fire' | 'natural_disaster' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Estado del workflow
  status: 'pending' | 'dispatched' | 'in_progress' | 'resolved' | 'cancelled' | 'false_alarm';
  
  // Ubicación geográfica (GeoJSON para consultas espaciales)
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
    address: string;
    reference_points: string;
  };
  
  // Detalles de la emergencia
  description: string;
  voice_transcript: string | null; // Si se activó por voz
  
  // Datos del smartwatch (si aplica)
  smartwatch_data: {
    heart_rate: number | null;
    fall_detected: boolean;
    device_id: string | null;
  } | null;
  
  // Respuesta
  responder_id: ObjectId | null;
  response_time_seconds: number | null;
  resolution_notes: string | null;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  resolved_at: Date | null;
}

/**
 * Respondedor de emergencias
 * Personal capacitado para atender alertas
 */
export interface ResponderDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  
  // Información profesional
  responder_type: 'paramedic' | 'police' | 'firefighter' | 'civil_protection' | 'volunteer';
  badge_number: string;
  organization: string;
  
  // Certificaciones
  certifications: {
    name: string;
    issuer: string;
    issue_date: Date;
    expiry_date: Date;
    certificate_number: string;
  }[];
  
  // Estado de servicio
  is_on_duty: boolean;
  current_location: {
    type: 'Point';
    coordinates: [number, number];
    last_updated: Date;
  } | null;
  
  // Estadísticas
  stats: {
    total_responses: number;
    average_response_time_seconds: number;
    rating: number;
    total_ratings: number;
  };
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  last_active: Date;
}

/**
 * Punto de seguridad
 * Ubicaciones seguras en la ciudad
 */
export interface SafetyPointDocument {
  _id?: ObjectId;
  
  // Información del punto
  name: string;
  type: 'hospital' | 'police_station' | 'fire_station' | 'shelter' | 'safe_zone' | 'pharmacy' | 'other';
  
  // Ubicación (GeoJSON)
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    neighborhood: string;
    municipality: string;
  };
  
  // Información de contacto
  contact: {
    phone: string;
    emergency_phone: string | null;
    email: string | null;
    website: string | null;
  };
  
  // Horario de atención
  schedule: {
    is_24_hours: boolean;
    hours: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      open: string;
      close: string;
    }[];
  };
  
  // Servicios disponibles
  services: string[];
  
  // Estado
  is_active: boolean;
  verified_by_admin: boolean;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
}

/**
 * Datos del smartwatch
 * Histórico de lecturas de dispositivos
 */
export interface SmartwatchDataDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  device_id: string;
  
  // Lecturas
  readings: {
    timestamp: Date;
    heart_rate: number;
    steps: number;
    calories_burned: number;
    blood_oxygen: number | null;
    stress_level: number | null;
  };
  
  // Alertas del dispositivo
  device_alerts: {
    type: 'fall_detected' | 'abnormal_heart_rate' | 'inactivity' | 'low_battery';
    timestamp: Date;
    handled: boolean;
  }[];
  
  // Estado del dispositivo
  battery_level: number;
  is_connected: boolean;
  last_sync: Date;
  
  // Metadatos
  created_at: Date;
}

/**
 * Contacto de emergencia
 * Personas a notificar en emergencias
 */
export interface EmergencyContactDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  
  // Información del contacto
  full_name: string;
  relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'friend' | 'neighbor' | 'other';
  phone: string;
  email: string | null;
  
  // Prioridad de notificación
  priority: number; // 1 = primero en contactar
  
  // Configuración
  notify_on_alert: boolean;
  notify_on_location_share: boolean;
  has_app_installed: boolean;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
}

/**
 * Log de auditoría
 * Registro de todas las acciones del sistema
 */
export interface AuditLogDocument {
  _id?: ObjectId;
  
  // Quién realizó la acción
  user_id: ObjectId | null;
  user_role: string;
  ip_address: string;
  user_agent: string;
  
  // Qué acción se realizó
  action: string;
  resource_type: string;
  resource_id: string | null;
  
  // Detalles
  details: Record<string, unknown>;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  
  // Resultado
  success: boolean;
  error_message: string | null;
  
  // Metadatos
  timestamp: Date;
}

/**
 * Registro de backup
 * Historial de respaldos realizados
 */
export interface BackupDocument {
  _id?: ObjectId;
  
  // Información del backup
  backup_type: 'full' | 'incremental' | 'differential';
  status: 'in_progress' | 'completed' | 'failed';
  
  // Detalles
  collections_included: string[];
  documents_count: number;
  size_bytes: number;
  
  // Almacenamiento
  storage_location: string;
  file_name: string;
  
  // Quién lo inició
  initiated_by: ObjectId | null;
  initiated_type: 'manual' | 'scheduled' | 'automatic';
  
  // Tiempos
  started_at: Date;
  completed_at: Date | null;
  
  // Error (si falló)
  error_message: string | null;
}

/**
 * Sesión de usuario
 * Para manejo de sesiones activas
 */
export interface SessionDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  
  // Token de sesión
  token_hash: string;
  
  // Información del dispositivo
  device_info: {
    user_agent: string;
    ip_address: string;
    device_type: 'mobile' | 'tablet' | 'desktop' | 'smartwatch';
    os: string;
    browser: string;
  };
  
  // Estado
  is_active: boolean;
  
  // Tiempos
  created_at: Date;
  expires_at: Date;
  last_activity: Date;
}

// ============================================
// ÍNDICES RECOMENDADOS
// ============================================

export const RECOMMENDED_INDEXES = {
  users: [
    { key: { email: 1 }, options: { unique: true } },
    { key: { phone: 1 }, options: { unique: true } },
    { key: { role: 1, is_active: 1 } },
    { key: { created_at: -1 } },
  ],
  
  medical_profiles: [
    { key: { user_id: 1 }, options: { unique: true } },
    { key: { blood_type: 1 } },
  ],
  
  alerts: [
    { key: { user_id: 1, created_at: -1 } },
    { key: { status: 1, priority: -1 } },
    { key: { responder_id: 1, status: 1 } },
    { key: { location: '2dsphere' } }, // Índice geoespacial
    { key: { created_at: -1 } },
  ],
  
  responders: [
    { key: { user_id: 1 }, options: { unique: true } },
    { key: { is_on_duty: 1, responder_type: 1 } },
    { key: { 'current_location': '2dsphere' } }, // Índice geoespacial
  ],
  
  safety_points: [
    { key: { location: '2dsphere' } }, // Índice geoespacial
    { key: { type: 1, is_active: 1 } },
    { key: { 'location.municipality': 1 } },
  ],
  
  smartwatch_data: [
    { key: { user_id: 1, created_at: -1 } },
    { key: { device_id: 1 } },
  ],
  
  emergency_contacts: [
    { key: { user_id: 1, priority: 1 } },
  ],
  
  audit_logs: [
    { key: { timestamp: -1 } },
    { key: { user_id: 1, timestamp: -1 } },
    { key: { action: 1, resource_type: 1 } },
  ],
  
  backups: [
    { key: { started_at: -1 } },
    { key: { status: 1 } },
  ],
  
  sessions: [
    { key: { user_id: 1 } },
    { key: { token_hash: 1 }, options: { unique: true } },
    { key: { expires_at: 1 }, options: { expireAfterSeconds: 0 } }, // TTL index
  ],
};

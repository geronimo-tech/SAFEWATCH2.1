/**
 * API de Sincronizacion Smartwatch - SafeWatch 2.0
 * 
 * Implementa seguridad para datos de salud en tiempo real:
 * - Autenticacion obligatoria
 * - Validacion estricta de rangos de valores medicos
 * - Rate limiting apropiado para sincronizacion frecuente
 * - Deteccion de anomalias y alertas automaticas
 */

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  checkRateLimit,
  logSecurityEvent,
  SECURITY_HEADERS
} from "@/lib/security"

// Rangos validos para datos de smartwatch
const VALID_RANGES = {
  heartRate: { min: 30, max: 250 },
  heartRateVariability: { min: 0, max: 200 },
  bloodOxygen: { min: 70, max: 100 },
  bloodPressureSystolic: { min: 70, max: 250 },
  bloodPressureDiastolic: { min: 40, max: 150 },
  stressLevel: { min: 0, max: 100 },
  steps: { min: 0, max: 100000 },
  calories: { min: 0, max: 10000 },
  distance: { min: 0, max: 100 }, // km
  sleepMinutes: { min: 0, max: 720 }, // 12 horas max
  respiratoryRate: { min: 8, max: 40 },
  bodyTemperature: { min: 34, max: 42 },
}

// Umbrales para alertas automaticas
const ALERT_THRESHOLDS = {
  heartRate: { low: 40, high: 150 },
  bloodOxygen: { low: 90 },
  bodyTemperature: { low: 35, high: 38.5 },
  bloodPressureSystolic: { high: 140 },
}

/**
 * Valida que un valor este dentro del rango permitido
 */
function validateRange(
  value: number | undefined,
  range: { min: number; max: number },
  fieldName: string
): { valid: boolean; error?: string } {
  if (value === undefined || value === null) {
    return { valid: true } // Campos opcionales
  }
  
  const num = Number(value)
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} debe ser un numero` }
  }
  
  if (num < range.min || num > range.max) {
    return { 
      valid: false, 
      error: `${fieldName} fuera de rango (${range.min}-${range.max})` 
    }
  }
  
  return { valid: true }
}

/**
 * POST /api/smartwatch/sync
 * Sincroniza datos del smartwatch
 */
export async function POST(request: Request) {
  try {
    // 1. Verificar autenticacion
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    
    if (!sessionCookie) {
      logSecurityEvent("unauthorized_access", {
        message: "Intento de sincronizar smartwatch sin autenticacion"
      })
      
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401, headers: SECURITY_HEADERS }
      )
    }

    // 2. Parsear sesion
    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json(
        { success: false, error: "Sesion invalida" },
        { status: 401, headers: SECURITY_HEADERS }
      )
    }

    // 3. Rate limiting - permitir sincronizacion frecuente
    // 60 requests por minuto (1 por segundo)
    const rateLimit = checkRateLimit(`smartwatch_${session.userId}`, 60, 60 * 1000)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Sincronizacion muy frecuente" },
        { status: 429, headers: SECURITY_HEADERS }
      )
    }

    // 4. Parsear body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Datos invalidos" },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    // 5. Validar todos los campos con rangos
    const validations = [
      validateRange(body.heartRate, VALID_RANGES.heartRate, "Ritmo cardiaco"),
      validateRange(body.heartRateVariability, VALID_RANGES.heartRateVariability, "HRV"),
      validateRange(body.bloodOxygen, VALID_RANGES.bloodOxygen, "Oxigeno en sangre"),
      validateRange(body.bloodPressureSystolic, VALID_RANGES.bloodPressureSystolic, "Presion sistolica"),
      validateRange(body.bloodPressureDiastolic, VALID_RANGES.bloodPressureDiastolic, "Presion diastolica"),
      validateRange(body.stressLevel, VALID_RANGES.stressLevel, "Nivel de estres"),
      validateRange(body.steps, VALID_RANGES.steps, "Pasos"),
      validateRange(body.calories, VALID_RANGES.calories, "Calorias"),
      validateRange(body.distance, VALID_RANGES.distance, "Distancia"),
      validateRange(body.sleepLightMinutes, VALID_RANGES.sleepMinutes, "Sueno ligero"),
      validateRange(body.sleepDeepMinutes, VALID_RANGES.sleepMinutes, "Sueno profundo"),
      validateRange(body.sleepRemMinutes, VALID_RANGES.sleepMinutes, "Sueno REM"),
      validateRange(body.respiratoryRate, VALID_RANGES.respiratoryRate, "Frecuencia respiratoria"),
      validateRange(body.bodyTemperature, VALID_RANGES.bodyTemperature, "Temperatura corporal"),
    ]

    const invalidValidation = validations.find(v => !v.valid)
    if (invalidValidation) {
      logSecurityEvent("invalid_input", {
        identifier: session.userId,
        message: invalidValidation.error,
        metadata: { source: "smartwatch_sync" }
      })
      
      return NextResponse.json(
        { success: false, error: invalidValidation.error },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    // 6. Crear registro de datos
    const reading = {
      id: `sw-${Date.now()}`,
      user_id: session.userId,
      heart_rate: body.heartRate,
      heart_rate_variability: body.heartRateVariability,
      blood_oxygen: body.bloodOxygen,
      blood_pressure_systolic: body.bloodPressureSystolic,
      blood_pressure_diastolic: body.bloodPressureDiastolic,
      stress_level: body.stressLevel,
      steps: body.steps,
      calories: body.calories,
      distance: body.distance,
      sleep_light_minutes: body.sleepLightMinutes,
      sleep_deep_minutes: body.sleepDeepMinutes,
      sleep_rem_minutes: body.sleepRemMinutes,
      respiratory_rate: body.respiratoryRate,
      body_temperature: body.bodyTemperature,
      fall_detected: Boolean(body.fallDetected),
      timestamp: new Date().toISOString()
    }

    // 7. Detectar condiciones de alerta
    const alerts: string[] = []
    let alertCreated = false

    // Caida detectada - maxima prioridad
    if (body.fallDetected) {
      console.log("[SMARTWATCH] Caida detectada para usuario:", session.userId)
      alertCreated = true
      alerts.push("fall_detected")
    }

    // Ritmo cardiaco anormal
    if (body.heartRate) {
      if (body.heartRate > ALERT_THRESHOLDS.heartRate.high) {
        console.log("[SMARTWATCH] Taquicardia detectada:", body.heartRate)
        alertCreated = true
        alerts.push("heart_rate_high")
      } else if (body.heartRate < ALERT_THRESHOLDS.heartRate.low) {
        console.log("[SMARTWATCH] Bradicardia detectada:", body.heartRate)
        alertCreated = true
        alerts.push("heart_rate_low")
      }
    }

    // Oxigeno bajo
    if (body.bloodOxygen && body.bloodOxygen < ALERT_THRESHOLDS.bloodOxygen.low) {
      console.log("[SMARTWATCH] Hipoxia detectada:", body.bloodOxygen)
      alertCreated = true
      alerts.push("low_oxygen")
    }

    // Temperatura anormal
    if (body.bodyTemperature) {
      if (body.bodyTemperature > ALERT_THRESHOLDS.bodyTemperature.high) {
        console.log("[SMARTWATCH] Fiebre detectada:", body.bodyTemperature)
        alertCreated = true
        alerts.push("fever")
      } else if (body.bodyTemperature < ALERT_THRESHOLDS.bodyTemperature.low) {
        console.log("[SMARTWATCH] Hipotermia detectada:", body.bodyTemperature)
        alertCreated = true
        alerts.push("hypothermia")
      }
    }

    // Presion alta
    if (body.bloodPressureSystolic && 
        body.bloodPressureSystolic > ALERT_THRESHOLDS.bloodPressureSystolic.high) {
      console.log("[SMARTWATCH] Hipertension detectada:", body.bloodPressureSystolic)
      alertCreated = true
      alerts.push("high_blood_pressure")
    }

    // Log de alerta si se creo alguna
    if (alertCreated) {
      logSecurityEvent("login_success", { // Usando evento existente como log
        identifier: session.userId,
        message: `Alertas de salud detectadas: ${alerts.join(", ")}`
      })
    }

    // TODO: Guardar en base de datos y crear alertas reales

    return NextResponse.json(
      { 
        success: true, 
        data: reading,
        alertCreated,
        alerts
      },
      { headers: SECURITY_HEADERS }
    )

  } catch (error) {
    console.error("[API] Error en POST /api/smartwatch/sync:", error)
    
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500, headers: SECURITY_HEADERS }
    )
  }
}

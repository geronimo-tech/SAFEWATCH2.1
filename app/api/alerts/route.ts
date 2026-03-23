/**
 * API de Alertas - SafeWatch 2.0
 * 
 * Implementa seguridad:
 * - Validacion de entrada
 * - Autenticacion requerida
 * - Sanitizacion de datos
 * - Rate limiting
 * - Logging de seguridad
 */

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getActiveAlerts } from "@/lib/responder"
import { 
  checkRateLimit, 
  logSecurityEvent,
  sanitizeString,
  validateUUID,
  SECURITY_HEADERS
} from "@/lib/security"

/**
 * GET /api/alerts
 * Obtiene las alertas activas
 * Requiere autenticacion
 */
export async function GET(request: Request) {
  try {
    // 1. Verificar autenticacion
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    
    if (!sessionCookie) {
      logSecurityEvent("unauthorized_access", {
        message: "Intento de acceso sin autenticacion a /api/alerts"
      })
      
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401, headers: SECURITY_HEADERS }
      )
    }

    // 2. Parsear y validar sesion
    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json(
        { success: false, error: "Sesion invalida" },
        { status: 401, headers: SECURITY_HEADERS }
      )
    }

    // 3. Verificar rate limiting
    const rateLimit = checkRateLimit(session.userId, 100, 60 * 1000) // 100 req/min
    
    if (!rateLimit.allowed) {
      logSecurityEvent("rate_limit_exceeded", {
        identifier: session.userId,
        message: "Rate limit excedido en /api/alerts"
      })
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Demasiadas solicitudes",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429, 
          headers: {
            ...SECURITY_HEADERS,
            "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
          }
        }
      )
    }

    // 4. Obtener alertas
    const alerts = await getActiveAlerts()
    
    // 5. Sanitizar datos de respuesta
    const sanitizedAlerts = alerts.map(alert => ({
      ...alert,
      user_name: sanitizeString(alert.user_name),
      location_address: sanitizeString(alert.location_address || ""),
      message: sanitizeString(alert.message || "")
    }))

    return NextResponse.json(
      { success: true, alerts: sanitizedAlerts },
      { headers: SECURITY_HEADERS }
    )

  } catch (error) {
    console.error("[API] Error en GET /api/alerts:", error)
    
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500, headers: SECURITY_HEADERS }
    )
  }
}

/**
 * POST /api/alerts
 * Crea una nueva alerta
 * Requiere autenticacion
 */
export async function POST(request: Request) {
  try {
    // 1. Verificar autenticacion
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    
    if (!sessionCookie) {
      logSecurityEvent("unauthorized_access", {
        message: "Intento de crear alerta sin autenticacion"
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

    // 3. Rate limiting mas restrictivo para creacion de alertas
    const rateLimit = checkRateLimit(`alert_create_${session.userId}`, 10, 60 * 1000) // 10/min
    
    if (!rateLimit.allowed) {
      logSecurityEvent("rate_limit_exceeded", {
        identifier: session.userId,
        message: "Rate limit excedido creando alertas"
      })
      
      return NextResponse.json(
        { success: false, error: "Demasiadas alertas creadas" },
        { status: 429, headers: SECURITY_HEADERS }
      )
    }

    // 4. Parsear y validar body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Cuerpo de solicitud invalido" },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    // 5. Validar tipo de alerta
    const validAlertTypes = ["manual", "fall_detection", "heart_rate", "sos"]
    if (!body.alert_type || !validAlertTypes.includes(body.alert_type)) {
      logSecurityEvent("invalid_input", {
        identifier: session.userId,
        message: "Tipo de alerta invalido",
        metadata: { alertType: body.alert_type }
      })
      
      return NextResponse.json(
        { success: false, error: "Tipo de alerta invalido" },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    // 6. Validar coordenadas si se proporcionan
    if (body.latitude !== undefined) {
      const lat = parseFloat(body.latitude)
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return NextResponse.json(
          { success: false, error: "Latitud invalida" },
          { status: 400, headers: SECURITY_HEADERS }
        )
      }
    }

    if (body.longitude !== undefined) {
      const lng = parseFloat(body.longitude)
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return NextResponse.json(
          { success: false, error: "Longitud invalida" },
          { status: 400, headers: SECURITY_HEADERS }
        )
      }
    }

    // 7. Sanitizar mensaje
    const sanitizedMessage = body.message ? sanitizeString(body.message) : undefined
    const sanitizedAddress = body.location_address 
      ? sanitizeString(body.location_address) 
      : undefined

    // 8. Crear alerta (simulado - en produccion ir a DB)
    const alert = {
      id: `alert-${Date.now()}`,
      user_id: session.userId,
      alert_type: body.alert_type,
      status: body.is_test ? "test" : "active",
      latitude: body.latitude,
      longitude: body.longitude,
      location_address: sanitizedAddress,
      message: sanitizedMessage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log("[API] Alerta creada:", alert.id)

    return NextResponse.json(
      { success: true, alert },
      { status: 201, headers: SECURITY_HEADERS }
    )

  } catch (error) {
    console.error("[API] Error en POST /api/alerts:", error)
    
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500, headers: SECURITY_HEADERS }
    )
  }
}

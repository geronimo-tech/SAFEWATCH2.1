/**
 * API de Perfil Medico - SafeWatch 2.0
 * 
 * Implementa seguridad para datos medicos sensibles:
 * - Autenticacion obligatoria
 * - Validacion estricta de datos medicos
 * - Sanitizacion de todos los campos
 * - Autorizacion: solo el usuario puede ver su perfil
 * - Logging de acceso a datos sensibles
 */

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  checkRateLimit,
  logSecurityEvent,
  sanitizeString,
  validateBloodType,
  validateIMSS,
  validatePhone,
  SECURITY_HEADERS
} from "@/lib/security"

/**
 * GET /api/medical-profile
 * Obtiene el perfil medico del usuario autenticado
 */
export async function GET(request: Request) {
  try {
    // 1. Verificar autenticacion
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    
    if (!sessionCookie) {
      logSecurityEvent("unauthorized_access", {
        message: "Intento de acceso a perfil medico sin autenticacion"
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

    // 3. Obtener userId del query parameter
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get("userId")

    // 4. Verificar autorizacion - solo el usuario puede ver su propio perfil
    // Los responders pueden ver perfiles durante emergencias (implementar logica adicional)
    if (requestedUserId && requestedUserId !== session.userId) {
      // Solo permitir si es un responder verificado
      if (session.userType !== "responder") {
        logSecurityEvent("unauthorized_access", {
          identifier: session.userId,
          message: "Intento de acceso a perfil medico de otro usuario",
          metadata: { requestedUserId }
        })
        
        return NextResponse.json(
          { success: false, error: "No autorizado para ver este perfil" },
          { status: 403, headers: SECURITY_HEADERS }
        )
      }
    }

    const targetUserId = requestedUserId || session.userId

    // 5. Rate limiting
    const rateLimit = checkRateLimit(`medical_${session.userId}`, 30, 60 * 1000)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes" },
        { status: 429, headers: SECURITY_HEADERS }
      )
    }

    // 6. Obtener perfil (simulado - en produccion ir a DB)
    // TODO: Implementar consulta a base de datos real
    const profile = {
      id: "mp-1",
      user_id: targetUserId,
      blood_type: "O+",
      allergies: ["Penicilina"],
      chronic_conditions: ["Diabetes tipo 2"],
      medications: ["Metformina 500mg"],
      emergency_contacts: [
        { 
          name: "Pedro Gonzalez", 
          relationship: "Esposo", 
          phone: "+52 333 123 4567" 
        }
      ],
      imss_number: "12345678901",
      height: 165,
      weight: 70,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Log acceso a datos sensibles
    console.log("[API] Acceso a perfil medico:", {
      accessedBy: session.userId,
      profileOwner: targetUserId,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { success: true, data: profile },
      { headers: SECURITY_HEADERS }
    )

  } catch (error) {
    console.error("[API] Error en GET /api/medical-profile:", error)
    
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500, headers: SECURITY_HEADERS }
    )
  }
}

/**
 * POST /api/medical-profile
 * Crea o actualiza el perfil medico
 */
export async function POST(request: Request) {
  try {
    // 1. Verificar autenticacion
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    
    if (!sessionCookie) {
      logSecurityEvent("unauthorized_access", {
        message: "Intento de modificar perfil medico sin autenticacion"
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

    // 3. Rate limiting
    const rateLimit = checkRateLimit(`medical_update_${session.userId}`, 10, 60 * 1000)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Demasiadas actualizaciones" },
        { status: 429, headers: SECURITY_HEADERS }
      )
    }

    // 4. Parsear body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Cuerpo de solicitud invalido" },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    // 5. Validar tipo de sangre
    if (body.blood_type && !validateBloodType(body.blood_type)) {
      logSecurityEvent("invalid_input", {
        identifier: session.userId,
        message: "Tipo de sangre invalido",
        metadata: { bloodType: body.blood_type }
      })
      
      return NextResponse.json(
        { success: false, error: "Tipo de sangre invalido. Use: A+, A-, B+, B-, AB+, AB-, O+, O-" },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    // 6. Validar numero IMSS
    if (body.imss_number && !validateIMSS(body.imss_number)) {
      return NextResponse.json(
        { success: false, error: "Numero IMSS invalido. Debe tener 11 digitos" },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    // 7. Validar contactos de emergencia
    if (body.emergency_contacts && Array.isArray(body.emergency_contacts)) {
      for (const contact of body.emergency_contacts) {
        if (contact.phone) {
          const phoneValidation = validatePhone(contact.phone)
          if (!phoneValidation.valid) {
            return NextResponse.json(
              { success: false, error: `Telefono de contacto invalido: ${phoneValidation.error}` },
              { status: 400, headers: SECURITY_HEADERS }
            )
          }
        }
        
        if (!contact.name || contact.name.trim().length < 2) {
          return NextResponse.json(
            { success: false, error: "Nombre de contacto de emergencia requerido" },
            { status: 400, headers: SECURITY_HEADERS }
          )
        }
      }
    }

    // 8. Validar altura y peso
    if (body.height !== undefined) {
      const height = Number(body.height)
      if (isNaN(height) || height < 50 || height > 300) {
        return NextResponse.json(
          { success: false, error: "Altura invalida (debe estar entre 50 y 300 cm)" },
          { status: 400, headers: SECURITY_HEADERS }
        )
      }
    }

    if (body.weight !== undefined) {
      const weight = Number(body.weight)
      if (isNaN(weight) || weight < 20 || weight > 500) {
        return NextResponse.json(
          { success: false, error: "Peso invalido (debe estar entre 20 y 500 kg)" },
          { status: 400, headers: SECURITY_HEADERS }
        )
      }
    }

    // 9. Sanitizar todos los campos de texto
    const sanitizedProfile = {
      id: `mp-${Date.now()}`,
      user_id: session.userId,
      blood_type: body.blood_type,
      allergies: Array.isArray(body.allergies) 
        ? body.allergies.map((a: string) => sanitizeString(a))
        : [],
      chronic_conditions: Array.isArray(body.chronic_conditions)
        ? body.chronic_conditions.map((c: string) => sanitizeString(c))
        : [],
      medications: Array.isArray(body.medications)
        ? body.medications.map((m: string) => sanitizeString(m))
        : [],
      emergency_contacts: Array.isArray(body.emergency_contacts)
        ? body.emergency_contacts.map((c: { name: string; relationship?: string; phone?: string }) => ({
            name: sanitizeString(c.name),
            relationship: c.relationship ? sanitizeString(c.relationship) : undefined,
            phone: c.phone ? sanitizeString(c.phone) : undefined
          }))
        : [],
      imss_number: body.imss_number,
      height: body.height ? Number(body.height) : undefined,
      weight: body.weight ? Number(body.weight) : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // TODO: Guardar en base de datos
    console.log("[API] Perfil medico guardado:", sanitizedProfile.id)

    return NextResponse.json(
      { success: true, data: sanitizedProfile },
      { status: 201, headers: SECURITY_HEADERS }
    )

  } catch (error) {
    console.error("[API] Error en POST /api/medical-profile:", error)
    
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500, headers: SECURITY_HEADERS }
    )
  }
}

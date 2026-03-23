/**
 * Modulo de Autenticacion - SafeWatch 2.0
 * 
 * Implementa autenticacion segura siguiendo OWASP Top 10:
 * - A02:2021 - Cryptographic Failures: Uso de bcrypt para hash de contrasenas
 * - A07:2021 - Identification and Authentication Failures: Validacion robusta
 * - Sesiones seguras con cookies HttpOnly
 * - Rate limiting para prevenir fuerza bruta
 */

"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  hashPassword,
  verifyPassword,
  validateEmail,
  validatePasswordStrength,
  validatePhone,
  sanitizeString,
  generateSecureId,
  checkLoginRateLimit,
  logSecurityEvent,
  SECURE_COOKIE_OPTIONS,
} from "./security"

// =============================================================================
// TIPOS
// =============================================================================

interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  user_type: "citizen" | "responder"
  created_at: string
}

interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

interface RegisterData {
  email: string
  password: string
  full_name: string
  phone?: string
  user_type: "citizen" | "responder"
}

// =============================================================================
// ALMACENAMIENTO TEMPORAL (Reemplazar con base de datos en produccion)
// =============================================================================

// Simulacion de base de datos en memoria
// NOTA: En produccion, esto debe conectarse a una base de datos real
const usersDB = new Map<string, {
  id: string
  email: string
  password_hash: string
  full_name: string
  phone?: string
  user_type: "citizen" | "responder"
  created_at: string
}>()

// =============================================================================
// FUNCIONES DE AUTENTICACION
// =============================================================================

/**
 * Inicia sesion de usuario
 * Implementa:
 * - Rate limiting para prevenir ataques de fuerza bruta
 * - Verificacion segura de contrasena con bcrypt
 * - Cookies HttpOnly para la sesion
 * - Logging de eventos de seguridad
 */
export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    // 1. Validar formato de email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      logSecurityEvent("invalid_input", {
        message: emailValidation.error,
        metadata: { field: "email" }
      })
      return { success: false, error: emailValidation.error }
    }

    const normalizedEmail = email.trim().toLowerCase()

    // 2. Verificar rate limiting
    const rateLimit = checkLoginRateLimit(normalizedEmail)
    if (!rateLimit.allowed) {
      logSecurityEvent("rate_limit_exceeded", {
        identifier: normalizedEmail,
        message: "Demasiados intentos de login"
      })
      return { 
        success: false, 
        error: "Demasiados intentos. Por favor espera 15 minutos." 
      }
    }

    // 3. Buscar usuario en base de datos
    const userRecord = usersDB.get(normalizedEmail)
    
    if (!userRecord) {
      // Usuario no encontrado - usar tiempo constante para evitar enumeracion
      await verifyPassword(password, "$2a$12$invalidhashtopreventtimingattack")
      
      logSecurityEvent("login_failed", {
        identifier: normalizedEmail,
        message: "Usuario no encontrado"
      })
      
      return { success: false, error: "Credenciales invalidas" }
    }

    // 4. Verificar contrasena con bcrypt
    const isValidPassword = await verifyPassword(password, userRecord.password_hash)
    
    if (!isValidPassword) {
      logSecurityEvent("login_failed", {
        identifier: normalizedEmail,
        message: "Contrasena incorrecta"
      })
      
      return { success: false, error: "Credenciales invalidas" }
    }

    // 5. Crear sesion segura
    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      full_name: userRecord.full_name,
      phone: userRecord.phone,
      user_type: userRecord.user_type,
      created_at: userRecord.created_at
    }

    // 6. Establecer cookie de sesion segura
    const cookieStore = await cookies()
    const sessionData = {
      userId: user.id,
      email: user.email,
      userType: user.user_type,
      createdAt: Date.now()
    }
    
    cookieStore.set("session", JSON.stringify(sessionData), SECURE_COOKIE_OPTIONS)

    logSecurityEvent("login_success", {
      identifier: normalizedEmail,
      message: "Login exitoso"
    })

    return { success: true, user }

  } catch (error) {
    console.error("[AUTH] Error en login:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

/**
 * Registra un nuevo usuario
 * Implementa:
 * - Validacion exhaustiva de todos los campos
 * - Hash seguro de contrasena con bcrypt
 * - Sanitizacion de inputs para prevenir XSS
 */
export async function register(data: RegisterData): Promise<AuthResult> {
  try {
    // 1. Validar email
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.error }
    }

    const normalizedEmail = data.email.trim().toLowerCase()

    // 2. Verificar si el email ya existe
    if (usersDB.has(normalizedEmail)) {
      return { success: false, error: "Este email ya esta registrado" }
    }

    // 3. Validar fortaleza de contrasena
    const passwordValidation = validatePasswordStrength(data.password)
    if (!passwordValidation.valid) {
      return { 
        success: false, 
        error: `Contrasena debil: ${passwordValidation.errors.join(", ")}` 
      }
    }

    // 4. Validar telefono si se proporciona
    if (data.phone) {
      const phoneValidation = validatePhone(data.phone)
      if (!phoneValidation.valid) {
        return { success: false, error: phoneValidation.error }
      }
    }

    // 5. Validar nombre
    if (!data.full_name || data.full_name.trim().length < 2) {
      return { success: false, error: "El nombre completo es requerido" }
    }

    // 6. Sanitizar inputs
    const sanitizedName = sanitizeString(data.full_name)
    const sanitizedPhone = data.phone ? sanitizeString(data.phone) : undefined

    // 7. Hash de contrasena con bcrypt
    const passwordHash = await hashPassword(data.password)

    // 8. Crear registro de usuario
    const userId = generateSecureId()
    const userRecord = {
      id: userId,
      email: normalizedEmail,
      password_hash: passwordHash,
      full_name: sanitizedName,
      phone: sanitizedPhone,
      user_type: data.user_type,
      created_at: new Date().toISOString()
    }

    // 9. Guardar en "base de datos"
    usersDB.set(normalizedEmail, userRecord)

    // 10. Crear usuario para respuesta (sin password_hash)
    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      full_name: userRecord.full_name,
      phone: userRecord.phone,
      user_type: userRecord.user_type,
      created_at: userRecord.created_at
    }

    // 11. Establecer sesion
    const cookieStore = await cookies()
    const sessionData = {
      userId: user.id,
      email: user.email,
      userType: user.user_type,
      createdAt: Date.now()
    }
    
    cookieStore.set("session", JSON.stringify(sessionData), SECURE_COOKIE_OPTIONS)

    logSecurityEvent("login_success", {
      identifier: normalizedEmail,
      message: "Registro y login exitoso"
    })

    return { success: true, user }

  } catch (error) {
    console.error("[AUTH] Error en registro:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

/**
 * Cierra la sesion del usuario
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/")
}

/**
 * Obtiene la sesion actual del usuario
 * Valida que la sesion sea valida y no haya expirado
 */
export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)
    
    // Verificar que la sesion tenga los campos requeridos
    if (!sessionData.userId || !sessionData.email || !sessionData.userType) {
      return null
    }

    // Verificar expiracion (7 dias)
    const sessionAge = Date.now() - sessionData.createdAt
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 dias en ms
    
    if (sessionAge > maxAge) {
      // Sesion expirada
      const store = await cookies()
      store.delete("session")
      return null
    }

    // Buscar usuario en "base de datos"
    const userRecord = usersDB.get(sessionData.email)
    
    if (!userRecord) {
      return null
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      full_name: userRecord.full_name,
      phone: userRecord.phone,
      user_type: userRecord.user_type,
      created_at: userRecord.created_at
    }

  } catch {
    return null
  }
}

/**
 * Verifica si el usuario tiene una sesion activa
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Verifica si el usuario es un responder
 */
export async function isResponder(): Promise<boolean> {
  const session = await getSession()
  return session?.user_type === "responder"
}

/**
 * Middleware de autenticacion
 * Redirige a login si no hay sesion activa
 */
export async function requireAuth(): Promise<User> {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }
  
  return session
}

/**
 * Middleware para rutas de responder
 * Redirige si el usuario no es responder
 */
export async function requireResponder(): Promise<User> {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }
  
  if (session.user_type !== "responder") {
    redirect("/dashboard")
  }
  
  return session
}

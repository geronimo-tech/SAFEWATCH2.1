/**
 * Middleware de Seguridad - SafeWatch 2.0
 * 
 * Implementa headers de seguridad y proteccion de rutas
 * siguiendo las mejores practicas de OWASP.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas que requieren autenticacion
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/contacts",
  "/settings",
  "/smartwatch",
  "/map",
  "/history",
  "/alerts",
  "/health-status-selection",
  "/voice-activation",
  "/test-mode",
]

// Rutas exclusivas para responders
const RESPONDER_ROUTES = [
  "/responder/dashboard",
  "/responder/alert",
  "/responder/setup",
]

// Rutas publicas (no requieren auth)
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/service-selection",
  "/legal",
  "/emergency-guide",
]

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // ==========================================================================
  // HEADERS DE SEGURIDAD (OWASP Best Practices)
  // ==========================================================================
  
  // Prevenir que el navegador haga MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")
  
  // Prevenir clickjacking
  response.headers.set("X-Frame-Options", "DENY")
  
  // Habilitar proteccion XSS del navegador
  response.headers.set("X-XSS-Protection", "1; mode=block")
  
  // Controlar informacion de referrer
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  
  // Controlar permisos del navegador
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=(self), accelerometer=(self)"
  )
  
  // Forzar HTTPS en produccion
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }
  
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  )
  
  // ==========================================================================
  // PROTECCION DE RUTAS
  // ==========================================================================
  
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session")
  
  // Verificar si la ruta esta protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )
  
  const isResponderRoute = RESPONDER_ROUTES.some(route => 
    pathname.startsWith(route)
  )
  
  // Si es ruta protegida y no hay sesion, redirigir a login
  if ((isProtectedRoute || isResponderRoute) && !sessionCookie) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Verificar tipo de usuario para rutas de responder
  if (isResponderRoute && sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value)
      if (session.userType !== "responder") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch {
      // Cookie invalida, redirigir a login
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Si el usuario esta autenticado y accede a login/register, redirigir al dashboard
  if (sessionCookie && (pathname === "/login" || pathname === "/register")) {
    try {
      const session = JSON.parse(sessionCookie.value)
      const dashboardUrl = session.userType === "responder" 
        ? "/responder/dashboard" 
        : "/dashboard"
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    } catch {
      // Continuar si hay error parseando la cookie
    }
  }
  
  return response
}

// Configurar en que rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*$).*)",
  ],
}

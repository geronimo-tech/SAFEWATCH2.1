"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { Shield, Lock, Key, FileCheck, Server, Network, Globe, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={32} />
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacidad y Seguridad
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            SAFEWATCH utiliza los más altos estándares de seguridad y encriptación para proteger tu información médica y personal en todo momento.
          </p>
        </div>

        {/* Main Security Promise */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-12">
          <div className="flex items-start gap-4">
            <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Tu Información Está Protegida</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Tu información médica está protegida y encriptada con los estándares más avanzados de la industria. 
                Solo será accesible para servicios de emergencia verificados cuando actives una alerta. 
                Puedes actualizar o eliminar esta información en cualquier momento desde tu perfil.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Encriptación End-to-End</span>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Verificación de Servicios</span>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Control Total</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Protocols Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Network className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Protocolos de Seguridad</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-lg">
            SAFEWATCH utiliza una combinación de protocolos diseñados para garantizar la confidencialidad, 
            integridad y autenticidad de los datos en todo momento. Estos protocolos protegen las comunicaciones 
            entre el reloj inteligente, la aplicación móvil y los servidores centrales.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* HTTPS */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">HTTPS (HTTP Secure)</h3>
                  <p className="text-sm text-muted-foreground">
                    Todas las comunicaciones entre los dispositivos y el servidor se realizan a través de conexiones seguras HTTPS, 
                    que emplean certificados SSL/TLS para cifrar la información transmitida y evitar la interceptación de datos sensibles.
                  </p>
                </div>
              </div>
            </Card>

            {/* TLS 1.3 */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">TLS 1.3 (Transport Layer Security)</h3>
                  <p className="text-sm text-muted-foreground">
                    Proporciona una capa adicional de seguridad en el transporte de datos, garantizando que las conexiones 
                    sean seguras y resistentes a ataques como Man-in-the-Middle o suplantación de identidad.
                  </p>
                </div>
              </div>
            </Card>

            {/* OAuth 2.0 */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">OAuth 2.0</h3>
                  <p className="text-sm text-muted-foreground">
                    Permite la autenticación y autorización segura del usuario sin necesidad de compartir sus credenciales directamente, 
                    facilitando el inicio de sesión mediante servicios confiables (como Google o Apple ID).
                  </p>
                </div>
              </div>
            </Card>

            {/* MFA */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">Autenticación Multifactor (MFA)</h3>
                  <p className="text-sm text-muted-foreground">
                    Proporciona una verificación adicional para el acceso del usuario, combinando contraseña, código temporal 
                    o biometría (huella dactilar o reconocimiento facial) para garantizar que solo el propietario del dispositivo pueda acceder.
                  </p>
                </div>
              </div>
            </Card>

            {/* S/MIME */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">S/MIME</h3>
                  <p className="text-sm text-muted-foreground">
                    Se aplica en la comunicación por correo electrónico del sistema. Este protocolo cifra y firma digitalmente 
                    los mensajes enviados por SAFEWATCH para garantizar su autenticidad y privacidad.
                  </p>
                </div>
              </div>
            </Card>

            {/* IPSec */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">IPSec (Internet Protocol Security)</h3>
                  <p className="text-sm text-muted-foreground">
                    Protocolo usado en conexiones de red privadas o VPN del sistema, protegiendo la transmisión de datos 
                    entre los servidores del centro de monitoreo y la nube mediante cifrado a nivel de red.
                  </p>
                </div>
              </div>
            </Card>

            {/* SSH */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">SSH (Secure Shell)</h3>
                  <p className="text-sm text-muted-foreground">
                    Protocolo utilizado por los administradores del sistema para acceder de forma remota y segura a los servidores, 
                    protegiendo las credenciales y comandos transmitidos.
                  </p>
                </div>
              </div>
            </Card>

            {/* DNSSEC */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">DNSSEC</h3>
                  <p className="text-sm text-muted-foreground">
                    Proporciona validación de la autenticidad en las consultas DNS, evitando que los usuarios sean redirigidos 
                    a servidores falsos o maliciosos al conectarse con el sistema SAFEWATCH.
                  </p>
                </div>
              </div>
            </Card>

            {/* SRTP */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">SRTP (Secure Real-time Transport Protocol)</h3>
                  <p className="text-sm text-muted-foreground">
                    Usado si el sistema integra llamadas o comunicación por voz en tiempo real, garantizando que el audio 
                    transmitido esté cifrado y no pueda ser interceptado.
                  </p>
                </div>
              </div>
            </Card>

            {/* HSTS */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">HSTS (HTTP Strict Transport Security)</h3>
                  <p className="text-sm text-muted-foreground">
                    Obliga a los navegadores y dispositivos conectarse únicamente mediante HTTPS, eliminando la posibilidad 
                    de conexiones inseguras o manipuladas.
                  </p>
                </div>
              </div>
            </Card>

            {/* JWT */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">JWT (JSON Web Token)</h3>
                  <p className="text-sm text-muted-foreground">
                    Protocolo de autenticación ligera que permite la validación de sesiones y permisos entre la aplicación 
                    y los servidores. Los tokens están firmados digitalmente, asegurando que no puedan ser modificados.
                  </p>
                </div>
              </div>
            </Card>

            {/* SNMPv3 */}
            <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">SNMPv3</h3>
                  <p className="text-sm text-muted-foreground">
                    Protocolo utilizado internamente para la gestión segura de los dispositivos y servidores de SAFEWATCH, 
                    con funciones de autenticación y cifrado en la comunicación administrativa.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FileCheck className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Firmas y Certificados Digitales</h2>
          </div>

          <div className="space-y-6">
            {/* SSL/TLS Certificate */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Certificado SSL/TLS</h3>
                  <p className="text-sm text-muted-foreground mb-3">Para: la página web</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Garantiza que la comunicación entre el usuario y el servidor esté cifrada y segura (HTTPS)</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Protege datos sensibles como ubicación, identidad y contactos de emergencia</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Es un requisito básico de confianza para los navegadores modernos</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Developer Signature */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Firma Digital del Desarrollador</h3>
                  <p className="text-sm text-muted-foreground mb-3">Para: la app móvil (Android/iOS)</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Las tiendas de aplicaciones (Google Play y App Store) exigen firmar digitalmente las apps antes de publicarlas</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Verifica la autenticidad del desarrollador y evita que otros modifiquen o distribuyan versiones falsas del software</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>En Android se usa un keystore (.jks) y en iOS un certificado de desarrollador de Apple</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Server Certificate */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Certificado de Servidor o API</h3>
                  <p className="text-sm text-muted-foreground mb-3">Para: el backend o servicios web que procesen alertas y datos de ubicación</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Garantiza la identidad del servidor y protege las comunicaciones entre la app y la base de datos o API</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Evita ataques "man-in-the-middle" donde un atacante intercepta las alertas o datos</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Electronic Signature */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Firma Electrónica de Usuarios (Opcional)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Para: validar la identidad de los usuarios o del centro de monitoreo</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Si el sistema registra alertas formales o reportes con valor legal, se puede usar una firma electrónica avanzada (FIEL o e.firma del SAT en México)</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Garantiza la autenticidad y responsabilidad de quien emite la alerta o reporte</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Aplica más en escenarios institucionales o de seguridad pública</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Code Signing */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Certificado de Código (Code Signing)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Para: el instalador o ejecutable del software si se distribuye fuera de tiendas oficiales</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Evita advertencias de seguridad en Windows o macOS al instalar el programa</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Garantiza que el archivo no ha sido alterado desde que el desarrollador lo firmó</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-center">
          <h3 className="text-2xl font-bold text-card-foreground mb-4">
            ¿Tienes Preguntas Sobre tu Privacidad?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Estamos comprometidos con la transparencia y la protección de tus datos. 
            Si tienes alguna pregunta sobre cómo manejamos tu información, no dudes en contactarnos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Volver al Inicio
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-border text-foreground bg-transparent">
                Registrarse Ahora
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 SAFEWATCH. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

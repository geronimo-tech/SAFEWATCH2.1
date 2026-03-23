import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Users, Bell, MapPin, Shield, Activity } from 'lucide-react'
import { Logo } from "@/components/ui/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size={40} />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Sistema de Seguridad Inteligente</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Protección en cada momento
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
            SAFEWATCH conecta tu smartwatch con servicios de emergencia y puntos de seguridad en Guadalajara. 
            Protección 24/7 con respuesta inmediata.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline" className="border-border text-foreground bg-transparent w-full sm:w-auto">
                <MapPin className="h-4 w-4 mr-2" />
                Ver Puntos de Seguridad
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Características Principales
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Monitoreo Continuo</h3>
            <p className="text-sm text-muted-foreground">
              Seguimiento en tiempo real de ritmo cardíaco, oxígeno en sangre, y detección automática de caídas
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Alertas Inteligentes</h3>
            <p className="text-sm text-muted-foreground">
              Sistema automático de alertas basado en movimientos bruscos, anomalías cardíacas y situaciones de riesgo
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Puntos de Seguridad</h3>
            <p className="text-sm text-muted-foreground">
              Mapa interactivo con estaciones de policía, hospitales y puntos seguros en Guadalajara con navegación
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Red de Respuesta</h3>
            <p className="text-sm text-muted-foreground">
              Conexión directa con policía, paramédicos y servicios de seguridad privada verificados
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Perfil Médico Completo</h3>
            <p className="text-sm text-muted-foreground">
              Información médica accesible en emergencias: alergias, tipo de sangre, número de IMSS y contactos
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <Link href="/security" target="_blank" className="group">
              <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                Privacidad y Seguridad
              </h3>
              <p className="text-sm text-muted-foreground">
                Datos encriptados y protegidos. Solo servicios verificados acceden a tu información en emergencias
              </p>
              <span className="text-xs text-primary mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver detalles completos
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
            ¿Eres un servicio de emergencia?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-lg">
            Únete a la red SAFEWATCH de servicios de emergencia. Accede a alertas en tiempo real, 
            perfiles médicos completos y coordenadas exactas de emergencias en Guadalajara.
          </p>
          <Link href="/emergency/register">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Registrar Servicio de Emergencia
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size={32} />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                Aviso de Privacidad
              </Link>
              <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/legal/disclaimer" className="hover:text-foreground transition-colors">
                Deslinde de Responsabilidad
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 SAFEWATCH. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { Bell, Smartphone, Lock, Globe, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <span className="text-xl font-bold">ShieldTech</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia y ajusta las preferencias de seguridad</p>
        </div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Notificaciones</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas en tiempo real en tu dispositivo</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">Recibe resúmenes de actividad por correo</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">Alertas por SMS</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones de emergencia por mensaje de texto</p>
                </div>
                <Switch id="sms-notifications" defaultChecked />
              </div>
            </div>
          </Card>

          {/* Smartwatch Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Smartwatch</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fall-detection">Detección de Caídas</Label>
                  <p className="text-sm text-muted-foreground">Alerta automática al detectar una caída</p>
                </div>
                <Switch id="fall-detection" defaultChecked />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="heart-rate-threshold">Umbral de Ritmo Cardíaco</Label>
                  <span className="text-sm font-medium">150 BPM</span>
                </div>
                <Slider
                  id="heart-rate-threshold"
                  defaultValue={[150]}
                  max={200}
                  min={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Alerta cuando el ritmo cardíaco supere este valor</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="movement-detection">Detección de Movimientos Bruscos</Label>
                  <p className="text-sm text-muted-foreground">Alerta ante movimientos anormales o violentos</p>
                </div>
                <Switch id="movement-detection" defaultChecked />
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Privacidad y Seguridad</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-sharing">Compartir Ubicación Siempre</Label>
                  <p className="text-sm text-muted-foreground">Permite rastreo continuo para respuesta más rápida</p>
                </div>
                <Switch id="location-sharing" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="medical-info-sharing">Compartir Información Médica</Label>
                  <p className="text-sm text-muted-foreground">Los servicios de emergencia verán tu perfil médico</p>
                </div>
                <Switch id="medical-info-sharing" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">Seguridad adicional para tu cuenta</p>
                </div>
                <Switch id="two-factor" />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Apariencia</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Modo Oscuro</Label>
                  <p className="text-sm text-muted-foreground">Interfaz oscura para reducir fatiga visual</p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>
            </div>
          </Card>

          {/* Language */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Idioma</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="radio" id="lang-es" name="language" defaultChecked className="h-4 w-4" />
                <Label htmlFor="lang-es">Español</Label>
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" id="lang-en" name="language" className="h-4 w-4" />
                <Label htmlFor="lang-en">English</Label>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancelar</Button>
            <Button>Guardar Cambios</Button>
          </div>
        </div>
      </main>
    </div>
  )
}

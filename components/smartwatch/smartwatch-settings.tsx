"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings, Bell, Heart, Activity } from "lucide-react"

interface SmartwatchSettingsProps {
  userId: string
}

export function SmartwatchSettings({ userId }: SmartwatchSettingsProps) {
  const [fallDetection, setFallDetection] = useState(true)
  const [heartRateAlerts, setHeartRateAlerts] = useState(true)
  const [movementAlerts, setMovementAlerts] = useState(false)
  const [heartRateThreshold, setHeartRateThreshold] = useState([150])

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Configuración de Alertas</CardTitle>
          </div>
          <CardDescription>Personaliza las alertas automáticas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="fall-detection" className="text-foreground">
                Detección de Caídas
              </Label>
              <p className="text-xs text-muted-foreground">Alerta automática al detectar caída</p>
            </div>
            <Switch id="fall-detection" checked={fallDetection} onCheckedChange={setFallDetection} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="heart-rate-alerts" className="text-foreground">
                Alertas de Ritmo Cardíaco
              </Label>
              <p className="text-xs text-muted-foreground">Notificar ritmo anormal</p>
            </div>
            <Switch id="heart-rate-alerts" checked={heartRateAlerts} onCheckedChange={setHeartRateAlerts} />
          </div>

          {heartRateAlerts && (
            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
              <Label className="text-foreground">Umbral de Alerta: {heartRateThreshold[0]} BPM</Label>
              <Slider
                value={heartRateThreshold}
                onValueChange={setHeartRateThreshold}
                min={120}
                max={180}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Alerta si el ritmo supera este valor</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="movement-alerts" className="text-foreground">
                Movimientos Bruscos
              </Label>
              <p className="text-xs text-muted-foreground">Detectar movimientos súbitos</p>
            </div>
            <Switch id="movement-alerts" checked={movementAlerts} onCheckedChange={setMovementAlerts} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Notificaciones</CardTitle>
          </div>
          <CardDescription>Preferencias de notificación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-foreground">Alertas de salud</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-foreground">Recordatorios de actividad</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-foreground">Actualizaciones del sistema</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

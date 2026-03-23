"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"
import { getActiveAlerts } from "@/lib/responder"

export function ActiveAlertsMap() {
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    async function fetchAlerts() {
      const data = await getActiveAlerts()
      setAlerts(data)
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Mapa de Alertas Activas</CardTitle>
            <CardDescription>Ubicación en tiempo real de emergencias</CardDescription>
          </div>
          <Badge className="bg-primary text-primary-foreground">{alerts.length} Alertas</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-secondary rounded-lg relative overflow-hidden">
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />

          {/* Alert markers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-2xl">
              {alerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="absolute"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`,
                  }}
                >
                  <div className="relative group cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center animate-pulse shadow-lg">
                      <MapPin className="h-5 w-5 text-destructive-foreground" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                      <div className="bg-card border border-border rounded-lg p-2 shadow-lg whitespace-nowrap">
                        <p className="text-xs font-medium text-foreground">{alert.user_name}</p>
                        <p className="text-xs text-muted-foreground">{alert.alert_type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
              <span className="text-foreground">Alerta Activa</span>
            </div>
          </div>

          {/* Navigation hint */}
          <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-2 shadow-lg">
            <Navigation className="h-4 w-4 text-primary" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Haz clic en los marcadores para ver detalles de cada alerta
        </p>
      </CardContent>
    </Card>
  )
}

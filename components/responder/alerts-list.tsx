"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Heart, MapPin, Clock } from "lucide-react"
import { getActiveAlerts } from "@/lib/responder"
import Link from "next/link"

export function AlertsList() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      const data = await getActiveAlerts()
      setAlerts(data)
      setIsLoading(false)
    }

    fetchAlerts()

    // Refresh alerts every 10 seconds
    const interval = setInterval(fetchAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "sos":
        return "SOS"
      case "fall_detection":
        return "Caída"
      case "heart_rate":
        return "Ritmo Cardíaco"
      default:
        return type
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const alertTime = new Date(dateString)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Hace menos de 1 minuto"
    if (diffMins === 1) return "Hace 1 minuto"
    if (diffMins < 60) return `Hace ${diffMins} minutos`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "Hace 1 hora"
    return `Hace ${diffHours} horas`
  }

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Cargando alertas...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Alertas Activas</CardTitle>
            <CardDescription>Emergencias que requieren atención</CardDescription>
          </div>
          <Badge className="bg-destructive text-destructive-foreground">{alerts.length} Activas</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="bg-secondary border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={alert.status === "active" ? "destructive" : "default"}
                        className={alert.status === "active" ? "" : "bg-primary text-primary-foreground"}
                      >
                        {getAlertTypeLabel(alert.alert_type)}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{alert.user_name}</span>
                      {alert.status === "responding" && (
                        <Badge variant="outline" className="border-primary text-primary">
                          En Atención
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{alert.location_address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{getTimeAgo(alert.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4 flex-shrink-0" />
                        <span>Tipo de sangre: {alert.medical_info.blood_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href={`/responder/alert/${alert.id}`}>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                        Responder
                      </Button>
                    </Link>
                    <Link href={`/responder/alert/${alert.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border text-foreground bg-transparent w-full"
                      >
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No hay alertas activas en este momento</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

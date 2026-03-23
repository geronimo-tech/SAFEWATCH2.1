"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, MapPin, Clock, Phone, X } from "lucide-react"
import { cancelAlert } from "@/lib/alerts"
import { useRouter } from "next/navigation"

interface ActiveAlertCardProps {
  userId: string
}

export function ActiveAlertCard({ userId }: ActiveAlertCardProps) {
  const router = useRouter()
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = async () => {
    setIsCancelling(true)
    await cancelAlert("current-alert-id")
    router.push("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-destructive/10 border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive-foreground animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-foreground text-2xl">Alerta SOS Activa</CardTitle>
              <CardDescription>Los servicios de emergencia han sido notificados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Hora de activación</p>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleString("es-MX")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Ubicación compartida</p>
                <p className="text-sm text-muted-foreground">Tu ubicación está siendo transmitida en tiempo real</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Contacto de emergencia notificado</p>
                <p className="text-sm text-muted-foreground">Tu contacto de emergencia ha sido alertado</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-foreground font-medium mb-2">Servicios de emergencia en camino</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Policía Municipal</span>
                <span className="text-primary font-medium">5 min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Seguridad Privada</span>
                <span className="text-primary font-medium">8 min</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              disabled={isCancelling}
              variant="outline"
              className="flex-1 border-border text-foreground bg-transparent"
            >
              <X className="mr-2 h-4 w-4" />
              {isCancelling ? "Cancelando..." : "Cancelar Alerta"}
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Phone className="mr-2 h-4 w-4" />
              Llamar a Emergencias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

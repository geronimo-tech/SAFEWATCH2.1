"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Heart, MapPin, Activity } from 'lucide-react'
import { createAlert } from "@/lib/alerts"
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function QuickActions() {
  const router = useRouter()
  const [showSOSDialog, setShowSOSDialog] = useState(false)
  const [isSendingAlert, setIsSendingAlert] = useState(false)

  const handleSOSAlert = async () => {
    setIsSendingAlert(true)

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await createAlert("current-user-id", {
            alert_type: "sos",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            message: "Alerta SOS activada manualmente",
          })

          setIsSendingAlert(false)
          setShowSOSDialog(false)
          router.push("/alerts/active")
        },
        async () => {
          // If location fails, send alert anyway
          await createAlert("current-user-id", {
            alert_type: "sos",
            message: "Alerta SOS activada manualmente (ubicación no disponible)",
          })

          setIsSendingAlert(false)
          setShowSOSDialog(false)
          router.push("/alerts/active")
        },
      )
    }
  }

  const handleHealthStatus = () => {
    router.push("/health-status-selection")
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Acciones Rápidas</CardTitle>
          <CardDescription>Activa alertas o revisa tu estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              onClick={() => setShowSOSDialog(true)}
              className="h-24 flex-col gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <AlertCircle className="h-6 w-6" />
              <span className="font-semibold">Alerta SOS</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 border-border text-foreground bg-transparent"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    alert(`Tu ubicación: ${position.coords.latitude}, ${position.coords.longitude}`)
                  })
                }
              }}
            >
              <MapPin className="h-6 w-6" />
              <span className="font-semibold">Compartir Ubicación</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 border-border text-foreground bg-transparent"
              onClick={handleHealthStatus}
            >
              <Heart className="h-6 w-6" />
              <span className="font-semibold">Estado de Salud</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 border-border text-foreground bg-transparent"
              onClick={() => router.push("/smartwatch")}
            >
              <Activity className="h-6 w-6" />
              <span className="font-semibold">Conectar Smartwatch</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSOSDialog} onOpenChange={setShowSOSDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirmar Alerta SOS
            </DialogTitle>
            <DialogDescription>
              Estás a punto de enviar una alerta de emergencia. Los servicios de respuesta cercanos serán notificados
              inmediatamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSOSDialog(false)} disabled={isSendingAlert}>
              Cancelar
            </Button>
            <Button
              onClick={handleSOSAlert}
              disabled={isSendingAlert}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSendingAlert ? "Enviando..." : "Enviar Alerta SOS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { createAlert } from "@/lib/alerts"
import { useToast } from "@/hooks/use-toast"

interface TestModePanelProps {
  userId: string
}

export function TestModePanel({ userId }: TestModePanelProps) {
  const [testResults, setTestResults] = useState<
    Array<{
      type: string
      timestamp: string
      success: boolean
    }>
  >([])
  const { toast } = useToast()

  const runTest = async (alertType: "manual" | "fall_detection" | "heart_rate") => {
    toast({
      title: "Ejecutando prueba",
      description: "Simulando alerta de emergencia...",
    })

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await createAlert(userId, {
          alert_type: alertType,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          message: `Prueba de alerta: ${alertType}`,
          is_test: true,
        })

        const result = {
          type: alertType,
          timestamp: new Date().toLocaleTimeString(),
          success: true,
        }

        setTestResults([result, ...testResults])

        toast({
          title: "Prueba completada",
          description: "La alerta de prueba se envió correctamente",
        })
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <CardTitle>Modo de Prueba Activo</CardTitle>
          </div>
          <CardDescription>
            Las alertas enviadas en modo de prueba NO notificarán a tus contactos de emergencia ni a servicios de
            respuesta. Úsalo para familiarizarte con el sistema.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Alerta</CardTitle>
          <CardDescription>Prueba diferentes escenarios de emergencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 bg-transparent"
              onClick={() => runTest("manual")}
            >
              <AlertCircle className="h-6 w-6" />
              <span>Alerta Manual</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 bg-transparent"
              onClick={() => runTest("fall_detection")}
            >
              <AlertCircle className="h-6 w-6" />
              <span>Detección de Caída</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 bg-transparent"
              onClick={() => runTest("heart_rate")}
            >
              <AlertCircle className="h-6 w-6" />
              <span>Ritmo Cardíaco</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Pruebas</CardTitle>
            <CardDescription>Historial de pruebas realizadas en esta sesión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium capitalize">{result.type.replace("_", " ")}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{result.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "Exitosa" : "Fallida"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

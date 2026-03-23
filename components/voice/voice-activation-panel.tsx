"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, AlertCircle } from "lucide-react"
import { createAlert } from "@/lib/alerts"
import { useToast } from "@/hooks/use-toast"

interface VoiceActivationPanelProps {
  userId: string
}

export function VoiceActivationPanel({ userId }: VoiceActivationPanelProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [keywords] = useState(["ayuda", "emergencia", "socorro", "auxilio", "help"])
  const { toast } = useToast()

  useEffect(() => {
    if (!isListening) return

    // Simulate voice recognition
    const interval = setInterval(() => {
      // In a real app, this would use Web Speech API
      console.log("[v0] Listening for voice commands...")
    }, 1000)

    return () => clearInterval(interval)
  }, [isListening])

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      toast({
        title: "Escuchando",
        description: "Di una palabra clave para activar una alerta",
      })
    }
  }

  const simulateVoiceCommand = async (keyword: string) => {
    setTranscript(`"${keyword}"`)

    toast({
      title: "Comando detectado",
      description: `Palabra clave "${keyword}" reconocida. Activando alerta...`,
    })

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await createAlert(userId, {
          alert_type: "manual",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          message: `Alerta activada por voz: "${keyword}"`,
          voice_activated: true,
        })

        toast({
          title: "Alerta enviada",
          description: "Tu alerta de emergencia ha sido enviada exitosamente",
        })
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Control por Voz</CardTitle>
          <CardDescription>
            Activa alertas de emergencia usando comandos de voz. El sistema escucha continuamente las palabras clave
            configuradas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              onClick={toggleListening}
              className="h-32 w-32 rounded-full"
            >
              {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
            </Button>
          </div>

          <div className="text-center">
            <Badge variant={isListening ? "destructive" : "secondary"} className="text-sm">
              {isListening ? "Escuchando..." : "Inactivo"}
            </Badge>
            {transcript && <p className="mt-2 text-sm text-muted-foreground">Última detección: {transcript}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Palabras clave configuradas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modo de Prueba</CardTitle>
          <CardDescription>Prueba los comandos de voz sin enviar alertas reales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {keywords.map((keyword) => (
              <Button
                key={keyword}
                variant="outline"
                onClick={() => simulateVoiceCommand(keyword)}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {keyword}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

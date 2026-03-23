"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, MapPin, Heart, Phone, User, FileText, Navigation, CheckCircle, MessageSquare } from "lucide-react"
import { respondToAlert } from "@/lib/responder"
import { useRouter } from "next/navigation"

interface AlertDetailsCardProps {
  alert: any
  responderId: string
}

export function AlertDetailsCard({ alert, responderId }: AlertDetailsCardProps) {
  const router = useRouter()
  const [isResponding, setIsResponding] = useState(false)
  const [notes, setNotes] = useState("")
  const [responseStatus, setResponseStatus] = useState<string | null>(null)

  const handleResponse = async (type: string) => {
    setIsResponding(true)
    await respondToAlert(alert.id, responderId, type)
    setResponseStatus(type)
    setIsResponding(false)

    if (type === "completed") {
      setTimeout(() => router.push("/responder/dashboard"), 2000)
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "sos":
        return "SOS Manual"
      case "fall_detection":
        return "Caída Detectada"
      case "heart_rate":
        return "Ritmo Cardíaco Anormal"
      default:
        return type
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Alert Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-card-foreground text-2xl">Alerta de Emergencia</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="destructive">{getAlertTypeLabel(alert.alert_type)}</Badge>
                  <span>•</span>
                  <span>{new Date(alert.created_at).toLocaleString("es-MX")}</span>
                </CardDescription>
              </div>
            </div>
            {responseStatus && (
              <Badge className="bg-primary text-primary-foreground">
                {responseStatus === "acknowledged" && "Reconocida"}
                {responseStatus === "en_route" && "En Camino"}
                {responseStatus === "arrived" && "En Sitio"}
                {responseStatus === "completed" && "Completada"}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Location & User Info */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Dirección</p>
                <p className="text-foreground">{alert.location_address}</p>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Navigation className="mr-2 h-4 w-4" />
                Abrir en Mapa
              </Button>

              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="text-foreground font-medium">{alert.user_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Contacto de Emergencia</p>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <p className="text-foreground font-medium">{alert.medical_profile.emergency_contact_name}</p>
                    <p className="text-sm text-muted-foreground">{alert.medical_profile.emergency_contact_phone}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border text-foreground bg-transparent">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Info & Actions */}
        <div className="space-y-6">
          <Card className="bg-card border-border border-primary/20">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Información Médica Crítica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Sangre</p>
                  <p className="text-lg font-bold text-foreground">{alert.medical_profile.blood_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IMSS</p>
                  <p className="text-sm font-medium text-foreground">{alert.medical_profile.imss_number}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Alergias</p>
                <div className="flex flex-wrap gap-2">
                  {alert.medical_profile.allergies.split(",").map((allergy: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-destructive text-destructive">
                      {allergy.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {alert.medical_profile.medical_conditions && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Condiciones Médicas</p>
                  <p className="text-sm text-foreground">{alert.medical_profile.medical_conditions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Acciones de Respuesta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!responseStatus && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleResponse("acknowledged")}
                    disabled={isResponding}
                    variant="outline"
                    className="border-border text-foreground bg-transparent"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Reconocer
                  </Button>
                  <Button
                    onClick={() => handleResponse("en_route")}
                    disabled={isResponding}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    En Camino
                  </Button>
                </div>
              )}

              {responseStatus === "en_route" && (
                <Button
                  onClick={() => handleResponse("arrived")}
                  disabled={isResponding}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  He Llegado
                </Button>
              )}

              {responseStatus === "arrived" && (
                <Button
                  onClick={() => handleResponse("completed")}
                  disabled={isResponding}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completar Respuesta
                </Button>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">
                  Notas de Respuesta
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agrega notas sobre la situación, acciones tomadas, etc."
                  className="bg-background border-input text-foreground min-h-24"
                />
              </div>

              <Button variant="outline" className="w-full border-border text-foreground bg-transparent">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contactar Usuario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert Message */}
      {alert.message && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Mensaje de Alerta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{alert.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

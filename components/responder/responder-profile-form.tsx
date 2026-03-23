"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveResponderProfile } from "@/lib/responder"
import { Loader2, Building2, Shield, MapPin, BadgeCheck } from "lucide-react"
import type { ResponderType } from "@/lib/types"

interface ResponderProfileFormProps {
  userId: string
}

export function ResponderProfileForm({ userId }: ResponderProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [responderType, setResponderType] = useState<ResponderType | "">("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await saveResponderProfile(userId, {
        organization_name: formData.get("organization_name") as string,
        responder_type: responderType as ResponderType,
        badge_number: formData.get("badge_number") as string,
        service_area: formData.get("service_area") as string,
      })

      router.push("/responder/dashboard")
    } catch (err) {
      console.error("[v0] Error saving responder profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Organization Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Información de Organización</CardTitle>
          </div>
          <CardDescription>Detalles de tu institución o empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization_name" className="text-card-foreground">
              Nombre de Organización *
            </Label>
            <Input
              id="organization_name"
              name="organization_name"
              type="text"
              placeholder="Ej: Policía Municipal de Guadalajara"
              required
              className="bg-background border-input text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responder_type" className="text-card-foreground">
              Tipo de Servicio *
            </Label>
            <Select value={responderType} onValueChange={(value) => setResponderType(value as ResponderType)} required>
              <SelectTrigger className="bg-background border-input text-foreground">
                <SelectValue placeholder="Selecciona el tipo de servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="police">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Policía</span>
                  </div>
                </SelectItem>
                <SelectItem value="private_security">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    <span>Seguridad Privada</span>
                  </div>
                </SelectItem>
                <SelectItem value="medical">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Servicios Médicos</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Credenciales</CardTitle>
          </div>
          <CardDescription>Información de identificación oficial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="badge_number" className="text-card-foreground">
              Número de Placa / Credencial
            </Label>
            <Input
              id="badge_number"
              name="badge_number"
              type="text"
              placeholder="Ej: POL-12345"
              className="bg-background border-input text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Número de identificación oficial (placa policial, credencial de seguridad, etc.)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Area */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Área de Servicio</CardTitle>
          </div>
          <CardDescription>Zona geográfica donde prestas servicio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service_area" className="text-card-foreground">
              Descripción del Área *
            </Label>
            <Textarea
              id="service_area"
              name="service_area"
              placeholder="Ej: Zona Centro, Colonias Providencia y Americana, Guadalajara, Jalisco"
              required
              className="bg-background border-input text-foreground min-h-24"
            />
            <p className="text-xs text-muted-foreground">
              Describe las colonias, municipios o zonas donde puedes responder a emergencias
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Verification Notice */}
      <Card className="bg-card border-border border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-card-foreground font-medium">Proceso de Verificación</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tu perfil será revisado por nuestro equipo de administración para verificar tu identidad y credenciales.
                Este proceso puede tomar de 24 a 48 horas. Una vez verificado, comenzarás a recibir alertas de
                emergencia en tu área de servicio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Enviar para Verificación"
        )}
      </Button>
    </form>
  )
}

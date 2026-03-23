"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveMedicalProfile } from "@/lib/medical"
import { Loader2, Heart, AlertCircle, Phone, FileText } from 'lucide-react'
import type { BloodType } from "@/lib/types"

interface MedicalProfileFormProps {
  userId: string
}

export function MedicalProfileForm({ userId }: MedicalProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [bloodType, setBloodType] = useState<BloodType | "">("")
  const [imssNumber, setImssNumber] = useState("")
  const [allergies, setAllergies] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")

  useEffect(() => {
    // Form remains empty on load - user fills it fresh each time
    // Data is only saved when user submits
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const medicalData = {
        imss_number: imssNumber,
        blood_type: bloodType as BloodType,
        allergies: allergies,
        medical_conditions: medicalConditions,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
      }

      localStorage.setItem('userMedicalProfile', JSON.stringify(medicalData))
      console.log("[v0] Medical profile saved to localStorage:", medicalData)

      await saveMedicalProfile(userId, medicalData)

      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Error saving medical profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Medical Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Información Médica Básica</CardTitle>
          </div>
          <CardDescription>Datos esenciales para atención de emergencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imss_number" className="text-card-foreground">
                Número de IMSS
              </Label>
              <Input
                id="imss_number"
                name="imss_number"
                type="text"
                placeholder="12345678901"
                value={imssNumber}
                onChange={(e) => setImssNumber(e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blood_type" className="text-card-foreground">
                Tipo de Sangre *
              </Label>
              <Select value={bloodType} onValueChange={(value) => setBloodType(value as BloodType)} required>
                <SelectTrigger className="bg-background border-input text-foreground">
                  <SelectValue placeholder="Selecciona tu tipo de sangre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies and Conditions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Alergias y Condiciones</CardTitle>
          </div>
          <CardDescription>Información crítica para tratamiento médico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-card-foreground">
              Alergias
            </Label>
            <Textarea
              id="allergies"
              name="allergies"
              placeholder="Ej: Penicilina, mariscos, polen..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="bg-background border-input text-foreground min-h-24"
            />
            <p className="text-xs text-muted-foreground">Separa múltiples alergias con comas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_conditions" className="text-card-foreground">
              Condiciones Médicas
            </Label>
            <Textarea
              id="medical_conditions"
              name="medical_conditions"
              placeholder="Ej: Diabetes, hipertensión, asma..."
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              className="bg-background border-input text-foreground min-h-24"
            />
            <p className="text-xs text-muted-foreground">Incluye enfermedades crónicas y medicamentos regulares</p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Contacto de Emergencia</CardTitle>
          </div>
          <CardDescription>Persona a contactar en caso de emergencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name" className="text-card-foreground">
                Nombre Completo *
              </Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                type="text"
                placeholder="María García"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                required
                className="bg-background border-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone" className="text-card-foreground">
                Teléfono *
              </Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                type="tel"
                placeholder="+52 123 456 7890"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                required
                className="bg-background border-input text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-card border-border border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-card-foreground font-medium">Privacidad y Seguridad</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tu información médica está protegida y encriptada. Solo será accesible para servicios de emergencia
                verificados cuando actives una alerta. Puedes actualizar o eliminar esta información en cualquier
                momento desde tu perfil.
              </p>
              <Link href="/security" target="_blank" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                Ver detalles de seguridad y protocolos
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-border text-foreground bg-transparent"
          onClick={() => router.push("/dashboard")}
        >
          Omitir por ahora
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar y Continuar"
          )}
        </Button>
      </div>
    </form>
  )
}

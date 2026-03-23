"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Building2, Shield, Loader2, MapPin, DollarSign } from 'lucide-react'
import Link from "next/link"

interface EmergencyService {
  id: string
  serviceType: string
  entityType: "public" | "private"
  organizationName: string
  city: string
  operatingHours: string
  capabilities: string[]
  registeredAt: string
  cost?: number
}

export default function ServiceSelectionPage() {
  const router = useRouter()
  const [step, setStep] = useState<"imss" | "service-type" | "select-service">("imss")
  const [isLoading, setIsLoading] = useState(false)
  const [imssNumber, setImssNumber] = useState("")
  const [serviceType, setServiceType] = useState<"public" | "private" | "">("")
  const [selectedService, setSelectedService] = useState("")
  const [privateServiceName, setPrivateServiceName] = useState("")
  const [privateCost, setPrivateCost] = useState("")
  const [error, setError] = useState("")
  const [publicServices, setPublicServices] = useState<EmergencyService[]>([])
  const [privateServices, setPrivateServices] = useState<EmergencyService[]>([])

  useEffect(() => {
    const registeredServices = localStorage.getItem('emergency_services')
    if (registeredServices) {
      try {
        const services = JSON.parse(registeredServices)
        const publicSvcs = services.filter((s: EmergencyService) => s.entityType === "public")
        const privateSvcs = services.filter((s: EmergencyService) => s.entityType === "private")
        setPublicServices(publicSvcs)
        setPrivateServices(privateSvcs)
        console.log("[v0] Loaded services - Public:", publicSvcs.length, "Private:", privateSvcs.length)
      } catch (e) {
        console.error("[v0] Error loading services:", e)
      }
    }
  }, [])

  const handleContinue = async () => {
    setError("")

    if (step === "imss") {
      localStorage.setItem('userIMSS', imssNumber)
      setStep("service-type")
    } else if (step === "service-type") {
      if (!serviceType) {
        setError("Por favor selecciona el tipo de servicio")
        return
      }
      setStep("select-service")
    } else if (step === "select-service") {
      if (serviceType === "public" && !selectedService) {
        setError("Por favor selecciona un servicio público")
        return
      }
      if (serviceType === "private" && !privateServiceName.trim()) {
        setError("Por favor ingresa el nombre de tu servicio privado")
        return
      }

      setIsLoading(true)
      try {
        const selectedServiceData = serviceType === "public"
          ? publicServices.find(s => s.id === selectedService)
          : { organizationName: privateServiceName, cost: privateCost ? parseFloat(privateCost) : 0 }

        const userServiceData = {
          imssNumber,
          serviceType,
          selectedService: selectedServiceData?.organizationName || privateServiceName,
          serviceCost: selectedServiceData?.cost || 0,
          savedAt: new Date().toISOString()
        }
        localStorage.setItem('userServiceSelection', JSON.stringify(userServiceData))
        
        console.log("[v0] Service selection saved:", userServiceData)
        router.push("/dashboard")
      } catch (err) {
        setError("Error al guardar tu selección. Intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step === "service-type") {
      setStep("imss")
    } else if (step === "select-service") {
      setStep("service-type")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SafeWatch</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Configurar Servicio de Salud</h1>
          <p className="text-muted-foreground">
            {step === "imss"
              ? "Ingresa tu número de IMSS para acceso rápido"
              : step === "service-type"
                ? "Selecciona el tipo de servicio de salud"
                : `Elige tu servicio de salud ${serviceType === "private" ? "privado" : "público"}`}
          </p>
        </div>

        {/* PASO 1: IMSS */}
        {step === "imss" && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Número de IMSS</CardTitle>
              <CardDescription>Este número facilita tu identificación en emergencias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imss" className="text-card-foreground">
                  Número de IMSS (18 dígitos)
                </Label>
                <Input
                  id="imss"
                  type="text"
                  placeholder="123456789012345678"
                  value={imssNumber}
                  onChange={(e) => setImssNumber(e.target.value)}
                  maxLength={18}
                  className="bg-background border-input text-foreground"
                />
                <p className="text-xs text-muted-foreground">Formato: 18 dígitos sin espacios</p>
              </div>

              {error && (
                <div className="flex gap-2 items-start text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => router.push("/dashboard")}
                >
                  Omitir
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleContinue}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Continuando...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PASO 2: TIPO DE SERVICIO */}
        {step === "service-type" && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Tipo de Servicio</CardTitle>
              <CardDescription>¿Qué tipo de servicio de salud utilizas?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Opción Público */}
                <button
                  onClick={() => setServiceType("public")}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    serviceType === "public"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Servicio Público</p>
                      <p className="text-sm text-muted-foreground">IMSS, ISSSTE, Servicios Estatales</p>
                      {publicServices.length > 0 && (
                        <p className="text-xs text-primary mt-1">{publicServices.length} servicios disponibles</p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Opción Privado */}
                <button
                  onClick={() => setServiceType("private")}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    serviceType === "private"
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Servicio Privado</p>
                      <p className="text-sm text-muted-foreground">Aseguradoras, Clínicas Privadas</p>
                      {privateServices.length > 0 && (
                        <p className="text-xs text-primary mt-1">{privateServices.length} servicios disponibles</p>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {error && (
                <div className="flex gap-2 items-start text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border" onClick={handleBack}>
                  Atrás
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleContinue}
                  disabled={!serviceType}
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PASO 3: SELECCIONAR SERVICIO */}
        {step === "select-service" && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                {serviceType === "public" ? "Servicios Públicos Disponibles" : "Tu Servicio Privado"}
              </CardTitle>
              <CardDescription>
                {serviceType === "public"
                  ? publicServices.length > 0
                    ? `Selecciona uno de los ${publicServices.length} servicios disponibles`
                    : "No hay servicios públicos registrados. Puedes registrar uno."
                  : "Proporciona los datos de tu aseguradora o clínica privada"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceType === "public" ? (
                publicServices.length > 0 ? (
                  <div className="space-y-3">
                    {publicServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedService === service.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-border bg-card hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{service.organizationName}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {service.city}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{service.operatingHours}</p>
                            {service.capabilities.length > 0 && (
                              <div className="flex gap-1 flex-wrap mt-2">
                                {service.capabilities.map((cap) => (
                                  <span key={cap} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded">
                                    {cap}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No hay servicios públicos registrados aún</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="private-service" className="text-card-foreground">
                      Nombre de tu Servicio Privado
                    </Label>
                    <Input
                      id="private-service"
                      type="text"
                      placeholder="Ej: AXA Seguros, Clínica Galenia"
                      value={privateServiceName}
                      onChange={(e) => setPrivateServiceName(e.target.value)}
                      className="bg-background border-input text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="private-cost" className="text-card-foreground">
                      Costo Mensual (Opcional)
                    </Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="private-cost"
                        type="number"
                        placeholder="Ej: 500"
                        value={privateCost}
                        onChange={(e) => setPrivateCost(e.target.value)}
                        className="bg-background border-input text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex gap-2 items-start text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-border" onClick={handleBack}>
                  Atrás
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleContinue}
                  disabled={isLoading || (serviceType === "public" && !selectedService) || (serviceType === "private" && !privateServiceName)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Selección"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indicador de progreso */}
        <div className="flex gap-2 mt-8 justify-center">
          <div className={`h-2 w-2 rounded-full ${step === "imss" ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-2 rounded-full ${step === "service-type" ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-2 rounded-full ${step === "select-service" ? "bg-primary" : "bg-muted"}`} />
        </div>
      </div>
    </div>
  )
}

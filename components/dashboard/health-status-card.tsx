"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, MapPin, Clock, DollarSign, AlertCircle, Loader2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

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

interface UserServiceSelection {
  imssNumber?: string
  selectedServices?: {
    hospital?: string
    ambulancia?: string
    policia?: string
    bomberos?: string
  }
  serviceType?: "public" | "private"
  selectedService?: string
  serviceCost?: number
  savedAt: string
}

export function HealthStatusCard() {
  const [step, setStep] = useState<"type-selection" | "service-selection" | "view-selected">("view-selected")
  const [serviceType, setServiceType] = useState<"public" | "private" | "">("")
  const [selectedService, setSelectedService] = useState("")
  const [imssNumber, setImssNumber] = useState("")
  const [privateServiceName, setPrivateServiceName] = useState("")
  const [privateCost, setPrivateCost] = useState("")
  const [publicServices, setPublicServices] = useState<EmergencyService[]>([])
  const [privateServices, setPrivateServices] = useState<EmergencyService[]>([])
  const [userSelection, setUserSelection] = useState<UserServiceSelection | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Cargar servicios registrados
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

    // Cargar selección actual
    const savedSelection = localStorage.getItem('userServiceSelection')
    if (savedSelection) {
      try {
        const selection = JSON.parse(savedSelection)
        setUserSelection(selection)
        setImssNumber(selection.imssNumber || "")
      } catch (e) {
        console.error("[v0] Error loading selection:", e)
      }
    }
  }

  const handleChangeService = () => {
    setStep("type-selection")
    setServiceType("")
    setSelectedService("")
    setError("")
  }

  const handleTypeSelection = () => {
    if (!serviceType) {
      setError("Por favor selecciona el tipo de servicio")
      return
    }
    setError("")
    setStep("service-selection")
  }

  const handleServiceSelection = async () => {
    setError("")
    setIsLoading(true)

    try {
      if (serviceType === "public" && !selectedService) {
        setError("Por favor selecciona un servicio público")
        setIsLoading(false)
        return
      }
      if (serviceType === "private" && !privateServiceName.trim()) {
        setError("Por favor ingresa el nombre de tu servicio privado")
        setIsLoading(false)
        return
      }

      const selectedServiceData = serviceType === "public"
        ? publicServices.find(s => s.id === selectedService)
        : null

      const newSelection: UserServiceSelection = {
        imssNumber: imssNumber || undefined,
        serviceType: serviceType as "public" | "private",
        selectedService: selectedServiceData?.organizationName || privateServiceName,
        serviceCost: selectedServiceData?.cost || (privateCost ? parseFloat(privateCost) : undefined),
        savedAt: new Date().toISOString()
      }

      localStorage.setItem('userServiceSelection', JSON.stringify(newSelection))
      console.log("[v0] Service selection updated:", newSelection)
      
      setUserSelection(newSelection)
      setStep("view-selected")
    } catch (err) {
      setError("Error al guardar tu selección. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <CardTitle className="text-card-foreground">Estado de Salud</CardTitle>
            <CardDescription>Selecciona tu servicio de salud preferido</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* VISTA: Servicio seleccionado */}
        {step === "view-selected" && userSelection && (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Display selected services by type */}
                  {userSelection.selectedServices && Object.entries(userSelection.selectedServices).map(([type, serviceName]) => (
                    serviceName && (
                      <div key={type} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          type === "hospital" ? "bg-red-500" :
                          type === "ambulancia" ? "bg-orange-500" :
                          type === "policia" ? "bg-blue-500" :
                          "bg-red-700"
                        }`} />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase">{type}</p>
                          <p className="text-sm font-medium text-foreground">{serviceName}</p>
                        </div>
                      </div>
                    )
                  ))}
                  
                  {/* Display legacy single selection for backward compatibility */}
                  {!userSelection.selectedServices && userSelection.selectedService && (
                    <div className="space-y-2">
                      <Badge variant={userSelection.serviceType === "public" ? "default" : "secondary"}>
                        {userSelection.serviceType === "public" ? "Público" : "Privado"}
                      </Badge>
                      <p className="text-sm font-semibold text-foreground">{userSelection.selectedService}</p>
                      {userSelection.imssNumber && (
                        <p className="text-xs text-muted-foreground">IMSS: {userSelection.imssNumber}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-border"
              onClick={handleChangeService}
            >
              Cambiar Servicio
            </Button>
          </div>
        )}

        {/* VISTA: Sin servicio seleccionado */}
        {step === "view-selected" && !userSelection && (
          <div className="text-center py-6 space-y-4">
            <p className="text-sm text-muted-foreground">No has seleccionado un servicio de salud</p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleChangeService}
            >
              Seleccionar Servicio
            </Button>
          </div>
        )}

        {/* PASO 1: Seleccionar tipo de servicio */}
        {step === "type-selection" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Opción Público */}
              <button
                onClick={() => setServiceType("public")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  serviceType === "public"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Servicio Público</p>
                    <p className="text-xs text-muted-foreground">IMSS, ISSSTE, Servicios Estatales</p>
                    {publicServices.length > 0 && (
                      <p className="text-xs text-primary mt-1">{publicServices.length} disponibles</p>
                    )}
                  </div>
                </div>
              </button>

              {/* Opción Privado */}
              <button
                onClick={() => setServiceType("private")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  serviceType === "private"
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Servicio Privado</p>
                    <p className="text-xs text-muted-foreground">Aseguradoras, Clínicas Privadas</p>
                    {privateServices.length > 0 && (
                      <p className="text-xs text-primary mt-1">{privateServices.length} disponibles</p>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {error && (
              <div className="flex gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setStep("view-selected")}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleTypeSelection}
                disabled={!serviceType}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* PASO 2: Seleccionar servicio específico */}
        {step === "service-selection" && (
          <div className="space-y-4">
            {serviceType === "public" ? (
              <div className="space-y-3">
                {publicServices.length > 0 ? (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {publicServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                            selectedService === service.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : "border-border bg-card hover:border-blue-300"
                          }`}
                        >
                          <p className="font-medium text-sm text-foreground">{service.organizationName}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {service.city}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {service.operatingHours}
                            </div>
                          </div>
                          {service.capabilities.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-2">
                              {service.capabilities.slice(0, 2).map((cap) => (
                                <span key={cap} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded">
                                  {cap}
                                </span>
                              ))}
                              {service.capabilities.length > 2 && (
                                <span className="text-xs text-muted-foreground px-2 py-0.5">
                                  +{service.capabilities.length - 2} más
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No hay servicios públicos registrados
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="private-service" className="text-card-foreground text-sm">
                    Nombre del Servicio Privado
                  </Label>
                  <Input
                    id="private-service"
                    type="text"
                    placeholder="Ej: AXA Seguros, Clínica Galenia"
                    value={privateServiceName}
                    onChange={(e) => setPrivateServiceName(e.target.value)}
                    className="bg-background border-input text-foreground text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="private-cost" className="text-card-foreground text-sm">
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
                      className="bg-background border-input text-foreground text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setStep("type-selection")}
                disabled={isLoading}
              >
                Atrás
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleServiceSelection}
                disabled={isLoading || (serviceType === "public" && !selectedService) || (serviceType === "private" && !privateServiceName)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

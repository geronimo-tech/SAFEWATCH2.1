'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Clock, DollarSign, AlertCircle, Loader2, ArrowLeft, Shield, Flame } from 'lucide-react'

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
  serviceType: "public" | "private"
  selectedServices: string[] // changed to array to support multiple selections
  serviceCost?: number
  savedAt: string
}

const getServiceIcon = (serviceType: string) => {
  switch (serviceType.toLowerCase()) {
    case 'hospital':
      return <Heart className="h-5 w-5 text-red-500" />
    case 'ambulancia':
      return <AlertCircle className="h-5 w-5 text-orange-500" />
    case 'policía':
    case 'policia':
      return <Shield className="h-5 w-5 text-blue-500" />
    case 'bomberos':
      return <Flame className="h-5 w-5 text-red-600" />
    default:
      return <Heart className="h-5 w-5 text-muted-foreground" />
  }
}

export default function HealthStatusSelectionPage() {
  const router = useRouter()
  const [step, setStep] = useState<"type-selection" | "service-selection">("type-selection")
  const [serviceType, setServiceType] = useState<"public" | "private" | "">("")
  const [selectedService, setSelectedService] = useState("")
  const [selectAnyNearby, setSelectAnyNearby] = useState(false)
  const [imssNumber, setImssNumber] = useState("")
  const [privateServiceName, setPrivateServiceName] = useState("")
  const [privateCost, setPrivateCost] = useState("")
  const [publicServices, setPublicServices] = useState<EmergencyService[]>([])
  const [privateServices, setPrivateServices] = useState<EmergencyService[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeServiceTypeTab, setActiveServiceTypeTab] = useState<string>("")
  const [selectedServicesByType, setSelectedServicesByType] = useState<Map<string, string>>(new Map()) // added map for multiple selections by type

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
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

    const savedSelection = localStorage.getItem('userServiceSelection')
    if (savedSelection) {
      try {
        const selection = JSON.parse(savedSelection)
        setImssNumber(selection.imssNumber || "")
      } catch (e) {
        console.error("[v0] Error loading selection:", e)
      }
    }
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
      if (serviceType === "public") {
        if (selectAnyNearby) {
          const newSelection: UserServiceSelection = {
            imssNumber: imssNumber || undefined,
            serviceType: "public",
            selectedServices: ["any-nearby"],
            savedAt: new Date().toISOString()
          }

          localStorage.setItem('userServiceSelection', JSON.stringify(newSelection))
          console.log("[v0] Service selection updated:", newSelection)
        } else if (selectedServicesByType.size === 0) {
          setError("Por favor selecciona al menos un servicio")
          setIsLoading(false)
          return
        } else {
          const selectedServiceNames = Array.from(selectedServicesByType.values()).map(serviceId => {
            const service = publicServices.find(s => s.id === serviceId)
            return service?.organizationName || ""
          })

          const newSelection: UserServiceSelection = {
            imssNumber: imssNumber || undefined,
            serviceType: "public",
            selectedServices: selectedServiceNames.filter(Boolean),
            savedAt: new Date().toISOString()
          }

          localStorage.setItem('userServiceSelection', JSON.stringify(newSelection))
          console.log("[v0] Service selection updated:", newSelection)
        }
      } else if (serviceType === "private" && !privateServiceName.trim()) {
        setError("Por favor ingresa el nombre de tu servicio privado")
        setIsLoading(false)
        return
      } else {
        const newSelection: UserServiceSelection = {
          imssNumber: imssNumber || undefined,
          serviceType: "private",
          selectedServices: [privateServiceName],
          serviceCost: privateCost ? parseFloat(privateCost) : undefined,
          savedAt: new Date().toISOString()
        }

        localStorage.setItem('userServiceSelection', JSON.stringify(newSelection))
        console.log("[v0] Service selection updated:", newSelection)
      }
      
      router.push("/dashboard")
    } catch (err) {
      setError("Error al guardar tu selección. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const getServiceTypes = () => {
    return Array.from(new Set(publicServices.map(s => s.serviceType.toLowerCase())))
  }

  const getServicesByType = (type: string) => {
    return publicServices.filter(s => s.serviceType.toLowerCase() === type.toLowerCase())
  }

  const toggleServiceSelection = (serviceId: string, serviceType: string) => {
    const newSelections = new Map(selectedServicesByType)
    if (newSelections.get(serviceType) === serviceId) {
      newSelections.delete(serviceType)
    } else {
      newSelections.set(serviceType, serviceId)
    }
    setSelectedServicesByType(newSelections)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Estado de Salud
              </h1>
              <p className="text-sm text-muted-foreground">Selecciona tu servicio de salud preferido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* PASO 1: Ingresa IMSS y selecciona tipo de servicio */}
          {step === "type-selection" && (
            <div className="space-y-6">
              {/* IMSS Input */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imss" className="text-foreground text-sm font-medium">
                    Número de IMSS (Opcional)
                  </Label>
                  <Input
                    id="imss"
                    type="text"
                    placeholder="Ej: 123456789"
                    value={imssNumber}
                    onChange={(e) => setImssNumber(e.target.value)}
                    className="bg-background border-input text-foreground text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Ingresa tu número de IMSS si lo tienes disponible</p>
                </div>
              </div>

              {/* Selección de tipo de servicio */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">¿Qué tipo de servicio deseas?</h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Opción Público */}
                  <button
                    onClick={() => setServiceType("public")}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      serviceType === "public"
                        ? "border-blue-500 bg-blue-900/20 dark:bg-blue-900/40"
                        : "border-border bg-card hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        serviceType === "public"
                          ? "bg-blue-500/20"
                          : "bg-muted"
                      }`}>
                        <Heart className={`h-6 w-6 ${
                          serviceType === "public"
                            ? "text-blue-600"
                            : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Servicio Público</p>
                        <p className="text-xs text-muted-foreground mt-1">IMSS, ISSSTE, Clínicas del Estado</p>
                        {publicServices.length > 0 && (
                          <Badge className="mt-2 bg-blue-600 text-white">
                            {publicServices.length} disponibles
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Opción Privado */}
                  <button
                    onClick={() => setServiceType("private")}
                    className={`p-6 rounded-lg border-2 transition-all text-left ${
                      serviceType === "private"
                        ? "border-green-500 bg-green-900/20 dark:bg-green-900/40"
                        : "border-border bg-card hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        serviceType === "private"
                          ? "bg-green-500/20"
                          : "bg-muted"
                      }`}>
                        <DollarSign className={`h-6 w-6 ${
                          serviceType === "private"
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Servicio Privado</p>
                        <p className="text-xs text-muted-foreground mt-1">Aseguradoras, Clínicas Privadas</p>
                        {privateServices.length > 0 && (
                          <Badge className="mt-2 bg-green-600 text-white">
                            {privateServices.length} disponibles
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex gap-2 text-destructive text-sm bg-destructive/10 p-4 rounded-lg border border-destructive/30">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => router.back()}
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
            <div className="space-y-6">
              {serviceType === "public" ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Servicios Públicos Disponibles</h2>
                  
                  {publicServices.length > 0 ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setSelectAnyNearby(!selectAnyNearby)
                          setSelectedServicesByType(new Map())
                        }}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectAnyNearby
                            ? "border-blue-500 bg-blue-900/20 dark:bg-blue-900/40"
                            : "border-border bg-card hover:border-blue-300"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <p className="font-semibold text-foreground">Cualquiera cerca de mi ubicación</p>
                            {selectAnyNearby && <Badge className="ml-auto bg-green-500 text-white">✓</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground ml-7">Se te mostrará el servicio más cercano disponible</p>
                        </div>
                      </button>

                      <div className="flex gap-2 border-b border-border overflow-x-auto pb-2">
                        {getServiceTypes().map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setActiveServiceTypeTab(type)
                              setSelectAnyNearby(false)
                            }}
                            className={`px-4 py-2 rounded-t-lg whitespace-nowrap font-medium text-sm transition-colors ${
                              activeServiceTypeTab === type
                                ? "bg-blue-600 text-white"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                            {selectedServicesByType.has(type) && (
                              <Badge className="ml-2 bg-green-500 text-white text-xs">✓</Badge>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {activeServiceTypeTab && getServicesByType(activeServiceTypeTab).map((service) => {
                          const isSelected = selectedServicesByType.get(activeServiceTypeTab) === service.id
                          return (
                            <button
                              key={service.id}
                              onClick={() => toggleServiceSelection(service.id, activeServiceTypeTab)} // allow toggling selection
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                  ? "border-green-500 bg-green-900/20 dark:bg-green-900/40"
                                  : "border-border bg-card hover:border-blue-300"
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  {getServiceIcon(service.serviceType)}
                                  <div>
                                    <p className="font-semibold text-foreground">{service.organizationName}</p>
                                    <p className="text-xs text-muted-foreground">{service.serviceType}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground ml-8">
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
                                  <div className="flex gap-2 flex-wrap pt-2 ml-8">
                                    {service.capabilities.slice(0, 3).map((cap) => (
                                      <span key={cap} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full">
                                        {cap}
                                      </span>
                                    ))}
                                    {service.capabilities.length > 3 && (
                                      <span className="text-xs text-muted-foreground px-3 py-1">
                                        +{service.capabilities.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                      <p className="text-muted-foreground">No hay servicios públicos registrados</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Información del Servicio Privado</h2>
                  
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="private-service" className="text-foreground text-sm font-medium">
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
                      <Label htmlFor="private-cost" className="text-foreground text-sm font-medium">
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
                </div>
              )}

              {error && (
                <div className="flex gap-2 text-destructive text-sm bg-destructive/10 p-4 rounded-lg border border-destructive/30">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
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
                  disabled={isLoading || (serviceType === "public" && !selectAnyNearby && selectedServicesByType.size === 0) || (serviceType === "private" && !privateServiceName)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Servicio"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

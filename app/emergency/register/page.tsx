'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Logo } from '@/components/ui/logo'
import { AlertCircle, Ambulance, Building2, Shield, Phone } from 'lucide-react'

const emergencyTypes = [
  { id: 'hospital', label: 'Hospital', icon: Building2, color: 'bg-red-500/10 text-red-600' },
  { id: 'ambulance', label: 'Servicio de Ambulancia', icon: Ambulance, color: 'bg-orange-500/10 text-orange-600' },
  { id: 'police', label: 'Policía', icon: Shield, color: 'bg-blue-500/10 text-blue-600' },
  { id: 'fire', label: 'Bomberos', icon: AlertCircle, color: 'bg-red-600/10 text-red-700' },
]

export default function EmergencyRegisterPage() {
  const [selectedType, setSelectedType] = useState<string>('')
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState({
    serviceType: '',
    entityType: '',
    organizationName: '',
    legalRepresentative: '',
    email: '',
    phone: '',
    address: '',
    city: 'Guadalajara',
    operatingHours: '24/7',
    staffCount: '',
    vehicles: '',
    capabilities: [] as string[],
    description: '',
    licenseNumber: '',
    website: '',
    agreeTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCapabilityToggle = (capability: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capability)
        ? prev.capabilities.filter(c => c !== capability)
        : [...prev.capabilities, capability]
    }))
  }

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    setFormData(prev => ({
      ...prev,
      serviceType: typeId
    }))
  }

  const handleSubmit = async () => {
    try {
      console.log("[v0] Registering service:", formData)
      
      // Guardar en localStorage
      const servicesData = JSON.parse(localStorage.getItem('emergency_services') || '[]')
      const newService = {
        id: Date.now().toString(),
        ...formData,
        registeredAt: new Date().toISOString()
      }
      servicesData.push(newService)
      localStorage.setItem('emergency_services', JSON.stringify(servicesData))
      
      console.log("[v0] Service registered successfully:", newService)
      alert('¡Servicio registrado exitosamente! Eres visible en la plataforma.')
      setFormStep(1)
      setSelectedType('')
      setFormData({
        serviceType: '',
        entityType: '',
        organizationName: '',
        legalRepresentative: '',
        email: '',
        phone: '',
        address: '',
        city: 'Guadalajara',
        operatingHours: '24/7',
        staffCount: '',
        vehicles: '',
        capabilities: [],
        description: '',
        licenseNumber: '',
        website: '',
        agreeTerms: false,
      })
    } catch (error) {
      console.error("[v0] Error registering service:", error)
      alert('Error al registrar el servicio. Intenta de nuevo.')
    }
  }

  const capabilities = {
    hospital: ['Urgencias', 'Cirugía', 'Cuidados Intensivos', 'Radiología', 'Laboratorio', 'Maternidad'],
    ambulance: ['Transporte Básico', 'Transporte Avanzado', 'Atención Prehospitalaria', 'Traslado Interhospitalario'],
    police: ['Patrullaje', 'Investigación', 'Control de Tráfico', 'Seguridad de Eventos'],
    fire: ['Rescate', 'Incendios', 'Materiales Peligrosos', 'Emergencias Médicas'],
  }

  const selectedCapabilities = capabilities[selectedType as keyof typeof capabilities] || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={40} />
            <span className="text-sm text-muted-foreground">Registro de Servicios</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-foreground">Volver</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Service Type */}
          {formStep === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-2 mb-12">
                <h1 className="text-4xl font-bold text-foreground">Registra tu Servicio de Emergencia</h1>
                <p className="text-muted-foreground text-lg">
                  Selecciona el tipo de servicio que proporcionas para acceder a alertas en tiempo real
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyTypes.map(type => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedType === type.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${type.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-foreground text-left">{type.label}</h3>
                      <p className="text-xs text-muted-foreground text-left mt-2">
                        {type.id === 'hospital' && 'Centros de atención médica especializada'}
                        {type.id === 'ambulance' && 'Servicios de transporte y atención prehospitalaria'}
                        {type.id === 'police' && 'Cuerpos de seguridad y vigilancia'}
                        {type.id === 'fire' && 'Servicios de rescate y emergencias'}
                      </p>
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-center pt-8">
                <Button
                  size="lg"
                  onClick={() => setFormStep(1.5)}
                  disabled={!selectedType}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 1.5: Select Entity Type (Public or Private) */}
          {formStep === 1.5 && (
            <div className="space-y-8">
              <div className="text-center space-y-2 mb-12">
                <h1 className="text-4xl font-bold text-foreground">Tipo de Entidad</h1>
                <p className="text-muted-foreground text-lg">
                  Especifica si tu servicio es una entidad pública o privada
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => {
                    handleSelectChange('entityType', 'public')
                    setFormStep(2)
                  }}
                  className={`p-8 rounded-lg border-2 transition-all cursor-pointer ${
                    formData.entityType === 'public'
                      ? 'border-blue-600 bg-blue-500/10'
                      : 'border-border hover:border-blue-600/50'
                  }`}
                >
                  <div className="h-16 w-16 rounded-lg flex items-center justify-center mb-4 bg-blue-500/10 text-blue-600 mx-auto">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">Entidad Pública</h3>
                  <p className="text-sm text-muted-foreground mt-3">
                    Servicios del gobierno o institución estatal
                  </p>
                </button>

                <button
                  onClick={() => {
                    handleSelectChange('entityType', 'private')
                    setFormStep(2)
                  }}
                  className={`p-8 rounded-lg border-2 transition-all cursor-pointer ${
                    formData.entityType === 'private'
                      ? 'border-green-600 bg-green-500/10'
                      : 'border-border hover:border-green-600/50'
                  }`}
                >
                  <div className="h-16 w-16 rounded-lg flex items-center justify-center mb-4 bg-green-500/10 text-green-600 mx-auto">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">Entidad Privada</h3>
                  <p className="text-sm text-muted-foreground mt-3">
                    Empresa o institución privada independiente
                  </p>
                </button>
              </div>

              <div className="flex justify-center pt-8">
                <Button
                  variant="outline"
                  onClick={() => setFormStep(1)}
                  className="border-border text-foreground"
                >
                  Atrás
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {formStep === 2 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-foreground">Información Básica</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      formData.entityType === 'public'
                        ? 'bg-blue-500/10 text-blue-600'
                        : 'bg-green-500/10 text-green-600'
                    }`}>
                      {formData.entityType === 'public' ? 'Pública' : 'Privada'}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2">Proporciona los detalles de tu organización</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">Paso 2 de 4</div>
              </div>

              <Card className="p-8 bg-card border-border">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="organizationName" className="text-foreground">Nombre de la Organización</Label>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        placeholder="Ej: Hospital Central Guadalajara"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legalRepresentative" className="text-foreground">Representante Legal</Label>
                      <Input
                        id="legalRepresentative"
                        name="legalRepresentative"
                        placeholder="Nombre completo"
                        value={formData.legalRepresentative}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-foreground">Email Institucional</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contacto@hospital.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-foreground">Teléfono de Emergencia</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+52 33 1234 5678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-foreground">Dirección</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Calle, número, colonia"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="licenseNumber" className="text-foreground">Número de Licencia/Registro</Label>
                      <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        placeholder="Ej: SEC-2024-001"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-foreground">Sitio Web (Opcional)</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="www.hospital.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={() => setFormStep(1.5)}
                  className="border-border text-foreground"
                >
                  Atrás
                </Button>
                <Button
                  size="lg"
                  onClick={() => setFormStep(3)}
                  disabled={!formData.organizationName || !formData.email || !formData.phone}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Capabilities and Details */}
          {formStep === 3 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Capacidades y Detalles</h2>
                  <p className="text-muted-foreground mt-2">Cuéntanos sobre tu servicio y capacidades</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">Paso 3 de 4</div>
              </div>

              <Card className="p-8 bg-card border-border">
                <div className="space-y-6">
                  <div>
                    <Label className="text-foreground font-semibold mb-4 block">Selecciona tus Capacidades</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCapabilities.map(capability => (
                        <button
                          key={capability}
                          onClick={() => handleCapabilityToggle(capability)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.capabilities.includes(capability)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.capabilities.includes(capability)}
                            onChange={() => handleCapabilityToggle(capability)}
                            className="mr-3"
                          />
                          <span className="text-foreground font-medium">{capability}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="staffCount" className="text-foreground">Cantidad de Personal</Label>
                      <Input
                        id="staffCount"
                        name="staffCount"
                        type="number"
                        placeholder="Ej: 50"
                        value={formData.staffCount}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicles" className="text-foreground">Número de Vehículos</Label>
                      <Input
                        id="vehicles"
                        name="vehicles"
                        type="number"
                        placeholder="Ej: 10"
                        value={formData.vehicles}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="operatingHours">Horario de Operación</Label>
                    <select
                      name="operatingHours"
                      value={formData.operatingHours}
                      onChange={(e) => handleSelectChange('operatingHours', e.target.value)}
                      className="w-full mt-2 px-3 py-2 rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="24/7">24/7 - Disponible todo el tiempo</option>
                      <option value="business">Horario Comercial (9AM - 6PM)</option>
                      <option value="custom">Horario Personalizado</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-foreground">Descripción Adicional</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Cuéntanos más sobre tu servicio, especialidades, experiencia..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <label className="text-sm text-foreground">
                      Acepto los términos de servicio y confirmo que la información proporcionada es veraz.
                    </label>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={() => setFormStep(2)}
                  className="border-border text-foreground"
                >
                  Atrás
                </Button>
                <Button
                  size="lg"
                  onClick={() => setFormStep(4)}
                  disabled={!formData.agreeTerms || formData.capabilities.length === 0}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation and Registration */}
          {formStep === 4 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Resumen y Confirmación</h2>
                  <p className="text-muted-foreground mt-2">Verifica la información antes de registrarte</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">Paso 4 de 4</div>
              </div>

              <Card className="p-8 bg-card border-border">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tipo de Servicio</p>
                      <p className="font-semibold text-foreground capitalize">{formData.serviceType}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tipo de Entidad</p>
                      <p className={`font-semibold ${formData.entityType === 'public' ? 'text-blue-600' : 'text-green-600'}`}>
                        {formData.entityType === 'public' ? 'Pública' : 'Privada'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Nombre Organización</p>
                      <p className="font-semibold text-foreground">{formData.organizationName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-foreground">{formData.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-semibold text-foreground">{formData.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                      <p className="font-semibold text-foreground">{formData.address}, {formData.city}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground mb-3">Capacidades</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.capabilities.map(cap => (
                        <span key={cap} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {formData.description && (
                    <div className="border-t border-border pt-6">
                      <p className="text-sm text-muted-foreground mb-2">Descripción</p>
                      <p className="text-foreground text-sm">{formData.description}</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <p className="text-sm text-foreground">
                  Al registrarte, aceptas que tu servicio será visible para usuarios que busquen servicios de emergencia en la plataforma SafeWatch.
                </p>
              </div>

              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={() => setFormStep(3)}
                  className="border-border text-foreground"
                >
                  Atrás
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Registrar Servicio
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

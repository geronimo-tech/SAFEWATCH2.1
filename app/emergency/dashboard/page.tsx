'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Logo } from '@/components/ui/logo'
import { AlertCircle, Phone, MapPin, Users, Clock, CheckCircle2, Eye, Bell, Activity } from 'lucide-react'

export default function EmergencyDashboard() {
  const [activeTab, setActiveTab] = useState('alerts')
  const [serviceType] = useState('hospital') // En producción, esto vendría del usuario logueado

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Emergencia Cardiaca',
      location: 'Av. México 2450, Guadalajara',
      distance: '0.8 km',
      patient: {
        age: 62,
        bloodType: 'O+',
        allergies: 'Penicilina'
      },
      timestamp: '2 minutos atrás',
      status: 'activa'
    },
    {
      id: 2,
      type: 'urgent',
      title: 'Fractura de Tobillo',
      location: 'Centro Comercial Plaza del Sol',
      distance: '1.2 km',
      patient: {
        age: 28,
        bloodType: 'AB-',
        allergies: 'Ninguna'
      },
      timestamp: '8 minutos atrás',
      status: 'asignada'
    },
    {
      id: 3,
      type: 'moderate',
      title: 'Dolor Abdominal Fuerte',
      location: 'Residencial Lomas del Bosque',
      distance: '2.1 km',
      patient: {
        age: 45,
        bloodType: 'B+',
        allergies: 'Ibuprofeno'
      },
      timestamp: '15 minutos atrás',
      status: 'pendiente'
    }
  ]

  const stats = [
    { label: 'Alertas Activas', value: '12', color: 'text-red-500' },
    { label: 'Alertas Respondidas', value: '847', color: 'text-green-500' },
    { label: 'Tiempo Promedio', value: '4.2 min', color: 'text-blue-500' },
    { label: 'Tasa Éxito', value: '99.2%', color: 'text-emerald-500' },
  ]

  const recentActivity = [
    { time: '14:32', action: 'Alerta respondida exitosamente', status: 'completed' },
    { time: '14:28', action: 'Nueva alerta recibida - Trauma', status: 'received' },
    { time: '14:15', action: 'Paciente llegó a hospital', status: 'completed' },
    { time: '14:05', action: 'Ambulancia en camino', status: 'in-progress' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={40} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">En línea</span>
            </div>
            <Button variant="ghost" className="text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Panel de Control</h1>
          <p className="text-muted-foreground">Hospital Central Guadalajara</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alerts Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-border px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3 bg-muted">
                    <TabsTrigger value="alerts" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Alertas
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Historial
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Configuración
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="alerts" className="p-6 space-y-4">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${
                        alert.type === 'critical'
                          ? 'border-l-red-500 bg-red-500/5'
                          : alert.type === 'urgent'
                            ? 'border-l-orange-500 bg-orange-500/5'
                            : 'border-l-yellow-500 bg-yellow-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <AlertCircle className={`h-5 w-5 mt-1 ${
                            alert.type === 'critical'
                              ? 'text-red-500'
                              : alert.type === 'urgent'
                                ? 'text-orange-500'
                                : 'text-yellow-500'
                          }`} />
                          <div>
                            <h3 className="font-semibold text-foreground">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'activa'
                            ? 'bg-red-500/20 text-red-600'
                            : alert.status === 'asignada'
                              ? 'bg-blue-500/20 text-blue-600'
                              : 'bg-gray-500/20 text-gray-600'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4 ml-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {alert.location} ({alert.distance})
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Edad: {alert.patient.age}</span>
                          <span>Tipo de sangre: {alert.patient.bloodType}</span>
                          <span>Alergias: {alert.patient.allergies}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-8">
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button size="sm" variant="outline" className="border-border text-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          Contactar
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="history" className="p-6 space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <span className="text-xs font-mono text-muted-foreground">{activity.time}</span>
                      <div className="flex-1">
                        <p className="text-foreground text-sm">{activity.action}</p>
                      </div>
                      {activity.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {activity.status === 'in-progress' && <Activity className="h-4 w-4 text-blue-500 animate-pulse" />}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="settings" className="p-6 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Notificaciones</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">Alertas Críticas</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">Alertas Urgentes</span>
                        </label>
                      </div>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Guardar Cambios
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <h3 className="font-semibold text-foreground mb-4">Acción Rápida</h3>
              <div className="space-y-2">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Responder Alerta
                </Button>
                <Button variant="outline" className="w-full border-border text-foreground justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver Mapa
                </Button>
                <Button variant="outline" className="w-full border-border text-foreground justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Mi Equipo
                </Button>
              </div>
            </Card>

            {/* Status Card */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Estado</h3>
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Personal Disponible</p>
                  <p className="text-2xl font-bold text-foreground">8/10</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Ambulancias Activas</p>
                  <p className="text-2xl font-bold text-foreground">5/6</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Tiempo Respuesta Prom</p>
                  <p className="text-2xl font-bold text-foreground">3.8 min</p>
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold text-foreground mb-4">Contacto de Soporte</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                  <p className="text-foreground font-mono">+52 33 1234 5678</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-mono text-sm">soporte@safewatch.com</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

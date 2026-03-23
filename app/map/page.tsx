'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Phone, Clock, Search, Filter, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { SafetyPoint } from '@/lib/types/database.types'

export default function MapPage() {
  const [safetyPoints, setSafetyPoints] = useState<SafetyPoint[]>([])
  const [filteredPoints, setFilteredPoints] = useState<SafetyPoint[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('[v0] Error getting location:', error)
        }
      )
    }

    // Fetch safety points
    fetchSafetyPoints()
  }, [])

  useEffect(() => {
    filterPoints()
  }, [safetyPoints, selectedType, searchQuery, userLocation])

  const fetchSafetyPoints = async () => {
    try {
      const response = await fetch('/api/safety-points')
      const result = await response.json()
      if (result.success) {
        setSafetyPoints(result.data)
      }
    } catch (error) {
      console.error('[v0] Error fetching safety points:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPoints = () => {
    let filtered = [...safetyPoints]

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(point => point.type === selectedType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(point =>
        point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by distance if user location is available
    if (userLocation) {
      filtered = filtered.map(point => ({
        ...point,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          point.latitude,
          point.longitude
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    setFilteredPoints(filtered)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180)
  }

  const openNavigation = (point: SafetyPoint) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`
    window.open(url, '_blank')
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      police_station: 'Policía',
      hospital: 'Hospital',
      fire_station: 'Bomberos',
      safe_point: 'Punto Seguro',
      emergency_center: 'Centro de Emergencias'
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      police_station: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      hospital: 'bg-red-500/10 text-red-600 dark:text-red-400',
      fire_station: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      safe_point: 'bg-green-500/10 text-green-600 dark:text-green-400',
      emergency_center: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    }
    return colors[type] || 'bg-gray-500/10 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Puntos de Seguridad</h1>
              <p className="text-sm text-muted-foreground">Guadalajara, Jalisco</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar punto de seguridad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
              className="whitespace-nowrap"
            >
              Todos
            </Button>
            <Button
              variant={selectedType === 'police_station' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('police_station')}
              className="whitespace-nowrap"
            >
              Policía
            </Button>
            <Button
              variant={selectedType === 'hospital' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('hospital')}
              className="whitespace-nowrap"
            >
              Hospitales
            </Button>
            <Button
              variant={selectedType === 'fire_station' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('fire_station')}
              className="whitespace-nowrap"
            >
              Bomberos
            </Button>
            <Button
              variant={selectedType === 'safe_point' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('safe_point')}
              className="whitespace-nowrap"
            >
              Puntos Seguros
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Cargando...' : `${filteredPoints.length} puntos encontrados`}
          </p>
        </div>

        {/* Safety Points List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPoints.map((point) => (
            <Card key={point.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Badge className={getTypeColor(point.type)}>
                    {getTypeLabel(point.type)}
                  </Badge>
                  <h3 className="font-semibold text-card-foreground mt-2 mb-1">
                    {point.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{point.address}</span>
                </div>

                {point.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <a href={`tel:${point.phone}`} className="hover:text-primary">
                      {point.phone}
                    </a>
                  </div>
                )}

                {point.hours_24 && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>Abierto 24 horas</span>
                  </div>
                )}

                {(point as any).distance && (
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Navigation className="h-4 w-4 flex-shrink-0" />
                    <span>{(point as any).distance.toFixed(1)} km</span>
                  </div>
                )}

                {point.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {point.services.map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => openNavigation(point)}
                className="w-full mt-4 bg-primary hover:bg-primary/90"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Obtener Direcciones
              </Button>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredPoints.length === 0 && (
          <Card className="p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              No se encontraron puntos
            </h3>
            <p className="text-muted-foreground">
              Intenta cambiar los filtros o la búsqueda
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

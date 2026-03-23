"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Search, Phone } from 'lucide-react'
import Link from "next/link"

interface SafetyPoint {
  id: string
  name: string
  type: "police" | "hospital" | "fire_station" | "red_cross"
  address: string
  phone: string
  latitude: number
  longitude: number
  distance?: number
}

const TYPE_LABELS = {
  police: "Policía",
  hospital: "Hospital",
  fire_station: "Bomberos",
  red_cross: "Cruz Roja"
}

const TYPE_COLORS = {
  police: "bg-blue-500",
  hospital: "bg-red-500",
  fire_station: "bg-orange-500",
  red_cross: "bg-red-600"
}

export function SafetyMapCard() {
  const [safetyPoints, setSafetyPoints] = useState<SafetyPoint[]>([])
  const [filteredPoints, setFilteredPoints] = useState<SafetyPoint[]>([])
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
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
          console.log("[v0] Geolocation error:", error)
        }
      )
    }

    // Fetch safety points
    fetch('/api/safety-points')
      .then(res => res.json())
      .then(data => {
        const points = Array.isArray(data) ? data : []
        setSafetyPoints(points)
        setFilteredPoints(points)
        setLoading(false)
      })
      .catch(err => {
        console.log("[v0] Error fetching safety points:", err)
        setSafetyPoints([])
        setFilteredPoints([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = Array.isArray(safetyPoints) ? [...safetyPoints] : []

    if (search) {
      filtered = filtered.filter(point =>
        point.name.toLowerCase().includes(search.toLowerCase()) ||
        point.address.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (selectedType) {
      filtered = filtered.filter(point => point.type === selectedType)
    }

    // Calculate distances if we have user location
    if (userLocation) {
      filtered = filtered.map(point => ({
        ...point,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          point.latitude,
          point.longitude
        )
      }))
      // Sort by distance
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    setFilteredPoints(filtered)
  }, [search, selectedType, safetyPoints, userLocation])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const openNavigation = (point: SafetyPoint) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-card-foreground">Puntos de Seguridad</h2>
        </div>
        <p className="text-muted-foreground text-center py-8">Cargando puntos de seguridad...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-card-foreground">Puntos de Seguridad</h2>
        </div>
        <Link href="/map">
          <Button variant="outline" size="sm" className="border-border">
            Ver Mapa Completo
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border text-foreground"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(null)}
            className={selectedType === null ? "bg-primary text-primary-foreground" : "border-border"}
          >
            Todos
          </Button>
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className={selectedType === type ? "bg-primary text-primary-foreground" : "border-border"}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Points list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {!Array.isArray(filteredPoints) || filteredPoints.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No se encontraron puntos de seguridad
          </p>
        ) : (
          filteredPoints.slice(0, 5).map((point) => (
            <Card key={point.id} className="p-4 bg-background border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${TYPE_COLORS[point.type]}`} />
                    <h3 className="font-medium text-card-foreground truncate">{point.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{point.address}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                      {TYPE_LABELS[point.type]}
                    </Badge>
                    {point.distance && (
                      <span className="text-xs text-muted-foreground">
                        {point.distance.toFixed(1)} km
                      </span>
                    )}
                    {point.phone && (
                      <a
                        href={`tel:${point.phone}`}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {point.phone}
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => openNavigation(point)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {Array.isArray(filteredPoints) && filteredPoints.length > 5 && (
        <div className="mt-4 text-center">
          <Link href="/map">
            <Button variant="outline" className="w-full border-border">
              Ver todos los {filteredPoints.length} puntos
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}

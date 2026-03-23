import { NextResponse } from 'next/server'
import type { SafetyPoint } from '@/lib/types/database.types'

// Safety points in Guadalajara (example data - in production this would come from database)
const safetyPoints: SafetyPoint[] = [
  {
    id: '1',
    name: 'Comisaría de Policía Centro',
    type: 'police_station',
    address: 'Av. Juárez 56, Zona Centro, Guadalajara',
    latitude: 20.6767,
    longitude: -103.3475,
    phone: '33-3668-0800',
    hours_24: true,
    services: ['Policía', 'Denuncias', 'Emergencias'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Hospital Civil de Guadalajara',
    type: 'hospital',
    address: 'Hospital 278, El Retiro, Guadalajara',
    latitude: 20.6854,
    longitude: -103.3493,
    phone: '33-3614-5501',
    hours_24: true,
    services: ['Urgencias', 'Trauma', 'Ambulancias'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Estación de Bomberos #1',
    type: 'fire_station',
    address: 'Av. 16 de Septiembre 699, Zona Centro',
    latitude: 20.6730,
    longitude: -103.3430,
    phone: '33-3619-6740',
    hours_24: true,
    services: ['Bomberos', 'Rescate', 'Emergencias'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cruz Roja Guadalajara',
    type: 'emergency_center',
    address: 'Av. Belisario Domínguez 1560, Col. Moderna',
    latitude: 20.6889,
    longitude: -103.3728,
    phone: '33-3614-2707',
    hours_24: true,
    services: ['Ambulancias', 'Primeros Auxilios', 'Urgencias'],
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Hospital México Americano',
    type: 'hospital',
    address: 'Colomos 2110, Providencia',
    latitude: 20.6994,
    longitude: -103.3826,
    phone: '33-3817-3000',
    hours_24: true,
    services: ['Urgencias', 'UCI', 'Trauma'],
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Comisaría Minerva',
    type: 'police_station',
    address: 'Av. Vallarta 2050, Col. Americana',
    latitude: 20.6780,
    longitude: -103.3787,
    phone: '33-3134-0080',
    hours_24: true,
    services: ['Policía', 'Seguridad Pública', 'Emergencias'],
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Hospital San Javier',
    type: 'hospital',
    address: 'Av. Pablo Casals 640, Prados Providencia',
    latitude: 20.7015,
    longitude: -103.3891,
    phone: '33-3669-0222',
    hours_24: true,
    services: ['Urgencias', 'Cardiología', 'Trauma'],
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Punto Seguro Plaza del Sol',
    type: 'safe_point',
    address: 'Av. López Mateos Sur 2077',
    latitude: 20.6444,
    longitude: -103.3920,
    phone: '33-3121-6500',
    hours_24: false,
    services: ['Vigilancia', 'Punto de Encuentro', 'Información'],
    created_at: new Date().toISOString()
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius')

    let filtered = [...safetyPoints]

    // Filter by type
    if (type && type !== 'all') {
      filtered = filtered.filter(point => point.type === type)
    }

    // Filter by proximity if coordinates provided
    if (lat && lng && radius) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      const radiusKm = parseFloat(radius)

      filtered = filtered.filter(point => {
        const distance = calculateDistance(userLat, userLng, point.latitude, point.longitude)
        return distance <= radiusKm
      }).sort((a, b) => {
        const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude)
        const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude)
        return distA - distB
      })
    }

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    console.error('[v0] Error fetching safety points:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch safety points' },
      { status: 500 }
    )
  }
}

// Calculate distance between two coordinates in kilometers (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

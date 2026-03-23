import { Shield, Clock, MapPin, Heart, AlertTriangle, CheckCircle, XCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function AlertHistoryPage() {
  // Mock data - in production this would come from the database
  const alerts = [
    {
      id: 1,
      type: "manual",
      status: "resolved",
      timestamp: "2025-01-07 14:30",
      location: "Av. Reforma 123, CDMX",
      responder: "Patrulla 451",
      responseTime: "4 min",
      notes: "Falsa alarma - Usuario presionó botón por error",
    },
    {
      id: 2,
      type: "fall",
      status: "resolved",
      timestamp: "2025-01-05 09:15",
      location: "Calle Insurgentes 456, CDMX",
      responder: "Ambulancia Cruz Roja",
      responseTime: "8 min",
      notes: "Caída detectada - Usuario atendido sin lesiones graves",
    },
    {
      id: 3,
      type: "heart_rate",
      status: "resolved",
      timestamp: "2025-01-03 18:45",
      location: "Parque Chapultepec, CDMX",
      responder: "Paramédicos ERUM",
      responseTime: "6 min",
      notes: "Ritmo cardíaco elevado por ejercicio intenso",
    },
    {
      id: 4,
      type: "manual",
      status: "cancelled",
      timestamp: "2025-01-02 22:10",
      location: "Polanco, CDMX",
      responder: null,
      responseTime: null,
      notes: "Cancelada por el usuario antes de respuesta",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "fall":
        return <AlertTriangle className="h-5 w-5" />
      case "heart_rate":
        return <Heart className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  const getAlertLabel = (type: string) => {
    switch (type) {
      case "fall":
        return "Caída Detectada"
      case "heart_rate":
        return "Ritmo Cardíaco Anormal"
      default:
        return "Alerta Manual"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resuelta
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <span className="text-xl font-bold">ShieldTech</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Historial de Alertas</h1>
          <p className="text-muted-foreground">Revisa todas tus alertas pasadas y su estado de resolución</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            Todas
          </Button>
          <Button variant="outline" size="sm">
            Resueltas
          </Button>
          <Button variant="outline" size="sm">
            Canceladas
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alertas</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <p className="text-2xl font-bold">6 min</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resueltas</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{getAlertLabel(alert.type)}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(alert.status)}
              </div>

              <div className="space-y-3 ml-13">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>{alert.location}</span>
                </div>

                {alert.responder && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Respondió:</strong> {alert.responder}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Tiempo de respuesta:</strong> {alert.responseTime}
                      </span>
                    </div>
                  </>
                )}

                {alert.notes && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{alert.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

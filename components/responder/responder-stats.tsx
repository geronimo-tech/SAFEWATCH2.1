import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

export function ResponderStats() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Estadísticas de Hoy</CardTitle>
          <CardDescription>Tu actividad de respuesta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm text-muted-foreground">Alertas Activas</span>
            </div>
            <span className="text-2xl font-bold text-foreground">2</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">En Proceso</span>
            </div>
            <span className="text-2xl font-bold text-foreground">1</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Resueltas</span>
            </div>
            <span className="text-2xl font-bold text-foreground">5</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-card-foreground">Estado del Servicio</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
              <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-primary font-medium">En Línea</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

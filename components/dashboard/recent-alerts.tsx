import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface RecentAlertsProps {
  userId: string
}

export function RecentAlerts({ userId }: RecentAlertsProps) {
  // TODO: Fetch actual alerts from database
  const alerts: any[] = []

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Alertas Recientes</CardTitle>
        <CardDescription>Historial de tus alertas de emergencia</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No tienes alertas recientes</p>
            <p className="text-xs text-muted-foreground mt-2">Tus alertas de emergencia aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4">{/* Alert items will be rendered here */}</div>
        )}
      </CardContent>
    </Card>
  )
}

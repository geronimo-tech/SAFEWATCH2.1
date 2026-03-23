import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ResponderDashboardHeader } from "@/components/responder/responder-dashboard-header"
import { ActiveAlertsMap } from "@/components/responder/active-alerts-map"
import { AlertsList } from "@/components/responder/alerts-list"
import { ResponderStats } from "@/components/responder/responder-stats"

export default async function ResponderDashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user_type !== "responder") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <ResponderDashboardHeader user={session} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Centro de Respuesta</h1>
          <p className="text-muted-foreground">Monitoreo de alertas de emergencia en tiempo real</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ActiveAlertsMap />
            <AlertsList />
          </div>

          <div className="space-y-6">
            <ResponderStats />
          </div>
        </div>
      </div>
    </div>
  )
}

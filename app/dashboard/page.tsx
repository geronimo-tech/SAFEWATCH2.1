import { getSession } from "@/lib/auth"
import { redirect } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { MedicalInfoCard } from "@/components/dashboard/medical-info-card"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { SafetyMapCard } from "@/components/map/safety-map-card"
import { MedicalInfoCardClient } from "@/components/dashboard/medical-info-card-client"
import { HealthStatusCard } from "@/components/dashboard/health-status-card"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user_type === "responder") {
    redirect("/responder/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido, {session.full_name}</h1>
          <p className="text-muted-foreground">Tu centro de seguridad personal</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <RecentAlerts userId={session.id} />
            <SafetyMapCard />
          </div>

          <div className="space-y-6">
            <HealthStatusCard />
            <MedicalInfoCardClient />
          </div>
        </div>
      </div>
    </div>
  )
}

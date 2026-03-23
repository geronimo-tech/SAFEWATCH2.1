import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SmartwatchMonitor } from "@/components/smartwatch/smartwatch-monitor"
import { SmartwatchSettings } from "@/components/smartwatch/smartwatch-settings"

export default async function SmartwatchPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user_type !== "citizen") {
    redirect("/responder/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Monitoreo de Smartwatch</h1>
          <p className="text-muted-foreground">Datos en tiempo real de tus sensores de salud y seguridad</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SmartwatchMonitor userId={session.id} />
          </div>

          <div>
            <SmartwatchSettings userId={session.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

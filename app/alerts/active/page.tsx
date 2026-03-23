import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ActiveAlertCard } from "@/components/alerts/active-alert-card"

export default async function ActiveAlertPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session} />

      <div className="container mx-auto px-4 py-8">
        <ActiveAlertCard userId={session.id} />
      </div>
    </div>
  )
}

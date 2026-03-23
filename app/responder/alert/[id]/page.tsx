import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ResponderDashboardHeader } from "@/components/responder/responder-dashboard-header"
import { AlertDetailsCard } from "@/components/responder/alert-details-card"
import { getAlertDetails } from "@/lib/responder"

export default async function AlertDetailsPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user_type !== "responder") {
    redirect("/dashboard")
  }

  const alert = await getAlertDetails(params.id)

  return (
    <div className="min-h-screen bg-background">
      <ResponderDashboardHeader user={session} />

      <div className="container mx-auto px-4 py-8">
        <AlertDetailsCard alert={alert} responderId={session.id} />
      </div>
    </div>
  )
}

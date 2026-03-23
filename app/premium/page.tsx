import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PremiumPlans } from "@/components/premium/premium-plans"

export default async function PremiumPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Planes ShieldTech</h1>
          <p className="text-muted-foreground text-lg">
            Elige el plan que mejor se adapte a tus necesidades de seguridad
          </p>
        </div>

        <PremiumPlans currentPlan="free" />
      </div>
    </div>
  )
}

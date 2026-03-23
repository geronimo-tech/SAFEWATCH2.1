import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TestModePanel } from "@/components/test-mode/test-mode-panel"

export default async function TestModePage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Modo de Prueba</h1>
          <p className="text-muted-foreground">
            Practica el envío de alertas sin notificar a tus contactos de emergencia
          </p>
        </div>

        <TestModePanel userId={session.id} />
      </div>
    </div>
  )
}

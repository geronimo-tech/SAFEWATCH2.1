import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { VoiceActivationPanel } from "@/components/voice/voice-activation-panel"

export default async function VoiceActivationPage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Activación por Voz</h1>
          <p className="text-muted-foreground">
            Configura comandos de voz para activar alertas de emergencia sin tocar tu dispositivo
          </p>
        </div>

        <VoiceActivationPanel userId={session.id} />
      </div>
    </div>
  )
}

import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ResponderProfileForm } from "@/components/responder/responder-profile-form"
import { Shield } from "lucide-react"
import Link from "next/link"

export default async function ResponderSetupPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user_type !== "responder") {
    redirect("/profile/setup")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">SafeGuard</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Configurar Perfil de Servicio de Emergencia</h1>
          <p className="text-muted-foreground">
            Completa tu información para comenzar a recibir alertas de emergencia en tu área de servicio.
          </p>
        </div>

        <ResponderProfileForm userId={session.id} />
      </div>
    </div>
  )
}

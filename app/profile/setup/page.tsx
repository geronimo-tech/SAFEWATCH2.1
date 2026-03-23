import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MedicalProfileForm } from "@/components/profile/medical-profile-form"
import { Shield } from "lucide-react"
import Link from "next/link"

export default async function ProfileSetupPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user_type !== "citizen") {
    redirect("/responder/setup")
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Configurar Perfil Médico</h1>
          <p className="text-muted-foreground">
            Esta información es crucial para los servicios de emergencia. Será accesible solo en caso de alerta.
          </p>
        </div>

        <MedicalProfileForm userId={session.id} />
      </div>
    </div>
  )
}

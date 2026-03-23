import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { redirect } from 'next/navigation'
import { getSession } from "@/lib/auth"

export default async function LoginPage() {
  const session = await getSession()
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 justify-center">
            <Logo size={48} />
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
          <p className="text-muted-foreground">Accede a tu cuenta de seguridad personal</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

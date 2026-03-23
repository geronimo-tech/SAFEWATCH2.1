import { RegisterForm } from "@/components/auth/register-form"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 justify-center">
            <Logo size={48} />
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Crear Cuenta</h1>
          <p className="text-muted-foreground">Regístrate como usuario del sistema</p>
        </div>

        <RegisterForm userType="citizen" />

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

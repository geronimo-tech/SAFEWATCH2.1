import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Logo size={40} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>

        <Card className="p-8 bg-card border-border">
          <h1 className="text-3xl font-bold text-card-foreground mb-6">
            Carta de Declaración de Derechos de Propiedad Intelectual
          </h1>

          <div className="space-y-6 text-muted-foreground">
            <p>
              El equipo desarrollador de la aplicación móvil de seguridad personal con compatibilidad en smartwatch
              manifiesta lo siguiente:
            </p>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Originalidad del proyecto</h2>
              <p>
                La aplicación constituye un desarrollo tecnológico original e innovador que integra funciones de
                seguridad personal y conectividad con dispositivos inteligentes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Propiedad intelectual</h2>
              <p>
                Los derechos de autor, diseño y código fuente corresponden al equipo creador, en apego a la Ley de la
                Propiedad Industrial (México, 2018).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Restricciones de uso</h2>
              <p>
                Queda prohibida la reproducción, modificación o distribución del software sin autorización expresa por
                escrito del titular.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Registro futuro</h2>
              <p>
                En caso de destinar la aplicación a fines comerciales, se realizarán los trámites correspondientes de
                registro de marca y patente de software ante el Instituto Mexicano de la Propiedad Industrial (IMPI).
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-border bg-accent/10 -mx-8 -mb-8 px-8 py-6 rounded-b-lg">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Marca Registrada</h3>
              <p className="text-sm">
                <strong>ShieldTech™</strong> es una marca registrada. Todos los derechos reservados © 2025
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

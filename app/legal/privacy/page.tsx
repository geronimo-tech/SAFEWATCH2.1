import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function PrivacyPage() {
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
            Aviso de Privacidad y Protección de Datos Personales
          </h1>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-sm">
              En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares
              (México, 2010), el equipo desarrollador de la aplicación móvil de seguridad personal con compatibilidad en
              smartwatch informa lo siguiente:
            </p>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Finalidad del tratamiento de datos</h2>
              <p>
                Los datos personales recabados (nombre, teléfono, ubicación en tiempo real, contactos de emergencia)
                serán utilizados exclusivamente para las funciones de seguridad ofrecidas por la aplicación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Transferencia de datos</h2>
              <p>
                La información no será compartida con terceros, salvo que exista una obligación legal o una emergencia
                en la que la vida del usuario esté en riesgo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">
                Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
              </h2>
              <p>
                El usuario podrá ejercer estos derechos solicitando la modificación o eliminación de sus datos en
                cualquier momento dentro de la aplicación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Medidas de seguridad</h2>
              <p>
                Se aplicarán protocolos de encriptación, autenticación y almacenamiento seguro para proteger la
                información personal.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm">
                <strong>Última actualización:</strong> Enero 2025
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function DisclaimerPage() {
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
          <h1 className="text-3xl font-bold text-card-foreground mb-6">Aviso Legal y Limitación de Responsabilidad</h1>

          <div className="space-y-6 text-muted-foreground">
            <p>
              La aplicación de seguridad personal es una herramienta de apoyo tecnológico que busca brindar asistencia
              preventiva en situaciones de riesgo.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Alcance</h2>
              <p>
                La aplicación no sustituye la intervención de las autoridades ni garantiza la eliminación total de
                riesgos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Limitación de responsabilidad</h2>
              <p className="mb-3">
                El equipo desarrollador no se hace responsable de daños, pérdidas o incidentes derivados de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Uso indebido de la aplicación</li>
                <li>Fallas técnicas en el dispositivo móvil o smartwatch</li>
                <li>Ausencia de conexión a internet o cobertura de red</li>
                <li>Información incompleta o errónea proporcionada por el usuario</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-card-foreground mb-3">Responsabilidad del usuario</h2>
              <p>
                El usuario se compromete a utilizar la aplicación de manera adecuada y mantener actualizada su versión
                para garantizar un correcto funcionamiento.
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

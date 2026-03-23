import { Shield, Heart, Flame, Droplet, AlertTriangle, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function EmergencyGuidePage() {
  const emergencyTypes = [
    {
      icon: Heart,
      title: "Emergencia Médica",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      steps: [
        "Mantén la calma y evalúa la situación",
        "Activa la alerta SOS en tu smartwatch o app",
        "Si es posible, llama al 911",
        "No muevas a la persona lesionada a menos que haya peligro inmediato",
        "Proporciona primeros auxilios básicos si sabes cómo hacerlo",
        "Espera a los servicios de emergencia",
      ],
    },
    {
      icon: Shield,
      title: "Situación de Peligro",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      steps: [
        "Prioriza tu seguridad personal",
        "Activa la alerta silenciosa si es posible",
        "Aléjate del peligro si puedes hacerlo de forma segura",
        "Busca un lugar público con gente",
        "No confrontes al agresor",
        "Mantén tu teléfono accesible",
      ],
    },
    {
      icon: Flame,
      title: "Incendio",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      steps: [
        "Activa la alarma de incendios si hay una disponible",
        "Evacúa el edificio inmediatamente",
        "No uses elevadores, usa las escaleras",
        "Mantente agachado si hay humo",
        "Toca las puertas antes de abrirlas",
        "Llama a los bomberos (911) una vez que estés seguro",
      ],
    },
    {
      icon: Droplet,
      title: "Desastre Natural",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      steps: [
        "Sigue las instrucciones de las autoridades locales",
        "Activa tu alerta de emergencia",
        "Busca refugio seguro",
        "Ten a mano tu kit de emergencia",
        "Mantente informado a través de radio o TV",
        "No salgas hasta que sea seguro",
      ],
    },
  ]

  const emergencyNumbers = [
    { service: "Emergencias Generales", number: "911" },
    { service: "Cruz Roja", number: "065" },
    { service: "Bomberos", number: "068" },
    { service: "Protección Civil", number: "5683-2222" },
    { service: "Locatel", number: "5658-1111" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <span className="text-xl font-bold">ShieldTech</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Volver al Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Guía de Emergencias</h1>
          <p className="text-muted-foreground">Instrucciones paso a paso para diferentes tipos de emergencias</p>
        </div>

        {/* Emergency Alert Card */}
        <Card className="p-6 mb-8 bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">En caso de emergencia inmediata</h3>
              <p className="text-sm mb-4">
                Si estás en peligro inmediato, activa tu alerta SOS presionando el botón de emergencia en tu smartwatch
                o en la app. Los servicios de emergencia serán notificados automáticamente con tu ubicación.
              </p>
              <Link href="/dashboard">
                <Button variant="destructive">
                  <Shield className="mr-2 h-4 w-4" />
                  Activar Alerta SOS
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Emergency Types */}
        <div className="space-y-6 mb-8">
          {emergencyTypes.map((emergency, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 rounded-full ${emergency.bgColor} flex items-center justify-center`}>
                  <emergency.icon className={`h-6 w-6 ${emergency.color}`} />
                </div>
                <h2 className="text-xl font-semibold">{emergency.title}</h2>
              </div>

              <div className="ml-15">
                <h3 className="font-medium mb-3">Pasos a seguir:</h3>
                <ol className="space-y-2">
                  {emergency.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                        {stepIndex + 1}
                      </span>
                      <span className="text-sm pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          ))}
        </div>

        {/* Emergency Numbers */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Números de Emergencia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyNumbers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">{item.service}</span>
                <a href={`tel:${item.number}`} className="text-primary font-bold text-lg hover:underline">
                  {item.number}
                </a>
              </div>
            ))}
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Consejos Generales de Seguridad</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mantén tu perfil médico actualizado en todo momento</li>
                <li>• Asegúrate de que tus contactos de emergencia estén informados</li>
                <li>• Practica cómo activar la alerta SOS rápidamente</li>
                <li>• Mantén tu smartwatch cargado y funcionando correctamente</li>
                <li>• Revisa periódicamente que tu ubicación esté activada</li>
                <li>• Familiarízate con las salidas de emergencia en lugares que frecuentas</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

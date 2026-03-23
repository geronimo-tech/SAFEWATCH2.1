import { Shield, Plus, Phone, Mail, User, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function EmergencyContactsPage() {
  // Mock data - in production this would come from the database
  const contacts = [
    {
      id: 1,
      name: "María González",
      relationship: "Esposa",
      phone: "+52 55 1234 5678",
      email: "maria@example.com",
      priority: 1,
    },
    {
      id: 2,
      name: "Dr. Roberto Martínez",
      relationship: "Médico de cabecera",
      phone: "+52 55 8765 4321",
      email: "dr.martinez@hospital.com",
      priority: 2,
    },
    {
      id: 3,
      name: "Juan Pérez",
      relationship: "Hermano",
      phone: "+52 55 9876 5432",
      email: "juan@example.com",
      priority: 3,
    },
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contactos de Emergencia</h1>
          <p className="text-muted-foreground">Gestiona las personas que serán notificadas en caso de emergencia</p>
        </div>

        {/* Add Contact Button */}
        <div className="mb-6">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Contacto de Emergencia
          </Button>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Prioridad {contact.priority}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 ml-15">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">¿Por qué son importantes los contactos de emergencia?</h3>
              <p className="text-sm text-muted-foreground">
                Cuando actives una alerta, estos contactos serán notificados automáticamente con tu ubicación y estado.
                Asegúrate de mantener esta información actualizada y de que tus contactos sepan que están registrados
                como contactos de emergencia.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

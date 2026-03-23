import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Edit } from "lucide-react"
import Link from "next/link"
import { getMedicalProfile } from "@/lib/medical"

interface MedicalInfoCardProps {
  userId: string
}

export async function MedicalInfoCard({ userId }: MedicalInfoCardProps) {
  const profile = await getMedicalProfile(userId)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Perfil Médico</CardTitle>
          </div>
          <Link href="/profile/setup">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Información de emergencia</CardDescription>
      </CardHeader>
      <CardContent>
        {profile ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Tipo de Sangre</p>
              <p className="text-sm font-medium text-foreground">{profile.blood_type || "No especificado"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">IMSS</p>
              <p className="text-sm font-medium text-foreground">{profile.imss_number || "No especificado"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alergias</p>
              <p className="text-sm font-medium text-foreground">{profile.allergies || "Ninguna registrada"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contacto de Emergencia</p>
              <p className="text-sm font-medium text-foreground">
                {profile.emergency_contact_name || "No especificado"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">No has configurado tu perfil médico</p>
            <Link href="/profile/setup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Configurar Ahora</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

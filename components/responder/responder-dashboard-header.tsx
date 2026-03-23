"use client"

import { Bell, User, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"

interface ResponderDashboardHeaderProps {
  user: {
    full_name: string
    email: string
  }
}

export function ResponderDashboardHeader({ user }: ResponderDashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/responder/dashboard" className="flex items-center gap-3">
          <Logo size={32} showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">
                <span className="text-[#0B7A9F]">SHIELD</span>
                <span className="text-[#7B3F9E]">TECH</span>
              </span>
            </div>
            <Badge variant="outline" className="text-xs border-primary text-primary mt-0.5">
              Servicio de Emergencia
            </Badge>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/responder/profile">Mi Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/responder/settings">Configuración</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  await logout()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

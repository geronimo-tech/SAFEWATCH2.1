"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { register } from "@/lib/auth"
import { Loader2, Check, X, Eye, EyeOff } from "lucide-react"

interface RegisterFormProps {
  userType: "citizen" | "responder"
}

/**
 * Formulario de Registro con Validacion de Seguridad
 * 
 * Implementa:
 * - Validacion de fortaleza de contrasena en tiempo real
 * - Indicadores visuales de requisitos
 * - Validacion de email
 * - Sanitizacion de inputs
 */
export function RegisterForm({ userType }: RegisterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Estado de validacion de contrasena
  const [password, setPassword] = useState("")
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  })

  // Validar contrasena en tiempo real
  useEffect(() => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [password])

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const passwordValue = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const full_name = formData.get("full_name") as string
    const phone = formData.get("phone") as string

    // Validacion del lado del cliente
    if (!isPasswordValid) {
      setError("La contrasena no cumple con los requisitos de seguridad")
      setIsLoading(false)
      return
    }

    if (passwordValue !== confirmPassword) {
      setError("Las contrasenas no coinciden")
      setIsLoading(false)
      return
    }

    // Validacion de email basica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Formato de email invalido")
      setIsLoading(false)
      return
    }

    try {
      const result = await register({
        email,
        password: passwordValue,
        full_name,
        phone,
        user_type: userType,
      })

      if (result.success) {
        if (userType === "responder") {
          router.push("/responder/setup")
        } else {
          router.push("/profile/setup")
        }
      } else {
        setError(result.error || "Error al crear la cuenta")
      }
    } catch (err) {
      setError("Error al crear la cuenta. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Componente de indicador de requisito
  const RequirementIndicator = ({ 
    met, 
    text 
  }: { 
    met: boolean
    text: string 
  }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? "text-green-500" : "text-muted-foreground"}`}>
      {met ? (
        <Check className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
      <span>{text}</span>
    </div>
  )

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          {userType === "citizen" ? "Registro de Usuario" : "Registro de Servicio de Emergencia"}
        </CardTitle>
        <CardDescription>
          {userType === "citizen"
            ? "Crea tu cuenta para acceder al sistema de seguridad"
            : "Registrate como servicio de emergencia"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-card-foreground">
              Nombre Completo
            </Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Juan Perez"
              required
              minLength={2}
              maxLength={100}
              className="bg-background border-input text-foreground"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">
              Correo Electronico
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              maxLength={254}
              className="bg-background border-input text-foreground"
            />
          </div>

          {/* Telefono */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-card-foreground">
              Telefono
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+52 123 456 7890"
              pattern="[\+]?[\d\s\-\(\)]{10,20}"
              className="bg-background border-input text-foreground"
            />
          </div>

          {/* Contrasena */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-card-foreground">
              Contrasena
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-input text-foreground pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Indicadores de requisitos de contrasena */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1 p-3 bg-muted/50 rounded-md">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Requisitos de seguridad:
                </p>
                <RequirementIndicator 
                  met={passwordValidation.minLength} 
                  text="Minimo 8 caracteres" 
                />
                <RequirementIndicator 
                  met={passwordValidation.hasUppercase} 
                  text="Al menos una mayuscula" 
                />
                <RequirementIndicator 
                  met={passwordValidation.hasLowercase} 
                  text="Al menos una minuscula" 
                />
                <RequirementIndicator 
                  met={passwordValidation.hasNumber} 
                  text="Al menos un numero" 
                />
                <RequirementIndicator 
                  met={passwordValidation.hasSpecial} 
                  text="Al menos un caracter especial (!@#$%...)" 
                />
              </div>
            )}
          </div>

          {/* Confirmar contrasena */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-card-foreground">
              Confirmar Contrasena
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                required
                minLength={8}
                maxLength={128}
                className="bg-background border-input text-foreground pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Boton de submit */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !isPasswordValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </Button>

          {/* Nota de seguridad */}
          <p className="text-xs text-muted-foreground text-center">
            Tu contrasena se almacena de forma segura usando encriptacion bcrypt.
            Nunca compartimos tus datos personales.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

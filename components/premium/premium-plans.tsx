"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, Crown, Zap } from "lucide-react"

interface PremiumPlansProps {
  currentPlan: "free" | "basic" | "premium" | "enterprise"
}

export function PremiumPlans({ currentPlan }: PremiumPlansProps) {
  const plans = [
    {
      id: "free",
      name: "Gratuito",
      price: "$0",
      period: "siempre",
      icon: Shield,
      description: "Funciones básicas de seguridad personal",
      features: [
        "Botón de alerta de emergencia",
        "Compartir ubicación en tiempo real",
        "Hasta 3 contactos de emergencia",
        "Historial de alertas (30 días)",
        "Integración básica con smartwatch",
      ],
      cta: "Plan Actual",
      variant: "outline" as const,
    },
    {
      id: "basic",
      name: "Básico",
      price: "$99",
      period: "MXN/mes",
      icon: Zap,
      description: "Protección mejorada con funciones avanzadas",
      features: [
        "Todo lo del plan Gratuito",
        "Contactos de emergencia ilimitados",
        "Activación por voz",
        "Modo oculto (alerta discreta)",
        "Notificaciones SMS y Email",
        "Historial completo de alertas",
        "Soporte prioritario 24/7",
      ],
      cta: "Actualizar a Básico",
      variant: "default" as const,
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$299",
      period: "MXN/mes",
      icon: Crown,
      description: "Monitoreo profesional y máxima protección",
      features: [
        "Todo lo del plan Básico",
        "Monitoreo 24/7 por centro de seguridad",
        "Llamada automática a emergencias (911)",
        "Grabación de audio durante alertas",
        "Grabación de video durante alertas",
        "Mapa de rutas seguras",
        "Análisis de zonas de riesgo",
        "Integración con aseguradoras",
        "Reporte mensual de seguridad",
      ],
      cta: "Actualizar a Premium",
      variant: "default" as const,
    },
    {
      id: "enterprise",
      name: "Empresarial",
      price: "Personalizado",
      period: "",
      icon: Shield,
      description: "Soluciones para empresas y organizaciones",
      features: [
        "Todo lo del plan Premium",
        "Gestión de múltiples usuarios",
        "Dashboard administrativo",
        "API de integración",
        "Capacitación personalizada",
        "Soporte dedicado",
        "SLA garantizado",
        "Reportes personalizados",
      ],
      cta: "Contactar Ventas",
      variant: "outline" as const,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => {
        const Icon = plan.icon
        const isCurrent = currentPlan === plan.id

        return (
          <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
            {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Más Popular</Badge>}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle>{plan.name}</CardTitle>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground ml-1">/{plan.period}</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.variant} disabled={isCurrent}>
                {isCurrent ? "Plan Actual" : plan.cta}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

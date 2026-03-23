"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Battery, TrendingUp, AlertTriangle, Wind, Thermometer, Moon, Zap, Droplets, Brain } from 'lucide-react'
import { saveSmartwatchData } from "@/lib/alerts"

interface SmartwatchMonitorProps {
  userId: string
}

export function SmartwatchMonitor({ userId }: SmartwatchMonitorProps) {
  const [heartRate, setHeartRate] = useState(72)
  const [hrv, setHrv] = useState(45) // Heart Rate Variability
  const [bloodOxygen, setBloodOxygen] = useState(98)
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 })
  const [stressLevel, setStressLevel] = useState(35)
  const [steps, setSteps] = useState(3847)
  const [calories, setCalories] = useState(1250)
  const [distance, setDistance] = useState(2.8) // km
  const [sleepData, setSleepData] = useState({ light: 180, deep: 90, rem: 75 }) // minutes
  const [respiratoryRate, setRespiratoryRate] = useState(16)
  const [bodyTemp, setBodyTemp] = useState(36.6)
  const [battery, setBattery] = useState(85)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [fallDetected, setFallDetected] = useState(false)

  // Simulate smartwatch data updates
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      const newHeartRate = Math.max(60, Math.min(100, heartRate + (Math.random() - 0.5) * 10))
      setHeartRate(Math.round(newHeartRate))
      
      setHrv(Math.max(20, Math.min(80, hrv + (Math.random() - 0.5) * 5)))
      setBloodOxygen(Math.max(95, Math.min(100, bloodOxygen + (Math.random() - 0.5) * 2)))
      setBloodPressure({
        systolic: Math.max(110, Math.min(140, bloodPressure.systolic + (Math.random() - 0.5) * 3)),
        diastolic: Math.max(70, Math.min(90, bloodPressure.diastolic + (Math.random() - 0.5) * 2))
      })
      setStressLevel(Math.max(0, Math.min(100, stressLevel + (Math.random() - 0.5) * 10)))
      setSteps((prev) => prev + Math.floor(Math.random() * 8))
      setCalories((prev) => prev + Math.floor(Math.random() * 3))
      setDistance((prev) => prev + Math.random() * 0.01)
      setRespiratoryRate(Math.max(12, Math.min(20, respiratoryRate + (Math.random() - 0.5) * 2)))
      setBodyTemp(Math.max(36, Math.min(38, bodyTemp + (Math.random() - 0.5) * 0.2)))
      setBattery((prev) => Math.max(0, prev - 0.1))

      // Save comprehensive data to backend
      saveSmartwatchData(userId, {
        heart_rate: Math.round(newHeartRate),
        heart_rate_variability: Math.round(hrv),
        blood_oxygen: Math.round(bloodOxygen),
        blood_pressure_systolic: Math.round(bloodPressure.systolic),
        blood_pressure_diastolic: Math.round(bloodPressure.diastolic),
        stress_level: Math.round(stressLevel),
        steps: steps,
        calories: calories,
        distance: Math.round(distance * 1000), // convert to meters
        respiratory_rate: Math.round(respiratoryRate),
        body_temperature: parseFloat(bodyTemp.toFixed(1)),
        battery_level: Math.round(battery),
        movement_intensity: "moderate",
        fall_detected: false,
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isMonitoring, heartRate, hrv, bloodOxygen, bloodPressure, stressLevel, steps, calories, distance, respiratoryRate, bodyTemp, battery, userId])

  const simulateFall = async () => {
    setFallDetected(true)
    await saveSmartwatchData(userId, {
      heart_rate: heartRate,
      heart_rate_variability: hrv,
      blood_oxygen: bloodOxygen,
      blood_pressure_systolic: bloodPressure.systolic,
      blood_pressure_diastolic: bloodPressure.diastolic,
      stress_level: stressLevel,
      steps: steps,
      calories: calories,
      distance: Math.round(distance * 1000),
      respiratory_rate: respiratoryRate,
      body_temperature: bodyTemp,
      battery_level: battery,
      movement_intensity: "sudden",
      fall_detected: true,
    })

    setTimeout(() => setFallDetected(false), 5000)
  }

  const simulateHighHeartRate = async () => {
    const highRate = 165
    setHeartRate(highRate)
    await saveSmartwatchData(userId, {
      heart_rate: highRate,
      heart_rate_variability: hrv,
      blood_oxygen: bloodOxygen,
      blood_pressure_systolic: bloodPressure.systolic,
      blood_pressure_diastolic: bloodPressure.diastolic,
      stress_level: stressLevel,
      steps: steps,
      calories: calories,
      distance: Math.round(distance * 1000),
      respiratory_rate: respiratoryRate,
      body_temperature: bodyTemp,
      battery_level: battery,
      movement_intensity: "high",
      fall_detected: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isMonitoring ? "bg-primary animate-pulse" : "bg-muted"}`} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isMonitoring ? "Smartwatch Conectado" : "Smartwatch Desconectado"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isMonitoring ? "Monitoreo activo" : "Inicia el monitoreo para comenzar"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={
                isMonitoring
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
            >
              {isMonitoring ? "Detener" : "Iniciar Monitoreo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Heart Rate */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm text-card-foreground">Ritmo Cardíaco</CardTitle>
              </div>
              {heartRate > 120 && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{heartRate}</span>
                <span className="text-sm text-muted-foreground">BPM</span>
              </div>
              <Progress value={(heartRate / 200) * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate Variability */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">HRV</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{Math.round(hrv)}</span>
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
              <Badge variant={hrv > 40 ? "default" : "destructive"} className="text-xs">
                {hrv > 40 ? "Óptimo" : "Bajo"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Blood Oxygen */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm text-card-foreground">Oxígeno (SpO₂)</CardTitle>
              </div>
              {bloodOxygen < 95 && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{Math.round(bloodOxygen)}</span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <Progress value={bloodOxygen} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Blood Pressure */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Presión Arterial</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)}
                </span>
                <span className="text-xs text-muted-foreground">mmHg</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {bloodPressure.systolic < 130 ? "Normal" : "Elevada"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Nivel de Estrés</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{Math.round(stressLevel)}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <Progress value={stressLevel} className="h-1.5" />
              <Badge 
                variant={stressLevel < 40 ? "default" : stressLevel < 70 ? "secondary" : "destructive"}
                className="text-xs"
              >
                {stressLevel < 40 ? "Relajado" : stressLevel < 70 ? "Moderado" : "Alto"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Respiratory Rate */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Respiración</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{Math.round(respiratoryRate)}</span>
                <span className="text-sm text-muted-foreground">rpm</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {respiratoryRate >= 12 && respiratoryRate <= 20 ? "Normal" : "Fuera de rango"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Body Temperature */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm text-card-foreground">Temperatura</CardTitle>
              </div>
              {(bodyTemp > 37.5 || bodyTemp < 36) && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{bodyTemp.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">°C</span>
              </div>
              <Badge 
                variant={bodyTemp >= 36 && bodyTemp <= 37.5 ? "default" : "destructive"}
                className="text-xs"
              >
                {bodyTemp >= 36 && bodyTemp <= 37.5 ? "Normal" : "Anormal"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Pasos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{steps.toLocaleString()}</span>
              </div>
              <Progress value={(steps / 10000) * 100} className="h-1.5" />
              <p className="text-xs text-muted-foreground">Meta: 10,000</p>
            </div>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Calorías</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{calories}</span>
                <span className="text-sm text-muted-foreground">kcal</span>
              </div>
              <Progress value={(calories / 2000) * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Distance */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Distancia</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{distance.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">km</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Battery */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Batería</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{Math.round(battery)}</span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <Progress value={battery} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Movement/Fall Detection */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm text-card-foreground">Movimiento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fallDetected ? (
                <div className="text-center py-2">
                  <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-1" />
                  <p className="text-xs font-medium text-destructive">Caída Detectada</p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <Activity className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium text-foreground">Normal</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Data Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <CardTitle className="text-card-foreground">Análisis de Sueño</CardTitle>
          </div>
          <CardDescription>Última noche: {(sleepData.light + sleepData.deep + sleepData.rem) / 60} horas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Sueño Ligero</p>
              <p className="text-2xl font-bold text-foreground">{sleepData.light}</p>
              <p className="text-xs text-muted-foreground">minutos</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Sueño Profundo</p>
              <p className="text-2xl font-bold text-foreground">{sleepData.deep}</p>
              <p className="text-xs text-muted-foreground">minutos</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Sueño REM</p>
              <p className="text-2xl font-bold text-foreground">{sleepData.rem}</p>
              <p className="text-xs text-muted-foreground">minutos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Controls */}
      <Card className="bg-card border-border border-primary/20">
        <CardHeader>
          <CardTitle className="text-card-foreground">Simulación de Eventos</CardTitle>
          <CardDescription>Prueba las alertas automáticas del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              onClick={simulateFall}
              disabled={!isMonitoring}
              variant="outline"
              className="border-border text-foreground bg-transparent"
            >
              Simular Caída
            </Button>
            <Button
              onClick={simulateHighHeartRate}
              disabled={!isMonitoring}
              variant="outline"
              className="border-border text-foreground bg-transparent"
            >
              Simular Ritmo Alto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

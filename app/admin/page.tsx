"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Database, 
  Server, 
  HardDrive, 
  Users, 
  FileJson, 
  RefreshCw, 
  Download, 
  Plus,
  Trash2,
  Edit,
  Eye,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Shield,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  Copy,
  Save
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface DatabaseStats {
  dbName: string
  collections: number
  documents: number
  dataSize: string
  storageSize: string
  indexes: number
}

interface Collection {
  name: string
  type: string
  documents: number
}

interface ConnectionStatus {
  connected: boolean
  latency: number
  serverInfo?: {
    host: string
    version: string
    uptime: number
    connections: object
  }
  error?: string
}

interface BackupStats {
  total: number
  completed: number
  failed: number
  lastBackup: string | null
}

interface Backup {
  _id: string
  backup_type: string
  status: string
  collections_included: string[]
  documents_count: number
  size_bytes: number
  started_at: string
  completed_at: string | null
}

interface AuditLog {
  _id: string
  action: string
  resource_type: string
  timestamp: string
  success: boolean
  user_role: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)
  const [backupStats, setBackupStats] = useState<BackupStats | null>(null)
  const [backups, setBackups] = useState<Backup[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [documents, setDocuments] = useState<object[]>([])
  const [loading, setLoading] = useState(true)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newDocument, setNewDocument] = useState("")
  const [editDocument, setEditDocument] = useState<{ id: string; data: string } | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Simular datos para demo (en producción, llamar a las APIs reales)
      setStats({
        dbName: "safewatch",
        collections: 10,
        documents: 1247,
        dataSize: "2.4 MB",
        storageSize: "4.8 MB",
        indexes: 23
      })

      setCollections([
        { name: "users", type: "collection", documents: 156 },
        { name: "alerts", type: "collection", documents: 423 },
        { name: "medical_profiles", type: "collection", documents: 142 },
        { name: "responders", type: "collection", documents: 28 },
        { name: "safety_points", type: "collection", documents: 89 },
        { name: "smartwatch_data", type: "collection", documents: 312 },
        { name: "emergency_contacts", type: "collection", documents: 67 },
        { name: "audit_logs", type: "collection", documents: 1834 },
        { name: "backups", type: "collection", documents: 12 },
        { name: "sessions", type: "collection", documents: 34 }
      ])

      setConnectionStatus({
        connected: true,
        latency: 45,
        serverInfo: {
          host: "cluster0-shard-00-00.mongodb.net:27017",
          version: "7.0.4",
          uptime: 864000,
          connections: { current: 12, available: 488 }
        }
      })

      setBackupStats({
        total: 12,
        completed: 11,
        failed: 1,
        lastBackup: new Date().toISOString()
      })

      setBackups([
        {
          _id: "1",
          backup_type: "full",
          status: "completed",
          collections_included: ["users", "alerts", "medical_profiles"],
          documents_count: 721,
          size_bytes: 1048576,
          started_at: new Date(Date.now() - 3600000).toISOString(),
          completed_at: new Date(Date.now() - 3500000).toISOString()
        },
        {
          _id: "2",
          backup_type: "incremental",
          status: "completed",
          collections_included: ["alerts", "audit_logs"],
          documents_count: 234,
          size_bytes: 524288,
          started_at: new Date(Date.now() - 86400000).toISOString(),
          completed_at: new Date(Date.now() - 86300000).toISOString()
        }
      ])

      setAuditLogs([
        { _id: "1", action: "INSERT", resource_type: "users", timestamp: new Date().toISOString(), success: true, user_role: "admin" },
        { _id: "2", action: "UPDATE", resource_type: "alerts", timestamp: new Date(Date.now() - 60000).toISOString(), success: true, user_role: "admin" },
        { _id: "3", action: "DELETE", resource_type: "sessions", timestamp: new Date(Date.now() - 120000).toISOString(), success: true, user_role: "admin" },
        { _id: "4", action: "BACKUP_CREATED", resource_type: "backup", timestamp: new Date(Date.now() - 3600000).toISOString(), success: true, user_role: "admin" }
      ])

    } catch {
      console.error("Error loading dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    setIsBackingUp(true)
    try {
      // Simular creación de backup
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newBackup: Backup = {
        _id: Date.now().toString(),
        backup_type: "full",
        status: "completed",
        collections_included: collections.map(c => c.name),
        documents_count: stats?.documents || 0,
        size_bytes: 1572864,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      }
      
      setBackups([newBackup, ...backups])
      setBackupStats(prev => prev ? { ...prev, total: prev.total + 1, completed: prev.completed + 1, lastBackup: new Date().toISOString() } : null)
      
      alert("Backup creado exitosamente")
    } catch {
      alert("Error al crear backup")
    } finally {
      setIsBackingUp(false)
    }
  }

  const loadCollectionDocuments = async (collectionName: string) => {
    setSelectedCollection(collectionName)
    // Simular carga de documentos
    const sampleDocs = Array.from({ length: 5 }, (_, i) => ({
      _id: `doc_${i + 1}`,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
      sample_field: `Valor ${i + 1}`,
      status: i % 2 === 0 ? "active" : "inactive"
    }))
    setDocuments(sampleDocs)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}d ${hours}h`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando panel de administracion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">Panel de Administracion</h1>
                  <p className="text-sm text-muted-foreground">Gestion de Base de Datos MongoDB</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={connectionStatus?.connected ? "default" : "destructive"} className="gap-1">
                {connectionStatus?.connected ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Conectado
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Desconectado
                  </>
                )}
              </Badge>
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <Database className="h-4 w-4" />
              Colecciones
            </TabsTrigger>
            <TabsTrigger value="backups" className="gap-2">
              <HardDrive className="h-4 w-4" />
              Respaldos
            </TabsTrigger>
            <TabsTrigger value="indexes" className="gap-2">
              <FileJson className="h-4 w-4" />
              Indices
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Clock className="h-4 w-4" />
              Auditoria
            </TabsTrigger>
          </TabsList>

          {/* Vista General */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Base de Datos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{stats?.dbName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">MongoDB Atlas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Colecciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{stats?.collections}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stats?.indexes} indices activos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{stats?.documents.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stats?.dataSize} de datos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Almacenamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{stats?.storageSize}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Espacio utilizado</p>
                </CardContent>
              </Card>
            </div>

            {/* Connection Info & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Estado del Servidor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Host</p>
                      <p className="font-mono text-sm truncate">{connectionStatus?.serverInfo?.host}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Version MongoDB</p>
                      <p className="font-mono text-sm">{connectionStatus?.serverInfo?.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Latencia</p>
                      <p className="font-mono text-sm">{connectionStatus?.latency}ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="font-mono text-sm">{formatUptime(connectionStatus?.serverInfo?.uptime || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Acciones Rapidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={handleCreateBackup} disabled={isBackingUp}>
                    {isBackingUp ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {isBackingUp ? "Creando respaldo..." : "Crear Respaldo Completo"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Coleccion
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileJson className="h-4 w-4 mr-2" />
                    Importar Datos JSON
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Ultimas operaciones en la base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.resource_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">{log.user_role}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.timestamp).toLocaleString("es-MX")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colecciones */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar coleccion..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Coleccion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Coleccion</DialogTitle>
                    <DialogDescription>
                      Ingresa el nombre para la nueva coleccion
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Coleccion</Label>
                      <Input placeholder="mi_coleccion" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Crear Coleccion</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections
                .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((collection) => (
                <Card key={collection.name} className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">{collection.name}</CardTitle>
                      <Badge variant="secondary">{collection.documents} docs</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo: {collection.type}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => loadCollectionDocuments(collection.name)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Document Viewer */}
            {selectedCollection && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Documentos de: {selectedCollection}</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Documento
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Agregar Documento</DialogTitle>
                          <DialogDescription>
                            Ingresa el documento en formato JSON
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Textarea 
                            placeholder='{"campo": "valor"}'
                            className="font-mono h-64"
                            value={newDocument}
                            onChange={(e) => setNewDocument(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Documento
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg font-mono text-sm">
                        <div className="flex items-start justify-between">
                          <pre className="text-xs overflow-auto flex-1">
                            {JSON.stringify(doc, null, 2)}
                          </pre>
                          <div className="flex gap-1 ml-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Respaldos */}
          <TabsContent value="backups" className="space-y-6">
            {/* Backup Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Backups</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">{backupStats?.total}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold text-green-500">{backupStats?.completed}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fallidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold text-red-500">{backupStats?.failed}</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ultimo Backup</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium">
                    {backupStats?.lastBackup 
                      ? new Date(backupStats.lastBackup).toLocaleString("es-MX")
                      : "Nunca"}
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Create Backup */}
            <Card>
              <CardHeader>
                <CardTitle>Crear Nuevo Respaldo</CardTitle>
                <CardDescription>Genera un respaldo de la base de datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Respaldo</Label>
                    <Select defaultValue="full">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Completo (Todas las colecciones)</SelectItem>
                        <SelectItem value="incremental">Incremental</SelectItem>
                        <SelectItem value="selective">Selectivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Formato de Salida</Label>
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="bson">BSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreateBackup} disabled={isBackingUp}>
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creando respaldo...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Iniciar Respaldo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Backup History */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Respaldos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backups.map((backup) => (
                    <div key={backup._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {backup.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : backup.status === "failed" ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                        )}
                        <div>
                          <p className="font-medium">
                            Backup {backup.backup_type === "full" ? "Completo" : "Incremental"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {backup.documents_count} documentos | {formatBytes(backup.size_bytes)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(backup.started_at).toLocaleString("es-MX")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={backup.status === "completed" ? "default" : "destructive"}>
                          {backup.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Indices */}
          <TabsContent value="indexes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Indices de la Base de Datos</CardTitle>
                <CardDescription>
                  Gestiona los indices para optimizar el rendimiento de las consultas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collections.map((collection) => (
                    <div key={collection.name} className="border rounded-lg">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4" />
                          <span className="font-medium">{collection.name}</span>
                        </div>
                        <Badge variant="outline">3 indices</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crear Nuevo Indice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Coleccion</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar coleccion" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Indice</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Simple (1 campo)</SelectItem>
                        <SelectItem value="compound">Compuesto</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="geospatial">Geoespacial (2dsphere)</SelectItem>
                        <SelectItem value="ttl">TTL (Expiracion)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Campos (JSON)</Label>
                  <Textarea placeholder='{"email": 1}' className="font-mono" />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Indice
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auditoria */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Auditoria</CardTitle>
                <CardDescription>
                  Historial completo de operaciones en la base de datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              log.action === "INSERT" ? "default" :
                              log.action === "UPDATE" ? "secondary" :
                              log.action === "DELETE" ? "destructive" : "outline"
                            }>
                              {log.action}
                            </Badge>
                            <span className="font-medium">{log.resource_type}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString("es-MX")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{log.user_role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

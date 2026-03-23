# Base de Datos MongoDB - SafeWatch 2.0

## Documentacion Tecnica de la Base de Datos NoSQL

**Fecha:** Marzo 2026  
**Version:** 2.0  
**Motor de BD:** MongoDB 7.0+  
**Hosting:** MongoDB Atlas (Nube)

---

## Tabla de Contenidos

1. [Configuracion de MongoDB Atlas](#1-configuracion-de-mongodb-atlas)
2. [Modelo de Datos NoSQL](#2-modelo-de-datos-nosql)
3. [Esquemas de Colecciones](#3-esquemas-de-colecciones)
4. [Indices del Sistema](#4-indices-del-sistema)
5. [Archivos JSON de Carga Inicial](#5-archivos-json-de-carga-inicial)
6. [Procedimiento de Respaldos](#6-procedimiento-de-respaldos)
7. [Panel de Administracion](#7-panel-de-administracion)
8. [Calidad de Datos](#8-calidad-de-datos)

---

## 1. Configuracion de MongoDB Atlas

### 1.1 Conexion a la Nube

```typescript
// lib/mongodb.ts - Configuracion de conexion

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'safewatch';

const options: MongoClientOptions = {
  maxPoolSize: 10,        // Maximo de conexiones en el pool
  minPoolSize: 2,         // Minimo de conexiones activas
  maxIdleTimeMS: 30000,   // Tiempo max de inactividad
  connectTimeoutMS: 10000, // Timeout de conexion
  socketTimeoutMS: 45000,  // Timeout de operaciones
  retryWrites: true,       // Reintentar escrituras
  retryReads: true,        // Reintentar lecturas
  w: 'majority',           // Confirmacion de mayoria
};
```

### 1.2 Variables de Entorno Requeridas

```env
# .env.local
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/safewatch?retryWrites=true&w=majority
MONGODB_DB_NAME=safewatch
```

### 1.3 Patron de Conexion Singleton

```typescript
// Reutilizar conexiones en ambiente serverless
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  const client = new MongoClient(MONGODB_URI, options);
  await client.connect();
  
  cachedClient = client;
  cachedDb = client.db(MONGODB_DB_NAME);
  
  return { client, db: cachedDb };
}
```

---

## 2. Modelo de Datos NoSQL

### 2.1 Diagrama de Colecciones

```
safewatch (Base de Datos)
│
├── users                    # Usuarios del sistema
│   └── _id, email, password_hash, role, preferences...
│
├── medical_profiles         # Perfiles medicos (1:1 con users)
│   └── _id, user_id, blood_type, allergies, medications...
│
├── alerts                   # Alertas de emergencia
│   └── _id, user_id, alert_type, status, location (GeoJSON)...
│
├── responders               # Respondedores de emergencia
│   └── _id, user_id, responder_type, certifications...
│
├── safety_points            # Puntos de seguridad (hospitales, policia)
│   └── _id, name, type, location (GeoJSON), contact...
│
├── smartwatch_data          # Datos de smartwatch (TTL 90 dias)
│   └── _id, user_id, device_id, readings, device_alerts...
│
├── emergency_contacts       # Contactos de emergencia
│   └── _id, user_id, full_name, phone, priority...
│
├── audit_logs               # Logs de auditoria (TTL 180 dias)
│   └── _id, action, resource_type, timestamp, success...
│
├── backups                  # Registro de respaldos
│   └── _id, backup_type, status, started_at...
│
└── sessions                 # Sesiones activas (TTL automatico)
    └── _id, user_id, token_hash, expires_at...
```

### 2.2 Relaciones Entre Documentos

| Coleccion A | Relacion | Coleccion B | Campo de Referencia |
|-------------|----------|-------------|---------------------|
| users | 1:1 | medical_profiles | user_id |
| users | 1:1 | responders | user_id |
| users | 1:N | alerts | user_id |
| users | 1:N | emergency_contacts | user_id |
| users | 1:N | smartwatch_data | user_id |
| users | 1:N | sessions | user_id |
| alerts | N:1 | responders | responder_id |

---

## 3. Esquemas de Colecciones

### 3.1 Coleccion: users

```typescript
interface UserDocument {
  _id: ObjectId;
  
  // Informacion personal
  email: string;              // Unico, indexado
  password_hash: string;      // bcrypt hash (nunca texto plano)
  full_name: string;
  phone: string;              // Unico, indexado
  
  // Rol y estado
  role: 'citizen' | 'responder' | 'admin';
  is_verified: boolean;
  is_active: boolean;
  
  // Configuracion
  preferences: {
    notifications_enabled: boolean;
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'system';
    emergency_voice_enabled: boolean;
  };
  
  // Suscripcion
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'family';
    expires_at: Date | null;
    features: string[];
  };
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  login_attempts: number;
  locked_until: Date | null;
}

// Validador de esquema MongoDB
{
  $jsonSchema: {
    bsonType: 'object',
    required: ['email', 'password_hash', 'full_name', 'phone', 'role'],
    properties: {
      email: { 
        bsonType: 'string', 
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' 
      },
      password_hash: { bsonType: 'string', minLength: 60 },
      role: { enum: ['citizen', 'responder', 'admin'] }
    }
  }
}
```

### 3.2 Coleccion: alerts

```typescript
interface AlertDocument {
  _id: ObjectId;
  user_id: ObjectId;           // Referencia a users
  
  // Tipo y prioridad
  alert_type: 'medical' | 'security' | 'accident' | 'fire' | 'natural_disaster' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'dispatched' | 'in_progress' | 'resolved' | 'cancelled' | 'false_alarm';
  
  // Ubicacion (GeoJSON para consultas espaciales)
  location: {
    type: 'Point';
    coordinates: [number, number];  // [longitud, latitud]
    address: string;
    reference_points: string;
  };
  
  // Detalles
  description: string;
  voice_transcript: string | null;
  
  // Datos de smartwatch
  smartwatch_data: {
    heart_rate: number | null;
    fall_detected: boolean;
    device_id: string | null;
  } | null;
  
  // Respuesta
  responder_id: ObjectId | null;
  response_time_seconds: number | null;
  resolution_notes: string | null;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  resolved_at: Date | null;
}
```

### 3.3 Coleccion: safety_points

```typescript
interface SafetyPointDocument {
  _id: ObjectId;
  
  name: string;
  type: 'hospital' | 'police_station' | 'fire_station' | 'shelter' | 'safe_zone' | 'pharmacy' | 'other';
  
  // Ubicacion GeoJSON
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    neighborhood: string;
    municipality: string;
  };
  
  // Contacto
  contact: {
    phone: string;
    emergency_phone: string | null;
    email: string | null;
    website: string | null;
  };
  
  // Horario
  schedule: {
    is_24_hours: boolean;
    hours: Array<{
      day: string;
      open: string;
      close: string;
    }>;
  };
  
  services: string[];
  is_active: boolean;
  verified_by_admin: boolean;
  
  created_at: Date;
  updated_at: Date;
}
```

---

## 4. Indices del Sistema

### 4.1 Indices por Coleccion

```typescript
// scripts/setup-mongodb.ts

const INDEXES_CONFIG = {
  // USERS - Indices para autenticacion y busqueda rapida
  users: [
    { key: { email: 1 }, options: { unique: true, name: 'idx_users_email' } },
    { key: { phone: 1 }, options: { unique: true, name: 'idx_users_phone' } },
    { key: { role: 1, is_active: 1 }, options: { name: 'idx_users_role_active' } },
    { key: { created_at: -1 }, options: { name: 'idx_users_created' } }
  ],
  
  // ALERTS - Indices para consultas de emergencia en tiempo real
  alerts: [
    { key: { user_id: 1, created_at: -1 }, options: { name: 'idx_alerts_user_date' } },
    { key: { status: 1, priority: -1 }, options: { name: 'idx_alerts_status_priority' } },
    { key: { responder_id: 1, status: 1 }, options: { name: 'idx_alerts_responder_status' } },
    { key: { 'location': '2dsphere' }, options: { name: 'idx_alerts_location_geo' } },
    { key: { created_at: -1 }, options: { name: 'idx_alerts_created' } }
  ],
  
  // SAFETY_POINTS - Indice geoespacial para buscar puntos cercanos
  safety_points: [
    { key: { 'location': '2dsphere' }, options: { name: 'idx_safety_location_geo' } },
    { key: { type: 1, is_active: 1 }, options: { name: 'idx_safety_type_active' } },
    { key: { name: 'text', 'location.address': 'text' }, options: { name: 'idx_safety_text_search' } }
  ],
  
  // SMARTWATCH_DATA - Indice TTL para eliminar datos antiguos automaticamente
  smartwatch_data: [
    { key: { user_id: 1, created_at: -1 }, options: { name: 'idx_smartwatch_user_date' } },
    { key: { created_at: 1 }, options: { name: 'idx_smartwatch_ttl', expireAfterSeconds: 7776000 } } // 90 dias
  ],
  
  // AUDIT_LOGS - Indice TTL para logs de auditoria
  audit_logs: [
    { key: { timestamp: -1 }, options: { name: 'idx_audit_timestamp' } },
    { key: { timestamp: 1 }, options: { name: 'idx_audit_ttl', expireAfterSeconds: 15552000 } } // 180 dias
  ],
  
  // SESSIONS - Indice TTL para sesiones expiradas
  sessions: [
    { key: { token_hash: 1 }, options: { unique: true, name: 'idx_sessions_token' } },
    { key: { expires_at: 1 }, options: { name: 'idx_sessions_ttl', expireAfterSeconds: 0 } }
  ]
};
```

### 4.2 Tipos de Indices Utilizados

| Tipo de Indice | Uso | Colecciones |
|----------------|-----|-------------|
| Single Field | Busquedas por un campo | users, alerts |
| Compound | Busquedas por multiples campos | alerts, responders |
| Unique | Garantizar unicidad | users (email, phone) |
| 2dsphere | Consultas geoespaciales | alerts, safety_points, responders |
| Text | Busqueda de texto | safety_points |
| TTL | Eliminacion automatica | smartwatch_data, audit_logs, sessions |

### 4.3 Consultas Geoespaciales

```typescript
// Buscar alertas cercanas a una ubicacion
const nearbyAlerts = await db.collection('alerts').find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [-103.3496, 20.6866]  // [lng, lat]
      },
      $maxDistance: 5000  // 5km
    }
  },
  status: 'pending'
}).toArray();

// Buscar hospitales mas cercanos
const nearestHospitals = await db.collection('safety_points').find({
  location: {
    $nearSphere: {
      $geometry: { type: 'Point', coordinates: [-103.35, 20.68] },
      $maxDistance: 10000  // 10km
    }
  },
  type: 'hospital',
  is_active: true
}).limit(5).toArray();
```

---

## 5. Archivos JSON de Carga Inicial

### 5.1 Ubicacion de Archivos

```
/data/seed/
├── users.json              # Usuarios iniciales (admin, responder, ciudadanos)
├── safety_points.json      # Puntos de seguridad en Guadalajara
├── responders.json         # Respondedores de emergencia
└── medical_profiles.json   # Perfiles medicos de ejemplo
```

### 5.2 Estructura de Archivos

```json
// data/seed/users.json
{
  "collection": "users",
  "description": "Usuarios iniciales del sistema SAFEWATCH",
  "data": [
    {
      "email": "admin@safewatch.mx",
      "password_hash": "$2a$12$...",  // Hash bcrypt
      "full_name": "Administrador SAFEWATCH",
      "phone": "+52 33 1234 5678",
      "role": "admin",
      "is_verified": true,
      "is_active": true,
      "preferences": {
        "notifications_enabled": true,
        "language": "es",
        "theme": "dark"
      },
      "created_at": { "$date": "2024-01-01T00:00:00.000Z" }
    }
  ]
}
```

### 5.3 Script de Carga

```bash
# Ejecutar script de carga
npx ts-node scripts/seed-database.ts
```

---

## 6. Procedimiento de Respaldos

### 6.1 API de Respaldos

```typescript
// app/api/admin/backup/route.ts

// POST - Crear nuevo backup
export async function POST(request: NextRequest) {
  const { backup_type = 'full', collections = [] } = await request.json();
  
  // 1. Determinar colecciones a respaldar
  let collectionsToBackup: string[];
  if (backup_type === 'full') {
    const allCollections = await db.listCollections().toArray();
    collectionsToBackup = allCollections.map(c => c.name);
  } else {
    collectionsToBackup = collections;
  }
  
  // 2. Crear registro de backup
  const backupRecord = {
    backup_type,
    status: 'in_progress',
    collections_included: collectionsToBackup,
    started_at: new Date(),
    initiated_type: 'manual'
  };
  
  // 3. Realizar backup de cada coleccion
  const backupData = {};
  for (const collectionName of collectionsToBackup) {
    const documents = await db.collection(collectionName).find({}).toArray();
    backupData[collectionName] = documents;
  }
  
  // 4. Guardar en almacenamiento (S3, Azure, GCS)
  // En produccion: await uploadToCloudStorage(backupData)
  
  // 5. Actualizar registro como completado
  await db.collection('backups').updateOne(
    { _id: backupId },
    { $set: { status: 'completed', completed_at: new Date() } }
  );
}
```

### 6.2 Tipos de Respaldo

| Tipo | Descripcion | Frecuencia Recomendada |
|------|-------------|------------------------|
| **full** | Todas las colecciones | Semanal |
| **incremental** | Solo cambios desde ultimo backup | Diario |
| **selective** | Colecciones especificas | Segun necesidad |

### 6.3 Desde el Panel de Administrador

1. Navegar a `/admin`
2. Seleccionar la pestana "Respaldos"
3. Configurar tipo de respaldo
4. Hacer clic en "Iniciar Respaldo"
5. Monitorear progreso en tiempo real

---

## 7. Panel de Administracion

### 7.1 Acceso

**URL:** `/admin`

**Funcionalidades:**
- Vista general de estadisticas de la BD
- Gestion de colecciones (ver, crear, eliminar)
- Visualizador de documentos con edicion JSON
- Sistema de respaldos
- Gestion de indices
- Logs de auditoria

### 7.2 Capturas de Pantalla

El panel incluye:
- **Dashboard:** Estadisticas generales, estado de conexion, acciones rapidas
- **Colecciones:** Lista de colecciones con conteo de documentos
- **Respaldos:** Crear, listar y eliminar backups
- **Indices:** Ver y crear indices
- **Auditoria:** Historial de operaciones

---

## 8. Calidad de Datos

### 8.1 Validacion de Esquemas

```typescript
// Validador de MongoDB para usuarios
{
  $jsonSchema: {
    bsonType: 'object',
    required: ['email', 'password_hash', 'full_name', 'phone', 'role'],
    properties: {
      email: { 
        bsonType: 'string', 
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      },
      password_hash: { 
        bsonType: 'string', 
        minLength: 60  // bcrypt hash length
      },
      role: { 
        enum: ['citizen', 'responder', 'admin'] 
      }
    }
  }
}
```

### 8.2 Integridad Referencial

```typescript
// Verificar antes de insertar alerta
async function createAlert(alertData: AlertInput) {
  // Verificar que el usuario existe
  const user = await db.collection('users').findOne({ _id: alertData.user_id });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Verificar que el responder existe (si se asigna)
  if (alertData.responder_id) {
    const responder = await db.collection('responders').findOne({ _id: alertData.responder_id });
    if (!responder) {
      throw new Error('Respondedor no encontrado');
    }
  }
  
  return await db.collection('alerts').insertOne(alertData);
}
```

### 8.3 Limpieza Automatica (TTL)

| Coleccion | TTL | Razon |
|-----------|-----|-------|
| smartwatch_data | 90 dias | Datos historicos de salud |
| audit_logs | 180 dias | Cumplimiento normativo |
| sessions | Automatico | Sesiones expiradas |

### 8.4 Auditoria de Cambios

Todas las operaciones CRUD se registran en `audit_logs`:

```typescript
// Registrar en auditoria
await db.collection('audit_logs').insertOne({
  user_id: session.userId,
  user_role: session.userType,
  action: 'UPDATE',
  resource_type: 'medical_profiles',
  resource_id: profileId,
  previous_value: oldDocument,
  new_value: newDocument,
  timestamp: new Date(),
  success: true
});
```

---

## Resumen

La base de datos MongoDB Atlas de SafeWatch 2.0 esta disenada para:

1. **Escalabilidad:** Pool de conexiones, indices optimizados
2. **Seguridad:** Validacion de esquemas, hash de contrasenas
3. **Rendimiento:** Indices geoespaciales para consultas en tiempo real
4. **Mantenimiento:** TTL automatico, backups programables
5. **Auditoria:** Registro completo de operaciones

**Credenciales de administrador por defecto:**
- Email: `admin@safewatch.mx`
- Password: `Admin123!`

(Cambiar inmediatamente en produccion)

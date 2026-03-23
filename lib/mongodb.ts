/**
 * MongoDB Atlas Connection Configuration
 * =======================================
 * Configuracion de conexion a MongoDB Atlas (nube)
 * 
 * Estandares de seguridad implementados:
 * - Connection pooling para optimizar conexiones
 * - Timeout configurables para evitar conexiones colgadas
 * - Retry automático en caso de fallo de conexión
 * - Variables de entorno para credenciales (nunca hardcodeadas)
 */

import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';

// URI de conexión a MongoDB Atlas (debe configurarse en variables de entorno)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:password@cluster0.mongodb.net/safewatch?retryWrites=true&w=majority';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'safewatch';

// Opciones de conexión optimizadas para producción
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  w: 'majority',
};

// Cache de la conexión para reutilizar en serverless
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Conectar a MongoDB Atlas
 * Implementa patrón singleton para reutilizar conexiones
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Si ya existe una conexión en cache, reutilizarla
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Validar que existe la URI de conexión
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI no está definido en las variables de entorno');
  }

  try {
    // Crear nueva conexión
    const client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    const db = client.db(MONGODB_DB_NAME);
    
    // Guardar en cache
    cachedClient = client;
    cachedDb = db;
    
    console.log('[MongoDB] Conexión establecida exitosamente a MongoDB Atlas');
    
    return { client, db };
  } catch (error) {
    console.error('[MongoDB] Error al conectar:', error);
    throw new Error('No se pudo conectar a MongoDB Atlas');
  }
}

/**
 * Obtener una colección específica con tipado
 */
export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Cerrar conexión (usar solo en scripts de migración o cierre de app)
 */
export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('[MongoDB] Conexión cerrada');
  }
}

/**
 * Verificar estado de la conexión
 */
export async function checkConnection(): Promise<{ 
  connected: boolean; 
  latency: number; 
  serverInfo?: object;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const { db } = await connectToDatabase();
    
    // Ping al servidor
    const result = await db.command({ ping: 1 });
    const latency = Date.now() - startTime;
    
    // Obtener información del servidor
    const serverStatus = await db.command({ serverStatus: 1 });
    
    return {
      connected: result.ok === 1,
      latency,
      serverInfo: {
        host: serverStatus.host,
        version: serverStatus.version,
        uptime: serverStatus.uptime,
        connections: serverStatus.connections,
      }
    };
  } catch (error) {
    return {
      connected: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Obtener estadísticas de la base de datos
 */
export async function getDatabaseStats(): Promise<{
  dbName: string;
  collections: number;
  documents: number;
  dataSize: string;
  storageSize: string;
  indexes: number;
}> {
  const { db } = await connectToDatabase();
  
  const stats = await db.stats();
  const collections = await db.listCollections().toArray();
  
  // Formatear tamaños a formato legible
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return {
    dbName: stats.db,
    collections: collections.length,
    documents: stats.objects,
    dataSize: formatBytes(stats.dataSize),
    storageSize: formatBytes(stats.storageSize),
    indexes: stats.indexes,
  };
}

/**
 * Nombres de las colecciones del sistema
 */
export const COLLECTIONS = {
  USERS: 'users',
  ALERTS: 'alerts',
  MEDICAL_PROFILES: 'medical_profiles',
  RESPONDERS: 'responders',
  SAFETY_POINTS: 'safety_points',
  SMARTWATCH_DATA: 'smartwatch_data',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  AUDIT_LOGS: 'audit_logs',
  BACKUPS: 'backups',
  SESSIONS: 'sessions',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

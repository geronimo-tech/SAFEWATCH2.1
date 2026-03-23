/**
 * Script de Configuracion de MongoDB
 * ===================================
 * 
 * Este script configura la base de datos MongoDB con:
 * - Creacion de colecciones
 * - Creacion de indices necesarios
 * - Carga de datos iniciales
 * - Configuracion de validacion de esquemas
 * 
 * Ejecutar con: npx ts-node scripts/setup-mongodb.ts
 */

import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:password@cluster0.mongodb.net/safewatch?retryWrites=true&w=majority';
const DB_NAME = 'safewatch';

// Definicion de colecciones con sus validadores de esquema
const COLLECTIONS_CONFIG = {
  users: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['email', 'password_hash', 'full_name', 'phone', 'role'],
        properties: {
          email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
          password_hash: { bsonType: 'string', minLength: 60 },
          full_name: { bsonType: 'string', minLength: 2, maxLength: 100 },
          phone: { bsonType: 'string' },
          role: { enum: ['citizen', 'responder', 'admin'] },
          is_verified: { bsonType: 'bool' },
          is_active: { bsonType: 'bool' }
        }
      }
    },
    validationLevel: 'moderate',
    validationAction: 'warn'
  },
  
  medical_profiles: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['user_id', 'blood_type'],
        properties: {
          user_id: { bsonType: 'objectId' },
          blood_type: { enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'] },
          date_of_birth: { bsonType: 'date' },
          gender: { enum: ['male', 'female', 'other', 'prefer_not_say'] }
        }
      }
    },
    validationLevel: 'moderate',
    validationAction: 'warn'
  },
  
  alerts: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['user_id', 'alert_type', 'priority', 'status', 'location'],
        properties: {
          user_id: { bsonType: 'objectId' },
          alert_type: { enum: ['medical', 'security', 'accident', 'fire', 'natural_disaster', 'other'] },
          priority: { enum: ['low', 'medium', 'high', 'critical'] },
          status: { enum: ['pending', 'dispatched', 'in_progress', 'resolved', 'cancelled', 'false_alarm'] }
        }
      }
    },
    validationLevel: 'moderate',
    validationAction: 'warn'
  },
  
  responders: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['user_id', 'responder_type', 'badge_number', 'organization'],
        properties: {
          user_id: { bsonType: 'objectId' },
          responder_type: { enum: ['paramedic', 'police', 'firefighter', 'civil_protection', 'volunteer'] },
          badge_number: { bsonType: 'string' },
          organization: { bsonType: 'string' }
        }
      }
    },
    validationLevel: 'moderate',
    validationAction: 'warn'
  },
  
  safety_points: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'type', 'location'],
        properties: {
          name: { bsonType: 'string', minLength: 2 },
          type: { enum: ['hospital', 'police_station', 'fire_station', 'shelter', 'safe_zone', 'pharmacy', 'other'] }
        }
      }
    },
    validationLevel: 'moderate',
    validationAction: 'warn'
  },
  
  smartwatch_data: {},
  emergency_contacts: {},
  audit_logs: {},
  backups: {},
  sessions: {}
};

// Definicion de indices
const INDEXES_CONFIG = {
  users: [
    { key: { email: 1 }, options: { unique: true, name: 'idx_users_email' } },
    { key: { phone: 1 }, options: { unique: true, name: 'idx_users_phone' } },
    { key: { role: 1, is_active: 1 }, options: { name: 'idx_users_role_active' } },
    { key: { created_at: -1 }, options: { name: 'idx_users_created' } }
  ],
  
  medical_profiles: [
    { key: { user_id: 1 }, options: { unique: true, name: 'idx_medical_user' } },
    { key: { blood_type: 1 }, options: { name: 'idx_medical_blood_type' } }
  ],
  
  alerts: [
    { key: { user_id: 1, created_at: -1 }, options: { name: 'idx_alerts_user_date' } },
    { key: { status: 1, priority: -1 }, options: { name: 'idx_alerts_status_priority' } },
    { key: { responder_id: 1, status: 1 }, options: { name: 'idx_alerts_responder_status' } },
    { key: { 'location': '2dsphere' }, options: { name: 'idx_alerts_location_geo' } },
    { key: { created_at: -1 }, options: { name: 'idx_alerts_created' } },
    { key: { alert_type: 1, status: 1 }, options: { name: 'idx_alerts_type_status' } }
  ],
  
  responders: [
    { key: { user_id: 1 }, options: { unique: true, name: 'idx_responders_user' } },
    { key: { is_on_duty: 1, responder_type: 1 }, options: { name: 'idx_responders_duty_type' } },
    { key: { 'current_location': '2dsphere' }, options: { name: 'idx_responders_location_geo', sparse: true } },
    { key: { badge_number: 1 }, options: { unique: true, name: 'idx_responders_badge' } }
  ],
  
  safety_points: [
    { key: { 'location': '2dsphere' }, options: { name: 'idx_safety_location_geo' } },
    { key: { type: 1, is_active: 1 }, options: { name: 'idx_safety_type_active' } },
    { key: { 'location.municipality': 1 }, options: { name: 'idx_safety_municipality' } },
    { key: { name: 'text', 'location.address': 'text' }, options: { name: 'idx_safety_text_search' } }
  ],
  
  smartwatch_data: [
    { key: { user_id: 1, created_at: -1 }, options: { name: 'idx_smartwatch_user_date' } },
    { key: { device_id: 1 }, options: { name: 'idx_smartwatch_device' } },
    { key: { created_at: 1 }, options: { name: 'idx_smartwatch_ttl', expireAfterSeconds: 7776000 } } // 90 dias TTL
  ],
  
  emergency_contacts: [
    { key: { user_id: 1, priority: 1 }, options: { name: 'idx_contacts_user_priority' } }
  ],
  
  audit_logs: [
    { key: { timestamp: -1 }, options: { name: 'idx_audit_timestamp' } },
    { key: { user_id: 1, timestamp: -1 }, options: { name: 'idx_audit_user_timestamp' } },
    { key: { action: 1, resource_type: 1 }, options: { name: 'idx_audit_action_resource' } },
    { key: { timestamp: 1 }, options: { name: 'idx_audit_ttl', expireAfterSeconds: 15552000 } } // 180 dias TTL
  ],
  
  backups: [
    { key: { started_at: -1 }, options: { name: 'idx_backups_started' } },
    { key: { status: 1 }, options: { name: 'idx_backups_status' } }
  ],
  
  sessions: [
    { key: { user_id: 1 }, options: { name: 'idx_sessions_user' } },
    { key: { token_hash: 1 }, options: { unique: true, name: 'idx_sessions_token' } },
    { key: { expires_at: 1 }, options: { name: 'idx_sessions_ttl', expireAfterSeconds: 0 } } // TTL automatico
  ]
};

async function setupDatabase() {
  console.log('Iniciando configuracion de MongoDB...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB Atlas');
    
    const db = client.db(DB_NAME);
    
    // 1. Crear colecciones con validadores
    console.log('\n--- Creando colecciones ---');
    for (const [collectionName, config] of Object.entries(COLLECTIONS_CONFIG)) {
      try {
        const existingCollections = await db.listCollections({ name: collectionName }).toArray();
        
        if (existingCollections.length === 0) {
          await db.createCollection(collectionName, config);
          console.log(`Coleccion creada: ${collectionName}`);
        } else {
          // Actualizar validador si ya existe
          if (Object.keys(config).length > 0) {
            await db.command({ collMod: collectionName, ...config });
          }
          console.log(`Coleccion existente actualizada: ${collectionName}`);
        }
      } catch (error) {
        console.error(`Error con coleccion ${collectionName}:`, error);
      }
    }
    
    // 2. Crear indices
    console.log('\n--- Creando indices ---');
    for (const [collectionName, indexes] of Object.entries(INDEXES_CONFIG)) {
      console.log(`\nIndices para ${collectionName}:`);
      
      for (const indexDef of indexes) {
        try {
          const result = await db.collection(collectionName).createIndex(indexDef.key, indexDef.options);
          console.log(`  Indice creado: ${result}`);
        } catch (error: any) {
          if (error.code === 85 || error.code === 86) {
            console.log(`  Indice ya existe: ${indexDef.options.name}`);
          } else {
            console.error(`  Error creando indice:`, error.message);
          }
        }
      }
    }
    
    // 3. Verificar indices creados
    console.log('\n--- Verificando indices ---');
    for (const collectionName of Object.keys(INDEXES_CONFIG)) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`${collectionName}: ${indexes.length} indices`);
    }
    
    // 4. Mostrar estadisticas
    console.log('\n--- Estadisticas de la BD ---');
    const stats = await db.stats();
    console.log(`Base de datos: ${stats.db}`);
    console.log(`Colecciones: ${stats.collections}`);
    console.log(`Documentos totales: ${stats.objects}`);
    console.log(`Tamano de datos: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Indices: ${stats.indexes}`);
    
    console.log('\n Configuracion completada exitosamente!');
    
  } catch (error) {
    console.error('Error durante la configuracion:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\nConexion cerrada.');
  }
}

// Ejecutar si es llamado directamente
setupDatabase().catch(console.error);

export { setupDatabase, COLLECTIONS_CONFIG, INDEXES_CONFIG };

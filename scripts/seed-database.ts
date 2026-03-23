/**
 * Script de Carga de Datos Iniciales
 * ===================================
 * 
 * Carga los datos de prueba desde los archivos JSON
 * 
 * Ejecutar con: npx ts-node scripts/seed-database.ts
 */

import { MongoClient, ObjectId } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:password@cluster0.mongodb.net/safewatch?retryWrites=true&w=majority';
const DB_NAME = 'safewatch';

// Archivos de datos a cargar
const SEED_FILES = [
  'users.json',
  'safety_points.json',
  'responders.json',
  'medical_profiles.json'
];

function parseJsonDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'object') {
    if (obj.$date) {
      return new Date(obj.$date);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(parseJsonDates);
    }
    
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = parseJsonDates(obj[key]);
    }
    return result;
  }
  
  return obj;
}

async function seedDatabase() {
  console.log('Iniciando carga de datos iniciales...\n');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB Atlas');
    
    const db = client.db(DB_NAME);
    const seedDataPath = path.join(process.cwd(), 'data', 'seed');
    
    for (const fileName of SEED_FILES) {
      const filePath = path.join(seedDataPath, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`Archivo no encontrado: ${fileName}, saltando...`);
        continue;
      }
      
      console.log(`\n--- Procesando ${fileName} ---`);
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const seedData = JSON.parse(fileContent);
      
      const collectionName = seedData.collection;
      const documents = seedData.data.map((doc: any) => parseJsonDates(doc));
      
      // Verificar si ya existen datos
      const existingCount = await db.collection(collectionName).countDocuments();
      
      if (existingCount > 0) {
        console.log(`La coleccion ${collectionName} ya tiene ${existingCount} documentos.`);
        console.log('Saltar? (los datos no se duplicaran)');
        
        // En modo automatico, saltar si ya hay datos
        console.log('Saltando carga para evitar duplicados...');
        continue;
      }
      
      // Insertar documentos
      const result = await db.collection(collectionName).insertMany(documents);
      console.log(`Insertados ${result.insertedCount} documentos en ${collectionName}`);
    }
    
    // Crear documento de admin si no existe
    console.log('\n--- Verificando usuario administrador ---');
    const adminExists = await db.collection('users').findOne({ role: 'admin' });
    
    if (!adminExists) {
      const bcrypt = await import('bcryptjs');
      const adminDoc = {
        email: 'admin@safewatch.mx',
        password_hash: await bcrypt.hash('Admin123!', 12),
        full_name: 'Administrador SAFEWATCH',
        phone: '+52 33 1234 5678',
        role: 'admin',
        is_verified: true,
        is_active: true,
        preferences: {
          notifications_enabled: true,
          language: 'es',
          theme: 'dark',
          emergency_voice_enabled: false
        },
        subscription: {
          plan: 'premium',
          expires_at: null,
          features: ['unlimited_alerts', 'priority_response', 'family_tracking', 'medical_history', 'admin_access']
        },
        created_at: new Date(),
        updated_at: new Date(),
        last_login: null,
        login_attempts: 0,
        locked_until: null
      };
      
      await db.collection('users').insertOne(adminDoc);
      console.log('Usuario administrador creado');
      console.log('Email: admin@safewatch.mx');
      console.log('Password: Admin123!');
    } else {
      console.log('Usuario administrador ya existe');
    }
    
    // Mostrar resumen
    console.log('\n--- Resumen de datos ---');
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`${col.name}: ${count} documentos`);
    }
    
    console.log('\n Carga de datos completada!');
    
  } catch (error) {
    console.error('Error durante la carga de datos:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\nConexion cerrada.');
  }
}

seedDatabase().catch(console.error);

export { seedDatabase };

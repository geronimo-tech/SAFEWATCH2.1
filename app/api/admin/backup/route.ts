/**
 * API de Respaldos (Backups) de Base de Datos
 * ============================================
 * 
 * Endpoints para gestión de respaldos de MongoDB
 * 
 * Funcionalidades:
 * - Crear backup completo o por colección
 * - Listar backups existentes
 * - Restaurar desde backup
 * - Eliminar backups antiguos
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Listar backups o descargar uno específico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    const { db } = await connectToDatabase();
    
    switch (action) {
      case 'list':
        const backups = await db
          .collection(COLLECTIONS.BACKUPS)
          .find({})
          .sort({ started_at: -1 })
          .limit(50)
          .toArray();
          
        return NextResponse.json({ success: true, data: backups });
        
      case 'download':
        const backupId = searchParams.get('id');
        if (!backupId) {
          return NextResponse.json(
            { success: false, error: 'ID de backup no especificado' },
            { status: 400 }
          );
        }
        
        const backup = await db
          .collection(COLLECTIONS.BACKUPS)
          .findOne({ _id: new ObjectId(backupId) });
          
        if (!backup) {
          return NextResponse.json(
            { success: false, error: 'Backup no encontrado' },
            { status: 404 }
          );
        }
        
        // En producción, aquí se descargaría el archivo desde el storage
        return NextResponse.json({
          success: true,
          data: backup,
          message: 'En producción, esto generaría un enlace de descarga',
        });
        
      case 'stats':
        const totalBackups = await db.collection(COLLECTIONS.BACKUPS).countDocuments();
        const completedBackups = await db.collection(COLLECTIONS.BACKUPS).countDocuments({ status: 'completed' });
        const failedBackups = await db.collection(COLLECTIONS.BACKUPS).countDocuments({ status: 'failed' });
        const lastBackup = await db
          .collection(COLLECTIONS.BACKUPS)
          .findOne({ status: 'completed' }, { sort: { completed_at: -1 } });
          
        return NextResponse.json({
          success: true,
          data: {
            total: totalBackups,
            completed: completedBackups,
            failed: failedBackups,
            lastBackup: lastBackup?.completed_at || null,
          },
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Backup API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo backup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { backup_type = 'full', collections = [] } = body;
    
    const { db } = await connectToDatabase();
    
    // Determinar colecciones a respaldar
    let collectionsToBackup: string[];
    if (backup_type === 'full') {
      const allCollections = await db.listCollections().toArray();
      collectionsToBackup = allCollections.map(c => c.name);
    } else {
      collectionsToBackup = collections;
    }
    
    // Crear registro de backup
    const backupRecord = {
      backup_type,
      status: 'in_progress' as const,
      collections_included: collectionsToBackup,
      documents_count: 0,
      size_bytes: 0,
      storage_location: 'mongodb_atlas', // En producción: S3, Azure Blob, etc.
      file_name: `backup_${Date.now()}.json`,
      initiated_by: null,
      initiated_type: 'manual' as const,
      started_at: new Date(),
      completed_at: null,
      error_message: null,
    };
    
    const insertResult = await db.collection(COLLECTIONS.BACKUPS).insertOne(backupRecord);
    const backupId = insertResult.insertedId;
    
    try {
      // Realizar backup de cada colección
      const backupData: Record<string, unknown[]> = {};
      let totalDocuments = 0;
      
      for (const collectionName of collectionsToBackup) {
        const documents = await db.collection(collectionName).find({}).toArray();
        backupData[collectionName] = documents;
        totalDocuments += documents.length;
      }
      
      // Calcular tamaño aproximado
      const jsonString = JSON.stringify(backupData);
      const sizeBytes = Buffer.byteLength(jsonString, 'utf8');
      
      // En producción, aquí se guardaría el archivo en un servicio de almacenamiento
      // Por ejemplo: AWS S3, Azure Blob Storage, Google Cloud Storage
      
      // Actualizar registro de backup como completado
      await db.collection(COLLECTIONS.BACKUPS).updateOne(
        { _id: backupId },
        {
          $set: {
            status: 'completed',
            documents_count: totalDocuments,
            size_bytes: sizeBytes,
            completed_at: new Date(),
          },
        }
      );
      
      // Log de auditoría
      await db.collection(COLLECTIONS.AUDIT_LOGS).insertOne({
        user_id: null,
        user_role: 'admin',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        action: 'BACKUP_CREATED',
        resource_type: 'backup',
        resource_id: backupId.toString(),
        details: {
          backup_type,
          collections: collectionsToBackup,
          documents: totalDocuments,
          size: sizeBytes,
        },
        previous_value: null,
        new_value: null,
        success: true,
        error_message: null,
        timestamp: new Date(),
      });
      
      return NextResponse.json({
        success: true,
        data: {
          backupId: backupId.toString(),
          backup_type,
          collections: collectionsToBackup,
          documents: totalDocuments,
          size: `${(sizeBytes / 1024).toFixed(2)} KB`,
          status: 'completed',
        },
      });
    } catch (backupError) {
      // Marcar backup como fallido
      await db.collection(COLLECTIONS.BACKUPS).updateOne(
        { _id: backupId },
        {
          $set: {
            status: 'failed',
            error_message: backupError instanceof Error ? backupError.message : 'Error desconocido',
            completed_at: new Date(),
          },
        }
      );
      
      throw backupError;
    }
  } catch (error) {
    console.error('[Backup API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear backup' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar backup
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de backup no especificado' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection(COLLECTIONS.BACKUPS).deleteOne({
      _id: new ObjectId(id),
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Backup no encontrado' },
        { status: 404 }
      );
    }
    
    // En producción, también eliminar el archivo del storage
    
    return NextResponse.json({
      success: true,
      message: 'Backup eliminado exitosamente',
    });
  } catch (error) {
    console.error('[Backup API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar backup' },
      { status: 500 }
    );
  }
}

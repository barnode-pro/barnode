#!/usr/bin/env node

/**
 * Sistema di Backup Automatico BarNode
 * Gestisce backup incrementali con rotazione e ripristino sicuro
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';

const BACKUP_DIR = './Backup_Automatico';
const LOG_FILE = path.join(BACKUP_DIR, 'backup.log');
const MAX_BACKUPS = 3;

// File e cartelle da escludere dal backup
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.vscode',
  '.idea',
  '.cache',
  '.DS_Store',
  '.env',
  '.env.*',
  'attached_assets',
  'Backup_Automatico'
];

/**
 * Scrive log con timestamp
 */
function log(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console.log(logEntry.trim());
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  fs.appendFileSync(LOG_FILE, logEntry);
}

/**
 * Genera nome backup con timestamp
 */
function generateBackupName() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `backup_${day}${month}${year}_${hour}${minute}.tar.gz`;
}

/**
 * Calcola checksum di un file
 */
function calculateChecksum(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Ottiene lista backup ordinata per data (più recente prima)
 */
function getBackupList() {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }
  
  return fs.readdirSync(BACKUP_DIR)
    .filter(file => file.startsWith('backup_') && file.endsWith('.tar.gz'))
    .map(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: stats.size,
        created: stats.birthtime
      };
    })
    .sort((a, b) => b.created - a.created);
}

/**
 * Rimuove backup più vecchi mantenendo solo MAX_BACKUPS
 */
function rotateBackups() {
  const backups = getBackupList();
  
  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);
    
    toDelete.forEach(backup => {
      fs.unlinkSync(backup.path);
      log(`Backup rimosso per rotazione: ${backup.name}`);
    });
  }
}

/**
 * Crea backup del progetto
 */
function createBackup() {
  try {
    log('Inizio creazione backup...');
    
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    const backupName = generateBackupName();
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    // Costruisce comando tar con esclusioni
    const excludeArgs = EXCLUDE_PATTERNS
      .map(pattern => `--exclude='${pattern}'`)
      .join(' ');
    
    const command = `tar -czf "${backupPath}" ${excludeArgs} .`;
    
    log(`Esecuzione comando: ${command}`);
    execSync(command, { stdio: 'pipe' });
    
    // Verifica che il file sia stato creato
    if (!fs.existsSync(backupPath)) {
      throw new Error('File backup non creato');
    }
    
    const stats = fs.statSync(backupPath);
    const sizeKB = Math.round(stats.size / 1024);
    const checksum = calculateChecksum(backupPath);
    
    log(`Backup creato: ${backupName}`);
    log(`Dimensione: ${sizeKB} KB`);
    log(`Checksum: ${checksum}`);
    
    // Rotazione backup
    rotateBackups();
    
    log('Backup completato con successo!');
    
    return {
      name: backupName,
      path: backupPath,
      size: sizeKB,
      checksum
    };
    
  } catch (error) {
    log(`ERRORE durante backup: ${error.message}`);
    throw error;
  }
}

/**
 * Mostra lista backup disponibili
 */
function listBackups() {
  const backups = getBackupList();
  
  if (backups.length === 0) {
    console.log('Nessun backup disponibile.');
    return;
  }
  
  console.log('\n📦 Backup disponibili:\n');
  
  backups.forEach((backup, index) => {
    const sizeKB = Math.round(backup.size / 1024);
    const date = backup.created.toLocaleString('it-IT');
    
    console.log(`${index + 1}. ${backup.name}`);
    console.log(`   Data: ${date}`);
    console.log(`   Dimensione: ${sizeKB} KB`);
    console.log('');
  });
  
  console.log('Per ripristinare: npm run restore-confirm <nome-backup>');
}

/**
 * Ripristina backup specificato
 */
function restoreBackup(backupName) {
  try {
    const backups = getBackupList();
    const backup = backups.find(b => b.name === backupName);
    
    if (!backup) {
      throw new Error(`Backup non trovato: ${backupName}`);
    }
    
    log(`Inizio ripristino backup: ${backupName}`);
    
    // Crea backup di sicurezza prima del ripristino
    log('Creazione backup di sicurezza...');
    const safetyBackup = createBackup();
    log(`Backup di sicurezza creato: ${safetyBackup.name}`);
    
    // Verifica integrità backup da ripristinare
    const currentChecksum = calculateChecksum(backup.path);
    log(`Verifica integrità backup: ${currentChecksum}`);
    
    // Estrae backup
    const command = `tar -xzf "${backup.path}" --overwrite`;
    log(`Esecuzione ripristino: ${command}`);
    
    execSync(command, { stdio: 'pipe' });
    
    log(`Ripristino completato: ${backupName}`);
    log('ATTENZIONE: Riavviare l\'applicazione per applicare le modifiche');
    
  } catch (error) {
    log(`ERRORE durante ripristino: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case '--list':
        listBackups();
        break;
        
      case '--restore':
        console.log('\n🔄 Ripristino Backup\n');
        listBackups();
        console.log('Usa: npm run restore-confirm <nome-backup>');
        break;
        
      case '--confirm':
        const backupName = args[1];
        if (!backupName) {
          console.error('Errore: Specificare nome backup');
          console.log('Uso: npm run restore-confirm <nome-backup>');
          process.exit(1);
        }
        restoreBackup(backupName);
        break;
        
      default:
        // Backup normale
        createBackup();
        break;
    }
    
  } catch (error) {
    console.error(`Errore: ${error.message}`);
    process.exit(1);
  }
}

// Esecuzione
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

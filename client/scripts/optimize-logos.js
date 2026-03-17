#!/usr/bin/env node

/**
 * Script para optimizar los logos black.webp y white.webp
 * Genera versiones optimizadas en diferentes tamaños para uso responsivo
 * 
 * Requiere: npm install sharp --save-dev
 * Uso: node scripts/optimize-logos.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intentar usar sharp si está disponible
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error('❌ Error: sharp no está instalado.');
  console.log('📦 Instala sharp ejecutando: npm install sharp --save-dev');
  process.exit(1);
}

const assetsDir = path.join(__dirname, '../public/assets');
const logos = ['black', 'white'];

// Tamaños a generar
const sizes = [
  { width: 150, suffix: '150' },
  { width: 300, suffix: '300' },
  { width: 360, suffix: '360' }
];

async function optimizeLogo(logoName) {
  const inputPath = path.join(assetsDir, `${logoName}.webp`);
  const outputDir = assetsDir;

  // Verificar que el archivo original existe
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ No se encontró: ${inputPath}`);
    return false;
  }

  console.log(`\n🔄 Optimizando ${logoName}.webp...`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Calcular altura manteniendo el aspect ratio
    const aspectRatio = metadata.height / metadata.width;

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${logoName}-${size.suffix}.webp`);
      const height = Math.round(size.width * aspectRatio);

      await image
        .resize(size.width, height, {
          fit: 'contain',
          withoutEnlargement: true
        })
        .webp({
          quality: 85,
          effort: 6
        })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      console.log(`  ✅ Generado: ${logoName}-${size.suffix}.webp (${size.width}x${height}, ${sizeKB} KB)`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error al optimizar ${logoName}.webp:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando optimización de logos...\n');

  let successCount = 0;
  for (const logo of logos) {
    const success = await optimizeLogo(logo);
    if (success) successCount++;
  }

  console.log(`\n✨ Optimización completada: ${successCount}/${logos.length} logos procesados`);
  
  if (successCount === logos.length) {
    console.log('\n📝 Las imágenes optimizadas están listas.');
    console.log('   El código en Icons.jsx ya está configurado para usarlas automáticamente.');
  }
}

main().catch(console.error);

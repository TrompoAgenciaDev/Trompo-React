import { readdir, unlink, rename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

// Configurar la ruta de FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rutas de las carpetas con videos
const videoFolders = [
  join(__dirname, '../client/public/assets/creatividad/branding-web'),
  join(__dirname, '../client/public/assets/creatividad/branding/carrusel/web'),
];


async function checkFFmpeg() {
  try {
    // Verificar que FFmpeg esté disponible
    if (ffmpegPath && ffmpegPath.path) {
      console.log(`✓ FFmpeg encontrado en: ${ffmpegPath.path}`);
      console.log(`✓ Versión: ${ffmpegPath.version || 'N/A'}\n`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error al verificar FFmpeg:', error.message);
    return false;
  }
}

async function getVideoFiles(folder) {
  try {
    const files = await readdir(folder);
    return files.filter(file => file.endsWith('.mp4'));
  } catch (error) {
    console.error(`Error leyendo carpeta ${folder}:`, error.message);
    return [];
  }
}

async function recodificarVideo(inputPath, outputPath) {
  console.log(`\n🔄 Recodificando: ${inputPath}`);
  
  return new Promise((resolve) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-preset medium',
        '-crf 23',
        '-b:a 128k',
        '-movflags +faststart',
        '-pix_fmt yuv420p',
        '-profile:v high',
        '-level 4.0'
      ])
      .on('start', (commandLine) => {
        console.log(`   Comando: ${commandLine}`);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r   Progreso: ${Math.floor(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log(`\n   ✓ Completado`);
        resolve(true);
      })
      .on('error', (err) => {
        console.error(`\n   ❌ Error: ${err.message}`);
        resolve(false);
      })
      .save(outputPath);
  });
}

async function main() {
  console.log('🎬 Iniciando recodificación de videos...\n');
  
  // Verificar que FFmpeg esté instalado
  const ffmpegAvailable = await checkFFmpeg();
  if (!ffmpegAvailable) {
    process.exit(1);
  }
  
  let totalVideos = 0;
  let videosProcesados = 0;
  let videosFallidos = 0;
  
  // Procesar cada carpeta
  for (const folder of videoFolders) {
    console.log(`\n📁 Procesando carpeta: ${folder}`);
    
    const videoFiles = await getVideoFiles(folder);
    
    if (videoFiles.length === 0) {
      console.log('   No se encontraron videos MP4');
      continue;
    }
    
    console.log(`   Encontrados ${videoFiles.length} video(s)`);
    totalVideos += videoFiles.length;
    
    // Recodificar cada video
    for (const videoFile of videoFiles) {
      const inputPath = join(folder, videoFile);
      const tempPath = join(folder, `temp_${videoFile}`);
      
      // Recodificar a archivo temporal
      const success = await recodificarVideo(inputPath, tempPath);
      
      if (success) {
        // Reemplazar el original con el recodificado
        try {
          // Eliminar el original
          await unlink(inputPath);
          // Renombrar el temporal al nombre original
          await rename(tempPath, inputPath);
          videosProcesados++;
          console.log(`   ✅ Reemplazado: ${videoFile}`);
        } catch (error) {
          console.error(`   ❌ Error reemplazando ${videoFile}:`, error.message);
          videosFallidos++;
          // Intentar eliminar archivo temporal
          try {
            await unlink(tempPath);
          } catch (e) {
            // Ignorar si no existe
          }
        }
      } else {
        videosFallidos++;
        // Eliminar archivo temporal si existe
        try {
          await unlink(tempPath);
        } catch (e) {
          // Ignorar si no existe
        }
      }
    }
  }
  
  // Resumen
  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumen:');
  console.log(`   Total de videos: ${totalVideos}`);
  console.log(`   ✅ Procesados exitosamente: ${videosProcesados}`);
  console.log(`   ❌ Fallidos: ${videosFallidos}`);
  console.log('='.repeat(50));
}

main().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});


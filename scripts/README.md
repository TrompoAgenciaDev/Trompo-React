# Scripts de Utilidad

## Recodificar Videos

Este script recodifica los videos MP4 en las carpetas de branding-web para optimizarlos para web y asegurar compatibilidad con navegadores.

### Requisitos

1. **FFmpeg debe estar instalado** en tu sistema:
   - Windows: Descarga desde https://ffmpeg.org/download.html o usa `choco install ffmpeg`
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg` o `sudo yum install ffmpeg`

2. Verifica que FFmpeg esté en tu PATH ejecutando:
   ```bash
   ffmpeg -version
   ```

### Uso

Desde la raíz del proyecto:

```bash
npm run recodificar-videos
```

O directamente:

```bash
node scripts/recodificar-videos.js
```

### ¿Qué hace?

1. Busca todos los videos MP4 en:
   - `client/public/assets/creatividad/branding-web/`
   - `client/public/assets/creatividad/branding/carrusel/web/`

2. Recodifica cada video con parámetros optimizados para web:
   - Codec H.264 (compatible con todos los navegadores)
   - Optimización para streaming web (faststart)
   - Calidad balanceada (CRF 23)
   - Audio AAC a 128kbps

3. **Reemplaza los videos originales** con las versiones recodificadas

### Parámetros de Recodificación

- **Video**: H.264 High Profile, CRF 23
- **Audio**: AAC 128kbps
- **Optimización**: Faststart para carga progresiva
- **Compatibilidad**: YUV420P para máxima compatibilidad

### Nota

El script crea archivos temporales durante el proceso y los reemplaza automáticamente. Si algo falla, los archivos originales se mantienen intactos.


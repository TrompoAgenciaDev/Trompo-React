# Optimización de Logos - Instrucciones

## Problema Actual

Los logos `black.webp` y `white.webp` son demasiado grandes (8063x2560px, ~573KB y ~401KB) para el tamaño en que se muestran (máximo 180px de ancho).

Lighthouse reporta un ahorro potencial de **974 KiB** al optimizar estas imágenes.

## Solución: Crear Versiones Optimizadas

### Tamaños Necesarios

Para `black.webp` y `white.webp`, crear las siguientes versiones:

1. **black-150.webp** / **white-150.webp**
   - Ancho: 150px
   - Uso: Mobile (1x)
   - Tamaño estimado: ~5-10KB

2. **black-300.webp** / **white-300.webp**
   - Ancho: 300px
   - Uso: Mobile retina (2x)
   - Tamaño estimado: ~15-25KB

3. **black-360.webp** / **white-360.webp**
   - Ancho: 360px
   - Uso: Desktop retina (2x para 180px)
   - Tamaño estimado: ~20-30KB

### Herramientas Recomendadas

- **Squoosh** (https://squoosh.app/): Herramienta web para optimizar imágenes
- **ImageMagick**: `convert black.webp -resize 150x -quality 85 black-150.webp`
- **Sharp** (Node.js): Para automatizar la generación

### Ubicación

Colocar las versiones optimizadas en: `client/public/assets/`

### Actualizar Código

Una vez creadas las versiones, actualizar `client/src/components/Icons.jsx`:

```javascript
const baseSrc = imageIcons[iconName];
const srcSet = iconName === "logoBlack" 
  ? `${base}assets/black-150.webp 150w, ${base}assets/black-300.webp 300w, ${base}assets/black-360.webp 360w`
  : `${base}assets/white-150.webp 150w, ${base}assets/white-300.webp 300w, ${base}assets/white-360.webp 360w`;
```

### Beneficios Esperados

- Reducción de ~974 KiB en descarga inicial
- Mejora en LCP (Largest Contentful Paint)
- Mejor experiencia en conexiones lentas
- Menor uso de datos móviles

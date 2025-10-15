# Solución para Videos en Safari

## Problema Identificado

Los videos en las páginas hero no se reproducían correctamente en Safari para Mac y dispositivos móviles (iPhone/iPad), aunque se cargaban correctamente y mostraban el espacio reservado.

## Causa del Problema

Safari tiene políticas estrictas de autoplay que requieren:
1. **Interacción del usuario** antes de reproducir videos con audio
2. **Videos silenciados** para permitir autoplay
3. **Atributo `playsInline`** para evitar pantalla completa en iOS
4. **Manejo especial de errores** y fallbacks

## Solución Implementada

### 1. Componente SafariVideo (`/src/components/SafariVideo.jsx`)

- **Detección automática de Safari**: Identifica el navegador Safari
- **Manejo de autoplay**: Intenta autoplay, si falla espera interacción del usuario
- **Fallback visual**: Muestra poster o imagen de fallback si hay errores
- **Event listeners**: Maneja errores y estados de carga
- **Compatibilidad**: Funciona en todos los navegadores

### 2. Hook useSafariVideo (`/src/hooks/useSafariVideo.js`)

- **Gestión de estado**: Controla reproducción, errores y detección de Safari
- **Funciones de control**: `playVideo()` y `pauseVideo()`
- **Event handling**: Maneja eventos de carga y error

### 3. Estilos CSS (`/src/assets/styles/safari-video.css`)

- **Ocultación de controles**: Oculta controles nativos de Safari
- **Compatibilidad iOS**: Mejora rendimiento en dispositivos móviles
- **Fallbacks visuales**: Estilos para estados de error
- **Responsive**: Adaptación para diferentes tamaños de pantalla

## Archivos Actualizados

### Páginas con Videos Hero:
- ✅ `Home.jsx`
- ✅ `Creatividad.jsx`
- ✅ `Desarrollo.jsx`
- ✅ `Estrategia.jsx`
- ✅ `Nosotros.jsx`
- ✅ `Soporte.jsx`
- ✅ `Interaccion.jsx`

### Cambios Realizados:

1. **Reemplazo de `<video>` por `<SafariVideo>`**
2. **Agregado de posters** para todas las páginas
3. **Cambio de `preload="auto"` a `preload="metadata"`**
4. **URLs corregidas** (especialmente en Soporte.jsx)
5. **Event handlers** para debugging y manejo de errores

## Características de la Solución

### ✅ Compatibilidad Total
- Safari Mac
- Safari iOS (iPhone/iPad)
- Chrome iOS
- Chrome Desktop
- Firefox
- Edge

### ✅ Funcionalidades
- Autoplay inteligente
- Fallback a poster en caso de error
- Detección automática de Safari
- Manejo de interacción del usuario
- Logging para debugging

### ✅ Optimizaciones
- Carga lazy con `preload="metadata"`
- Ocultación de controles nativos
- Mejor rendimiento en móviles
- Fallbacks visuales

## Uso del Componente

```jsx
import SafariVideo from "../components/SafariVideo";

<SafariVideo
  src={`${base}assets/hero/video.mp4`}
  className="hero-video desktop-only"
  poster={`${base}assets/hero/video-poster.webp`}
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"
  disablePictureInPicture
  controlsList="nodownload noremoteplayback"
  onError={(error) => console.log('Error:', error)}
  onLoad={() => console.log('Video cargado')}
/>
```

## Testing

Para probar la solución:

1. **Safari Mac**: Verificar que los videos se reproducen automáticamente
2. **Safari iOS**: Verificar que los videos se reproducen después de tocar la pantalla
3. **Chrome iOS**: Verificar compatibilidad
4. **Consola del navegador**: Revisar logs de carga y errores

## Archivos de Video Requeridos

Asegúrate de que existan estos archivos:

```
/public/assets/hero/
├── home.mp4
├── home-poster.webp
├── creatividad-hero.mp4
├── creatividad-hero-poster.webp
├── desarrollo-hero.mp4
├── desarrollo-hero-poster.webp
├── estrategia-hero.mp4
├── estrategia-hero-poster.webp
├── soporte-hero.mp4
├── soporte-hero-poster.webp
├── interaccion.mp4
└── mobile/
    ├── home-mobile.mp4
    ├── home-mobile-poster.webp
    ├── creatividad-hero-mobile.mp4
    ├── creatividad-hero-mobile-poster.webp
    ├── desarrollo-hero-mobile.mp4
    ├── desarrollo-hero-mobile-poster.webp
    ├── estrategia-hero-mobile.mp4
    ├── estrategia-hero-mobile-poster.webp
    ├── soporte-hero-mobile.mp4
    ├── soporte-hero-mobile-poster.webp
    └── interaccion-mobile.mp4
```

## Notas Importantes

- Los videos deben estar en formato **MP4 con códec H.264** para máxima compatibilidad
- Los posters deben estar en formato **WebP** para mejor compresión
- El componente maneja automáticamente los errores y muestra fallbacks
- En Safari, si el autoplay falla, el usuario debe interactuar con la página para iniciar la reproducción

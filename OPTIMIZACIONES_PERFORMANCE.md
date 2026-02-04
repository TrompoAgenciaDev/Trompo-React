# Optimizaciones de Performance y Buenas Prácticas

## 📊 Resumen Ejecutivo

Este documento contiene todas las acciones identificadas para mejorar el score de Lighthouse en las categorías de **Performance** y **Best Practices**. Las optimizaciones están organizadas por prioridad e impacto esperado.

---

## 🔴 ALTA PRIORIDAD - Impacto Inmediato

### 1. Agregar Lazy Loading a Imágenes

**Problema:** Muchas imágenes se cargan inmediatamente sin lazy loading, afectando el First Contentful Paint (FCP) y Largest Contentful Paint (LCP).

**Archivos afectados:**
- `client/src/pages/servicios/PaidMedia.jsx`
- `client/src/pages/paidMedia/Google.jsx`
- `client/src/pages/paidMedia/Meta.jsx`
- Cualquier archivo que use `<img src=` directamente

**Solución:**
```jsx
// ANTES:
<img src={`${base}assets/paid-media/google-ads/busqueda.webp`} alt="Busqueda Google Ads" />

// DESPUÉS:
<img 
  src={`${base}assets/paid-media/google-ads/busqueda.webp`} 
  alt="Busqueda Google Ads"
  loading="lazy"
  width={800}
  height={600}
  decoding="async"
/>
```

**Impacto esperado:** +15-20 puntos en Performance

---

### 2. Agregar Dimensiones (Width/Height) a Todas las Imágenes

**Problema:** Falta de dimensiones causa Cumulative Layout Shift (CLS), afectando la experiencia del usuario.

**Solución:**
- Agregar atributos `width` y `height` a todas las imágenes
- Usar valores reales de las imágenes o calcular aspect-ratio
- Para imágenes responsivas, usar `style={{ aspectRatio: '16/9' }}` junto con width/height

**Ejemplo:**
```jsx
<img 
  src="image.webp"
  alt="Description"
  width={1200}
  height={800}
  style={{ maxWidth: '100%', height: 'auto' }}
/>
```

**Impacto esperado:** +10-15 puntos en Performance, mejora CLS

---

### 3. Optimizar Cacheo de Archivos JSON

**Problema:** Todos los hooks usan `cache: "no-store"`, evitando que el navegador cachee los archivos JSON.

**Archivos afectados:**
- `client/src/hooks/useStoricalClients.js`
- `client/src/hooks/useFetchValues.js`
- `client/src/hooks/usePortfolioData.js`
- `client/src/hooks/usePostsData.js`
- `client/src/hooks/usePosts.js`
- `client/src/hooks/useFetchFaqs.js`
- `client/src/hooks/useFetchServices.js`
- `client/src/hooks/useFetchTestimonials.js`
- `client/src/hooks/useMembers.js`
- `client/src/components/sliders/SocialMediaShowcaseSlider.jsx`

**Solución:**
```javascript
// ANTES:
fetch(url, { cache: "no-store" })

// DESPUÉS (Opción 1 - Cache con versioning):
const ts = Date.now();
fetch(`${url}?v=${ts}`, { cache: "default" })

// DESPUÉS (Opción 2 - Cache con timestamp en build):
// Usar import.meta.env.BUILD_TIME o similar
fetch(`${url}?v=${import.meta.env.BUILD_TIME || Date.now()}`, { 
  cache: "default",
  headers: {
    'Cache-Control': 'public, max-age=3600' // 1 hora
  }
})
```

**Impacto esperado:** +10-15 puntos en Performance, reduce requests repetidos

---

### 4. Optimizar Carga de Fuentes con font-display

**Problema:** Las fuentes de Google Fonts no tienen `font-display: swap`, causando FOIT (Flash of Invisible Text).

**Archivo:** `client/index.html`

**Solución:**
```html
<!-- ANTES: -->
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
  rel="stylesheet"
/>

<!-- DESPUÉS (ya tiene display=swap, pero optimizar carga): -->
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
  rel="stylesheet"
  media="print" 
  onload="this.media='all'"
/>
<noscript>
  <link
    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet"
  />
</noscript>
```

**Impacto esperado:** +5-10 puntos en Performance, mejora FCP

---

## 🟡 MEDIA PRIORIDAD - Mejoras Significativas

### 5. Implementar Lazy Loading en Videos No Críticos

**Problema:** El componente `SimpleHeroVideo` carga videos inmediatamente con `preload="metadata"`.

**Archivo:** `client/src/components/SimpleHeroVideo.jsx`

**Solución:**
```jsx
// Cambiar preload de "metadata" a "none" para videos no críticos
// O implementar lazy loading con Intersection Observer

// Opción 1: Preload none
preload="none"

// Opción 2: Lazy loading completo
// Usar el componente LazyVideo existente o crear variante
```

**Impacto esperado:** +10-15 puntos en Performance

---

### 6. Mover Google Tag Manager a Carga Asíncrona

**Problema:** GTM se carga de forma síncrona en el `<head>`, bloqueando el renderizado.

**Archivo:** `client/index.html`

**Solución:**
```html
<!-- ANTES: -->
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-WTCNM4L");
</script>

<!-- DESPUÉS: -->
<script>
  // Inicializar dataLayer inmediatamente (no bloquea)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
</script>
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-WTCNM4L"></script>
```

**Impacto esperado:** +5-10 puntos en Performance

---

### 7. Agregar Preload para Recursos Críticos

**Problema:** Falta de preload para recursos críticos como el video hero y poster.

**Archivo:** `client/index.html`

**Solución:**
```html
<head>
  <!-- Preload video hero (solo desktop, mobile se carga después) -->
  <link 
    rel="preload" 
    href="/assets/hero/hero.mp4" 
    as="video" 
    type="video/mp4"
    media="(min-width: 768px)"
  />
  
  <!-- Preload poster del hero -->
  <link 
    rel="preload" 
    href="/assets/hero/home.webp" 
    as="image"
  />
  
  <!-- Preload poster mobile -->
  <link 
    rel="preload" 
    href="/assets/hero/mobile/home.webp" 
    as="image"
    media="(max-width: 767px)"
  />
</head>
```

**Impacto esperado:** +5-10 puntos en Performance, mejora LCP

---

### 8. Agregar fetchpriority a Recursos Críticos

**Problema:** El navegador no sabe qué recursos son críticos para la primera carga.

**Archivos afectados:**
- `client/src/pages/Home.jsx`
- `client/src/components/SimpleHeroVideo.jsx`

**Solución:**
```jsx
// En SimpleHeroVideo.jsx
<video
  fetchPriority="high"  // Agregar este atributo
  className={`hero-video desktop-only ${className}`}
  // ... resto de props
/>

// En imágenes críticas del hero
<img 
  src={poster}
  fetchPriority="high"
  // ... resto de props
/>
```

**Impacto esperado:** +5-8 puntos en Performance

---

### 9. Optimizar Resource Hints (DNS Prefetch, Preconnect)

**Problema:** Falta de hints para recursos externos.

**Archivo:** `client/index.html`

**Solución:**
```html
<head>
  <!-- DNS Prefetch para dominios externos -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://sibforms.com">
  
  <!-- Preconnect para recursos críticos -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

**Impacto esperado:** +3-5 puntos en Performance

---

## 🟢 BAJA PRIORIDAD - Mejoras Incrementales

### 10. Optimizar Code Splitting en Vite

**Problema:** Puede haber chunks muy grandes que se cargan innecesariamente.

**Archivo:** `client/vite.config.js`

**Solución:**
```javascript
build: {
  rollupOptions: {
    output: {
      // ... configuración existente
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-framer': ['framer-motion'],
        'vendor-router': ['react-router-dom'],
        'vendor-forms': ['react-hook-form'], // si se usa
      },
    },
  },
  // Agregar compresión gzip también
  reportCompressedSize: false, // Mejora velocidad de build
}
```

**Impacto esperado:** +3-5 puntos en Performance

---

### 11. Reducir Elementos en Animaciones Infinitas

**Problema:** `InfiniteSlider` crea 16 elementos duplicados, aumentando el DOM.

**Archivo:** `client/src/pages/Home.jsx`

**Solución:**
```jsx
// ANTES:
const items = Array(16).fill(text);

// DESPUÉS:
const items = Array(8).fill(text); // Reducir a 8 elementos
// O usar CSS transforms puros cuando sea posible
```

**Impacto esperado:** +2-3 puntos en Performance

---

### 12. Implementar Service Worker para Cacheo Offline

**Problema:** No hay cacheo persistente de recursos estáticos.

**Solución:**
- Crear service worker para cachear JSONs, imágenes y otros recursos
- Implementar estrategia Cache First para recursos estáticos
- Usar Workbox o similar

**Impacto esperado:** +5-10 puntos en Performance (en visitas subsecuentes)

---

### 13. Optimizar Imágenes con srcset y sizes

**Problema:** Imágenes no se adaptan al tamaño de pantalla.

**Solución:**
```jsx
<img
  src="image-large.webp"
  srcSet="
    image-small.webp 400w,
    image-medium.webp 800w,
    image-large.webp 1200w
  "
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="Description"
  loading="lazy"
/>
```

**Impacto esperado:** +5-8 puntos en Performance

---

### 14. Agregar Decoding="async" a Todas las Imágenes

**Problema:** Decodificación síncrona de imágenes bloquea el hilo principal.

**Solución:**
```jsx
<img 
  src="image.webp"
  alt="Description"
  decoding="async"  // Agregar a todas las imágenes
/>
```

**Impacto esperado:** +2-3 puntos en Performance

---

### 15. Optimizar Uso de Framer Motion

**Problema:** Framer Motion puede ser pesado si se usa en exceso.

**Archivos afectados:** Múltiples componentes

**Solución:**
- Usar `useReducedMotion` donde ya se implementa (✅ ya está en algunos lugares)
- Considerar CSS animations para animaciones simples
- Lazy load componentes con animaciones pesadas

**Impacto esperado:** +3-5 puntos en Performance

---

### 16. Agregar Meta Tags de Performance

**Archivo:** `client/index.html`

**Solución:**
```html
<head>
  <!-- Prefetch para rutas probables -->
  <link rel="prefetch" href="/servicios">
  <link rel="prefetch" href="/nosotros">
  
  <!-- Preload para recursos críticos de rutas comunes -->
  <link rel="preload" href="/assets/hero/hero.mp4" as="video">
</head>
```

**Impacto esperado:** +2-4 puntos en Performance

---

## 📋 Checklist de Implementación

### Fase 1: Quick Wins (1-2 días)
- [ ] Agregar `loading="lazy"` a todas las imágenes
- [ ] Agregar `width` y `height` a todas las imágenes
- [ ] Cambiar `cache: "no-store"` a cacheo con versioning
- [ ] Optimizar carga de fuentes

### Fase 2: Optimizaciones Medias (3-5 días)
- [ ] Implementar lazy loading en videos
- [ ] Mover GTM a carga asíncrona
- [ ] Agregar preload para recursos críticos
- [ ] Agregar fetchpriority
- [ ] Optimizar resource hints

### Fase 3: Optimizaciones Avanzadas (1-2 semanas)
- [ ] Optimizar code splitting
- [ ] Reducir elementos en animaciones
- [ ] Implementar Service Worker
- [ ] Agregar srcset y sizes
- [ ] Optimizar Framer Motion

---

## 📊 Impacto Esperado Total

**Antes de optimizaciones:**
- Performance: ~40-50 puntos
- Best Practices: ~60-70 puntos

**Después de Fase 1:**
- Performance: ~60-70 puntos (+20-30)
- Best Practices: ~75-85 puntos (+15-20)

**Después de Fase 2:**
- Performance: ~75-85 puntos (+35-45)
- Best Practices: ~85-95 puntos (+25-35)

**Después de Fase 3:**
- Performance: ~85-95 puntos (+45-55)
- Best Practices: ~90-100 puntos (+30-40)

---

## 🔍 Métricas a Monitorear

Después de cada fase, verificar en Lighthouse:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Speed Index**: < 3.4s

---

## 📝 Notas Adicionales

1. **Testing:** Probar cada optimización en un entorno de staging antes de producción
2. **Monitoreo:** Usar Lighthouse CI para monitorear cambios
3. **Rollback:** Mantener backups antes de cambios grandes
4. **Documentación:** Documentar cambios en código con comentarios

---

## 🚀 Orden Recomendado de Implementación

1. **Semana 1:** Fase 1 (Quick Wins)
2. **Semana 2:** Fase 2 (Optimizaciones Medias)
3. **Semana 3-4:** Fase 3 (Optimizaciones Avanzadas)

Cada fase debe ser probada y validada antes de continuar con la siguiente.

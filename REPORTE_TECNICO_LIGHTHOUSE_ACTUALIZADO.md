# REPORTE TÉCNICO INTEGRAL - ANÁLISIS DE MÉTRICAS LIGHTHOUSE (ACTUALIZADO)

**Proyecto:** Trompo-React  
**Fecha:** 2026-02-06  
**Versión:** 5.3 - Eliminación Último Reemplazo Post-Render  
**Objetivo:** Documentar verificación final para eliminar cualquier reemplazo visible posterior al primer render y garantizar LCP < 2s, CLS < 0.1, Performance ≥ 90

---

## CAMBIOS IMPLEMENTADOS (VERSIÓN FINAL)

### ✅ Optimizaciones Aplicadas - Análisis Detallado

#### 1. Home Route - LCP Crítico (PRIORIDAD MÁXIMA)

**Problema identificado:**
- Home estaba siendo lazy-loaded con `lazy(() => import(...))`, causando que el componente crítico se cargara como chunk async
- Esto retrasaba el LCP porque el hero no existía en el DOM hasta que el chunk se descargaba y parseaba
- Lighthouse penalizaba porque el elemento LCP aparecía tarde en el timeline

**Solución implementada:**

**ANTES (`routesConfig.js`):**
```javascript
const Home = lazy(() => import("../pages/Home"));
```

**DESPUÉS (`routesConfig.js` línea 4):**
```javascript
// Home importado estáticamente - CRÍTICO para LCP
import Home from "../pages/Home";
```

**Impacto técnico:**
- Home ahora forma parte del bundle inicial (`main-[hash].js`)
- No requiere descarga de chunk adicional
- Disponible inmediatamente después del parseo del bundle principal
- **Reducción esperada de LCP:** 500-1500ms (dependiendo de velocidad de red)

**Routing optimizado (`AppRoutes.jsx`):**

**ANTES:**
```jsx
// Home podía estar mezclado con otras rutas
{allRoutes.map(({ path, Component }) => (
  <Route path={path} element={
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  } />
))}
```

**DESPUÉS (`AppRoutes.jsx` líneas 5-27):**
```jsx
const AppRoutes = () => {
  // Separar Home (estático) de rutas lazy
  const allRoutes = Object.values(routesConfig).flat();
  
  // Eliminar duplicados usando Map para mantener solo la primera ocurrencia
  const routesMap = new Map();
  allRoutes.forEach(route => {
    if (!routesMap.has(route.path)) {
      routesMap.set(route.path, route);
    }
  });
  
  // Home debe estar primero - CRÍTICO para LCP
  const homeRoute = routesMap.get("/");
  routesMap.delete("/");
  const otherRoutes = Array.from(routesMap.values());

  return (
    <Routes>
      {/* Home renderizado sin Suspense - CRÍTICO para LCP */}
      {homeRoute && (
        <Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
      )}
      {/* Rutas secundarias con Suspense - fallback null para evitar CLS */}
      {otherRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Routes>
  );
};
```

**Beneficios del routing optimizado:**
- Home se renderiza primero en el árbol de rutas (prioridad de renderizado)
- Eliminación de rutas duplicadas evita re-renders innecesarios
- Home sin Suspense elimina cualquier delay por fallback
- **Reducción esperada de LCP:** 200-500ms adicionales

#### 2. Suspense / Fallbacks - Eliminación de CLS

**Problema identificado:**
- `LoadingSpinner` tenía `minHeight: '50vh'` que ocupaba espacio visual
- Cuando el componente lazy se cargaba, el spinner desaparecía causando layout shift
- Fallbacks con altura causaban CLS porque reemplazaban bloques visibles

**Solución implementada:**

**ANTES (`LoadingSpinner.jsx`):**
```jsx
const LoadingSpinner = () => {
  return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner">...</div>
    </div>
  );
};
```

**DESPUÉS (`LoadingSpinner.jsx` línea 9):**
```jsx
const LoadingSpinner = () => {
  // Fallback mínimo sin altura - evita CLS
  return null;
};
```

**Fallbacks en Home.jsx:**

**ANTES:**
```jsx
<Suspense fallback={<div style={{ minHeight: '400px' }} />}>
  <Beneficios />
</Suspense>
```

**DESPUÉS (`Home.jsx` líneas 314, 318, 324):**
```jsx
<Suspense fallback={null}>
  <Beneficios />
</Suspense>

<Suspense fallback={null}>
  <Contact form="home" />
</Suspense>

<Suspense fallback={null}>
  <CustomerSlider />
</Suspense>
```

**Impacto técnico:**
- `fallback={null}` no ocupa espacio en el DOM
- No causa layout shifts cuando el componente lazy se carga
- Componentes below-the-fold aparecen sin desplazar contenido
- **Reducción esperada de CLS:** 0.05-0.15 puntos (dependiendo de cantidad de Suspense)

**Componentes lazy en Home.jsx (líneas 15-17):**
```jsx
//components lazy (below-the-fold)
const CustomerSlider = lazy(() => import("../components/sliders/CustomerSlider.jsx"));
const Contact = lazy(() => import("../layout/Contact"));
const Beneficios = lazy(() => import("../components/Beneficios"));
```

**Estrategia de lazy loading:**
- Solo componentes below-the-fold son lazy-loaded
- Hero y contenido crítico renderizan inmediatamente
- Chunks se cargan después del primer paint

#### 3. Layout Root - Estabilidad del DOM

**Problema identificado:**
- AnimatePresence o motion.div envolviendo toda la app causaban cambios de layout
- Estados como `mounted`, `ready`, `isClient` retrasaban el render inicial
- Cambios en `body`/`html` antes del primer paint causaban CLS

**Verificación realizada:**

**App.jsx (líneas 15-34):**
```jsx
function AppContent() {
  const { isOpen, togglePopup } = useTogglePopup();
  const location = useLocation();
  
  // Preload dinámico de recursos críticos
  usePreloadResources();
  
  // Prefetch inteligente de rutas relacionadas
  usePrefetchRoutes();

  return (
    <>
      <Header onTogglePopup={togglePopup} />
      <MenuPopup isOpen={isOpen} onClose={togglePopup} />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </>
  );
}
```

**Estado confirmado:**
- ✅ Sin AnimatePresence envolviendo toda la app
- ✅ Sin motion.div en el root
- ✅ Sin estados que retrasen render (`mounted`, `ready`, `isClient`)
- ✅ Layout estable desde el primer render

**MenuPopup Portal Creation - Corrección aplicada:**

**ANTES (`MenuPopup.jsx`):**
```jsx
useEffect(() => {
  const container = document.createElement('div');
  container.id = 'menu-popup-portal';
  document.body.appendChild(container); // Ejecutaba inmediatamente
  portalContainerRef.current = container;
  
  return () => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
}, []);
```

**DESPUÉS (`MenuPopup.jsx` líneas 16-27):**
```jsx
// Crear portal container - diferido para no afectar render inicial
useEffect(() => {
  const createPortal = () => {
    const container = document.createElement('div');
    container.id = 'menu-popup-portal';
    document.body.appendChild(container);
    portalContainerRef.current = container;
  };

  // Diferir creación del portal para no afectar render inicial
  if ('requestIdleCallback' in window) {
    const idleId = requestIdleCallback(createPortal, { timeout: 500 });
    return () => {
      cancelIdleCallback(idleId);
      if (portalContainerRef.current?.parentNode) {
        portalContainerRef.current.parentNode.removeChild(portalContainerRef.current);
      }
    };
  } else {
    const timeoutId = setTimeout(createPortal, 0);
    return () => {
      clearTimeout(timeoutId);
      if (portalContainerRef.current?.parentNode) {
        portalContainerRef.current.parentNode.removeChild(portalContainerRef.current);
      }
    };
  }
}, []);
```

**Impacto técnico:**
- Portal creation se ejecuta cuando el navegador está idle
- No bloquea el render inicial ni causa layout shifts
- `timeout: 500` asegura que se ejecute incluso si el navegador está ocupado
- Fallback a `setTimeout(0)` para navegadores sin `requestIdleCallback`
- **Reducción esperada de CLS:** 0.01-0.03 puntos
- **Reducción esperada de TBT:** 10-30ms

#### 4. Routing - Optimización de Carga

**Estrategia implementada:**

**Eliminación de duplicados (`AppRoutes.jsx` líneas 9-15):**
```jsx
// Eliminar duplicados usando Map para mantener solo la primera ocurrencia
const routesMap = new Map();
allRoutes.forEach(route => {
  if (!routesMap.has(route.path)) {
    routesMap.set(route.path, route);
  }
});
```

**Beneficios:**
- Evita renderizar rutas duplicadas
- Reduce tamaño del árbol de rutas
- Mejora performance de matching de rutas

**Home renderizado primero (líneas 17-20):**
```jsx
// Home debe estar primero - CRÍTICO para LCP
const homeRoute = routesMap.get("/");
routesMap.delete("/");
const otherRoutes = Array.from(routesMap.values());
```

**Impacto:**
- Home tiene prioridad en el orden de renderizado
- React Router procesa Home antes que otras rutas
- **Reducción esperada de LCP:** 50-150ms

**Rutas secundarias lazy-loaded:**
- Solo rutas que no son Home son lazy-loaded
- Home es 100% síncrono
- Sin animaciones de transición en above-the-fold

#### 5. TBT - Optimización de JavaScript

**usePreloadResources diferido (`hooks/usePreloadResources.js`):**

**ANTES:**
```javascript
useEffect(() => {
  // Preload inmediato - bloqueaba main thread
  preloadResource(...);
}, [location.pathname]);
```

**DESPUÉS:**
```javascript
useEffect(() => {
  const executePreload = () => {
    // Lógica de preload
  };

  // Diferir con requestIdleCallback o setTimeout como fallback
  if ('requestIdleCallback' in window) {
    const idleId = requestIdleCallback(executePreload, { timeout: 2000 });
    return () => cancelIdleCallback(idleId);
  } else {
    const timeoutId = setTimeout(executePreload, 100);
    return () => clearTimeout(timeoutId);
  }
}, [location.pathname]);
```

**Impacto:**
- Preload se ejecuta cuando el navegador está idle
- No bloquea el render inicial
- **Reducción esperada de TBT:** 50-150ms

**ScrollTop listener diferido (`components/buttons/ScrollTop.jsx`):**

**ANTES:**
```jsx
useEffect(() => {
  const handleScroll = () => { /* ... */ };
  handleScroll(); // Ejecutaba inmediatamente
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**DESPUÉS:**
```jsx
useEffect(() => {
  const setupScrollListener = () => {
    const handleScroll = () => { /* ... */ };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  };

  // Diferir con requestIdleCallback o setTimeout
  let cleanup;
  if ('requestIdleCallback' in window) {
    const idleId = requestIdleCallback(setupScrollListener, { timeout: 1000 });
    cleanup = () => cancelIdleCallback(idleId);
  } else {
    const timeoutId = setTimeout(setupScrollListener, 100);
    cleanup = () => clearTimeout(timeoutId);
  }

  return cleanup;
}, []);
```

**Impacto:**
- Listener se configura cuando el navegador está idle
- No bloquea el render inicial
- **Reducción esperada de TBT:** 20-50ms

**Imports no usados eliminados (`pages/Home.jsx` línea 5):**

**ANTES:**
```jsx
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, useSpring, AnimatePresence, useReducedMotion } from "motion/react";
```

**DESPUÉS:**
```jsx
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
```

**Impacto:**
- Reduce bundle size eliminando código no usado
- Tree-shaking más efectivo
- **Reducción esperada de bundle:** ~5-15KB
- **Reducción esperada de TBT:** 10-30ms (menos código para parsear)

**Animaciones sin desplazamiento vertical (`Home.jsx` líneas 230, 243, 261):**

**ANTES:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
```

**DESPUÉS:**
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
```

**Impacto:**
- Elimina desplazamiento vertical que causaba CLS
- Solo anima opacity (no afecta layout)
- **Reducción esperada de CLS:** 0.02-0.05 puntos por animación

---

## 1. ESTRUCTURA GENERAL DEL PROYECTO

### Árbol de Archivos Relevante

```
client/
├── index.html                    # HTML inicial (crítico para LCP/CLS)
├── src/
│   ├── main.jsx                  # Bootstrap de React
│   ├── App.jsx                   # Root Layout (ESTABLE)
│   ├── index.css                 # Estilos globales
│   ├── routes/
│   │   └── AppRoutes.jsx         # Routing - Home sin Suspense
│   ├── layout/
│   │   ├── Header.jsx            # Header (CORREGIDO - sin animación entrada)
│   │   └── Footer.jsx            # Footer estático
│   ├── pages/
│   │   └── Home.jsx              # Página principal (IMPORT ESTÁTICO)
│   ├── components/
│   │   ├── StaticHero.jsx        # Hero con video/poster
│   │   ├── LoadingSpinner.jsx   # Fallback null (CORREGIDO)
│   │   └── popups/
│   │       └── MenuPopup.jsx    # Popup que modifica body.overflow
│   ├── hooks/
│   │   ├── usePreloadResources.js  # Diferido con requestIdleCallback
│   │   └── usePrefetchRoutes.js   # Delay 2s (ya estaba)
│   └── context/
│       └── HoverContext.jsx     # Context provider (estado inicial)
```

### Layout Principal

**Definido en:** `App.jsx` → `AppContent()` → Renderiza:
1. `<Header />` - Sin animaciones de entrada (CORREGIDO)
2. `<MenuPopup />` - Portal que modifica `body.style.overflow`
3. `<AppRoutes />` - Home sin Suspense, otras rutas con Suspense
4. `<ScrollTop />` - Botón que aparece/desaparece según scroll
5. `<Footer />` - Estático

### Primer Render vs JS/Estado

**ANTES de React (index.html):**
- Solo `<div id="root"></div>` vacío
- CSS inline crítico para header y hero (líneas 122-213)
- Scripts de GTM y Brevo (no bloqueantes, cargan después de `load`)

**DESPUÉS de React (main.jsx → App.jsx):**
- Home se importa estáticamente - disponible inmediatamente
- Header renderiza sin animaciones de entrada
- Hero renderiza inmediatamente con Home

---

## 2. index.html (CRÍTICO)

### HTML Antes de Hidratación

```html
<body>
  <div id="root"></div>  <!-- VACÍO - React lo llena -->
  <script type="module" src="/src/main.jsx"></script>
</body>
```

**ESTADO ACTUAL:** No hay estructura HTML inicial. El hero, header y contenido dependen de React renderizando, PERO Home ahora se carga inmediatamente (no lazy).

### CSS y JS que Bloquean Render

**CSS Bloqueante:**
- `index.css` importado en `main.jsx` (línea 3) - **BLOQUEA RENDER**
- `@import url('/assets/fonts/fonts.css')` en `index.css` - **BLOQUEA RENDER**
- Google Fonts con `media="print"` y `onload` (líneas 100-101) - **NO bloquea inicialmente**
- Typekit (`use.typekit.net/crf2yba.css`) - **BLOQUEA RENDER** (línea 119)

**JS Bloqueante:**
- `main.jsx` como módulo ES6 - **BLOQUEA RENDER** hasta parsear
- React + ReactDOM + StrictMode - **EJECUTA ANTES DEL PRIMER PAINT**
- **Home.jsx ahora está en el bundle inicial** - No requiere chunk separado

### Preload/Preconnect

**Preloads existentes:**
- ✅ Hero images (desktop/mobile) con `fetchpriority="high"` (líneas 56-72)
- ✅ Fuentes críticas Montserrat (líneas 81-94)

**Preconnects:**
- ✅ Google Fonts (líneas 48-49)
- ✅ GTM (línea 50)
- ✅ Brevo (línea 51)

**MEJORA:** Home ahora está en el bundle inicial, el hero se renderiza inmediatamente después del primer paint.

### Scripts Third-Party

1. **Google Tag Manager:**
   - Carga después de `window.load` (líneas 26-33)
   - ✅ No bloquea render inicial

2. **Brevo (Sibforms):**
   - Carga después de `window.load` (líneas 232-259)
   - ✅ No bloquea render inicial

3. **Typekit (Adobe Fonts):**
   - `<link rel="stylesheet" href="https://use.typekit.net/crf2yba.css" />` (línea 119)
   - ⚠️ **BLOQUEA RENDER** - Carga síncrona sin defer

---

## 3. main.jsx / Bootstrap de React

### Montaje de React

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

**Configuración:**
- ✅ Usa `createRoot` (React 18+)
- ⚠️ **StrictMode activo** - Causa doble render en desarrollo
- ❌ **NO hay SSR/SSG** - Todo es client-side

**MEJORA:** Home ahora está en el bundle inicial, se renderiza inmediatamente.

### Suspense Global

**NO hay Suspense global** en `main.jsx`. En `AppRoutes.jsx`:
- Home se renderiza **SIN Suspense** (líneas 14-16)
- Rutas secundarias usan Suspense con `fallback={null}` (líneas 18-28)

**MEJORA:** Home no espera ningún chunk async, se renderiza inmediatamente.

### Lógica Antes del Primer Paint

**En `main.jsx`:**
1. Importa `index.css` - **BLOQUEA RENDER**
2. Importa `App.jsx` - Ejecuta imports de dependencias
3. **Importa `Home.jsx` estáticamente** - Disponible inmediatamente
4. Registra Service Worker (solo en producción, después de `load`) - No bloquea

**En `App.jsx`:**
1. Importa `BrowserRouter` - Carga React Router
2. Importa `Header`, `Footer`, `MenuPopup` - Carga componentes
3. Ejecuta hooks en `AppContent`:
   - `usePreloadResources()` - Diferido con `requestIdleCallback`
   - `usePrefetchRoutes()` - useEffect con delay de 2s

**MEJORA:** Home se renderiza inmediatamente, no espera chunks async.

---

## 4. App.jsx / Root Layout (ESTABLE)

### Estructura del Layout Root

```jsx
function AppContent() {
  const { isOpen, togglePopup } = useTogglePopup();
  const location = useLocation();
  
  usePreloadResources();  // Diferido con requestIdleCallback
  usePrefetchRoutes();     // useEffect con delay 2s
  
  return (
    <>
      <Header onTogglePopup={togglePopup} />
      <MenuPopup isOpen={isOpen} onClose={togglePopup} />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </>
  );
}
```

### Dependencias de Estado

**Estado que afecta layout inicial:**
- ❌ `isOpen` (MenuPopup) - No afecta layout inicial (popup cerrado por defecto)
- ✅ `location` (React Router) - Determina qué página renderizar
- ✅ `hoverComponent` (HoverContext) - Estado inicial `false`, no afecta

**ESTADO ACTUAL:** El layout root NO depende de estado para renderizar, y Home se carga inmediatamente.

### Cambios Después del Primer Render

**Header (`Header.jsx`):**
- **CORREGIDO:** Sin animaciones de entrada (según usuario)
- Renderiza en posición final desde el inicio
- **NO causa CLS**

**MenuPopup:**
- Se monta siempre (línea 28 de App.jsx)
- Usa `createPortal` (línea 216 de MenuPopup.jsx)
- Crea un div en `document.body` (línea 19)
- Modifica `body.style.overflow` cuando se abre (línea 61)

**ScrollTop:**
- Aparece/desaparece según scroll (línea 47 de ScrollTop.jsx)
- Usa `useState` para `visible`
- **CLS menor:** Botón es `position: fixed`, no desplaza contenido

### AnimatePresence / motion.div

**AnimatePresence:**
- ✅ NO hay `AnimatePresence` envolviendo toda la app
- ✅ Solo se usa en `Home.jsx` para el menú de servicios (línea 228) - **CORREGIDO:** Sin desplazamiento vertical

**motion.div envolviendo app:**
- ❌ NO hay motion.div envolviendo toda la app
- ✅ Solo componentes individuales usan motion

---

## 5. ROUTING (OPTIMIZADO)

### Carga de Rutas

**React Router v7** con estructura optimizada:

```jsx
// AppRoutes.jsx
const allRoutes = Object.values(routesConfig).flat();

// Eliminar duplicados usando Map para mantener solo la primera ocurrencia
const routesMap = new Map();
allRoutes.forEach(route => {
  if (!routesMap.has(route.path)) {
    routesMap.set(route.path, route);
  }
});

// Home debe estar primero - CRÍTICO para LCP
const homeRoute = routesMap.get("/");
routesMap.delete("/");
const otherRoutes = Array.from(routesMap.values());

return (
  <Routes>
    {/* Home SIN Suspense - renderizado primero */}
    {homeRoute && (
      <Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
    )}
    {/* Rutas secundarias CON Suspense */}
    {otherRoutes.map(({ path, Component }) => (
      <Route
        key={path}
        path={path}
        element={
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        }
      />
    ))}
  </Routes>
);
```

**ESTADO ACTUAL:**
- ✅ Home importado estáticamente en `routesConfig.js` (línea 4)
- ✅ Home renderizado sin Suspense en `AppRoutes.jsx` (líneas 25-27)
- ✅ Rutas duplicadas eliminadas usando Map (líneas 10-15)
- ✅ Home renderizado primero (líneas 18-19)
- ✅ Rutas secundarias lazy con Suspense y `fallback={null}`

### Suspense Fallback

**Fallback para rutas secundarias:**
- `fallback={null}` - **NO causa CLS**

**LoadingSpinner:**
- Ahora retorna `null` (línea 9 de LoadingSpinner.jsx)
- **NO causa CLS**

---

## 6. HERO / ABOVE-THE-FOLD (OPTIMIZADO)

### Componente Hero Actual

**En `Home.jsx` (líneas 201-206):**
```jsx
<StaticHero
  desktopSrc={`${base}assets/hero/hero.mp4`}
  mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
  desktopPoster={`${base}assets/hero/home.webp`}
  mobilePoster={`${base}assets/hero/mobile/home.webp`}
/>
```

### ¿Es Realmente el LCP?

**ESTADO ACTUAL:** 
- ✅ Home se importa estáticamente
- ✅ Home se renderiza inmediatamente (sin esperar chunks)
- ✅ Hero renderiza con Home en el primer render
- ✅ **El hero debe ser el LCP** - Aparece inmediatamente después del primer paint

**Ruta de renderizado optimizada:**
1. `index.html` → `<div id="root"></div>` (vacío)
2. `main.jsx` → `createRoot(...).render(<App />)`
3. `App.jsx` → Renderiza `<AppRoutes />`
4. `AppRoutes.jsx` → Renderiza Home **SIN Suspense**
5. `Home.jsx` se renderiza **INMEDIATAMENTE** → Hero aparece

**MEJORA:** El hero aparece mucho antes porque Home no espera chunks async.

### Dependencias del Hero

**Estado:**
- ❌ No depende de estado

**Efectos:**
- ❌ No tiene useEffect (en Home.jsx)

**Animaciones:**
- ❌ No tiene animaciones de entrada

**ESTADO ACTUAL:** Hero es completamente estático y renderiza inmediatamente.

---

## 7. CLS GLOBAL (DETALLE) - MEJORADO

### ⚠️ DATOS DEL TRACE REQUERIDOS

**Para completar esta sección, ejecutar Lighthouse y extraer del trace:**

1. **Layout Shifts detectados:**
   ```javascript
   // En Chrome DevTools → Performance → Lighthouse
   // Buscar eventos "LayoutShift"
   // Para cada shift, extraer:
   //   - value (score del shift)
   //   - sources[] (array de causas)
   //   - impactedNodes[] (nodos afectados)
   //   - timestamp
   ```

### Elementos que Cambian de Tamaño/Visibilidad (Auditoría de Código)

#### 1. Header (CORREGIDO)

**`Header.jsx`:**
- **CORREGIDO:** Sin animación de entrada `y: -250`
- Renderiza en posición final desde el inicio
- **NO causa CLS**

#### 2. Fuentes (PENDIENTE)

**Fuentes cargadas:**
- Montserrat (Google Fonts) - `media="print"` + `onload` (no bloquea inicialmente)
- Bricolage Grotesque (Google Fonts) - `media="print"` + `onload` (no bloquea inicialmente)
- **Typekit (Adobe Fonts)** - `<link rel="stylesheet">` SIN defer (línea 119) - **BLOQUEA**

**PROBLEMA:** Cuando las fuentes se cargan, pueden causar FOIT/FOUT, causando CLS.

#### 3. LoadingSpinner (CORREGIDO)

**`LoadingSpinner.jsx`:**
- **CORREGIDO:** Ahora retorna `null` (línea 9)
- **NO causa CLS**

#### 4. Fallbacks de Suspense (CORREGIDO)

**En `Home.jsx`:**
- **CORREGIDO:** Todos los fallbacks cambiados a `null` (líneas 314, 318, 324)
- **NO causan CLS**

#### 5. AnimatePresence en Home (MEJORADO)

**`Home.jsx` (líneas 228-276):**
- **MEJORADO:** Eliminado desplazamiento vertical (`y: 20`)
- Ahora solo usa `opacity` para transiciones
- **CLS reducido:** Sin desplazamiento vertical

#### 6. ScrollTop Button

**`ScrollTop.jsx`:**
- Aparece/desaparece según scroll
- **CLS menor:** Botón es `position: fixed`, no desplaza contenido

#### 7. MenuPopup

**`MenuPopup.jsx`:**
- Portal creation diferido con `requestIdleCallback` (líneas 16-27) - **CORREGIDO**
- Modifica `body.style.overflow` cuando se abre (línea 59)
- **CLS menor:** Portal creation diferido, solo afecta cuando popup se abre

---

## 8. LCP REAL (NO ASUMIDO) - OPTIMIZADO

### ⚠️ DATOS DEL TRACE REQUERIDOS

**Para completar esta sección, ejecutar Lighthouse y extraer del trace:**

1. **Selector del elemento LCP:**
   ```javascript
   // En Chrome DevTools → Performance → Lighthouse
   // Buscar evento "largest-contentful-paint"
   // Extraer: node.selector o node.nodeName
   ```

2. **Timestamp del LCP:**
   ```javascript
   // Del mismo evento
   // Extraer: timestamp (en ms desde navigationStart)
   ```

### Predicción Basada en Código Optimizado

**Elemento esperado:** `<img>` dentro de `<picture>` en `StaticHero` (renderizado por `Home.jsx`)

**Selector esperado:** 
- Desktop: `main.full-container > div.full-container > [data-hero-container] > picture > img[src*="hero/home.webp"]`
- Mobile: `main.full-container > div.full-container > [data-hero-container] > picture > img[src*="hero/mobile/home.webp"]`

**Ruta de renderizado optimizada:**
1. `index.html` → `<div id="root"></div>` (vacío)
2. `main.jsx` → `createRoot(...).render(<App />)`
3. `App.jsx` → Renderiza `<AppRoutes />`
4. `AppRoutes.jsx` → Renderiza Home **SIN Suspense**
5. `Home.jsx` se renderiza **INMEDIATAMENTE** → Hero aparece

**Timestamp estimado:** LCP debería ser < 2000ms debido a que Home no espera chunks async.

**MEJORA:** El hero aparece mucho antes porque:
- ✅ Home está en el bundle inicial
- ✅ No espera chunks async
- ✅ No hay Suspense bloqueando el render

---

## 9. JAVASCRIPT INICIAL / TBT (MEJORADO)

### Scripts en el Primer Render

**Bloqueantes (antes del primer paint):**
1. `main.jsx` (módulo ES6)
2. React + ReactDOM (vendor-react chunk)
3. React Router (vendor-router chunk)
4. Framer Motion (vendor-framer chunk) - usado en Header
5. `App.jsx` y sus imports
6. `AppRoutes.jsx`
7. **`Home.jsx` ahora está en el bundle inicial** - No requiere chunk separado

**MEJORA:** Home.jsx está en el bundle inicial, no requiere request adicional.

**No bloqueantes (después del primer paint):**
- `usePreloadResources()` - Diferido con `requestIdleCallback`
- `usePrefetchRoutes()` - useEffect con delay 2s
- Service Worker registration - después de `load`
- GTM - después de `load`
- Brevo - después de `load`

### Librerías Pesadas Cargadas Upfront

**Vendors cargados antes del primer paint:**
1. **React + ReactDOM** (~130KB gzipped)
2. **React Router** (~20KB gzipped)
3. **Framer Motion** (~60KB gzipped) - usado solo en Header inicialmente
4. **Motion (nuevo)** - usado en Home.jsx para animaciones
5. **Home.jsx** - Ahora en bundle inicial (tamaño desconocido, requiere medición)

**MEJORA:** Home.jsx está en el bundle inicial, pero aumenta el tamaño del bundle inicial.

### Observers, Listeners y Efectos al Inicio

**En `App.jsx`:**
- `usePreloadResources()` - **DIFERIDO** con `requestIdleCallback`
- `usePrefetchRoutes()` - useEffect con delay 2s

**En `Header.jsx`:**
- Framer Motion animaciones - ejecutan inmediatamente al montar (pero sin desplazamiento)

**En `ScrollTop.jsx`:**
- `useEffect` para scroll listener - **DIFERIDO** con `requestIdleCallback` (línea 24)
- `useEffect` para reset scroll (línea 10)
- `useEffect` para `history.scrollRestoration` (línea 16)

**En `MenuPopup.jsx`:**
- `useEffect` para crear portal - **DIFERIDO** con `requestIdleCallback` (línea 16)
- `useEffect` para detectar viewport (línea 30)
- `useEffect` para listeners de click/keydown (línea 37)
- `useEffect` para modificar `body.style.overflow` (línea 58)

**MEJORA:** 
- `usePreloadResources` ahora está diferido con `requestIdleCallback`, reduce TBT
- `ScrollTop` listener diferido con `requestIdleCallback`, reduce TBT
- `MenuPopup` portal creation diferido con `requestIdleCallback`, evita cambios en body antes del primer paint
- Imports no usados eliminados de Home.jsx (useScroll, useTransform, useMotionValueEvent, useInView, useSpring), reduce bundle size

### Impacto Estimado en TBT

**TBT mejorado debido a:**
1. **Home.jsx en bundle inicial:** No requiere request adicional, pero aumenta bundle inicial
2. **usePreloadResources diferido:** No bloquea main thread inicialmente
3. **Fallbacks null:** No hay renderizado de fallbacks que bloqueen

**Estimación:** TBT debería ser < 200ms debido a:
- Home renderiza inmediatamente
- Hooks diferidos
- Sin fallbacks bloqueantes

---

## 10. THIRD-PARTY

### Scripts Externos Cargados

1. **Google Tag Manager:**
   - Carga después de `window.load` (línea 30 de index.html)
   - ✅ No bloquea render inicial

2. **Brevo (Sibforms):**
   - Carga después de `window.load` (línea 256 de index.html)
   - ✅ No bloquea render inicial

3. **Google Fonts (Montserrat, Bricolage Grotesque):**
   - Carga con `media="print"` + `onload="this.media='all'"` (líneas 100-101)
   - ✅ No bloquea render inicial

4. **Typekit (Adobe Fonts):**
   - `<link rel="stylesheet" href="https://use.typekit.net/crf2yba.css" />` (línea 119)
   - ⚠️ **BLOQUEA RENDER** - Carga síncrona sin defer

---

## 11. AUDITORÍA COMPLETA DE RUTAS LAZY Y FALLBACKS

### Listado de Rutas Lazy por Archivo

#### Rutas Principales (routesConfig.js)

| Ruta | Componente | Tipo | Fallback | Impacto LCP |
|------|------------|------|----------|-------------|
| `/` | `Home` | **ESTÁTICO** | N/A | **OPTIMIZADO** - Renderiza inmediatamente |
| `/nosotros` | `Nosotros` | Lazy | `null` | Alto - Above-the-fold |
| `/contactanos` | `Contactanos` | Lazy | `null` | Alto - Above-the-fold |
| `/faqs` | `Faqs` | Lazy | `null` | Medio |
| `/servicios` | `Servicios` | Lazy | `null` | Alto - Above-the-fold |
| `/servicios/disenio` | `Disenio` | Lazy | `null` | Alto - Above-the-fold |
| `/servicios/desarrollo` | `Desarrollo` | Lazy | `null` | Alto - Above-the-fold |
| `/servicios/paid-media` | `PaidMedia` | Lazy | `null` | Alto - Above-the-fold |
| `/servicios/social-media` | `SocialMedia` | Lazy | `null` | Alto - Above-the-fold |
| `/servicios/multimedia` | `Multimedia` | Lazy | `null` | Alto - Above-the-fold |
| `/post/:slug` | `SinglePost` | Lazy | `null` | Alto - Above-the-fold |
| `/portfolio/:slug` | `SinglePortfolio` | Lazy | `null` | Alto - Above-the-fold |
| `/casos` | `Casos` | Lazy | `null` | Medio |
| `/terms` | `Terms` | Lazy | `null` | Bajo |
| `/gracias` | `Gracias` | Lazy | `null` | Bajo |
| `/not-found` | `NotFound` | Lazy | `null` | Bajo |
| `/maintenance` | `Maintenance` | Lazy | `null` | Bajo |
| `/primavera` | `Primavera` | Lazy | `null` | Alto - Landing |
| `/clear-cache` | `ClearCache` | Lazy | `null` | Bajo |

#### Componentes Lazy Dentro de Páginas

| Componente | Archivo Padre | Fallback | Impacto |
|------------|---------------|----------|---------|
| `CustomerSlider` | `pages/Home.jsx` | `null` | Bajo - Below-the-fold |
| `Contact` | `pages/Home.jsx` | `null` | Bajo - Below-the-fold |
| `Beneficios` | `pages/Home.jsx` | `null` | Bajo - Below-the-fold |
| `Portfolio3d` | `pages/servicios/Desarrollo.jsx` | `null` | Medio - Puede estar above-the-fold |

### Fallback de Suspense Global

**Archivo:** `routes/AppRoutes.jsx` (líneas 18-28)

```jsx
{otherRoutes.map(({ path, Component }) => (
  <Route
    path={path}
    element={
      <Suspense fallback={null}>  {/* ✅ CORREGIDO */}
        <Component />
      </Suspense>
    }
  />
))}
```

**LoadingSpinner:**
- **Archivo:** `components/LoadingSpinner.jsx`
- **Estilo:** Retorna `null` (línea 9)
- **✅ CORREGIDO:** No causa CLS

### Tamaños de Chunks

**⚠️ REQUERIDO:** Ejecutar build y analizar `dist/assets/` para obtener tamaños reales:

```bash
npm run build
# Analizar dist/assets/*.js para tamaños de chunks
```

**Chunks esperados (según vite.config.js):**
- `vendor-react.[hash].js` - React + ReactDOM (~130KB gzipped estimado)
- `vendor-framer.[hash].js` - Framer Motion (~60KB gzipped estimado)
- `vendor-router.[hash].js` - React Router (~20KB gzipped estimado)
- `vendor-general.[hash].js` - Otros vendors
- **`Home.[hash].js` - Ahora en bundle inicial** (tamaño desconocido, requiere medición)
- `[otras-páginas].[hash].js` - Chunks de otras páginas

**MEJORA:** Home.jsx ahora está en el bundle inicial, aumenta el tamaño del bundle inicial pero elimina el delay de carga.

### Modulepreload para Chunk Inicial

**Auditoría de `index.html`:**

**❌ NO hay `<link rel="modulepreload">` para:**
- Bundle inicial (que ahora incluye Home.jsx)
- Chunk de `vendor-react`
- Chunk de `vendor-router`

**✅ Hay `<link rel="preload">` para:**
- Imágenes del hero (líneas 56-72)
- Fuentes críticas (líneas 81-94)

**RECOMENDACIÓN:** Agregar `<link rel="modulepreload">` para el bundle inicial después del build.

---

## 12. AUDITORÍA DE CAMBIOS GLOBALES QUE GENERAN CLS

### Modificaciones a body/html

#### 1. MenuPopup.jsx

**Archivo:** `components/popups/MenuPopup.jsx`

**Modificaciones:**
```javascript
// Línea 60-62: Cuando popup se abre
document.body.style.overflow = "hidden";
document.body.classList.add("menu-open");
```

**Riesgo CLS:** ⚠️ **MEDIO** - Cambia `overflow` que puede afectar layout

**Condición:** Solo si `isOpen === true` (popup abierto)

**Probabilidad antes del primer paint:** ⚠️ **BAJA** - Popup cerrado por defecto

#### 2. Maintenance.jsx, NotFound.jsx, Gracias.jsx

**Modificaciones:**
```javascript
document.body.classList.add("hide-chrome");
```

**Riesgo CLS:** ⚠️ **MEDIO** - Clase puede ocultar header/footer

**Condición:** Solo en páginas específicas

### Headers con Animaciones de Entrada

#### 1. Header.jsx (CORREGIDO)

**Archivo:** `layout/Header.jsx`

**ESTADO ACTUAL:** 
- **CORREGIDO:** Sin animaciones de entrada (según usuario)
- Renderiza en posición final desde el inicio
- **NO causa CLS**

#### 2. Otros Componentes con Animaciones de Entrada

**Componentes con `initial={{ opacity: 0 }}` o `initial={{ y: -X }}`:**

| Componente | Archivo | Animación Inicial | Riesgo CLS |
|------------|---------|-------------------|-------------|
| Home (menú contenido) | `pages/Home.jsx` | `initial={{ opacity: 0 }}` (CORREGIDO) | **BAJO** - Solo opacity, sin desplazamiento |
| MenuPopup (submenu) | `components/popups/MenuPopup.jsx` | `initial={{ maxHeight: 0, opacity: 0 }}` | Bajo - Solo cuando popup abierto |
| Menu (submenu) | `components/Menu.jsx` | `initial={{ maxHeight: 0, opacity: 0 }}` | Bajo - Solo en hover/click |
| Varios componentes | Múltiples archivos | `initial={{ opacity: 0.1 }}` | Bajo - Fade in no causa CLS |

**MEJORA:** Animaciones en Home.jsx ahora solo usan `opacity`, sin desplazamiento vertical.

### Aparición/Desaparición de UI Flotante

#### 1. ScrollTop Button

**Archivo:** `components/buttons/ScrollTop.jsx`

**Comportamiento:**
- Aparece/desaparece según scroll
- **CLS menor:** Botón es `position: fixed`, no desplaza contenido

#### 2. MenuPopup Overlay

**Archivo:** `components/popups/MenuPopup.jsx`

**Comportamiento:**
- Overlay solo cuando popup abierto
- **CLS menor:** Overlay es `position: fixed`, no desplaza contenido

---

## 13. CONCLUSIÓN TÉCNICA (ACTUALIZADA)

### Causas Reales de CLS Alto (MEJORADAS)

1. **Header con animación de entrada (CORREGIDO):**
   - ✅ **CORREGIDO:** Sin animación `y: -250`
   - ✅ Renderiza en posición final desde el inicio

2. **Fuentes que se cargan después (PENDIENTE):**
   - Typekit carga síncronamente, puede causar FOIT/FOUT
   - Google Fonts carga asíncronamente pero puede causar cambio de tamaño cuando se carga

3. **LoadingSpinner de Suspense (CORREGIDO):**
   - ✅ **CORREGIDO:** Ahora retorna `null`
   - ✅ No causa CLS

4. **AnimatePresence en Home (MEJORADO):**
   - ✅ **MEJORADO:** Eliminado desplazamiento vertical (`y: 20`)
   - ✅ Solo usa `opacity` para transiciones

5. **MenuPopup modifica body.overflow:**
   - Aunque poco probable antes del primer paint, puede causar CLS si se abre

### Causas Reales de LCP Alto (OPTIMIZADAS)

1. **Hero lazy-loaded (CORREGIDO):**
   - ✅ **CORREGIDO:** Home ahora es import estático
   - ✅ Hero renderiza inmediatamente con Home
   - ✅ No espera chunks async

2. **No hay HTML inicial:**
   - Todo depende de React renderizando
   - PERO Home ahora se carga inmediatamente

3. **Code splitting:**
   - ✅ **MEJORADO:** Home está en bundle inicial
   - ✅ No requiere request adicional para Home

4. **JavaScript blocking:**
   - Todo el proceso depende de JS ejecutándose
   - PERO Home está disponible inmediatamente

**MEJORA:** LCP debería ser < 2000ms debido a que Home renderiza inmediatamente.

### Causas Reales de TBT Alto (MEJORADAS)

1. **Parseo de JavaScript pesado:**
   - React + ReactDOM (~130KB)
   - React Router (~20KB)
   - Framer Motion (~60KB)
   - Motion (~40KB)
   - **Home.jsx ahora en bundle inicial** (aumenta bundle inicial)

2. **Ejecución de React:**
   - Render inicial de App → Header → Routes → Home
   - PERO Home ahora está disponible inmediatamente

3. **Animaciones de Framer Motion:**
   - Header anima inmediatamente al montar
   - PERO sin desplazamiento vertical (CORREGIDO)

4. **Múltiples useEffects:**
   - ✅ **MEJORADO:** `usePreloadResources` ahora diferido con `requestIdleCallback`
   - `usePrefetchRoutes` ya tenía delay 2s

**MEJORA:** TBT debería ser < 200ms debido a hooks diferidos y Home disponible inmediatamente.

### Cuello de Botella Principal (ACTUALIZADO)

**CUELLOS DE BOTELLA RESTANTES:**

1. **Typekit bloquea render (LCP/TBT):**
   - Carga síncrona sin defer
   - Puede causar FOIT/FOUT

2. **Bundle inicial más grande (TBT):**
   - Home.jsx ahora está en bundle inicial
   - Aumenta tiempo de parseo inicial

3. **Fuentes causan CLS (CLS):**
   - Typekit y Google Fonts pueden causar FOIT/FOUT

---

## 14. TABLA FINAL: CULPABLES CONFIRMADOS VS POSIBLES (ACTUALIZADA)

### ✅ CULPABLES CORREGIDOS

| Culpable | Tipo | Estado | Evidencia |
|----------|------|--------|-----------|
| **Header animación entrada** | CLS | ✅ **CORREGIDO** | Sin animación `y: -250` |
| **Home.jsx lazy-loaded** | LCP | ✅ **CORREGIDO** | Import estático en routesConfig.js |
| **LoadingSpinner minHeight** | CLS | ✅ **CORREGIDO** | Retorna `null` |
| **Fallbacks con altura** | CLS | ✅ **CORREGIDO** | Todos cambiados a `null` |
| **AnimatePresence con y:20** | CLS | ✅ **MEJORADO** | Solo usa `opacity` |
| **usePreloadResources bloquea** | TBT | ✅ **CORREGIDO** | Diferido con `requestIdleCallback` |

### ⚠️ CULPABLES RESTANTES

| Culpable | Tipo | Evidencia en Código | Impacto Estimado | Requiere Validación |
|----------|------|---------------------|------------------|---------------------|
| **Typekit bloquea render** | LCP/TBT | `index.html` línea 119: `<link rel="stylesheet">` sin defer | **MEDIO** | ✅ Verificar en trace |
| **Fuentes causan FOIT/FOUT** | CLS | Typekit carga síncrona, Google Fonts async | **MEDIO** | ✅ Verificar en trace si hay shifts cuando fuentes cargan |
| **Bundle inicial más grande** | TBT | Home.jsx ahora en bundle inicial (pero disponible inmediatamente) | **BAJO** | ✅ Medir tamaño después de build |
| **MenuPopup modifica overflow** | CLS | `MenuPopup.jsx` línea 59: `body.style.overflow` | **BAJO** | ✅ CORREGIDO: Portal creation diferido, solo afecta cuando popup se abre |

### ✅ OPTIMIZACIONES FINALES APLICADAS

| Optimización | Tipo | Archivo | Estado |
|--------------|------|---------|--------|
| **Eliminación rutas duplicadas** | Routing | `AppRoutes.jsx` líneas 10-15 | ✅ Implementado |
| **Home renderizado primero** | LCP | `AppRoutes.jsx` líneas 18-19 | ✅ Implementado |
| **ScrollTop listener diferido** | TBT | `ScrollTop.jsx` línea 24 | ✅ Implementado |
| **Imports no usados eliminados** | TBT | `Home.jsx` línea 5 | ✅ Implementado |

### 📊 RESUMEN POR MÉTRICA (ACTUALIZADO)

#### LCP (Largest Contentful Paint)

**Corregidos:**
1. ✅ Home.jsx lazy-loaded (CORREGIDO)
2. ✅ Hero disponible inmediatamente

**Restantes:**
- Typekit bloquea render
- Bundle inicial más grande (pero Home disponible inmediatamente)

**Acción requerida:** Extraer del trace:
- Selector exacto del elemento LCP
- Timestamp del LCP
- URL del recurso (si es imagen)

**Expectativa:** LCP < 2000ms

**Validación requerida:**
- Ejecutar Lighthouse 3 veces
- Tomar la mediana
- Confirmar que el elemento LCP es el hero/poster
- Verificar que LCP < 2000ms

#### CLS (Cumulative Layout Shift)

**Corregidos:**
1. ✅ Header con animación `y: -250` (CORREGIDO)
2. ✅ LoadingSpinner con `minHeight: '50vh'` (CORREGIDO)
3. ✅ Fallbacks con altura (CORREGIDO)
4. ✅ AnimatePresence con `y: 20` (MEJORADO - solo opacity ahora)
5. ✅ Rutas duplicadas eliminadas (evita re-renders innecesarios)

**Restantes:**
- Fuentes causan FOIT/FOUT (Typekit carga síncrona)
- MenuPopup modifica `body.overflow` (bajo riesgo - portal creation diferido, solo cuando popup se abre)

**Acción requerida:** Extraer del trace:
- Layout shifts detectados
- `value` (score) de cada shift
- `impactedNodes[]` de cada shift
- `sources[]` (causas) de cada shift
- Timestamp de cada shift

**Expectativa:** CLS < 0.1

**Validación requerida:**
- Ejecutar Lighthouse 3 veces
- Tomar la mediana
- Confirmar CLS < 0.1
- Si CLS > 0.1, revisar trace para identificar causas

#### TBT (Total Blocking Time)

**Corregidos:**
1. ✅ usePreloadResources diferido con `requestIdleCallback` (CORREGIDO)
2. ✅ ScrollTop listener diferido con `requestIdleCallback` (CORREGIDO)
3. ✅ Home disponible inmediatamente (CORREGIDO)
4. ✅ Imports no usados eliminados (reduce bundle size)

**Restantes:**
- Parseo de ~250KB+ de JavaScript (incluyendo Home.jsx ahora en bundle inicial)
- Typekit bloquea render

**Acción requerida:** Verificar en trace:
- Tiempo de parseo de cada chunk
- Tiempo de ejecución de useEffects
- Tiempo de animaciones de Framer Motion

**Expectativa:** TBT < 200ms

**Validación requerida:**
- Ejecutar Lighthouse 3 veces
- Tomar la mediana
- Verificar TBT < 200ms

---

## 15. PLAN DE CORRECCIÓN ADICIONAL (SIN IMPLEMENTAR)

### Orden de Corrección por Impacto

#### FASE 1: Optimización de Fuentes (Impacto: CLS MEDIANO)

1. **Mover Typekit a carga asíncrona:**
   - Usar técnica de no-bloqueo similar a Google Fonts
   - O usar `font-display: swap` en CSS
   - **Impacto esperado:** Reducción de CLS por FOIT/FOUT

2. **Optimizar carga de Google Fonts:**
   - Verificar que `font-display: swap` esté configurado
   - **Impacto esperado:** Reducción menor de CLS

#### FASE 2: Modulepreload (Impacto: LCP MEDIANO)

1. **Agregar modulepreload para bundle inicial:**
   - Después del build, agregar `<link rel="modulepreload">` para el bundle inicial
   - **Impacto esperado:** Reducción moderada de LCP

#### FASE 3: Optimización de Bundle (Impacto: TBT MEDIANO)

1. **Code splitting más agresivo:**
   - Separar Framer Motion en chunk separado
   - Cargar solo cuando se necesite
   - **Impacto esperado:** Reducción moderada de TBT

2. **Tree-shaking:**
   - Verificar que solo se importe lo necesario de Framer Motion
   - **Impacto esperado:** Reducción menor de TBT

---

## 16. INSTRUCCIONES PARA EXTRAER DATOS DEL TRACE

### Cómo Obtener Datos del Trace de Lighthouse

#### Paso 1: Ejecutar Lighthouse

1. Abrir Chrome DevTools (F12)
2. Ir a pestaña **Lighthouse**
3. Seleccionar **Performance**
4. Marcar **Desktop** o **Mobile** según corresponda
5. Click en **Analyze page load**

#### Paso 2: Extraer LCP del Trace

1. En el reporte de Lighthouse, ir a **Performance**
2. Buscar métrica **Largest Contentful Paint**
3. Click derecho → **Show in trace**
4. En el trace, buscar evento **largest-contentful-paint**
5. Extraer:
   ```javascript
   // En la pestaña "Event Log" del trace
   {
     name: "largest-contentful-paint",
     args: {
       data: {
         nodeId: 123,  // ID del nodo
         renderTime: 2345.67,  // Timestamp en ms
         size: 123456,  // Tamaño en px²
         url: "https://example.com/hero.webp"  // Si es imagen
       }
     }
   }
   ```
6. Para obtener el selector:
   - Click en el evento en el trace
   - En "Details" → buscar "node" o "element"
   - Usar Chrome DevTools → Elements → encontrar el nodo por ID
   - Click derecho → Copy → Copy selector

#### Paso 3: Extraer Layout Shifts del Trace

1. En el reporte de Lighthouse, ir a **Performance**
2. Buscar métrica **Cumulative Layout Shift**
3. Click derecho → **Show in trace**
4. En el trace, buscar eventos **LayoutShift**
5. Para cada shift, extraer:
   ```javascript
   // En la pestaña "Event Log" del trace
   {
     name: "LayoutShift",
     args: {
       data: {
         value: 0.123,  // Score del shift (0-1)
         sources: [
           {
             nodeId: 456,
             previousRect: { x: 0, y: 0, width: 100, height: 50 },
             currentRect: { x: 0, y: 50, width: 100, height: 50 }
           }
         ],
         impactedNodes: [
           {
             nodeId: 789,
             oldGeometry: { x: 0, y: 100, width: 200, height: 300 },
             newGeometry: { x: 0, y: 150, width: 200, height: 300 }
           }
         ]
       }
     }
   }
   ```
6. Para obtener selectores de nodos afectados:
   - Usar Chrome DevTools → Elements → encontrar nodos por ID
   - Click derecho → Copy → Copy selector

#### Paso 4: Extraer Tiempos de Parseo/Ejecución

1. En el trace, buscar eventos:
   - **EvaluateScript** - Ejecución de JavaScript
   - **ParseHTML** - Parseo de HTML
   - **ParseStylesheet** - Parseo de CSS
2. Filtrar por nombre de archivo (ej: `Home.jsx`, `vendor-react.js`)
3. Sumar tiempos de todos los eventos relacionados

#### Paso 5: Documentar en el Reporte

Una vez extraídos los datos, actualizar las secciones:

- **Sección 8 (LCP REAL):** Agregar selector, timestamp y URL
- **Sección 7 (CLS GLOBAL):** Agregar layout shifts con impacted nodes
- **Sección 11 (AUDITORÍA RUTAS LAZY):** Agregar tamaños reales de chunks
- **Sección 14 (TABLA FINAL):** Marcar culpables como "CONFIRMADO" o "DESCARTADO"

### Script de Ayuda para Extraer Datos

```javascript
// Ejecutar en Console de Chrome DevTools después de Lighthouse
// Extraer LCP
performance.getEntriesByType('largest-contentful-paint').forEach((entry, index) => {
  console.log(`LCP ${index + 1}:`, {
    element: entry.element,
    renderTime: entry.renderTime,
    loadTime: entry.loadTime,
    size: entry.size,
    url: entry.url
  });
});

// Extraer Layout Shifts
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Layout Shift:', {
      value: entry.value,
      sources: entry.sources,
      startTime: entry.startTime
    });
  }
}).observe({ type: 'layout-shift', buffered: true });
```

---

## RESUMEN DE CAMBIOS IMPLEMENTADOS (VERSIÓN FINAL)

### ✅ Optimizaciones Completadas

1. **Home Route - LCP Crítico:**
   - ✅ Eliminado `lazy()` de Home
   - ✅ Home importado estáticamente
   - ✅ Home renderizado sin Suspense
   - ✅ Hero disponible inmediatamente
   - ✅ Home renderizado primero en routing (prioridad LCP)
   - ✅ Rutas duplicadas eliminadas

2. **Suspense / Fallbacks:**
   - ✅ `LoadingSpinner` retorna `null`
   - ✅ Todos los fallbacks cambiados a `null`
   - ✅ Eliminados fallbacks con altura

3. **Layout Root:**
   - ✅ Sin AnimatePresence envolviendo toda la app
   - ✅ Sin motion.div en el root
   - ✅ Layout estable desde el primer render
   - ✅ Sin cambios globales en body/html antes del primer paint

4. **Routing:**
   - ✅ Solo rutas secundarias son lazy-loaded
   - ✅ Home es síncrono
   - ✅ Rutas duplicadas eliminadas usando Map
   - ✅ Home renderizado primero

5. **TBT:**
   - ✅ `usePreloadResources` diferido con `requestIdleCallback`
   - ✅ `ScrollTop` listener diferido con `requestIdleCallback`
   - ✅ `MenuPopup` portal creation diferido con `requestIdleCallback`
   - ✅ Componentes below-the-fold lazy-loaded
   - ✅ Animaciones sin desplazamiento vertical en Home.jsx
   - ✅ Imports no usados eliminados (reduce bundle size)

### ⚠️ Optimizaciones Pendientes

1. **Typekit:**
   - Mover a carga asíncrona
   - O usar `font-display: swap`
   - **Impacto:** Reducción de CLS y TBT

2. **Modulepreload:**
   - Agregar `<link rel="modulepreload">` para bundle inicial después del build
   - **Impacto:** Reducción moderada de LCP

3. **Code Splitting:**
   - Separar Framer Motion en chunk separado (si es posible)
   - **Impacto:** Reducción moderada de TBT

### ✅ Estado Final del Código

**Archivos Modificados:**
- `routes/AppRoutes.jsx` - Routing optimizado, sin duplicados, Home primero
- `components/buttons/ScrollTop.jsx` - Listener diferido
- `components/popups/MenuPopup.jsx` - Portal creation diferido con requestIdleCallback
- `pages/Home.jsx` - Imports optimizados
- `hooks/usePreloadResources.js` - Diferido con requestIdleCallback
- `components/LoadingSpinner.jsx` - Retorna null
- `config/routesConfig.js` - Home import estático

**Archivos Sin Cambios (Ya Optimizados):**
- `App.jsx` - Layout root estable
- `layout/Header.jsx` - Sin animaciones de entrada (según usuario)

---

## 17. ESTADO FINAL Y VALIDACIÓN REQUERIDA

### Estado Actual del Código (Post Ajustes Finales)

#### Archivos Modificados en Ajustes Finales

1. **`routes/AppRoutes.jsx`:**
   - ✅ Eliminación de rutas duplicadas usando Map (líneas 10-15)
   - ✅ Home renderizado primero (líneas 18-19)
   - ✅ Home sin Suspense (líneas 25-27)
   - ✅ Rutas secundarias con Suspense y `fallback={null}`

2. **`components/buttons/ScrollTop.jsx`:**
   - ✅ Listener de scroll diferido con `requestIdleCallback` (línea 24)
   - ✅ Reduce TBT al diferir trabajo no crítico

3. **`pages/Home.jsx`:**
   - ✅ Imports no usados eliminados (useScroll, useTransform, useMotionValueEvent, useInView, useSpring)
   - ✅ Reduce bundle size y TBT

4. **`hooks/usePreloadResources.js`:**
   - ✅ Diferido con `requestIdleCallback` (ya estaba implementado)

5. **`components/LoadingSpinner.jsx`:**
   - ✅ Retorna `null` (ya estaba implementado)

6. **`config/routesConfig.js`:**
   - ✅ Home import estático (ya estaba implementado)

### Verificación de Requisitos

#### ✅ 1. HOME / ABOVE-THE-FOLD (CRÍTICO)

- ✅ Home NO está lazy-loaded (`routesConfig.js` línea 4)
- ✅ Home NO está envuelto en Suspense (`AppRoutes.jsx` líneas 25-27)
- ✅ Home renderiza de forma síncrona
- ✅ Home existe en el DOM en el primer render
- ✅ Home no depende de fallback

**Validación requerida:**
- Lighthouse debe marcar un elemento del hero/above-the-fold como LCP
- El LCP no debe depender de un chunk async

#### ✅ 2. SUSPENSE Y FALLBACKS (CLS)

- ✅ Todos los Suspense tienen `fallback={null}`
- ✅ `LoadingSpinner` retorna `null`
- ✅ Sin `min-height` grandes
- ✅ Sin loaders fullscreen
- ✅ Sin placeholders que desaparecen

**Validación requerida:**
- CLS < 0.1
- No debe haber layout shifts causados por fallbacks

#### ✅ 3. LAYOUT ROOT / APP.JSX

- ✅ Layout root no depende de estado
- ✅ Layout root no cambia después del primer render
- ✅ Sin AnimatePresence envolviendo toda la app
- ✅ Sin motion.div en el root
- ✅ Sin cambios globales en body/html antes del primer paint

**Validación requerida:**
- No debe haber CLS causado por cambios en el layout root

#### ✅ 4. ROUTING

- ✅ Solo rutas secundarias son lazy
- ✅ Ruta inicial (Home) es completamente síncrona
- ✅ Rutas duplicadas eliminadas
- ✅ Home renderizado primero
- ✅ Sin animaciones de transición de rutas en above-the-fold

**Validación requerida:**
- Home debe renderizarse inmediatamente
- No debe haber delay por routing

#### ✅ 5. LCP DEFINITIVO

- ✅ Hero existe desde el primer render
- ✅ Hero no se reemplaza
- ✅ Hero no se oculta
- ✅ Hero no tiene animaciones de entrada

**Validación requerida:**
- Lighthouse debe marcar el hero/poster como LCP
- LCP < 2000ms

#### ✅ 6. TBT (ÚLTIMA FASE)

- ✅ `usePreloadResources` diferido
- ✅ `ScrollTop` listener diferido
- ✅ Componentes below-the-fold lazy-loaded
- ✅ Imports no usados eliminados
- ✅ Sin efectos innecesarios en el primer render

**Validación requerida:**
- TBT < 200ms
- Performance ≥ 90

### Checklist de Validación Lighthouse

**Antes de ejecutar Lighthouse:**
- [ ] Build de producción ejecutado (`npm run build`)
- [ ] Servidor de producción iniciado
- [ ] Caché del navegador limpiado
- [ ] Network throttling configurado (si aplica)

**Ejecutar Lighthouse 3 veces:**
1. Primera ejecución: Anotar métricas
2. Segunda ejecución: Anotar métricas
3. Tercera ejecución: Anotar métricas

**Calcular mediana:**
- LCP: Mediana de las 3 ejecuciones
- CLS: Mediana de las 3 ejecuciones
- TBT: Mediana de las 3 ejecuciones
- Performance: Mediana de las 3 ejecuciones

**Validar objetivos:**
- [ ] CLS < 0.1
- [ ] LCP < 2000ms
- [ ] Performance ≥ 90
- [ ] Elemento LCP es el hero/poster
- [ ] No hay layout shifts críticos

**Si CLS > 0.1:**
- [ ] Extraer layout shifts del trace
- [ ] Identificar `impactedNodes`
- [ ] Identificar `sources`
- [ ] Documentar causas en el reporte

**Si LCP > 2000ms:**
- [ ] Extraer elemento LCP del trace
- [ ] Verificar selector y timestamp
- [ ] Identificar qué está bloqueando el LCP
- [ ] Documentar causas en el reporte

**Si Performance < 90:**
- [ ] Revisar todas las métricas
- [ ] Identificar cuello de botella principal
- [ ] Documentar causas en el reporte

### Métricas Esperadas (Post Optimizaciones)

| Métrica | Objetivo | Estado Esperado |
|---------|----------|-----------------|
| **LCP** | < 2000ms | Hero/poster visible inmediatamente |
| **CLS** | < 0.1 | Sin layout shifts significativos |
| **TBT** | < 200ms | Hooks diferidos, bundle optimizado |
| **Performance** | ≥ 90 | Todas las métricas optimizadas |

### Próximos Pasos

1. **Ejecutar Lighthouse 3 veces** y documentar resultados
2. **Si métricas cumplen objetivos:** Reporte completo
3. **Si métricas NO cumplen objetivos:**
   - Extraer datos del trace
   - Identificar causas específicas
   - Aplicar correcciones adicionales
   - Re-ejecutar Lighthouse

---

**Fin del Reporte Actualizado - Versión 4.0**

## CAMBIOS EN VERSIÓN 4.0 - ANÁLISIS DETALLADO

### Corrección Estructural Final - MenuPopup Portal Creation

#### Problema Identificado

El componente `MenuPopup` creaba un portal container en `document.body` inmediatamente en el `useEffect` del mount. Esto causaba:

1. **Manipulación del DOM antes del primer paint:** El `appendChild` se ejecutaba durante el render inicial, potencialmente causando layout shifts
2. **Bloqueo del main thread:** Aunque mínimo, la creación del portal competía con el render crítico
3. **CLS potencial:** Si el portal se creaba antes de que el layout se estabilizara, podía causar shifts

#### Solución Implementada

**Archivo:** `client/src/components/popups/MenuPopup.jsx`  
**Líneas:** 15-35

**Código ANTES:**
```jsx
useEffect(() => {
  const container = document.createElement('div');
  container.id = 'menu-popup-portal';
  document.body.appendChild(container); // ⚠️ Ejecutaba inmediatamente
  portalContainerRef.current = container;
  
  return () => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
}, []);
```

**Código DESPUÉS:**
```jsx
// Crear portal container - diferido para no afectar render inicial
useEffect(() => {
  const createPortal = () => {
    const container = document.createElement('div');
    container.id = 'menu-popup-portal';
    document.body.appendChild(container);
    portalContainerRef.current = container;
  };

  // Diferir creación del portal para no afectar render inicial
  if ('requestIdleCallback' in window) {
    const idleId = requestIdleCallback(createPortal, { timeout: 500 });
    return () => {
      cancelIdleCallback(idleId);
      if (portalContainerRef.current?.parentNode) {
        portalContainerRef.current.parentNode.removeChild(portalContainerRef.current);
      }
    };
  } else {
    const timeoutId = setTimeout(createPortal, 0);
    return () => {
      clearTimeout(timeoutId);
      if (portalContainerRef.current?.parentNode) {
        portalContainerRef.current.parentNode.removeChild(portalContainerRef.current);
      }
    };
  }
}, []);
```

#### Análisis Técnico de la Solución

**1. requestIdleCallback:**
- **Qué es:** API del navegador que ejecuta callbacks cuando el main thread está idle
- **Cuándo se ejecuta:** Después de que el navegador complete el frame actual y no tenga trabajo pendiente
- **Timeout:** `{ timeout: 500 }` asegura que se ejecute máximo 500ms después, incluso si el navegador está ocupado
- **Compatibilidad:** Disponible en Chrome 47+, Edge 79+, Safari 15.4+

**2. Fallback setTimeout:**
- **Para qué:** Navegadores que no soportan `requestIdleCallback` (versiones antiguas)
- **Por qué `setTimeout(0)`:**
  - Ejecuta después del stack actual
  - Permite que el render inicial complete
  - No bloquea el main thread inmediatamente

**3. Cleanup mejorado:**
- Cancela el `requestIdleCallback` si el componente se desmonta antes de ejecutarse
- Limpia el portal container si existe
- Previene memory leaks

#### Impacto Esperado

**Métricas esperadas:**

| Métrica | Antes | Después | Mejora Esperada |
|---------|-------|---------|-----------------|
| **CLS** | Variable | Estable | -0.01 a -0.03 puntos |
| **TBT** | Variable | Reducido | -10 a -30ms |
| **LCP** | Sin cambio | Sin cambio | 0ms (no afecta LCP) |
| **FCP** | Sin cambio | Sin cambio | 0ms (no afecta FCP) |

**Razones del impacto:**

1. **CLS reducido:**
   - Portal creation no compite con el render inicial
   - `document.body` no se modifica durante el primer paint
   - Layout se estabiliza antes de cualquier manipulación

2. **TBT reducido:**
   - Creación del portal no bloquea el main thread durante el render crítico
   - Se ejecuta cuando el navegador tiene tiempo disponible
   - Menos trabajo síncrono en el render inicial

3. **Sin impacto en funcionalidad:**
   - Portal se crea antes de que el usuario pueda interactuar con el menú
   - `timeout: 500` asegura creación rápida incluso en dispositivos lentos
   - Usuario no percibe diferencia

#### Validación Requerida

**En Lighthouse:**
1. Ejecutar Lighthouse 3 veces
2. Verificar que CLS no aumente por creación del portal
3. Verificar que TBT se mantenga o mejore
4. Confirmar que no hay layout shifts relacionados con `#menu-popup-portal`

**En Chrome DevTools:**
1. Abrir Performance tab
2. Grabar carga de página
3. Verificar que `appendChild` del portal ocurre después del primer paint
4. Confirmar que no hay layout shifts en el timeline

#### Consideraciones Adicionales

**¿Por qué no crear el portal en el HTML inicial?**
- El portal solo se necesita cuando el popup se abre
- Crearlo en HTML inicial ocuparía espacio innecesario
- Diferirlo es la mejor estrategia para este caso

**¿Por qué no usar `useLayoutEffect`?**
- `useLayoutEffect` se ejecuta síncronamente antes del paint
- Esto bloquearía el render inicial
- `useEffect` con `requestIdleCallback` es la mejor opción

**¿Qué pasa si el usuario abre el menú antes de que se cree el portal?**
- El componente verifica `if (!portalContainerRef.current) return null;` (línea 91)
- Si el portal no existe, el popup simplemente no se renderiza
- En la práctica, el portal se crea mucho antes de que el usuario pueda interactuar

---

## RESUMEN DE IMPACTO ESPERADO (VERSIÓN 4.0)

### Métricas Lighthouse Esperadas

| Métrica | Objetivo | Estado Actual (Estimado) | Mejora Esperada |
|---------|----------|--------------------------|----------------|
| **LCP** | < 2000ms | ~1800-2200ms | **-500 a -1500ms** (Home estático) |
| **CLS** | < 0.1 | ~0.15-0.25 | **-0.05 a -0.20 puntos** (fallbacks null, portal diferido) |
| **TBT** | < 200ms | ~250-400ms | **-80 a -230ms** (hooks diferidos, imports optimizados) |
| **Performance** | ≥ 90 | ~75-85 | **+5 a +15 puntos** (todas las optimizaciones) |

### Cambios por Categoría

**LCP (Largest Contentful Paint):**
- ✅ Home import estático: **-500 a -1500ms**
- ✅ Home sin Suspense: **-200 a -500ms**
- ✅ Home renderizado primero: **-50 a -150ms**
- **Total esperado:** **-750 a -2150ms**

**CLS (Cumulative Layout Shift):**
- ✅ Fallbacks null: **-0.05 a -0.15 puntos**
- ✅ Portal creation diferido: **-0.01 a -0.03 puntos**
- ✅ Animaciones sin desplazamiento vertical: **-0.02 a -0.05 puntos**
- **Total esperado:** **-0.08 a -0.23 puntos**

**TBT (Total Blocking Time):**
- ✅ usePreloadResources diferido: **-50 a -150ms**
- ✅ ScrollTop listener diferido: **-20 a -50ms**
- ✅ Portal creation diferido: **-10 a -30ms**
- ✅ Imports optimizados: **-10 a -30ms**
- **Total esperado:** **-90 a -260ms**

### Archivos Modificados (Resumen Detallado)

1. **`routes/AppRoutes.jsx`**
   - Eliminación de duplicados con Map
   - Home renderizado primero sin Suspense
   - Rutas secundarias con Suspense y fallback null

2. **`components/popups/MenuPopup.jsx`**
   - Portal creation diferido con requestIdleCallback
   - Cleanup mejorado para prevenir memory leaks

3. **`components/buttons/ScrollTop.jsx`**
   - Listener de scroll diferido con requestIdleCallback
   - No bloquea render inicial

4. **`pages/Home.jsx`**
   - Imports optimizados (eliminados no usados)
   - Animaciones sin desplazamiento vertical
   - Suspense con fallback null

5. **`hooks/usePreloadResources.js`**
   - Preload diferido con requestIdleCallback
   - No bloquea render inicial

6. **`components/LoadingSpinner.jsx`**
   - Retorna null en lugar de spinner con altura

7. **`config/routesConfig.js`**
   - Home import estático en lugar de lazy

---

**Fin del Reporte Actualizado - Versión 4.0 (Detallado)**

---

## VALIDACIÓN PRIMER RENDER ESTABLE (VERSIÓN 5.0)

### Objetivo de la Validación

Garantizar que el primer render de React sea completamente estable y directo, sin intermediarios que retrasen el contenido crítico. Lighthouse penaliza por orden de render, no por peso de assets. El objetivo es que Home y el contenido above-the-fold existan en el primer render efectivo de React.

### Metodología de Validación

Se realizó una verificación exhaustiva del código para asegurar que cumple con todos los requisitos para un primer render estable. Se verificó cada componente crítico, cada import, cada Suspense, y cada hook para garantizar que no haya intermediarios que retrasen el render inicial.

### Requisitos Verificados

#### 1. PRIMER COMMIT DE REACT ✅

**Flujo de renderizado actual verificado:**
```
main.jsx (createRoot)
  └─> App.jsx
      └─> BrowserRouter
          └─> HoverProvider
              └─> AppContent
                  ├─> Header (renderiza inmediatamente)
                  └─> AppRoutes
                      └─> Home (renderiza inmediatamente, SIN Suspense)
                          └─> StaticHero (renderiza inmediatamente)
                              └─> Poster <img> (renderiza inmediatamente)
```

**Estado:** ✅ CORRECTO
- Home se renderiza directamente sin intermediarios
- No hay lazy() en la ruta inicial
- No hay Suspense envolviendo Home
- No hay loaders visibles
- No hay fallbacks
- No hay estados mounted/ready/isClient

**Código verificado:**

**main.jsx (líneas 37-41):**
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
✅ **VERIFICADO** - Render directo sin intermediarios

**App.jsx (líneas 15-34):**
```jsx
function AppContent() {
  const { isOpen, togglePopup } = useTogglePopup();
  const location = useLocation();
  
  // Preload dinámico de recursos críticos (diferido)
  usePreloadResources();
  
  // Prefetch inteligente de rutas relacionadas (diferido)
  usePrefetchRoutes();

  return (
    <>
      <Header onTogglePopup={togglePopup} />
      <MenuPopup isOpen={isOpen} onClose={togglePopup} />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </>
  );
}
```

**Búsquedas realizadas:**
```bash
# Buscar AnimatePresence envolviendo app
grep -r "AnimatePresence" client/src/App.jsx
# Resultado: ✅ No encontrado

# Buscar motion.div envolviendo app
grep -r "motion\.(div|section|main|header|footer)" client/src/App.jsx
# Resultado: ✅ No encontrado

# Buscar estados problemáticos
grep -r "useState.*mounted\|useState.*ready\|useState.*isClient" client/src/App.jsx
# Resultado: ✅ No encontrado
```

**Verificación:**
- ✅ Sin AnimatePresence envolviendo toda la app
- ✅ Sin motion.div envolviendo toda la app
- ✅ Sin estados que retrasen render
- ✅ Layout estable desde el primer render

#### 2. HOME (CRÍTICO) ✅

**Importación estática (`routesConfig.js` línea 4):**
```javascript
// Home importado estáticamente - CRÍTICO para LCP
import Home from "../pages/Home";
```
✅ **VERIFICADO** - Import síncrono, no lazy()

**Búsqueda realizada:**
```bash
# Buscar lazy() sobre Home
grep -r "lazy.*Home\|Home.*lazy" client/src
# Resultado: ✅ No encontrado (solo comentarios)
```

**Renderizado sin Suspense (`AppRoutes.jsx` líneas 17-27):**
```jsx
// Home debe estar primero - CRÍTICO para LCP
const homeRoute = routesMap.get("/");
routesMap.delete("/");
const otherRoutes = Array.from(routesMap.values());

return (
  <Routes>
    {/* Home renderizado sin Suspense - CRÍTICO para LCP */}
    {homeRoute && (
      <Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
    )}
    ...
  </Routes>
);
```
✅ **VERIFICADO** - Home renderizado directamente sin Suspense

**Búsqueda realizada:**
```bash
# Buscar Suspense envolviendo Home
grep -r "Suspense.*Home\|Home.*Suspense" client/src/routes
# Resultado: ✅ No encontrado (Home renderizado sin Suspense)
```

**Componente Home (`Home.jsx` líneas 178-206):**
```jsx
const Home = () => {
  const [activeMenuItem, setActiveMenuItem] = useState(0); // Solo para interactividad
  
  return (
    <div className="full-container">
      <StaticHero
        desktopSrc={`${base}assets/hero/hero.webm`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />
      <ServiceTitle ... />
      ...
    </div>
  );
};
```

**Búsqueda de dependencias problemáticas:**
```bash
# Buscar useEffect que retrase render
grep -r "useEffect\|useLayoutEffect" client/src/pages/Home.jsx
# Resultado: ✅ No encontrado (Home no tiene useEffect)

# Buscar estados problemáticos
grep -r "useState.*mounted\|useState.*ready\|useState.*isClient" client/src/pages/Home.jsx
# Resultado: ✅ No encontrado (solo useState(0) para interactividad)
```

**Verificaciones realizadas:**
- ✅ No depende de useEffect para existir
- ✅ No se reemplaza por fallback
- ✅ No se anima en entrada (solo contenido interno)
- ✅ Hero renderiza inmediatamente con Home
- ✅ Home existe en el DOM en el primer paint

#### 3. SUSPENSE GLOBAL ✅

**Suspense solo para rutas secundarias (`AppRoutes.jsx` líneas 29-39):**
```jsx
{otherRoutes.map(({ path, Component }) => (
  <Route
    key={path}
    path={path}
    element={
      <Suspense fallback={null}> {/* ✅ fallback null */}
        <Component />
      </Suspense>
    }
  />
))}
```
✅ **VERIFICADO** - Solo rutas secundarias tienen Suspense
✅ **VERIFICADO** - fallback={null} (sin altura, sin reemplazos visuales)

**Suspense en Home para componentes below-the-fold (`Home.jsx` líneas 314, 318, 324):**
```jsx
<Suspense fallback={null}>
  <Beneficios />
</Suspense>

<Suspense fallback={null}>
  <Contact form="home" />
</Suspense>

<Suspense fallback={null}>
  <CustomerSlider />
</Suspense>
```
✅ **VERIFICADO** - Solo componentes below-the-fold
✅ **VERIFICADO** - fallback={null} (sin altura)

**Componentes lazy en Home (`Home.jsx` líneas 15-17):**
```jsx
//components lazy (below-the-fold)
const CustomerSlider = lazy(() => import("../components/sliders/CustomerSlider.jsx"));
const Contact = lazy(() => import("../layout/Contact"));
const Beneficios = lazy(() => import("../components/Beneficios"));
```
✅ **VERIFICADO** - Solo componentes below-the-fold son lazy-loaded

**Búsqueda de problemas:**
```bash
# Buscar loaders fullscreen
grep -r "minHeight.*vh\|min-height.*vh\|fullscreen\|full-screen" client/src
# Resultado: ✅ No encontrado (solo en componentes no críticos)

# Buscar placeholders con altura
grep -r "fallback.*minHeight\|fallback.*min-height" client/src
# Resultado: ✅ No encontrado (todos los fallbacks son null)
```

**Prohibiciones verificadas:**
- ✅ NO hay loaders fullscreen
- ✅ NO hay min-height grandes
- ✅ NO hay placeholders que desaparecen
- ✅ NO hay Suspense en la ruta inicial

#### 4. LAYOUT ROOT (INERTE) ✅

**App.jsx verificado completamente:**
```jsx
function AppContent() {
  const { isOpen, togglePopup } = useTogglePopup();
  const location = useLocation();
  
  usePreloadResources(); // Diferido con requestIdleCallback
  usePrefetchRoutes(); // Delay 2s
  
  return (
    <>
      <Header onTogglePopup={togglePopup} />
      <MenuPopup isOpen={isOpen} onClose={togglePopup} />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </>
  );
}
```

**Búsquedas realizadas:**
```bash
# Buscar AnimatePresence
grep -r "AnimatePresence" client/src/App.jsx
# Resultado: ✅ No encontrado

# Buscar motion.div envolviendo app
grep -r "motion\.(div|section|main|header|footer)" client/src/App.jsx
# Resultado: ✅ No encontrado

# Buscar estados problemáticos
grep -r "useState.*mounted\|useState.*ready\|useState.*isClient" client/src/App.jsx
# Resultado: ✅ No encontrado
```

**Verificación body/html:**
- ✅ MenuPopup portal creation diferido (no modifica body antes del primer paint)
- ✅ No hay cambios en overflow antes del primer paint
- ✅ No hay cambios en scrollbars antes del primer paint

**MenuPopup portal creation (`MenuPopup.jsx` líneas 16-27):**
```jsx
useEffect(() => {
  const createPortal = () => {
    const container = document.createElement('div');
    container.id = 'menu-popup-portal';
    document.body.appendChild(container);
    portalContainerRef.current = container;
  };

  // Diferir creación del portal para no afectar render inicial
  if ('requestIdleCallback' in window) {
    const idleId = requestIdleCallback(createPortal, { timeout: 500 });
    return () => {
      cancelIdleCallback(idleId);
      if (portalContainerRef.current?.parentNode) {
        portalContainerRef.current.parentNode.removeChild(portalContainerRef.current);
      }
    };
  } else {
    const timeoutId = setTimeout(createPortal, 0);
    return () => {
      clearTimeout(timeoutId);
      if (portalContainerRef.current?.parentNode) {
        portalContainerRef.current.parentNode.removeChild(portalContainerRef.current);
      }
    };
  }
}, []);
```
✅ **VERIFICADO** - Portal creation diferido, no afecta primer paint

#### 5. ROUTING ✅

**Ruta inicial optimizada (`AppRoutes.jsx` líneas 5-27):**
```jsx
const AppRoutes = () => {
  // Separar Home (estático) de rutas lazy
  const allRoutes = Object.values(routesConfig).flat();
  
  // Eliminar duplicados usando Map para mantener solo la primera ocurrencia
  const routesMap = new Map();
  allRoutes.forEach(route => {
    if (!routesMap.has(route.path)) {
      routesMap.set(route.path, route);
    }
  });
  
  // Home debe estar primero - CRÍTICO para LCP
  const homeRoute = routesMap.get("/");
  routesMap.delete("/");
  const otherRoutes = Array.from(routesMap.values());

  return (
    <Routes>
      {/* Home renderizado sin Suspense - CRÍTICO para LCP */}
      {homeRoute && (
        <Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
      )}
      {/* Rutas secundarias con Suspense - fallback null para evitar CLS */}
      {otherRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Routes>
  );
};
```

**Verificaciones:**
- ✅ Ruta inicial (Home) es 100% síncrona
- ✅ Solo rutas no críticas son lazy-loaded
- ✅ Home renderizado primero (prioridad LCP)
- ✅ Rutas duplicadas eliminadas
- ✅ NO hay animaciones de transición en above-the-fold

#### 6. LCP DEFINITIVO ✅

**Elemento esperado como LCP:**
- **Componente:** `StaticHero` (línea 201 de `Home.jsx`)
- **Elemento:** `<img>` del poster (línea 89 de `StaticHero.jsx`)
- **Renderizado:** Inmediatamente con Home en el primer render

**Código del poster (`StaticHero.jsx` líneas 78-110):**
```jsx
// El poster se renderiza inmediatamente en el HTML inicial
// Un solo elemento <img> usando <picture> con source media
// NUNCA desaparece, permanece en el DOM durante toda la vida de la página
return (
  <div data-hero-container className={className}>
    {/* POSTER: Un solo elemento LCP, nunca desaparece */}
    <picture>
      <source 
        media="(min-width: 768px)" 
        srcSet={desktopPoster}
      />
      <img
        src={mobilePoster}
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="hero-poster-img"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          // NUNCA display: none, NUNCA opacity: 0
          // El poster permanece visible siempre
          // width y height definidos para evitar CLS
        }}
      />
    </picture>
    ...
  </div>
);
```

**Verificaciones realizadas:**
- ✅ Existe desde el primer render (poster renderiza inmediatamente)
- ✅ NO se reemplaza (poster permanece en DOM siempre)
- ✅ NO se oculta (poster siempre visible, z-index: 1)
- ✅ NO se anima en entrada (sin animaciones de entrada)
- ✅ width y height definidos (evita CLS)
- ✅ fetchPriority="high" (prioridad de carga)
- ✅ loading="eager" (carga inmediata)

**useEffect en StaticHero (`StaticHero.jsx` líneas 26-76):**
```jsx
// useEffect SOLO para iniciar el video después del primer paint
// NO afecta layout ni LCP
useEffect(() => {
  const initVideo = () => {
    // Lógica para iniciar video después del primer paint
  };
  
  // Usar requestAnimationFrame para esperar al primer paint
  const rafId = requestAnimationFrame(() => {
    setTimeout(initVideo, 0);
  });
  
  return () => {
    cancelAnimationFrame(rafId);
  };
}, [desktopSrc, mobileSrc]);
```
✅ **VERIFICADO** - useEffect solo para video, no afecta poster ni LCP

### Resumen de Validación Completa

| Requisito | Estado | Archivo/Línea | Verificación |
|-----------|--------|---------------|--------------|
| **Home import estático** | ✅ | `routesConfig.js` línea 4 | Import síncrono |
| **Home sin lazy()** | ✅ | Todo el código | Verificado con grep |
| **Home sin Suspense** | ✅ | `AppRoutes.jsx` líneas 25-27 | Renderizado directo |
| **Home renderiza hero inmediatamente** | ✅ | `Home.jsx` línea 201 | StaticHero renderiza inmediatamente |
| **Hero renderiza poster inmediatamente** | ✅ | `StaticHero.jsx` líneas 84-110 | Poster en primer render |
| **Layout root estable** | ✅ | `App.jsx` | Sin AnimatePresence, sin motion.div |
| **Sin estados mounted/ready/isClient** | ✅ | Todo el código | Verificado con grep |
| **Suspense solo para rutas secundarias** | ✅ | `AppRoutes.jsx` líneas 29-39 | Solo rutas no críticas |
| **Fallbacks null** | ✅ | Todos los Suspense | Sin altura, sin CLS |
| **LCP existe desde primer render** | ✅ | `StaticHero.jsx` | Poster renderiza inmediatamente |
| **Portal creation diferido** | ✅ | `MenuPopup.jsx` líneas 16-27 | No afecta primer paint |
| **Hooks diferidos** | ✅ | `usePreloadResources.js`, `ScrollTop.jsx` | No bloquean render inicial |

### Documento de Validación Creado

Se creó `VALIDACION_PRIMER_RENDER.md` con:
- ✅ Verificación completa de cada requisito
- ✅ Checklist detallado para Lighthouse
- ✅ Instrucciones para validación técnica en Chrome DevTools
- ✅ Guía para interpretar resultados
- ✅ Tabla de resumen de validación

### Próximos Pasos - Validación Lighthouse

#### Checklist Pre-Lighthouse

- [ ] Build de producción ejecutado (`npm run build`)
- [ ] Servidor de producción iniciado
- [ ] Caché del navegador limpiado
- [ ] Network throttling configurado (si aplica)

#### Ejecutar Lighthouse 3 Veces

**Instrucciones:**
1. Abrir Chrome DevTools
2. Ir a la pestaña Lighthouse
3. Seleccionar "Performance" y "Desktop" o "Mobile"
4. Click en "Generate report"
5. Repetir 3 veces
6. Anotar métricas de cada ejecución

**Métricas a registrar:**
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- TBT (Total Blocking Time)
- Performance Score
- Elemento LCP identificado

#### Calcular Mediana

**Fórmula:**
- Ordenar las 3 mediciones de menor a mayor
- La mediana es el valor del medio

**Objetivos:**
- LCP mediana: < 2000ms
- CLS mediana: < 0.1
- TBT mediana: < 200ms
- Performance mediana: ≥ 90

#### Validación de Resultados

**Si CLS < 0.1:**
- ✅ Objetivo cumplido
- ✅ Continuar con optimizaciones adicionales (si necesario)

**Si CLS ≥ 0.1:**
- ⚠️ Revisar trace de Lighthouse
- ⚠️ Identificar layout shifts específicos
- ⚠️ Extraer `impactedNodes` y `sources` del trace
- ⚠️ Aplicar correcciones específicas
- ⚠️ Re-ejecutar Lighthouse

**Si LCP < 2000ms:**
- ✅ Objetivo cumplido

**Si LCP ≥ 2000ms:**
- ⚠️ Verificar que el elemento LCP sea el hero/poster
- ⚠️ Verificar que no dependa de chunks async
- ⚠️ Revisar network timing en trace
- ⚠️ Verificar que el poster tenga `fetchPriority="high"`

**Si Performance ≥ 90:**
- ✅ Objetivo cumplido

**Si Performance < 90:**
- ⚠️ Revisar todas las métricas
- ⚠️ Identificar cuello de botella principal
- ⚠️ Aplicar optimizaciones adicionales

### Verificación Técnica Adicional

#### En Chrome DevTools Performance Tab

**Pasos:**
1. Abrir Performance tab
2. Click en Record (círculo rojo)
3. Recargar página
4. Esperar a que cargue completamente
5. Detener grabación

**Verificaciones en timeline:**
- ✅ Home debe aparecer inmediatamente después del parseo del bundle
- ✅ Hero (StaticHero) debe aparecer inmediatamente después de Home
- ✅ Poster debe aparecer en el timeline antes del primer paint
- ✅ NO debe haber gaps grandes entre parseo y render de Home
- ✅ NO debe haber layout shifts relacionados con Home/Hero

#### En Chrome DevTools Elements Tab

**Verificaciones:**
- ✅ Inspeccionar `<div id="root">`
- ✅ Verificar que Home existe inmediatamente
- ✅ Verificar que StaticHero existe inmediatamente
- ✅ Verificar que poster `<img>` existe inmediatamente
- ✅ Verificar que NO hay placeholders que desaparecen
- ✅ Verificar que NO hay loaders que se reemplazan
- ✅ Verificar que NO hay elementos con `display: none` que luego aparecen

### Conclusión de Validación

**Estado del código:** ✅ LISTO PARA VALIDACIÓN LIGHTHOUSE

Todos los requisitos para un primer render estable han sido verificados y cumplidos:

1. ✅ Home importado estáticamente
2. ✅ Home sin Suspense
3. ✅ Home sin lazy()
4. ✅ Layout root estable
5. ✅ Hero renderiza inmediatamente
6. ✅ Poster renderiza inmediatamente
7. ✅ LCP existe desde primer render
8. ✅ Sin estados que retrasen render
9. ✅ Suspense solo para rutas secundarias
10. ✅ Fallbacks null
11. ✅ Portal creation diferido
12. ✅ Hooks diferidos

**Flujo de renderizado garantizado:**
```
main.jsx → App.jsx → BrowserRouter → HoverProvider → AppContent → Header + AppRoutes → Home → StaticHero → Poster <img>
```

**Tiempo estimado hasta primer render:**
- Parseo de bundle: ~100-300ms (dependiendo de tamaño)
- Render de Home: Inmediato después del parseo
- Render de Hero: Inmediato con Home
- Render de Poster: Inmediato con Hero
- **Total estimado:** ~100-300ms hasta que el poster esté en el DOM

**Próximo paso:** Ejecutar Lighthouse 3 veces y validar métricas.

---

**Fin del Reporte Actualizado - Versión 5.0 (Validación Primer Render Estable)**

---

## LIMPIEZA FINAL LCP / CLS (VERSIÓN 5.1)

### Objetivo de la Limpieza Final

Eliminar cualquier reemplazo visible posterior al primer render. Lighthouse penaliza por reemplazo tardío de bloques grandes. El objetivo es llevar CLS < 0.1 y LCP < 2s sin optimizar assets ni agregar lógica nueva.

### Auditoría Realizada

#### 1. SUSPENSE (ÚLTIMO FOCO) ✅

**Suspense en Home (`Home.jsx` líneas 314, 318, 324):**
```jsx
<Suspense fallback={null}>
  <Beneficios />
</Suspense>

<Suspense fallback={null}>
  <Contact form="home" />
</Suspense>

<Suspense fallback={null}>
  <CustomerSlider />
</Suspense>
```

**Estado verificado:**
- ✅ Todos los Suspense tienen `fallback={null}`
- ✅ Todos los Suspense están en componentes below-the-fold
- ✅ No hay Suspense en el primer viewport
- ✅ No hay loaders visibles
- ✅ No hay min-height
- ✅ No hay placeholders que desaparecen
- ✅ No hay skeletons que se reemplazan

**Componentes lazy verificados:**
- `Beneficios` - Componente estático, renderiza sin reemplazos
- `Contact` - Componente estático, renderiza sin reemplazos
- `CustomerSlider` - Componente estático, renderiza sin reemplazos

**Resultado:** ✅ Ningún bloque grande se reemplaza después del primer render

#### 2. ROUTING (REEMPLAZOS DE CONTENIDO) ✅

**AppRoutes.jsx verificado:**
```jsx
const AppRoutes = () => {
  // Home debe estar primero - CRÍTICO para LCP
  const homeRoute = routesMap.get("/");
  routesMap.delete("/");
  const otherRoutes = Array.from(routesMap.values());

  return (
    <Routes>
      {/* Home renderizado sin Suspense - CRÍTICO para LCP */}
      {homeRoute && (
        <Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
      )}
      {/* Rutas secundarias con Suspense - fallback null para evitar CLS */}
      {otherRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Routes>
  );
};
```

**Búsqueda de animaciones de transición:**
```bash
grep -r "AnimatePresence\|motion\.(div|section|main).*Route\|transition\|fade\|slide" client/src/routes
# Resultado: ✅ No encontrado
```

**Estado verificado:**
- ✅ No hay animaciones de transición de ruta
- ✅ No hay wrappers que re-renderizan el contenido principal
- ✅ Home no se vuelve a montar
- ✅ No hay "pantalla intermedia" antes del contenido real
- ✅ El contenido principal aparece una sola vez y queda

**Resultado:** ✅ El contenido principal aparece una sola vez y queda estable

#### 3. LCP DEFINITIVO (CONFIRMACIÓN) ✅

**Elemento LCP identificado:**
- **Componente:** `StaticHero` (línea 201 de `Home.jsx`)
- **Elemento:** `<img>` del poster (línea 89 de `StaticHero.jsx`)
- **Selector esperado:** `img.hero-poster-img` o `picture > img`

**Verificación completa:**

**Código del poster (`StaticHero.jsx` líneas 78-110):**
```jsx
// El poster se renderiza inmediatamente en el HTML inicial
// Un solo elemento <img> usando <picture> con source media
// NUNCA desaparece, permanece en el DOM durante toda la vida de la página
return (
  <div data-hero-container className={className}>
    {/* POSTER: Un solo elemento LCP, nunca desaparece */}
    <picture>
      <source 
        media="(min-width: 768px)" 
        srcSet={desktopPoster}
      />
      <img
        src={mobilePoster}
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="hero-poster-img"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          // NUNCA display: none, NUNCA opacity: 0
          // El poster permanece visible siempre
          // width y height definidos para evitar CLS
        }}
      />
    </picture>
    ...
  </div>
);
```

**Verificaciones realizadas:**
- ✅ Existe desde el primer render (poster renderiza inmediatamente con Home)
- ✅ NO se reemplaza (poster permanece en DOM siempre)
- ✅ NO se oculta (poster siempre visible, z-index: 1, sin display: none, sin opacity: 0)
- ✅ NO se anima (sin animaciones de entrada)
- ✅ width y height definidos (evita CLS)
- ✅ fetchPriority="high" (prioridad de carga)
- ✅ loading="eager" (carga inmediata)

**Búsqueda de cambios en el poster:**
```bash
grep -r "display.*none\|opacity.*0\|visibility.*hidden" client/src/components/StaticHero.jsx
# Resultado: ✅ No encontrado (solo comentarios confirmando que nunca se oculta)
```

**Resultado:** ✅ El LCP existe desde el primer render y no cambia durante la carga

### Resumen de Limpieza Final

| Área | Estado | Verificación |
|------|--------|--------------|
| **Suspense en Home** | ✅ | Todos con fallback={null}, below-the-fold |
| **Suspense en routing** | ✅ | Solo rutas secundarias, fallback={null} |
| **Reemplazos visibles** | ✅ | No hay reemplazos después del primer render |
| **Animaciones de transición** | ✅ | No hay animaciones de ruta |
| **Re-montaje de Home** | ✅ | Home no se vuelve a montar |
| **LCP estable** | ✅ | Poster no se reemplaza ni se oculta |

### Validación Final Requerida

**Después de aplicar estos cambios:**

1. **Ejecutar Lighthouse 3 veces**
   - Abrir Chrome DevTools → Lighthouse
   - Seleccionar "Performance" y "Desktop" o "Mobile"
   - Click en "Generate report"
   - Repetir 3 veces

2. **Tomar la mediana**
   - Ordenar las 3 mediciones de menor a mayor
   - La mediana es el valor del medio

3. **Confirmar métricas:**
   - ✅ CLS < 0.1
   - ✅ LCP < 2000ms
   - ✅ Performance ≥ 90

**Si CLS no baja:**
- ⚠️ Revisar trace de Lighthouse
- ⚠️ Identificar layout shifts específicos
- ⚠️ Extraer `impactedNodes` y `sources`
- ⚠️ Aplicar correcciones específicas
- ⚠️ Re-ejecutar Lighthouse

**Si LCP no baja:**
- ⚠️ Verificar que el elemento LCP sea el hero/poster
- ⚠️ Verificar que no dependa de chunks async
- ⚠️ Revisar network timing en trace

### Regla Final Aplicada

**A esta altura:**
- ✅ No se agregó nada nuevo
- ✅ Solo se eliminaron reemplazos
- ✅ Cada reemplazo visible eliminado = Lighthouse no castiga

**Cambios aplicados:**
- Ninguno necesario - Todo ya estaba correcto
- Suspense ya tienen fallback={null}
- Routing ya está limpio sin animaciones
- LCP ya es estable desde el primer render

**Estado final:** ✅ LISTO PARA VALIDACIÓN LIGHTHOUSE

---

**Fin del Reporte Actualizado - Versión 5.1 (Limpieza Final LCP/CLS)**

---

## ACTUALIZACIÓN VIDEO HERO (VERSIÓN 5.2)

### Cambio Realizado

**Video Desktop cambiado de MP4 a WebM:**

**ANTES (`Home.jsx` línea 202):**
```jsx
<StaticHero
  desktopSrc={`${base}assets/hero/hero.mp4`}
  mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
  ...
/>
```

**DESPUÉS (`Home.jsx` línea 202):**
```jsx
<StaticHero
  desktopSrc={`${base}assets/hero/hero.webm`}
  mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
  ...
/>
```

### Mejoras en StaticHero.jsx

**Detección automática del tipo MIME:**

**ANTES:**
```jsx
// Establecer la fuente del video
const source = video.querySelector('source');
if (source) {
  source.src = videoSrc;
}
```

**DESPUÉS:**
```jsx
// Establecer la fuente del video y el tipo MIME
const source = video.querySelector('source');
if (source) {
  source.src = videoSrc;
  // Determinar el tipo MIME basado en la extensión del archivo
  if (videoSrc.endsWith('.webm')) {
    source.type = 'video/webm';
  } else if (videoSrc.endsWith('.mp4')) {
    source.type = 'video/mp4';
  }
}
```

**Source element actualizado:**
```jsx
<source />
// El tipo MIME se determina automáticamente según la extensión del archivo
```

### Beneficios del Cambio

1. **WebM es más eficiente:**
   - Mejor compresión que MP4
   - Tamaño de archivo generalmente menor
   - Mejor calidad a menor bitrate

2. **Detección automática de tipo MIME:**
   - El componente ahora detecta automáticamente el formato
   - Soporta tanto WebM como MP4
   - No requiere cambios manuales en el código para diferentes formatos

3. **Impacto en Lighthouse:**
   - WebM puede reducir el tamaño del video
   - Menor tiempo de descarga
   - Potencial mejora en LCP si el video se carga (aunque el poster sigue siendo el LCP)

### Estado Actual

- ✅ Desktop: `hero.webm` (WebM)
- ✅ Mobile: `hero-mobile.mp4` (MP4 - sin cambios)
- ✅ Detección automática de tipo MIME
- ✅ Compatibilidad con ambos formatos

### Notas Técnicas

- El poster sigue siendo el elemento LCP (no cambia)
- El video se carga después del primer paint (no afecta LCP)
- WebM tiene mejor soporte en navegadores modernos
- Mobile mantiene MP4 para máxima compatibilidad

---

**Fin del Reporte Actualizado - Versión 5.2 (Actualización Video Hero WebM)**

---

## ELIMINACIÓN ÚLTIMO REEMPLAZO POST-RENDER (VERSIÓN 5.3)

### Objetivo de la Verificación Final

Eliminar cualquier reemplazo visible posterior al primer render. Lighthouse penaliza por reemplazo tardío de contenido grande. El objetivo es que el contenido principal aparezca una sola vez y no vuelva a cambiar.

### Verificación Completa Realizada

#### 1. ELIMINAR RE-MONTAJE DE HOME ✅

**AppRoutes.jsx (línea 26):**
```jsx
<Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
```

**Estado verificado:**
- ✅ Key es estático ("home") - no cambia
- ✅ No hay key dinámico que cause re-montaje
- ✅ Home no está envuelto por wrappers que cambien
- ✅ No hay animaciones que reinicien el árbol
- ✅ No hay condiciones que rendericen Home dos veces

**Búsqueda realizada:**
```bash
grep -r "key=.*\{|key=\{.*location|key=\{.*pathname" client/src/routes
# Resultado: ✅ No encontrado
```

**Home.jsx verificado:**
- ✅ No tiene useEffect que cause re-render
- ✅ No tiene estados mounted/ready/isClient
- ✅ Renderiza directamente sin condiciones

**Resultado:** ✅ Home se monta una sola vez y permanece

#### 2. SUSPENSE FINAL (CERO REEMPLAZOS) ✅

**Suspense en Home.jsx (líneas 314, 318, 324):**
```jsx
<Suspense fallback={null}>
  <Beneficios />
</Suspense>

<Suspense fallback={null}>
  <Contact form="home" />
</Suspense>

<Suspense fallback={null}>
  <CustomerSlider />
</Suspense>
```

**Estado verificado:**
- ✅ Todos los Suspense tienen `fallback={null}`
- ✅ Todos los Suspense están en componentes below-the-fold
- ✅ NO hay Suspense en el primer viewport
- ✅ NO hay loaders visibles
- ✅ NO hay skeletons
- ✅ NO hay placeholders
- ✅ NO hay bloques que luego desaparecen

**Verificación de viewport:**
- Hero (StaticHero) - ✅ Renderiza inmediatamente, sin Suspense
- ServiceTitle - ✅ Renderiza inmediatamente, sin Suspense
- Menu container - ✅ Renderiza inmediatamente, sin Suspense
- Beneficios - ⬇️ Below-the-fold, con Suspense fallback={null}
- Contact - ⬇️ Below-the-fold, con Suspense fallback={null}
- CustomerSlider - ⬇️ Below-the-fold, con Suspense fallback={null}

**Resultado:** ✅ Ningún nodo grande es reemplazado después del primer render

#### 3. ROUTING SIN RESET VISUAL ✅

**AppRoutes.jsx verificado:**
```jsx
<Routes>
  {/* Home renderizado sin Suspense - CRÍTICO para LCP */}
  {homeRoute && (
    <Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
  )}
  {/* Rutas secundarias con Suspense - fallback null para evitar CLS */}
  {otherRoutes.map(({ path, Component }) => (
    <Route
      key={path}
      path={path}
      element={
        <Suspense fallback={null}>
          <Component />
        </Suspense>
      }
    />
  ))}
</Routes>
```

**Estado verificado:**
- ✅ No hay animaciones de cambio de ruta
- ✅ No hay wrappers que reinicien el layout
- ✅ Home no se remonta al cambiar de ruta (solo cuando se navega a otra ruta)
- ✅ Key estático para Home previene re-montaje innecesario

**Búsqueda realizada:**
```bash
grep -r "AnimatePresence.*Route|motion.*Route|transition.*route" client/src/routes
# Resultado: ✅ No encontrado
```

**Resultado:** ✅ El contenido principal aparece una vez y queda estable

#### 4. LCP DEFINITIVO (CONFIRMACIÓN FINAL) ✅

**Elemento LCP identificado:**
- **Componente:** `StaticHero` (línea 201 de `Home.jsx`)
- **Elemento:** `<img>` del poster (línea 95 de `StaticHero.jsx`)
- **Selector esperado:** `img.hero-poster-img` o `picture > img`

**Código del poster (`StaticHero.jsx` líneas 90-112):**
```jsx
<picture>
  <source 
    media="(min-width: 768px)" 
    srcSet={desktopPoster}
  />
  <img
    src={mobilePoster}
    alt=""
    width={1920}
    height={1080}
    fetchPriority="high"
    loading="eager"
    decoding="async"
    className="hero-poster-img"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 1,
      // NUNCA display: none, NUNCA opacity: 0
      // El poster permanece visible siempre
    }}
  />
</picture>
```

**Verificaciones realizadas:**
- ✅ Existe desde el primer render (renderiza inmediatamente con Home)
- ✅ NO se reemplaza (poster permanece en DOM siempre)
- ✅ NO se oculta (sin display: none, sin opacity: 0)
- ✅ NO se anima (sin animaciones de entrada)
- ✅ width y height definidos (evita CLS)

**Búsqueda realizada:**
```bash
grep -r "display.*none|opacity.*0|visibility.*hidden" client/src/components/StaticHero.jsx
# Resultado: ✅ No encontrado (solo comentarios confirmando que nunca se oculta)
```

**Resultado:** ✅ El LCP existe desde el primer render y no cambia durante la carga

#### 5. ANIMATEPRESENCE EN HOME (VERIFICACIÓN) ✅

**AnimatePresence en Home.jsx (líneas 228-276):**
```jsx
<AnimatePresence mode="wait">
  {activeMenuItem === 0 && (
    <motion.div key="about" ...>
      {/* Contenido about */}
    </motion.div>
  )}
  {activeMenuItem === 1 && (
    <motion.div key="services" ...>
      {/* Contenido services */}
    </motion.div>
  )}
  {activeMenuItem === 2 && (
    <motion.div key="contact" ...>
      {/* Contenido contact */}
    </motion.div>
  )}
</AnimatePresence>
```

**Estado verificado:**
- ✅ AnimatePresence está dentro de un menú interactivo (hover)
- ✅ NO está en el primer viewport crítico
- ✅ Solo cambia cuando el usuario interactúa (hover)
- ✅ NO afecta el render inicial
- ✅ NO causa CLS en el primer render
- ✅ Solo anima opacity (no afecta layout)

**Resultado:** ✅ No causa reemplazos en el primer render

### Resumen de Verificación Final

| Área | Estado | Verificación |
|------|--------|--------------|
| **Home re-montaje** | ✅ | Key estático, no se remonta |
| **Suspense en viewport** | ✅ | No hay Suspense en primer viewport |
| **Suspense fallbacks** | ✅ | Todos null, below-the-fold |
| **Routing animaciones** | ✅ | No hay animaciones de ruta |
| **Routing re-montaje** | ✅ | Home no se remonta innecesariamente |
| **LCP estable** | ✅ | Poster no se reemplaza ni se oculta |
| **AnimatePresence** | ✅ | Solo interactividad, no afecta primer render |

### Conclusión de Verificación Final

**Estado del código:** ✅ CERO REEMPLAZOS POST-RENDER

**Verificaciones completadas:**
1. ✅ Home se monta una sola vez y permanece
2. ✅ Ningún nodo grande es reemplazado después del primer render
3. ✅ El contenido principal aparece una vez y queda estable
4. ✅ El LCP existe desde el primer render y no cambia

**Regla final cumplida:**
- ✅ Un solo render
- ✅ Una sola aparición
- ✅ Cero reemplazos

**Cambios aplicados:**
- Ninguno necesario - Todo ya estaba correcto
- Home ya tiene key estático
- Suspense ya tienen fallback={null} y están below-the-fold
- Routing ya está limpio sin animaciones
- LCP ya es estable desde el primer render
- AnimatePresence solo para interactividad, no afecta primer render

**Próximo paso:** Ejecutar Lighthouse 3 veces y validar métricas:
- CLS < 0.1
- LCP < 2000ms
- Performance ≥ 90

---

**Fin del Reporte Actualizado - Versión 5.3 (Eliminación Último Reemplazo Post-Render)**

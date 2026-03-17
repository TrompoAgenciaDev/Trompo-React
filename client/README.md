# Trompo - Agencia Digital

## 📋 Descripción del Proyecto

**Trompo** es una aplicación web corporativa para una agencia digital que ofrece servicios de creatividad, estrategia, desarrollo web, interacción y soporte. La aplicación está construida con React.js y utiliza tecnologías modernas para garantizar una experiencia de usuario óptima.

## 🏗️ Arquitectura del Proyecto

### **Stack Tecnológico**
- **Frontend**: React 19.2.1 + Vite 7.0.4
- **Routing**: React Router DOM 7.7.0
- **Animaciones**: Framer Motion 12.23.6
- **Estilos**: CSS puro con prefijos de compatibilidad
- **Build**: Vite con compresión Brotli
- **Linting**: ESLint con reglas personalizadas

### **Estructura de Carpetas**
```
src/
├── assets/
│   ├── styles/          # CSS organizados por componente/página
│   └── fonts/           # Fuentes tipográficas
├── components/          # Componentes reutilizables
│   ├── buttons/         # Botones especializados
│   ├── sliders/         # Sliders y carruseles
│   ├── forms/           # Formularios
│   └── popups/          # Modales y popups
├── hooks/               # Custom hooks
├── layout/              # Componentes de layout
├── pages/               # Páginas principales
│   └── servicios/       # Páginas de servicios
├── routes/              # Configuración de rutas
├── templates/           # Templates para posts/portfolio
└── utils/               # Utilidades
```

## 🚀 Optimizaciones Implementadas

### **Performance**
- **Code Splitting**: Lazy loading de páginas con React.lazy()
- **Lazy Loading**: Imágenes y videos se cargan bajo demanda
- **Preload Inteligente**: Recursos críticos se precargan automáticamente
- **Bundle Optimization**: Compresión Brotli y minificación Terser
- **Prefetch**: Páginas relacionadas se precargan estratégicamente

### **Videos Hero**
- **Componente**: `SimpleHeroVideo` para videos hero optimizados
- **Responsive**: Versiones desktop y mobile automáticas
- **Preload**: Solo metadata para reducir carga inicial
- **Posters**: Imágenes placeholder optimizadas
- **Archivos**: `home.mp4` (desktop) y `home-mobile.mp4` (mobile)

### **Imágenes**
- **LazyImage**: Componente con lazy loading y placeholders
- **Formato**: WebP para mejor compresión
- **Responsive**: Adaptación automática a diferentes dispositivos

## 📱 Páginas y Rutas

### **Páginas Principales**
- `/` - Home (página principal)
- `/nosotros` - Sobre la agencia
- `/contactanos` - Formulario de contacto

### **Servicios**
- `/estrategia` - Servicios de estrategia digital
- `/creatividad` - Servicios creativos y branding
- `/desarrollo` - Desarrollo web y plataformas
- `/interaccion` - Redes sociales y automation
- `/soporte` - Soporte técnico y mantenimiento

### **Otras Páginas**
- `/post/:slug` - Posts individuales
- `/portfolio/:id` - Casos de estudio
- `/gracias` - Página de confirmación
- `/terms` - Términos y condiciones
- `/clear-cache` - Página de limpieza de caché (excluida de analíticas)

## 🎨 Sistema de Estilos

### **Organización CSS**
- **Un archivo por página/componente**: Estilos modulares
- **Prefijos de compatibilidad**: Webkit, Moz, MS, O
- **Responsive Design**: Mobile-first con breakpoints
- **Variables CSS**: Para colores y fuentes consistentes

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: 1280px+
- **XL Desktop**: 1366px+

### **Colores Principales**
- **Amarillo**: #FED332 (color principal)
- **Amarillo Claro**: #FEE070 (fondos)
- **Gris**: #F5F5F5 (fondos neutros)
- **Negro**: #1D1D1B (texto principal)

## 🔧 Componentes Clave

### **LazyImage**
```jsx
<LazyImage 
  src="imagen.webp" 
  alt="Descripción"
  placeholder="#ffffff"
  critical={false}
/>
```

### **SimpleHeroVideo**
```jsx
<SimpleHeroVideo
  desktopSrc="video-desktop.mp4"
  mobileSrc="video-mobile.mp4"
  desktopPoster="poster-desktop.webp"
  mobilePoster="poster-mobile.webp"
/>
```

### **LazyComponent**
```jsx
<LazyComponent
  importFunc={() => import('./HeavyComponent')}
  fallback={<LoadingSpinner />}
/>
```

## 📊 Hooks Personalizados

### **useLazyLoading**
- **Propósito**: Lazy loading con Intersection Observer
- **Uso**: Para imágenes y videos no críticos
- **Configuración**: Threshold, rootMargin, once

### **usePreloadResources**
- **Propósito**: Preload dinámico de recursos críticos
- **Uso**: Videos hero y imágenes importantes
- **Automático**: Se ejecuta en cada cambio de ruta

### **usePrefetchRoutes**
- **Propósito**: Prefetch de páginas relacionadas
- **Uso**: Mejora la navegación entre páginas
- **Inteligente**: Prefetch basado en la página actual

## 🎯 Configuración de Vite

### **Aliases**
- `@` → `/src`
- `@a` → `/src/assets`
- `@as` → `/src/assets/styles`
- `@ai` → `/src/assets/icons`
- `@ap` → `/src/assets/portfolioImg`

### **Optimizaciones**
- **Compresión**: Brotli para archivos > 1KB
- **Code Splitting**: CSS y JS separados
- **Minificación**: Terser para producción
- **Target**: ESNext para mejor performance

## ⚠️ Consideraciones Importantes

### **Videos Hero**
- **CRÍTICO**: Los videos hero usan `SimpleHeroVideo` (NO `OptimizedHeroVideo`)
- **Preload**: Solo metadata para reducir carga inicial
- **Posters**: Obligatorios para mejor UX
- **Formato**: MP4 con fallback WebM
- **Archivos Actuales**: `home.mp4` y `home-mobile.mp4` (corregidos desde `home2.mp4`)

### **Imágenes**
- **Formato**: WebP preferido, con fallback
- **Lazy Loading**: Usar `LazyImage` para imágenes no críticas
- **Placeholders**: Colores consistentes con el diseño
- **Responsive**: Usar srcset para diferentes resoluciones

### **Rutas**
- **Code Splitting**: Todas las páginas usan React.lazy()
- **Suspense**: LoadingSpinner durante carga
- **Prefetch**: Se ejecuta automáticamente
- **SEO**: Rutas amigables y meta tags

### **Estilos**
- **Prefijos**: Mantener compatibilidad con navegadores antiguos
- **Grid**: Usar prefijos `-ms-grid` para IE
- **Flexbox**: Prefijos completos para todos los navegadores
- **Transform**: Prefijos `-webkit-`, `-moz-`, `-o-`

## 🚨 Reglas de Desarrollo

### **NO Modificar**
- **Estructura de rutas**: `routesConfig.js` y `AppRoutes.jsx`
- **Hooks de optimización**: `useLazyLoading`, `usePreloadResources`
- **Componentes de video**: `SimpleHeroVideo` funciona correctamente
- **Configuración de Vite**: Aliases y optimizaciones

### **SÍ Modificar**
- **Contenido**: Textos, imágenes, videos
- **Estilos**: CSS dentro de los archivos existentes
- **Componentes**: Agregar nuevos componentes
- **Páginas**: Crear nuevas páginas siguiendo el patrón

### **Antes de Modificar**
1. **Leer este README** completamente
2. **Probar en desarrollo** antes de producción
3. **Verificar performance** con DevTools
4. **Mantener compatibilidad** con navegadores
5. **Seguir patrones** existentes

## 🔍 Debugging

### **Videos No Se Ven**
- Verificar que use `SimpleHeroVideo` (NO `OptimizedHeroVideo`)
- Comprobar rutas de archivos de video
- Revisar consola para errores de carga

### **Imágenes No Carguen**
- Verificar que use `LazyImage` para imágenes no críticas
- Comprobar rutas de archivos de imagen
- Revisar placeholder colors

### **Performance Lenta**
- Verificar que el code splitting esté activo
- Comprobar que lazy loading funcione
- Revisar bundle size en DevTools

### **Error 403 (Forbidden)**
Si encuentras errores 403 en alguna página, especialmente en `/soporte`, verifica:

1. **Archivos de recursos faltantes**
   - Verificar que todos los archivos referenciados existan (videos, imágenes, posters)
   - Los posters de videos deben existir o usar archivos alternativos (ej: `home.webp`)

2. **Rutas y URLs**
   - Asegurar consistencia en el uso de `BASE_URL` (usar variable `base` con barra final)
   - Verificar que las rutas de assets sean correctas

3. **Configuración del servidor**
   - Revisar permisos de archivos y directorios
   - Verificar que `.htaccess` permita acceso a archivos estáticos
   - Comprobar que no haya conflictos con `.htaccess` anidados

4. **Caché del navegador**
   - El error 403 puede ser causado por caché obsoleta
   - Usar la página de limpieza de caché: `/clear-cache`
   - O agregar `?nocache=timestamp` a la URL

## 🧹 Manejo de Caché

### **Sistema de Limpieza de Caché**

El proyecto incluye un sistema completo para manejar y limpiar la caché cuando sea necesario.

#### **Página de Limpieza de Caché**
- **URL**: `/clear-cache`
- **Funcionalidades**:
  - Limpia Service Workers registrados
  - Limpia Cache API del navegador
  - Fuerza recarga sin caché
  - Interfaz visual con barra de progreso
  - **Excluida de Google Analytics** (no aparece en las métricas)

#### **Métodos para Limpiar Caché**

**Opción 1: Página Dedicada**
```
https://tudominio.com/clear-cache
```
Visita esta URL para limpiar automáticamente toda la caché del navegador.

**Opción 2: Parámetro en URL**
Agrega `?nocache=timestamp` a cualquier URL:
```
https://tudominio.com/soporte?nocache=1234567890
```
El servidor desactivará automáticamente el caché para esa solicitud específica.

**Opción 3: Atajos de Teclado**
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
Esto fuerza una recarga completa sin usar caché.

**Opción 4: DevTools**
1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Marca la opción **"Disable cache"**
4. Recarga la página

#### **Configuración en .htaccess**

El archivo `.htaccess` incluye reglas automáticas para:
- Detectar el parámetro `?nocache=` en las URLs
- Desactivar caché para la página `/clear-cache`
- Mantener caché normal para el resto del sitio (optimización de performance)

#### **Cuándo Usar la Limpieza de Caché**

Usa la limpieza de caché cuando:
- ✅ Encuentres errores 403 o 404 inesperados
- ✅ Los cambios no se reflejen después de un deploy
- ✅ Los recursos (imágenes, videos) no se actualicen
- ✅ Haya problemas de visualización después de actualizaciones
- ✅ Necesites forzar una recarga completa del sitio

#### **Notas Importantes**

- La página `/clear-cache` está **excluida de Google Analytics** para no afectar las métricas
- La limpieza de caché solo afecta al navegador del usuario, no al servidor
- Los recursos estáticos (videos, imágenes) tienen caché de 1 año para optimización
- El sistema mantiene el balance entre performance (caché) y actualizaciones (limpieza)

## 📈 Métricas de Performance

### **Objetivos**
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Bundle Size**: < 1MB inicial

### **Herramientas**
- **Lighthouse**: Para métricas de performance
- **DevTools**: Para análisis de red y bundle
- **WebPageTest**: Para testing en diferentes conexiones

## 🛠️ Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

## 📞 Soporte

Para dudas sobre el proyecto, consultar:
1. Este README
2. Comentarios en el código
3. Documentación de React y Vite
4. DevTools para debugging

---

**⚠️ IMPORTANTE**: Este proyecto está optimizado para performance. Cualquier modificación debe mantener estas optimizaciones para no afectar la experiencia del usuario.
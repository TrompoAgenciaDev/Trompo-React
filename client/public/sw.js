// Service Worker para cacheo offline de recursos estáticos
// Versión del cache - incrementar para invalidar cache anterior
const CACHE_VERSION = 'v1';
const CACHE_NAME = `trompo-static-${CACHE_VERSION}`;

// Recursos estáticos a cachear en la instalación
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  // Archivos JSON estáticos
  '/posts.json',
  '/portfolio.json',
  '/services.json',
  '/testimoniales.json',
  '/values.json',
  '/members.json',
  '/faqs.json',
  '/clientes-storic.json',
  // Imágenes críticas
  '/logo2.webp',
  '/Icon.svg',
  '/icon-top.svg',
];

// Patrones de recursos que deben ser cacheados (Cache First)
const STATIC_PATTERNS = [
  /\.json$/,
  /\.webp$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.svg$/,
  /\.gif$/,
  /\.css$/,
  /\.js$/,
  /\.woff2?$/,
  /\.ttf$/,
  /\.eot$/,
];

// Patrones de recursos que NO deben ser cacheados
const EXCLUDE_PATTERNS = [
  /\/clear-cache/,
  /form-handler\.php/,
  /\.php$/,
  /sw\.js$/, // No cachear el service worker mismo
];

/**
 * Verifica si una URL debe ser cacheada
 */
function shouldCache(url) {
  // Excluir URLs que no deben ser cacheadas
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(url))) {
    return false;
  }

  // Cachear si coincide con algún patrón estático
  return STATIC_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Instalación del Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando recursos estáticos iniciales');
        // Cachear recursos críticos, pero no fallar si algunos fallan
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.warn('[SW] Algunos recursos no se pudieron cachear:', err);
        });
      })
      .then(() => {
        // Forzar activación inmediata del nuevo service worker
        return self.skipWaiting();
      })
  );
});

/**
 * Activación del Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Eliminar caches antiguos
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('trompo-static-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Eliminando cache antiguo:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Tomar control de todas las páginas inmediatamente
        return self.clients.claim();
      })
  );
});

/**
 * Interceptar peticiones fetch - Estrategia Cache First para recursos estáticos
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo procesar peticiones GET
  if (request.method !== 'GET') {
    return;
  }

  // Solo procesar peticiones del mismo origen
  if (url.origin !== self.location.origin) {
    return;
  }

  // Verificar si el recurso debe ser cacheado
  if (!shouldCache(url.href)) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Cache First: devolver del cache si existe
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en cache, hacer fetch y cachear
        return fetch(request)
          .then((response) => {
            // Solo cachear respuestas exitosas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para poder cachearla
            const responseToCache = response.clone();

            // Cachear la respuesta
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.warn('[SW] Error al hacer fetch:', error);
            // En caso de error, intentar devolver del cache si existe
            return caches.match(request);
          });
      })
  );
});

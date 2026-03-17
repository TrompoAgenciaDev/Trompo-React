import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para preload dinámico de recursos críticos basado en la ruta actual
 */
export const usePreloadResources = () => {
  const location = useLocation();

  useEffect(() => {
    // Diferir ejecución para no bloquear main thread - usar requestIdleCallback
    const executePreload = () => {
      const preloadResource = (href, as, type = null) => {
        // Verificar si ya existe el preload
        const existingLink = document.querySelector(`link[rel="preload"][href="${href}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        
        // Agregar 'as' si está presente y es válido
        if (as) {
          link.as = as;
        }
        
        if (type) {
          link.type = type;
        }

        document.head.appendChild(link);
      };

      const removePreload = (href) => {
        const link = document.querySelector(`link[rel="preload"][href="${href}"]`);
        if (link) {
          document.head.removeChild(link);
        }
      };

      // Limpiar preloads anteriores
      const existingPreloads = document.querySelectorAll('link[rel="preload"][as="video"]');
      existingPreloads.forEach(link => {
        if (link.href.includes('assets/hero/')) {
          document.head.removeChild(link);
        }
      });

      const base = import.meta.env.BASE_URL?.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;

      // Preload del video hero: no usar preload con as="video" (soporte limitado).
      // El video se carga cuando el componente Hero lo necesita.
      // Preload de imágenes críticas de la página actual
      const getCriticalImages = (pathname) => {
        const images = [];
        
        if (pathname === '/' || pathname === '/home') {
          images.push(`${base}assets/hero/home.webp`);
        }
        
        if (pathname.includes('/nosotros')) {
          images.push(`${base}assets/hero/home.webp`);
        }
        
        // Agregar más imágenes críticas según la página
        return images;
      };

      const criticalImages = getCriticalImages(location.pathname);
      criticalImages.forEach(imageSrc => {
        preloadResource(imageSrc, 'image');
      });
    };

    // Diferir con requestIdleCallback o setTimeout como fallback
    let cleanup;
    if ('requestIdleCallback' in window) {
      const idleId = requestIdleCallback(executePreload, { timeout: 2000 });
      cleanup = () => cancelIdleCallback(idleId);
    } else {
      const timeoutId = setTimeout(executePreload, 100);
      cleanup = () => clearTimeout(timeoutId);
    }

    return cleanup;
  }, [location.pathname]);
};

/**
 * Hook para prefetch de recursos de páginas relacionadas
 * @param {Array} relatedPages - Array de rutas relacionadas
 * @param {number} delay - Delay en ms antes de hacer prefetch
 */
export const usePrefetchRelated = (relatedPages = [], delay = 2000) => {
  useEffect(() => {
    if (relatedPages.length === 0) return;

    const timer = setTimeout(() => {
      const base = import.meta.env.BASE_URL?.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;

      relatedPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = `${base}${page}`;
        document.head.appendChild(link);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [relatedPages, delay]);
};

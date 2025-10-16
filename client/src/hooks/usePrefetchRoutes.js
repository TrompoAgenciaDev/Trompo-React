import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para prefetch inteligente de rutas relacionadas
 */
export const usePrefetchRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const prefetchRoute = (routePath) => {
      // Crear un link de prefetch con URL completa
      const base = import.meta.env.BASE_URL?.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `${window.location.origin}${base}${routePath.replace(/^\//, '')}`;
      document.head.appendChild(link);
    };

    // Prefetch de páginas relacionadas basado en la ruta actual
    const getRelatedRoutes = (pathname) => {
      const routes = [];
      
      if (pathname === '/' || pathname === '/home') {
        // Desde home, prefetch páginas principales
        routes.push('/nosotros', '/contactanos', '/estrategia', '/creatividad');
      }
      
      if (pathname.includes('/nosotros')) {
        // Desde nosotros, prefetch servicios
        routes.push('/estrategia', '/creatividad', '/desarrollo', '/contactanos');
      }
      
      if (pathname.includes('/estrategia') || pathname.includes('/creatividad') || 
          pathname.includes('/desarrollo') || pathname.includes('/interaccion') || 
          pathname.includes('/soporte')) {
        // Desde servicios, prefetch otros servicios y contacto
        routes.push('/nosotros', '/contactanos');
        if (!pathname.includes('/estrategia')) routes.push('/estrategia');
        if (!pathname.includes('/creatividad')) routes.push('/creatividad');
        if (!pathname.includes('/desarrollo')) routes.push('/desarrollo');
        if (!pathname.includes('/interaccion')) routes.push('/interaccion');
        if (!pathname.includes('/soporte')) routes.push('/soporte');
      }
      
      if (pathname.includes('/contactanos')) {
        // Desde contacto, prefetch servicios principales
        routes.push('/estrategia', '/creatividad', '/desarrollo', '/nosotros');
      }
      
      return routes;
    };

    // Delay para no interferir con la carga inicial
    const timer = setTimeout(() => {
      const relatedRoutes = getRelatedRoutes(location.pathname);
      relatedRoutes.forEach(route => {
        prefetchRoute(route);
      });
    }, 2000); // Prefetch después de 2 segundos

    return () => clearTimeout(timer);
  }, [location.pathname]);
};

/**
 * Hook para prefetch en hover de enlaces
 * @param {string} routePath - Ruta a prefetch
 */
export const usePrefetchOnHover = (routePath) => {
  const prefetchRoute = (path) => {
    const base = import.meta.env.BASE_URL?.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `${window.location.origin}${base}${path.replace(/^\//, '')}`;
    document.head.appendChild(link);
  };

  return {
    onMouseEnter: () => prefetchRoute(routePath),
    onFocus: () => prefetchRoute(routePath)
  };
};

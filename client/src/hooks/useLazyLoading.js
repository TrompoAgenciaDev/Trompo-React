import { useState, useEffect, useRef } from 'react';

/**
 * Hook para lazy loading de imágenes y videos usando Intersection Observer
 * @param {Object} options - Opciones de configuración
 * @param {number} options.threshold - Umbral de visibilidad (0-1)
 * @param {string} options.rootMargin - Margen del root (ej: "50px")
 * @param {boolean} options.once - Si solo debe ejecutarse una vez
 * @returns {Object} { isVisible, ref }
 */
export const useLazyLoading = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    once = true
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Si ya se cargó y es "once", no hacer nada más
    if (hasLoaded && once) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            setHasLoaded(true);
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, once, hasLoaded]);

  return { isVisible, ref: elementRef };
};

/**
 * Hook específico para lazy loading de videos con poster
 * @param {Object} options - Opciones de configuración
 * @returns {Object} { isVisible, ref, shouldLoadVideo }
 */
export const useLazyVideo = (options = {}) => {
  const { isVisible, ref } = useLazyLoading(options);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Pequeño delay para mejorar la UX
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return { isVisible, ref, shouldLoadVideo };
};

/**
 * Hook para preload de recursos críticos
 * @param {string} href - URL del recurso a preload
 * @param {string} as - Tipo de recurso (video, image, etc.)
 * @param {boolean} shouldPreload - Si debe hacer preload
 */
export const usePreload = (href, as = 'image', shouldPreload = true) => {
  useEffect(() => {
    if (!shouldPreload || !href) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (as === 'video') {
      link.type = 'video/mp4';
    }

    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [href, as, shouldPreload]);
};

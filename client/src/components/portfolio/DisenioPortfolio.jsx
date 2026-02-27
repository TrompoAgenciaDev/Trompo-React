import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";
import LazyImage from "../LazyImage";

// Hook para precargar imágenes en segundo plano
const useImagePreloader = (imageUrls, bufferSize = 3) => {
  const preloadedRef = useRef(new Set());
  const preloadingRef = useRef(new Set());

  const preloadImage = useCallback((url) => {
    if (!url || preloadedRef.current.has(url) || preloadingRef.current.has(url)) return;
    
    preloadingRef.current.add(url);
    const img = new Image();
    img.onload = () => {
      preloadedRef.current.add(url);
      preloadingRef.current.delete(url);
    };
    img.onerror = () => {
      preloadingRef.current.delete(url);
    };
    img.src = url;
  }, []);

  // Precargar imágenes críticas (primeras de cada slide)
  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;
    
    // Precargar primeras imágenes de cada slide inmediatamente
    imageUrls.forEach((item) => {
      if (item.images && item.images.length > 0) {
        // Precargar primera imagen de cada slide
        preloadImage(item.images[0]);
        // Precargar segunda imagen si existe
        if (item.images.length > 1) {
          preloadImage(item.images[1]);
        }
      }
    });
  }, [imageUrls, preloadImage]);

  // Precargar buffer de imágenes alrededor del índice activo
  const preloadBuffer = useCallback((activeIndex) => {
    if (!imageUrls || imageUrls.length === 0) return;
    
    const item = imageUrls[activeIndex];
    if (!item || !item.images) return;

    // Precargar imágenes del slide activo y adyacentes
    const start = Math.max(0, activeIndex - 1);
    const end = Math.min(imageUrls.length - 1, activeIndex + 1);
    
    for (let i = start; i <= end; i++) {
      const slideItem = imageUrls[i];
      if (slideItem && slideItem.images) {
        // Precargar hasta bufferSize imágenes de cada slide adyacente
        slideItem.images.slice(0, bufferSize).forEach(preloadImage);
      }
    }
  }, [imageUrls, bufferSize, preloadImage]);

  return { preloadBuffer, preloadImage };
};

// Caché simple para evitar recargas múltiples
// COMENTADO: Deshabilitado para forzar recarga siempre y ver cambios en tiempo real
const portfolioCache = new Map();

// Cargar datos del portfolio sin caché para ver cambios en tiempo real
async function fetchPortfolioData(category = "branding") {
  const cacheKey = `portfolio-${category}`;
  
  // COMENTADO: Deshabilitar caché en memoria para forzar recarga
  // if (portfolioCache.has(cacheKey)) {
  //   return portfolioCache.get(cacheKey);
  // }
  
  // Usar buildTime para versionado del cache
  const buildTime = import.meta.env.BUILD_TIME || Date.now();
  const res = await fetch(`${import.meta.env.BASE_URL}portfolio.json?v=${buildTime}`, {
    cache: "default",
  });
  if (!res.ok) throw new Error("No se pudo cargar portfolio.json");
  const data = await res.json();
  
  // Si es "branding", buscar en disenio
  if (category === "branding") {
    const items = Array.isArray(data?.disenio) ? data.disenio : [];
    const filtered = items.filter(item => {
      const categories = Array.isArray(item.category) ? item.category : [];
      return categories.some(cat => cat && cat.toLowerCase() === "branding" && !categories.some(c => c && c.toLowerCase() === "branding-web"));
    });
    
    // COMENTADO: No guardar en caché para forzar recarga
    // portfolioCache.set(cacheKey, filtered);
    return filtered;
  }
  
  // Si es "social media", buscar en interaccion
  const items = Array.isArray(data?.interaccion) ? data.interaccion : [];
  const filtered = items.filter(item => {
    const categories = Array.isArray(item.category) ? item.category : [];
    return categories.some(cat => cat && cat.toLowerCase() === "social media");
  });
  
  // COMENTADO: No guardar en caché para forzar recarga
  // portfolioCache.set(cacheKey, filtered);
  return filtered;
}

/* Inner slider infinito 4:3 con lazy loading - solo imágenes */
/* REFACTORIZADO: Loop infinito con snap invisible para evitar saltos */
function InnerAutoSlider({ list, interval = 1500, direction = 1, isVisible, isHovered = false, autoStart = false, isInViewport: externalIsInViewport = null, preloadImage: externalPreloadImage = null }) {
  const len = list.length;
  
  // TODOS LOS HOOKS DEBEN ESTAR ANTES DE CUALQUIER RETURN CONDICIONAL
  // Preparar array extendido: 5 copias para loop infinito real
  // [copia1][copia2][copia3][copia4][copia5]
  // La copia central (copia3) es la que se muestra normalmente
  const REPEAT = 5;
  const extended = useMemo(() => len > 1 ? Array.from({ length: REPEAT }, () => list).flat() : [], [list, len]);
  const baseLen = len;
  
  // Índice GLOBAL en el array extendido (0 a extended.length-1)
  // Estado inicial: baseLen * 2 (inicio de copia central, imagen 0)
  const CENTER_COPY_START = baseLen > 1 ? baseLen * 2 : 0;
  const [globalIndex, setGlobalIndex] = useState(CENTER_COPY_START);
  
  // Control de animación: true = animación normal, false = snap instantáneo
  const [shouldAnimate, setShouldAnimate] = useState(true);
  
  // Ref para el intervalo de autoplay - cada instancia tiene su propio ref
  const autoplayIntervalRef = useRef(null);
  // Ref para el timeout del delay inicial
  const startDelayRef = useRef(null);
  // Ref para rastrear si está en hover
  const wasHoveredRef = useRef(false);
  // Ref para el contenedor (lazy loading)
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);
  // Ref para prevenir múltiples resets simultáneos
  const isResettingRef = useRef(false);
  // Ref para rastrear el índice anterior y detectar saltos grandes
  const prevGlobalIndexRef = useRef(CENTER_COPY_START);
  // Estado para rastrear si está en viewport (para autoStart)
  const [internalIsInViewport, setInternalIsInViewport] = useState(false);
  
  // Usar el prop externo si está disponible, sino usar el interno
  const isInViewport = externalIsInViewport !== null ? externalIsInViewport : internalIsInViewport;

  // Lazy loading: solo renderizar cuando está visible
  useEffect(() => {
    if (!isVisible || shouldRender) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, shouldRender]);

  // Detectar si está en viewport (para autoStart en mobile) - solo si no hay prop externo
  useEffect(() => {
    if (!autoStart || !shouldRender || !containerRef.current || externalIsInViewport !== null) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        setInternalIsInViewport(entries[0].isIntersecting);
      },
      { threshold: 0.5 } // Al menos 50% visible
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [autoStart, shouldRender, externalIsInViewport]);

  // Función para limpiar todos los timers
  const clearAllTimers = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }
  }, []);

  // Efecto: Monitorear globalIndex para hacer snap cuando hay saltos grandes o salimos del rango
  useEffect(() => {
    const shouldBeActive = autoStart ? isInViewport : isHovered;
    if (len <= 1 || !shouldRender || !shouldBeActive || isResettingRef.current) return;

    const prevIndex = prevGlobalIndexRef.current;
    const CENTER_COPY_END = CENTER_COPY_START + baseLen - 1;
    
    // Detectar saltos grandes (más de 1) que indican un loop
    const indexDiff = Math.abs(globalIndex - prevIndex);
    const isLargeJump = indexDiff > 1 && indexDiff < baseLen; // Salto grande pero no un reset completo
    
    // Verificar si estamos fuera del rango de la copia central
    const isOutOfRange = globalIndex < CENTER_COPY_START || globalIndex > CENTER_COPY_END;
    
    // Si hay un salto grande o estamos fuera del rango, hacer snap sin animación
    if (isLargeJump || isOutOfRange) {
      let targetIndex = globalIndex;
      
      if (isOutOfRange) {
        // Calcular el índice relativo dentro de cualquier copia
        const relativeIndex = globalIndex % baseLen;
        // Calcular la posición equivalente en la copia central
        targetIndex = CENTER_COPY_START + relativeIndex;
      } else if (isLargeJump && globalIndex === CENTER_COPY_START + 1) {
        // Estamos haciendo loop: ya estamos en la posición correcta (imagen 1)
        targetIndex = globalIndex;
      }
      
      // Snap instantáneo sin animación
      setShouldAnimate(false);
      
      // Si necesitamos cambiar el índice, hacerlo
      if (targetIndex !== globalIndex) {
        setGlobalIndex(targetIndex);
      }
      
      // Habilitar animación después del snap (muy corto delay para que React procese el snap)
      const timeoutId = setTimeout(() => {
        setShouldAnimate(true);
      }, 10);
      
      // Actualizar el ref del índice anterior
      prevGlobalIndexRef.current = targetIndex !== globalIndex ? targetIndex : globalIndex;
      
      return () => clearTimeout(timeoutId);
    } else {
      // Actualizar el ref del índice anterior en caso normal
      prevGlobalIndexRef.current = globalIndex;
    }
  }, [globalIndex, len, shouldRender, isHovered, isInViewport, autoStart, CENTER_COPY_START, baseLen]);

  // Efecto PRINCIPAL: Controlar hover y autoplay
  useEffect(() => {
    // Si no hay imágenes suficientes o no está renderizado, salir
    if (len <= 1 || !shouldRender) return;

    // Determinar si debe estar activo: hover (desktop) o inViewport (mobile con autoStart)
    const shouldBeActive = autoStart ? isInViewport : isHovered;

    // Si el estado no cambió, no hacer nada
    if (wasHoveredRef.current === shouldBeActive) return;
    
    // Actualizar el ref INMEDIATAMENTE para prevenir ejecuciones múltiples
    wasHoveredRef.current = shouldBeActive;

    // LIMPIAR cualquier timer activo primero (CRÍTICO)
    clearAllTimers();

    if (shouldBeActive) {
      // AL HACER HOVER:
      // 1. Mover inmediatamente al slide índice 1 (segunda imagen) en la copia central con snap
      setShouldAnimate(false);
      const hoverStartIndex = CENTER_COPY_START + 1; // Imagen 1 (segunda) en copia central
      setGlobalIndex(hoverStartIndex);
      prevGlobalIndexRef.current = hoverStartIndex; // Actualizar ref para evitar falsos saltos
      
      // Habilitar animación después del snap
      setTimeout(() => setShouldAnimate(true), 50);
      
      // 2. Iniciar autoplay después de un pequeño delay
      startDelayRef.current = setTimeout(() => {
        // Verificar que aún estamos en hover
        if (!wasHoveredRef.current || isResettingRef.current) return;
        
        // Crear UN SOLO intervalo de autoplay
        autoplayIntervalRef.current = setInterval(() => {
          // Verificar que aún estamos en hover antes de avanzar
          if (!wasHoveredRef.current || isResettingRef.current) {
            clearAllTimers();
            return;
          }
          
          // Avanzar al siguiente slide en el array extendido
          setGlobalIndex((prev) => {
            const next = prev + 1;
            const CENTER_COPY_END = CENTER_COPY_START + baseLen - 1;
            
            // Si el siguiente índice estaría fuera de la copia central, hacer loop a imagen 1
            if (next > CENTER_COPY_END) {
              // Hacer loop: volver a la segunda imagen (índice 1) en la copia central
              // Hacer snap instantáneo sin animación
              const loopIndex = CENTER_COPY_START + 1;
              setShouldAnimate(false);
              prevGlobalIndexRef.current = loopIndex; // Actualizar ref antes del cambio
              // Re-habilitar animación después de un breve delay
              setTimeout(() => setShouldAnimate(true), 10);
              return loopIndex;
            }
            
            return next;
          });
        }, interval);
      }, 300);

      // Cleanup: limpiar el delay si el componente se desmonta o cambia el hover
      return () => {
        clearAllTimers();
      };

    } else {
      // AL QUITAR HOVER:
      // 1. Detener autoplay completamente
      clearAllTimers();
      
      // 2. Resetear al slide índice 0 (primera imagen) en la copia central con snap instantáneo
      setShouldAnimate(false);
      const resetIndex = CENTER_COPY_START; // Imagen 0 (primera) en copia central
      setGlobalIndex(resetIndex);
      prevGlobalIndexRef.current = resetIndex; // Actualizar ref para evitar falsos saltos
      isResettingRef.current = true;
      
      // Desactivar el flag de reset después de un breve momento
      setTimeout(() => {
        isResettingRef.current = false;
      }, 100);
    }

    // Cleanup general: siempre limpiar al desmontar
    return () => {
      clearAllTimers();
    };
  }, [isHovered, isInViewport, autoStart, len, shouldRender, interval, clearAllTimers, CENTER_COPY_START]);

  // Precargar imágenes próximas cuando está activo - MOVIDO ANTES DE RETURNS
  const shouldBeActive = autoStart ? isInViewport : isHovered;
  
  useEffect(() => {
    if (!shouldBeActive || !shouldRender || len <= 1) return;
    
    // Función de precarga local si no se pasa externamente
    const preload = externalPreloadImage || ((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
    
    // Precargar imágenes próximas (actual + siguientes 2)
    const currentImageIndex = globalIndex % baseLen;
    const nextIndices = [
      (currentImageIndex + 1) % baseLen,
      (currentImageIndex + 2) % baseLen,
    ];
    
    nextIndices.forEach(idx => {
      if (list[idx]) {
        preload(list[idx]);
      }
    });
  }, [globalIndex, shouldBeActive, shouldRender, len, baseLen, list, externalPreloadImage]);

  // Calcular el offset para la animación usando el índice global
  const offsetPct = globalIndex * 100;

  // Si solo hay 1 o menos imágenes, retornar simple
  if (len <= 1) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
        }}
      >
        <img
          src={list[0] || ""}
          alt=""
          decoding="async"
          width={1200}
          height={900}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  // Si aún no se debe renderizar (lazy loading)
  if (!shouldRender) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        }}
      />
    );
  }

  // Si NO está activo: mostrar solo la primera imagen estática (slide 0)
  if (!shouldBeActive) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
        }}
      >
        <img
          src={list[0]}
          alt=""
          decoding="async"
          width={1200}
          height={900}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  // Si hay hover: mostrar el slider con animación
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{ position: "absolute", inset: 0, display: "flex" }}
        animate={{ x: `-${offsetPct}%` }}
        transition={
          shouldAnimate 
            ? { duration: 0.45, ease: "easeOut" } 
            : { duration: 0 } // Snap instantáneo sin animación
        }
      >
        {extended.map((src, i) => {
          // Marcar como críticas las imágenes visibles y próximas
          const isVisible = Math.abs(i - globalIndex) <= 2;
          return (
            <div key={i} style={{ width: "100%", flex: "0 0 100%" }}>
              <LazyImage
                src={src}
                alt=""
                placeholder="#f0f0f0"
                critical={isVisible}
                width={1200}
                height={1200}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  aspectRatio: '1/1'
                }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Componente para cada slide en mobile: solo la primera imagen (destacada) del portfolio
function MobileSimpleSlide({ imageSrc }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <img
        src={imageSrc}
        alt=""
        decoding="async"
        width={1200}
        height={900}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

export default function DisenioPortfolio({ category = "branding" }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const draggingRef = useRef(false);
  const dragControls = useDragControls();
  const containerRef = useRef(null);
  
  // Hook de precarga de imágenes
  const { preloadBuffer, preloadImage } = useImagePreloader(items, 3);

  // Detectar si es mobile (<1024px) - desktop desde 1024px
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cargar datos con caché mejorado
  useEffect(() => {
    let mounted = true;
    let abortController = new AbortController();
    
    (async () => {
      try {
        const data = await fetchPortfolioData(category);
        if (!mounted || abortController.signal.aborted) return;
        
        // Preparar items con imágenes
        const preparedItems = data.map(item => {
          const base = import.meta.env.BASE_URL?.endsWith("/")
            ? import.meta.env.BASE_URL
            : `${import.meta.env.BASE_URL}/`;
          
          const images = [];
          
          // Para branding: usar featured_image y gallery
          if (category === "branding") {
            if (item.featured_image) {
              images.push(`${base}${item.featured_image.replace(/^\//, '')}`);
            }
            if (Array.isArray(item.gallery)) {
              item.gallery.forEach(g => {
                images.push(`${base}${g.replace(/^\//, '')}`);
              });
            }
          } else {
            // Para social media: usar vertical_image, featured_image y gallery
            if (item.vertical_image) {
              images.push(`${base}${item.vertical_image.replace(/^\//, '')}`);
            }
            if (item.featured_image) {
              images.push(`${base}${item.featured_image.replace(/^\//, '')}`);
            }
            if (Array.isArray(item.gallery)) {
              item.gallery.forEach(g => {
                images.push(`${base}${g.replace(/^\//, '')}`);
              });
            }
          }
          
          return {
            id: item.id,
            title: item.title || item.name,
            images: images.length > 0 ? images : [],
          };
        }).filter(item => item.images.length > 0);

        // Limitar a 12 items para el grid 4x3
        const limitedItems = preparedItems.slice(0, 12);
        
        if (mounted && !abortController.signal.aborted) {
          setItems(limitedItems);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error cargando portfolio:", error);
        }
      }
    })();
    
    return () => { 
      mounted = false;
      abortController.abort();
    };
  }, [category]);

  // Carrusel infinito para mobile - una sola imagen por cliente (primera/destacada)
  const REPEAT = 3;
  const firstImages = useMemo(() => {
    if (items.length === 0) return [];
    return items.map(item => item.images?.[0]).filter(Boolean);
  }, [items]);
  const slides = useMemo(() => {
    if (firstImages.length === 0) return [];
    return Array.from({ length: REPEAT }, () => firstImages).flat();
  }, [firstImages]);
  
  const baseLength = firstImages.length;
  const middleIndex = baseLength > 0 ? baseLength * Math.floor(REPEAT / 2) : 0;
  
  // Índice lógico: 0 → baseLength - 1 (para saber qué slide mostrar)
  const [logicalIndex, setLogicalIndex] = useState(0);
  // Índice visual extendido: para el loop infinito
  const [visualIndex, setVisualIndex] = useState(middleIndex);
  
  // Precargar buffer cuando cambia el hover (desktop) o índice (mobile)
  useEffect(() => {
    if (items.length === 0) return;
    
    const activeIndex = isMobile ? logicalIndex : hoveredIndex;
    if (activeIndex !== null && activeIndex >= 0 && activeIndex < items.length) {
      preloadBuffer(activeIndex);
    }
  }, [hoveredIndex, logicalIndex, isMobile, items, preloadBuffer]);
  // Estado para controlar animación durante corrección del loop
  const [shouldAnimateTransition, setShouldAnimateTransition] = useState(true);
  
  // Refs para control de autoplay y drag
  const autoplayTimerRef = useRef(null);
  const autoplayResumeTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const containerWidthRef = useRef(0);
  const isCorrectingLoopRef = useRef(false);

  // Inicializar índice lógico cuando cambian los items
  useEffect(() => {
    if (!isMobile || items.length === 0) return;
    setLogicalIndex(0);
    setVisualIndex(middleIndex);
  }, [isMobile, items.length, middleIndex]);

  // Función para mover al siguiente slide (lógica centralizada)
  const moveToNext = useCallback(() => {
    if (baseLength <= 1 || isDraggingRef.current || isCorrectingLoopRef.current) return;
    
    setLogicalIndex((prev) => {
      const next = (prev + 1) % baseLength;
      return next;
    });
  }, [baseLength]);

  // Función para mover al slide anterior
  const moveToPrev = useCallback(() => {
    if (baseLength <= 1 || isDraggingRef.current || isCorrectingLoopRef.current) return;
    
    setLogicalIndex((prev) => {
      const next = (prev - 1 + baseLength) % baseLength;
      return next;
    });
  }, [baseLength]);

  // Sincronizar índice visual con índice lógico (para loop infinito)
  useEffect(() => {
    if (!isMobile || baseLength === 0) return;
    
    // Calcular el índice visual equivalente en la copia central
    const targetVisualIndex = middleIndex + logicalIndex;
    
    // Solo actualizar si es diferente (evitar loops infinitos)
    if (targetVisualIndex !== visualIndex) {
      setVisualIndex(targetVisualIndex);
    }
  }, [logicalIndex, middleIndex, baseLength, isMobile, visualIndex]);

  // Corrección del loop infinito (UN SOLO LUGAR)
  useEffect(() => {
    if (!isMobile || baseLength <= 1 || isCorrectingLoopRef.current) return;
    
    const min = baseLength * 2;
    const max = baseLength * (REPEAT - 2);
    
    // Si estamos fuera del rango de la copia central, hacer snap invisible
    if (visualIndex < min || visualIndex > max) {
      isCorrectingLoopRef.current = true;
      
      // Desactivar animación para snap instantáneo
      setShouldAnimateTransition(false);
      
      // Calcular el índice relativo dentro de cualquier copia
      const relativeIndex = ((visualIndex % baseLength) + baseLength) % baseLength;
      // Mover a la posición equivalente en la copia central
      const correctedIndex = middleIndex + relativeIndex;
      
      // Snap instantáneo sin animación (usando requestAnimationFrame para evitar conflictos)
      requestAnimationFrame(() => {
        setVisualIndex(correctedIndex);
        setLogicalIndex(relativeIndex);
        isCorrectingLoopRef.current = false;
        
        // Re-habilitar animación después del snap
        setTimeout(() => {
          setShouldAnimateTransition(true);
        }, 50);
      });
    }
  }, [visualIndex, baseLength, REPEAT, middleIndex, isMobile]);

  const slideWidthPct = isMobile ? 100 : 25; // 100% en mobile, 25% (4 columnas) en desktop
  const offsetPct = isMobile ? visualIndex * slideWidthPct : 0;

  // Autoplay para mobile - REFACTORIZADO
  useEffect(() => {
    if (!isMobile || baseLength <= 1) {
      // Limpiar timer y timeout si no es mobile
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      if (autoplayResumeTimeoutRef.current) {
        clearTimeout(autoplayResumeTimeoutRef.current);
        autoplayResumeTimeoutRef.current = null;
      }
      return;
    }

    // Limpiar timer anterior si existe
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    
    // Limpiar timeout de reanudación si existe
    if (autoplayResumeTimeoutRef.current) {
      clearTimeout(autoplayResumeTimeoutRef.current);
      autoplayResumeTimeoutRef.current = null;
    }

    // Crear UN SOLO intervalo de autoplay
    autoplayTimerRef.current = setInterval(() => {
      // Verificar que no estemos arrastrando
      if (!isDraggingRef.current && !isCorrectingLoopRef.current) {
        moveToNext();
      }
    }, 3000);

    // Cleanup: limpiar al desmontar o cambiar dependencias
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      if (autoplayResumeTimeoutRef.current) {
        clearTimeout(autoplayResumeTimeoutRef.current);
        autoplayResumeTimeoutRef.current = null;
      }
    };
  }, [isMobile, baseLength, moveToNext]);

  // Mobile: Hooks para drag y ancho del contenedor (DEBEN estar antes de cualquier return)
  // Obtener ancho del contenedor para calcular delta del drag
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        containerWidthRef.current = containerRef.current.offsetWidth;
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isMobile]);

  // Handlers para drag - REFACTORIZADO
  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    draggingRef.current = true;
    
    // Pausar autoplay durante el drag
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    
    // Guardar posición inicial del drag
    if (containerRef.current) {
      dragStartXRef.current = containerRef.current.getBoundingClientRect().left;
    }
  }, []);

  const handleDrag = useCallback((event, info) => {
    // No hacer nada durante el drag, solo rastrear
    // El movimiento visual lo maneja Framer Motion automáticamente
  }, []);

  const handleDragEnd = useCallback((event, info) => {
    isDraggingRef.current = false;
    draggingRef.current = false;
    
    // Limpiar timeout anterior si existe (evitar múltiples timeouts)
    if (autoplayResumeTimeoutRef.current) {
      clearTimeout(autoplayResumeTimeoutRef.current);
      autoplayResumeTimeoutRef.current = null;
    }
    
    // Calcular delta del drag
    const deltaX = info.offset.x;
    const threshold = containerWidthRef.current * 0.3; // 30% del ancho para activar cambio
    
    // Determinar dirección y mover solo 1 slide
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Drag hacia la derecha = slide anterior
        moveToPrev();
      } else {
        // Drag hacia la izquierda = slide siguiente
        moveToNext();
      }
    }
    
    // Reanudar autoplay después de un breve delay
    autoplayResumeTimeoutRef.current = setTimeout(() => {
      autoplayResumeTimeoutRef.current = null;
      
      if (!isMobile || baseLength <= 1 || isDraggingRef.current) return;
      
      // Limpiar timer anterior si existe
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      
      // Crear nuevo intervalo
      autoplayTimerRef.current = setInterval(() => {
        if (!isDraggingRef.current && !isCorrectingLoopRef.current) {
          moveToNext();
        }
      }, 3000);
    }, 500); // Delay de 500ms antes de reanudar autoplay
  }, [isMobile, baseLength, moveToNext, moveToPrev]);

  if (items.length === 0) {
    return (
      <div className="grid-portfolio-container" style={{ minHeight: "400px" }}>
        <p>Cargando portfolio...</p>
      </div>
    );
  }

  // Desktop: Grid 4x3
  if (!isMobile) {
    return (
      <div className="grid-portfolio-container">
        <div className="grid-portfolio-wrapper">
          {items.map((item, i) => {
            const isVisible = true; // En desktop siempre visible
            const isHovered = hoveredIndex === i;
            return (
              <div 
                key={item.id || i} 
                className="grid-portfolio-item"
                onMouseEnter={() => {
                  setHoveredIndex(i);
                  // Precargar imágenes cuando se hace hover
                  if (item.images && item.images.length > 0) {
                    item.images.slice(0, 5).forEach(preloadImage);
                  }
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <InnerAutoSlider 
                  list={item.images} 
                  interval={1500} 
                  direction={1} 
                  isVisible={isVisible}
                  isHovered={isHovered}
                  preloadImage={preloadImage}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Mobile: Carrusel - REFACTORIZADO

  return (
    <div 
      ref={containerRef}
      className="grid-portfolio-container portfolio-carousel-mobile"
      style={{ 
        position: "relative", 
        overflow: "hidden", 
        width: "100%",
      }}
    >
      {/* Flecha izquierda */}
      <button
        onClick={() => moveToPrev()}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"}
        aria-label="Slide anterior"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => moveToNext()}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"}
        aria-label="Slide siguiente"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <motion.div
        className="portfolio-carousel-track"
        style={{ 
          display: "flex",
          width: "100%",
          willChange: "transform"
        }}
        animate={{ x: `-${offsetPct}%` }}
        transition={{ 
          duration: shouldAnimateTransition ? 0.6 : 0, 
          ease: "easeOut" 
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        dragControls={dragControls}
      >
        {slides.map((imageSrc, i) => (
          <div
            key={`slide-${i}`}
            style={{
              width: `${slideWidthPct}%`,
              flex: `0 0 ${slideWidthPct}%`,
              padding: "4px",
              boxSizing: "border-box",
              minWidth: 0,
            }}
          >
            <MobileSimpleSlide imageSrc={imageSrc} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}


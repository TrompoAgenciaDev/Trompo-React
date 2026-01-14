import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";
import LazyImage from "../LazyImage";

// Cargar datos del portfolio
async function fetchPortfolioData(category = "branding") {
  const ts = Date.now();
  const res = await fetch(`${import.meta.env.BASE_URL}portfolio.json?v=${ts}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo cargar portfolio.json");
  const data = await res.json();
  
  // Si es "branding", buscar en disenio
  if (category === "branding") {
    const items = Array.isArray(data?.disenio) ? data.disenio : [];
    return items.filter(item => {
      const categories = Array.isArray(item.category) ? item.category : [];
      return categories.some(cat => cat && cat.toLowerCase() === "branding" && !categories.some(c => c && c.toLowerCase() === "branding-web"));
    });
  }
  
  // Si es "social media", buscar en interaccion
  const items = Array.isArray(data?.interaccion) ? data.interaccion : [];
  return items.filter(item => {
    const categories = Array.isArray(item.category) ? item.category : [];
    return categories.some(cat => cat && cat.toLowerCase() === "social media");
  });
}

/* Inner slider infinito 4:3 con lazy loading - solo imágenes */
/* REFACTORIZADO: Loop infinito con snap invisible para evitar saltos */
function InnerAutoSlider({ list, interval = 1500, direction = 1, isVisible, isHovered = false }) {
  const len = list.length;
  
  // Si solo hay 1 o menos imágenes, retornar simple
  if (len <= 1) {
    return (
      <div
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

  // Preparar array extendido: 5 copias para loop infinito real
  // [copia1][copia2][copia3][copia4][copia5]
  // La copia central (copia3) es la que se muestra normalmente
  const REPEAT = 5;
  const extended = useMemo(() => Array.from({ length: REPEAT }, () => list).flat(), [list]);
  const baseLen = len;
  
  // Índice GLOBAL en el array extendido (0 a extended.length-1)
  // Estado inicial: baseLen * 2 (inicio de copia central, imagen 0)
  const CENTER_COPY_START = baseLen * 2;
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
    if (len <= 1 || !shouldRender || !isHovered || isResettingRef.current) return;

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
  }, [globalIndex, len, shouldRender, isHovered, CENTER_COPY_START, baseLen]);

  // Efecto PRINCIPAL: Controlar hover y autoplay
  useEffect(() => {
    // Si no hay imágenes suficientes o no está renderizado, salir
    if (len <= 1 || !shouldRender) return;

    // Si el hover no cambió, no hacer nada
    if (wasHoveredRef.current === isHovered) return;
    
    // Actualizar el ref INMEDIATAMENTE para prevenir ejecuciones múltiples
    wasHoveredRef.current = isHovered;

    // LIMPIAR cualquier timer activo primero (CRÍTICO)
    clearAllTimers();

    if (isHovered) {
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
  }, [isHovered, len, shouldRender, interval, clearAllTimers, CENTER_COPY_START]);

  // Calcular el offset para la animación usando el índice global
  const offsetPct = globalIndex * 100;

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

  // Si NO hay hover: mostrar solo la primera imagen estática (slide 0)
  if (!isHovered) {
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
        {extended.map((src, i) => (
          <div key={i} style={{ width: "100%", flex: "0 0 100%" }}>
            <LazyImage
              src={src}
              alt=""
              placeholder="#f0f0f0"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </motion.div>
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

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cargar datos
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchPortfolioData(category);
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
        
        if (mounted) {
          setItems(limitedItems);
        }
      } catch (error) {
        console.error("Error cargando portfolio:", error);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Carrusel infinito para mobile
  const REPEAT = 3;
  const slides = useMemo(() => {
    if (items.length === 0) return [];
    return Array.from({ length: REPEAT }, () => items).flat();
  }, [items]);
  
  const baseLength = items.length;
  const middleIndex = baseLength > 0 ? baseLength * Math.floor(REPEAT / 2) : 0;
  const [carouselIndex, setCarouselIndex] = useState(middleIndex);

  useEffect(() => {
    if (!isMobile || items.length === 0) return;
    setCarouselIndex(middleIndex);
  }, [isMobile, items.length, middleIndex]);

  useEffect(() => {
    if (!isMobile || items.length <= 1) return;
    const min = baseLength * 2;
    const max = baseLength * (REPEAT - 2);
    if (carouselIndex < min || carouselIndex > max) {
      const mod = ((carouselIndex % baseLength) + baseLength) % baseLength;
      setCarouselIndex(middleIndex + mod);
    }
  }, [carouselIndex, baseLength, REPEAT, middleIndex, isMobile, items.length]);

  const slideWidthPct = isMobile ? 100 : 25; // 100% en mobile, 25% (4 columnas) en desktop
  const offsetPct = isMobile ? carouselIndex * slideWidthPct : 0;

  // Auto-play para mobile carousel
  useEffect(() => {
    if (!isMobile || items.length <= 1 || draggingRef.current) return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isMobile, items.length]);

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
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <InnerAutoSlider 
                  list={item.images} 
                  interval={1500} 
                  direction={1} 
                  isVisible={isVisible}
                  isHovered={isHovered}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Mobile: Carrusel
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
      <motion.div
        className="portfolio-carousel-track"
        style={{ 
          display: "flex",
          width: "100%",
          willChange: "transform"
        }}
        animate={{ x: `-${offsetPct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => { draggingRef.current = true; }}
        onDragEnd={() => { 
          draggingRef.current = false;
        }}
        dragControls={dragControls}
      >
        {slides.map((item, i) => {
          // Determinar si el slide está visible (el actual y los adyacentes)
          const isVisible = Math.abs(i - carouselIndex) <= 1;
          return (
            <div
              key={`${item.id}-${i}`}
              style={{
                width: `${slideWidthPct}%`,
                flex: `0 0 ${slideWidthPct}%`,
                padding: "4px",
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <InnerAutoSlider 
                list={item.images} 
                interval={1800} 
                direction={1}
                isVisible={isVisible}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}


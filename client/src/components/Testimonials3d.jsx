import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import useFetchTestimonials from "../hooks/useFetchTestimonials";
import "../assets/styles/testimonials.css";

const REPEAT = 3;
const SCROLL_SPEED = 0.5; // Velocidad de scroll continuo (píxeles por frame)

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const norm = (i, n) => ((i % n) + n) % n;

// Componente para cada slide con cálculo de rotateX normalizado para loop infinito
const TestimonialSlide = ({ 
  item, 
  getImagePath,
  index,
  autoScrollY,
  slideHeight,
  viewportHeight,
  total
}) => {
  // Normalizar el índice por ciclo para manejar slides clonados (REPEAT)
  // cycleIndex: posición dentro de un ciclo (0 a total-1)
  const cycleIndex = norm(index, total);
  
  // Calcular la posición base del centro del slide dentro de un ciclo
  // slideCenterBase: posición ideal dentro de un ciclo, independiente de clones
  const slideCenterBase = (cycleIndex * slideHeight) + (slideHeight / 2);
  
  // Calcular el progreso dentro del ciclo considerando el reset del loop
  // cycleHeight: altura de un ciclo completo
  const cycleHeight = slideHeight * total;
  
  // Calcular el centro del slide relativo al viewport
  // Considerando el wrap del ciclo infinito y la posición absoluta del track
  const slideCenterInViewport = useTransform(
    autoScrollY,
    (trackY) => {
      // trackY es negativo cuando el track sube
      // Calcular la posición absoluta del slide dentro del track
      // slideTopInTrack: posición del top del slide dentro del track (considerando clones)
      const slideTopInTrack = index * slideHeight;
      
      // El centro del slide en coordenadas del track
      const slideCenterInTrack = slideTopInTrack + (slideHeight / 2);
      
      // El centro del slide relativo al viewport (top del viewport = 0)
      // trackY es negativo cuando el track sube, así que sumamos para obtener la posición en el viewport
      const slideCenterAbsolute = slideCenterInTrack + trackY;
      
      return slideCenterAbsolute;
    }
  );
  
  // Centro del viewport
  const viewportCenter = viewportHeight / 2;
  
  // Delta: diferencia entre el centro de la tarjeta y el centro del viewport
  // delta > 0: tarjeta está por debajo del centro (viene desde abajo)
  // delta < 0: tarjeta está por encima del centro (se va hacia arriba)
  // delta = 0: tarjeta está exactamente en el centro
  const delta = useTransform(
    slideCenterInViewport,
    (center) => center - viewportCenter
  );
  
  // Normalización simétrica: maxDistance = mitad de la altura del viewport
  const maxDistance = viewportHeight / 2;
  
  // t = clamp(delta / maxDistance, -1, 1)
  // t mapea la distancia desde el centro al rango [-1, 1]
  // t = +1: bien abajo del centro
  // t = 0: exactamente en el centro
  // t = -1: bien arriba del centro
  const t = useTransform(
    delta,
    (d) => {
      if (maxDistance === 0) return 0;
      return Math.max(-1, Math.min(1, d / maxDistance));
    }
  );
  
  // Rotación requerida: rotateX = 90 * t
  // t = +1 (abajo del centro) => rotateX = +90deg (inclinada hacia adelante, reverencia)
  // t = 0 (centro exacto) => rotateX = 0deg (recta)
  // t = -1 (arriba del centro) => rotateX = -90deg (inclinada hacia atrás)
  const rotateX = useTransform(t, (value) => 90 * value);
  
  return (
    <motion.div
      className="testimoniales-slide-vertical"
      style={{
        flex: "0 0 auto",
        width: "100%",
        boxSizing: "border-box",
        padding: "0.5rem 0",
        rotateX: rotateX,
        transformPerspective: 1000,
        translateZ: 0.01,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform',
      }}
    >
      <div className="testimoniales-card" style={{ width: "100%" }}>
        <div className="testimoniales-text">
          {item.text.replace(/^✨\s*/, '')}
        </div>
        <div className="testimoniales-author-info">
          <img 
            src={getImagePath(item.image)} 
            alt={item.name || item.author} 
            className="testimoniales-avatar"
            onError={(e) => {
              // Fallback si la imagen no carga
              e.target.style.display = 'none';
            }}
          />
          <div className="testimoniales-author-details">
            <div className="testimoniales-author-name">
              {item.name || (() => {
                const parts = (item.author || '').split(/[-,]/);
                return parts[0] ? parts[0].trim() : item.author;
              })()}
            </div>
            <div className="testimoniales-author-role" title={item.role || (() => {
              const parts = (item.author || '').split(/[-,]/);
              return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
            })()}>
              {item.role || (() => {
                const parts = (item.author || '').split(/[-,]/);
                return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
              })()}
            </div>
          </div>
        </div>
        <div className="testimoniales-quote-icon">"</div>
      </div>
    </motion.div>
  );
};

export default function Testimonials3D({ size = null }) {
  const { testimonials, loading, error } = useFetchTestimonials();
  const total = testimonials.length;
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollY = useMotionValue(0);
  const animationRef = useRef(null);
  
  // Medir alturas solo en mount y resize (no por frame)
  const [slideHeight, setSlideHeight] = useState(500);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Clonar testimonials para loop infinito
  const cloned = useMemo(
    () => (total ? Array.from({ length: REPEAT }, () => testimonials).flat() : []),
    [testimonials, total]
  );

  const middle = total * Math.floor(REPEAT / 2);
  
  // Medir slideHeight solo cuando el track tiene elementos (mount/resize)
  useEffect(() => {
    if (!trackRef.current) return;
    
    const measureSlideHeight = () => {
      if (trackRef.current?.firstElementChild) {
        const height = trackRef.current.firstElementChild.offsetHeight || 500;
        setSlideHeight(height);
      }
    };
    
    // Medir después de que los elementos se rendericen
    const timeout = setTimeout(measureSlideHeight, 0);
    
    window.addEventListener('resize', measureSlideHeight);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', measureSlideHeight);
    };
  }, [cloned.length]);
  
  // Medir viewportHeight (testimoniales-viewport) solo en mount y resize
  useEffect(() => {
    if (!viewportRef.current) return;
    
    const measureViewportHeight = () => {
      if (viewportRef.current) {
        setViewportHeight(viewportRef.current.offsetHeight);
      }
    };
    
    measureViewportHeight();
    window.addEventListener('resize', measureViewportHeight);
    
    return () => window.removeEventListener('resize', measureViewportHeight);
  }, []);


  // Animación continua vertical de abajo hacia arriba
  useEffect(() => {
    if (!total || isPaused || draggingRef.current || !containerRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const container = containerRef.current;
    
    // Animación continua hacia arriba
    const animateContinuous = () => {
      if (!container || draggingRef.current || isPaused) return;
      
      const currentY = autoScrollY.get();
      const newY = currentY - SCROLL_SPEED;
      
      // Si llegamos al final de un ciclo, resetear suavemente
      const maxY = slideHeight * total;
      if (Math.abs(newY) >= maxY) {
        // Resetear al inicio del buffer
        autoScrollY.set(0);
      } else {
        autoScrollY.set(newY);
      }
      
      animationRef.current = requestAnimationFrame(animateContinuous);
    };

    animationRef.current = requestAnimationFrame(animateContinuous);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [total, isPaused, slideHeight]);

  // Drag handlers - simplificados como en Portfolio3d
  const handleDragStart = () => {
    draggingRef.current = true;
    setIsPaused(true);
    
    // Cancelar animación automática
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleDragEnd = () => {
    // Sincronizar la posición final del drag con autoScrollY
    // Usar un pequeño delay para asegurar que framer-motion haya terminado de aplicar el transform
    setTimeout(() => {
      if (trackRef.current) {
        const transform = window.getComputedStyle(trackRef.current).transform;
        if (transform && transform !== 'none') {
          const matrix = transform.match(/matrix\(([^)]+)\)/);
          if (matrix) {
            const values = matrix[1].split(', ');
            const translateY = parseFloat(values[5] || values[13] || 0);
            // Actualizar autoScrollY con la posición final del drag
            autoScrollY.set(translateY);
          }
        }
      }
      
      // Usar requestAnimationFrame para asegurar que el estado se actualice después del drag
      requestAnimationFrame(() => {
        draggingRef.current = false;
        setIsPaused(false);
      });
    }, 0);
  };

  if (loading) return <div>Cargando testimonios...</div>;
  if (error) return <div>{error}</div>;
  if (!total) return <div>No hay testimonios disponibles.</div>;

  // Función para obtener la ruta de la imagen con base
  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    // Si ya tiene la ruta completa, usarla; si no, agregar base
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `${base}${imagePath.slice(1)}`;
    }
    return `${base}${imagePath}`;
  };

  return (
    <div
      ref={containerRef}
      className="testimoniales-container testimoniales-container-vertical"
    >
      <div 
        ref={viewportRef}
        className="testimoniales-viewport testimoniales-viewport-vertical" 
        style={{ 
          overflow: "hidden", 
          height: "100%",
          perspective: "1000px",
          perspectiveOrigin: "center center"
        }}
      >
        <motion.div
          ref={trackRef}
          className="testimoniales-track testimoniales-track-vertical"
          style={{ 
            y: autoScrollY,
            display: "flex",
            flexDirection: "column",
            willChange: "transform",
            cursor: "grab"
          }}
          drag="y"
          dragElastic={0.05}
          dragMomentum
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          dragConstraints={{ top: -Infinity, bottom: Infinity }}
          whileTap={{ cursor: "grabbing" }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {cloned.map((item, i) => (
            <TestimonialSlide
              key={i}
              item={item}
              getImagePath={getImagePath}
              index={i}
              autoScrollY={autoScrollY}
              slideHeight={slideHeight}
              viewportHeight={viewportHeight}
              total={total}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue } from "motion/react";
import useFetchTestimonials from "../hooks/useFetchTestimonials";
import "../assets/styles/testimonials.css";

const REPEAT = 3;
const SCROLL_SPEED = 0.5; // Velocidad de scroll continuo (píxeles por frame)

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const norm = (i, n) => ((i % n) + n) % n;

// Componente para cada slide - sin efectos 3D, solo movimiento vertical
const TestimonialSlide = ({ 
  item, 
  getImagePath 
}) => {
  return (
    <div
      className="testimoniales-slide-vertical"
      style={{
        flex: "0 0 auto",
        width: "100%",
        boxSizing: "border-box",
        padding: "0.5rem 0",
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
    </div>
  );
};

export default function Testimonials3D({ size = null }) {
  const { testimonials, loading, error } = useFetchTestimonials();
  const total = testimonials.length;
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollY = useMotionValue(0);
  const animationRef = useRef(null);

  // Clonar testimonials para loop infinito
  const cloned = useMemo(
    () => (total ? Array.from({ length: REPEAT }, () => testimonials).flat() : []),
    [testimonials, total]
  );

  const middle = total * Math.floor(REPEAT / 2);
  
  // Función helper para obtener altura del slide
  const getSlideHeight = useMemo(() => {
    return () => {
      if (trackRef.current?.firstElementChild) {
        return trackRef.current.firstElementChild.offsetHeight || 500;
      }
      if (containerRef.current) {
        const viewportHeight = containerRef.current.offsetHeight;
        return Math.round(viewportHeight * 0.555) || 500;
      }
      return 500;
    };
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
      const slideHeight = getSlideHeight();
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
  }, [total, isPaused, getSlideHeight]);

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
      <div className="testimoniales-viewport testimoniales-viewport-vertical" style={{ overflow: "hidden", height: "100%" }}>
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
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

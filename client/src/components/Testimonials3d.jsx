import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, animate, useSpring } from "motion/react";
import useFetchTestimonials from "../hooks/useFetchTestimonials";
import "../assets/styles/testimonials.css";

const TRANSITION_S = 1.5;
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
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragY = useMotionValue(0);
  const autoScrollY = useMotionValue(0);
  const animationRef = useRef(null);
  const lastAutoYRef = useRef(0);
  const dragStartY = useRef(0);

  // Clonar testimonials para loop infinito
  const cloned = useMemo(
    () => (total ? Array.from({ length: REPEAT }, () => testimonials).flat() : []),
    [testimonials, total]
  );

  const middle = total * Math.floor(REPEAT / 2);
  const [index, setIndex] = useState(middle);

  // Animación continua vertical de abajo hacia arriba
  useEffect(() => {
    if (!total || isPaused || isDragging || !containerRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const container = containerRef.current;
    
    // Obtener altura real del slide desde el DOM
    const getSlideHeight = () => {
      if (trackRef.current && trackRef.current.firstElementChild) {
        return trackRef.current.firstElementChild.offsetHeight || 500;
      }
      // Fallback basado en viewport
      if (container) {
        const viewportHeight = container.offsetHeight;
        // El viewport ahora es 180% (100% tarjeta + 40% arriba + 40% abajo)
        // Entonces cada slide es aproximadamente 55.5% del viewport (100/180)
        return Math.round(viewportHeight * 0.555) || 500;
      }
      return 500;
    };
    
    // Animación continua hacia arriba
    const animateContinuous = () => {
      if (!container) return;
      
      const currentY = autoScrollY.get();
      const slideHeight = getSlideHeight();
      const newY = currentY - SCROLL_SPEED;
      
      // Si llegamos al final de un ciclo, resetear suavemente
      const maxY = slideHeight * total;
      if (Math.abs(newY) >= maxY) {
        // Resetear al inicio del buffer
        autoScrollY.set(0);
        setIndex(middle);
      } else {
        autoScrollY.set(newY);
      }
      
      lastAutoYRef.current = autoScrollY.get();
      animationRef.current = requestAnimationFrame(animateContinuous);
    };

    animationRef.current = requestAnimationFrame(animateContinuous);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [total, isPaused, isDragging, middle]);

  // Drag vertical
  const onDragStart = (_e, _info) => {
    setIsDragging(true);
    setIsPaused(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    // Guardar la posición actual de autoScrollY como base para el drag
    const currentY = autoScrollY.get();
    dragStartY.current = currentY;
    dragY.set(currentY);
  };

  const onDrag = (_e, info) => {
    // El drag se suma directamente a la posición inicial guardada
    const newY = dragStartY.current + info.offset.y;
    dragY.set(newY);
  };

  const onDragEnd = (_e, info) => {
    if (!containerRef.current || !trackRef.current) return;
    
    // Obtener altura real del slide desde el DOM
    const getSlideHeight = () => {
      if (trackRef.current && trackRef.current.firstElementChild) {
        return trackRef.current.firstElementChild.offsetHeight || 500;
      }
      // Fallback basado en viewport
      const container = containerRef.current;
      if (container) {
        const viewportHeight = container.offsetHeight;
        return Math.round(viewportHeight * 0.555) || 500;
      }
      return 500;
    };
    
    const h = getSlideHeight();
    const threshold = Math.max(40, h * 0.15);
    const dy = info.offset.y;
    const velocity = info.velocity.y;
    
    const currentY = dragY.get();
    const currentSlide = Math.floor(Math.abs(currentY) / h);
    
    let targetY;
    let newIndex = index;
    
    // Considerar velocidad para hacer el drag más natural
    const velocityThreshold = 200;
    
    if (Math.abs(velocity) > velocityThreshold) {
      // Si hay velocidad suficiente, cambiar slide en esa dirección
      if (velocity < 0) {
        // Movimiento hacia arriba
        targetY = -(currentSlide + 1) * h;
        newIndex = index + 1;
      } else {
        // Movimiento hacia abajo
        targetY = -Math.max(0, currentSlide - 1) * h;
        newIndex = Math.max(middle, index - 1);
      }
    } else if (dy <= -threshold) {
      // Arrastrar hacia arriba = siguiente slide
      targetY = -(currentSlide + 1) * h;
      newIndex = index + 1;
    } else if (dy >= threshold) {
      // Arrastrar hacia abajo = slide anterior
      targetY = -Math.max(0, currentSlide - 1) * h;
      newIndex = Math.max(middle, index - 1);
    } else {
      // Snap al actual
      targetY = -currentSlide * h;
    }
    
    setIndex(newIndex);
    
    // Animar suavemente a la posición objetivo
    animate(autoScrollY, targetY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3
    });
    
    animate(dragY, targetY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3
    });
    
    setIsDragging(false);
    
    // Reanudar animación después de un delay más corto
    setTimeout(() => {
      setIsPaused(false);
    }, 500);
  };

  // Recentrar cuando nos acercamos a los bordes
  useEffect(() => {
    if (!total || isDragging) return;
    const min = total * 1;
    const max = total * (REPEAT - 1);
    if (index < min || index > max) {
      const mod = norm(index, total);
      setIndex(middle + mod);
      // Obtener altura real del slide
      const getSlideHeight = () => {
        if (trackRef.current && trackRef.current.firstElementChild) {
          return trackRef.current.firstElementChild.offsetHeight || 500;
        }
        if (containerRef.current) {
          const viewportHeight = containerRef.current.offsetHeight;
          return Math.round(viewportHeight * 0.555) || 500;
        }
        return 500;
      };
      const slideH = getSlideHeight();
      const newY = -mod * slideH;
      autoScrollY.set(newY);
      dragY.set(newY);
    }
  }, [index, total, middle, isDragging]);

  // Crear spring para animación automática
  const springY = useSpring(autoScrollY, {
    stiffness: 200,
    damping: 25,
    mass: 0.5,
  });
  
  // Usar directamente dragY durante el drag para máxima fluidez
  // Usar springY cuando no está arrastrando
  const y = isDragging ? dragY : springY;

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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="testimoniales-viewport testimoniales-viewport-vertical" style={{ overflow: "hidden", height: "100%" }}>
        <motion.div
          ref={trackRef}
          className="testimoniales-track testimoniales-track-vertical"
          style={{ 
            y: y,
            display: "flex",
            flexDirection: "column",
            willChange: "transform",
            cursor: isDragging ? "grabbing" : "grab"
          }}
          drag="y"
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{ top: -Infinity, bottom: Infinity }}
          whileDrag={{ cursor: "grabbing" }}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
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

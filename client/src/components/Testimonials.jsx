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

export default function Testimonials({ size = null }) {
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
    
    // Animación continua hacia arriba
    const animateContinuous = () => {
      if (!container) return;
      
      const currentY = autoScrollY.get();
      const slideHeight = container.offsetHeight || 500;
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
  const onDragStart = () => {
    setIsDragging(true);
    setIsPaused(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    // Guardar la posición actual de autoScrollY como base para el drag
    dragY.set(autoScrollY.get());
  };

  const onDrag = (_e, info) => {
    if (isDragging) {
      // El drag se suma a la posición base
      dragY.set(autoScrollY.get() + info.offset.y);
    }
  };

  const onDragEnd = (_e, info) => {
    if (!containerRef.current) return;
    
    const h = containerRef.current.offsetHeight || 500;
    const threshold = Math.max(40, h * 0.15);
    const dy = info.offset.y;
    
    const currentY = dragY.get();
    const currentSlide = Math.floor(Math.abs(currentY) / h);
    
    if (dy <= -threshold) {
      // Arrastrar hacia arriba = siguiente slide
      const nextSlide = currentSlide + 1;
      const newY = -nextSlide * h;
      setIndex((p) => {
        const newP = p + 1;
        return newP;
      });
      autoScrollY.set(newY);
      dragY.set(newY);
    } else if (dy >= threshold) {
      // Arrastrar hacia abajo = slide anterior
      const prevSlide = Math.max(0, currentSlide - 1);
      const newY = -prevSlide * h;
      setIndex((p) => {
        const newP = Math.max(middle, p - 1);
        return newP;
      });
      autoScrollY.set(newY);
      dragY.set(newY);
    } else {
      // Snap al actual
      const snapY = -currentSlide * h;
      autoScrollY.set(snapY);
      dragY.set(snapY);
    }
    
    setIsDragging(false);
    
    // Reanudar animación después de un delay
    setTimeout(() => {
      setIsPaused(false);
    }, TRANSITION_S * 1000);
  };

  // Recentrar cuando nos acercamos a los bordes
  useEffect(() => {
    if (!total || isDragging) return;
    const min = total * 1;
    const max = total * (REPEAT - 1);
    if (index < min || index > max) {
      const mod = norm(index, total);
      setIndex(middle + mod);
      const slideH = containerRef.current?.offsetHeight || 500;
      const newY = -mod * slideH;
      autoScrollY.set(newY);
      dragY.set(newY);
    }
  }, [index, total, middle, isDragging]);

  // Usar spring para suavizar la transición
  const y = useSpring(isDragging ? dragY : autoScrollY, {
    stiffness: 100,
    damping: 30,
  });

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
            willChange: "transform"
          }}
          drag="y"
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{ top: -Infinity, bottom: Infinity }}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        >
          {cloned.map((item, i) => (
            <div
              key={i}
              className="testimoniales-slide-vertical"
              style={{
                flex: "0 0 100%",
                width: "100%",
                boxSizing: "border-box",
                padding: "0.5rem",
                display: "flex",
                alignItems: "stretch",
                minHeight: "100%",
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
          ))}
        </motion.div>
      </div>
    </div>
  );
}

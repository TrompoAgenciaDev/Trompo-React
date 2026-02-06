import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "../../assets/styles/semicircular-video-slider.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const originalVideoData = [
  { src: `${base}assets/creatividad/multimedia/volvo.mp4`, title: "Volvo Trucks" },
  { src: `${base}assets/creatividad/multimedia/denso.mp4`, title: "Denso" },
  { src: `${base}assets/creatividad/multimedia/viditec.mp4`, title: "Viditec" },
  { src: `${base}assets/creatividad/multimedia/raulito.mp4`, title: "Raulito" },
  { src: `${base}assets/creatividad/multimedia/agreteq.mp4`, title: "Agreteq" },
  { src: `${base}assets/creatividad/multimedia/wu.mp4`, title: "Wu" },
];

// Duplicar el array 2 veces (original + 2 copias = 3 repeticiones totales)
const videoData = [...originalVideoData, ...originalVideoData, ...originalVideoData];
const ORIGINAL_LENGTH = originalVideoData.length;
const MIDDLE_START = ORIGINAL_LENGTH; // Empezar en la segunda repetición

// Componente individual para cada slide con curva
const CurvedSlide = ({ video, index, x, containerRef, wrapperRef, videoRefs, isDragging }) => {
  const slideRef = useRef(null);
  const maxCurveHeight = 250;
  const maxRotation = 25;
  
  // Cachear rects para evitar múltiples lecturas en cada frame
  const rectsCacheRef = useRef({ container: null, slide: null, timestamp: 0 });
  const CACHE_DURATION = 16; // ~1 frame a 60fps
  
  // Función helper para obtener rects cacheados
  const getCachedRects = () => {
    const now = performance.now();
    if (rectsCacheRef.current.timestamp && (now - rectsCacheRef.current.timestamp) < CACHE_DURATION) {
      return rectsCacheRef.current;
    }
    
    if (!containerRef.current || !slideRef.current) {
      return { container: null, slide: null };
    }
    
    // Batch las lecturas en un solo frame
    const containerRect = containerRef.current.getBoundingClientRect();
    const slideRect = slideRef.current.getBoundingClientRect();
    
    rectsCacheRef.current = {
      container: containerRect,
      slide: slideRect,
      timestamp: now
    };
    
    return rectsCacheRef.current;
  };
  
  // Calcular Y basado en posición real del slide
  const y = useTransform(x, () => {
    const rects = getCachedRects();
    if (!rects.container || !rects.slide || !rects.container.width || !rects.slide.width) return 0;
    
    const viewportCenterX = rects.container.left + (rects.container.width / 2);
    const slideCenterX = rects.slide.left + (rects.slide.width / 2);
    const distanceFromCenter = slideCenterX - viewportCenterX;
    const normalizedDistance = distanceFromCenter / (rects.container.width / 2);
    const clampedDistance = Math.max(-1, Math.min(1, normalizedDistance));
    
    return -maxCurveHeight * (1 - Math.pow(clampedDistance, 2));
  });
  
  // Calcular rotación Z basada en posición real
  const rotateZ = useTransform(x, () => {
    const rects = getCachedRects();
    if (!rects.container || !rects.slide || !rects.container.width || !rects.slide.width) return 0;
    
    const viewportCenterX = rects.container.left + (rects.container.width / 2);
    const slideCenterX = rects.slide.left + (rects.slide.width / 2);
    const distanceFromCenter = slideCenterX - viewportCenterX;
    const normalizedDistance = distanceFromCenter / (rects.container.width / 2);
    const clampedDistance = Math.max(-1, Math.min(1, normalizedDistance));
    
    return clampedDistance * maxRotation;
  });
  
  // Calcular zIndex basado en distancia del centro
  const zIndex = useTransform(x, () => {
    const rects = getCachedRects();
    if (!rects.container || !rects.slide || !rects.container.width || !rects.slide.width) return 50;
    
    const viewportCenterX = rects.container.left + (rects.container.width / 2);
    const slideCenterX = rects.slide.left + (rects.slide.width / 2);
    const distanceFromCenter = Math.abs(slideCenterX - viewportCenterX);
    const normalizedDistance = distanceFromCenter / (rects.container.width / 2);
    
    return Math.round(100 - Math.min(1, normalizedDistance) * 50);
  });
  
  // Invalidar cache en resize/scroll
  useEffect(() => {
    const invalidateCache = () => {
      rectsCacheRef.current.timestamp = 0;
    };
    
    window.addEventListener('resize', invalidateCache, { passive: true });
    window.addEventListener('scroll', invalidateCache, { passive: true });
    
    return () => {
      window.removeEventListener('resize', invalidateCache);
      window.removeEventListener('scroll', invalidateCache);
    };
  }, []);
  
  return (
    <motion.div
      ref={slideRef}
      className="multimedia-video-slide black-bg"
      style={{
        y: y,
        rotateZ: rotateZ,
        zIndex: zIndex
      }}
      whileHover={!isDragging ? { scale: 1.05 } : {}}
    >
      <video
        ref={(el) => {
          if (el) {
            videoRefs.current[index] = el;
          }
        }}
        src={video.src}
        muted
        loop
        playsInline
        preload="metadata"
        className="multimedia-video-slide-video"
        onMouseEnter={(e) => {
          if (e.currentTarget && !isDragging) {
            e.currentTarget.play().catch(() => {});
          }
        }}
        onMouseLeave={(e) => {
          if (e.currentTarget) {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0; // Reiniciar al inicio al salir del hover
          }
        }}
      />
      <h3 className="multimedia-video-slide-title">{video.title}</h3>
    </motion.div>
  );
};

const SemicircularVideoSlider = () => {
  const videoRefs = useRef([]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  // Cachear containerWidth para evitar lecturas repetidas de offsetWidth
  const containerWidthRef = useRef(0);
  
  // Calcular valor inicial de x basado en window.innerWidth (disponible inmediatamente)
  const getInitialX = () => {
    if (typeof window === "undefined") return 0;
    const slideWidth = window.innerWidth >= 1024 ? 400 : 160;
    const gap = window.innerWidth >= 1024 ? 70 : 20;
    const slideWithGap = slideWidth + gap;
    // Usar window.innerWidth como aproximación del containerWidth
    const containerWidth = window.innerWidth;
    const centerOffset = (containerWidth / 2) - (slideWidth / 2);
    return centerOffset - (MIDDLE_START * slideWithGap);
  };
  
  // ÚNICA fuente de verdad: motionValue x - inicializado con valor calculado
  const x = useMotionValue(getInitialX());
  
  // Calcular dimensiones
  const getSlideWidth = () => {
    if (typeof window === "undefined") return 160;
    return window.innerWidth >= 1024 ? 400 : 160;
  };

  const getGap = () => {
    if (typeof window === "undefined") return 20;
    return window.innerWidth >= 1024 ? 70 : 20;
  };

  const getSlideWithGap = () => {
    return getSlideWidth() + getGap();
  };

  // Función para actualizar containerWidth cacheado
  const updateContainerWidth = () => {
    if (containerRef.current) {
      // Usar requestAnimationFrame para batch la lectura
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerWidthRef.current = containerRef.current.offsetWidth;
        }
      });
    }
  };
  
  // Refinar posición inicial con dimensiones reales del DOM
  // Usar useLayoutEffect para ejecutar antes del paint y evitar layout incorrecto inicial
  useLayoutEffect(() => {
    // Actualizar cache inicial
    updateContainerWidth();
    
    const refinePosition = () => {
      if (!containerRef.current) return false;
      
      const slideWidth = getSlideWidth();
      // Usar valor cacheado, actualizar si es 0
      if (containerWidthRef.current === 0) {
        containerWidthRef.current = containerRef.current.offsetWidth;
      }
      const containerWidth = containerWidthRef.current;
      
      if (!containerWidth) return false;
      
      const centerOffset = (containerWidth / 2) - (slideWidth / 2);
      const slideWithGap = getSlideWithGap();
      const correctX = centerOffset - (MIDDLE_START * slideWithGap);
      
      // Solo actualizar si hay diferencia significativa (más de 1px)
      const currentX = x.get();
      if (Math.abs(currentX - correctX) > 1) {
        x.set(correctX);
      }
      
      return true;
    };
    
    // Refinar posición inmediatamente si el DOM está listo
    if (refinePosition()) {
      // Forzar recálculo de transforms después de que el layout se estabilice
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const currentX = x.get();
          // Trigger mínimo para forzar recálculo de todos los transforms
          x.set(currentX + 0.0001);
          requestAnimationFrame(() => {
            x.set(currentX);
          });
        });
      });
    } else {
      // Si el DOM no está listo, intentar en frames siguientes
      let attempts = 0;
      const tryRefine = () => {
        attempts++;
        if (refinePosition()) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const currentX = x.get();
              x.set(currentX + 0.0001);
              requestAnimationFrame(() => {
                x.set(currentX);
              });
            });
          });
        } else if (attempts < 3) {
          requestAnimationFrame(tryRefine);
        }
      };
      requestAnimationFrame(tryRefine);
    }
  }, []);

  // Actualizar cache en resize
  useEffect(() => {
    const handleResize = () => {
      updateContainerWidth();
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calcular límites del carrusel infinito
  const getDragConstraints = () => {
    if (!containerRef.current) return { left: 0, right: 0 };
    
    const slideWidth = getSlideWidth();
    // Usar valor cacheado
    if (containerWidthRef.current === 0 && containerRef.current) {
      containerWidthRef.current = containerRef.current.offsetWidth;
    }
    const containerWidth = containerWidthRef.current;
    const centerOffset = (containerWidth / 2) - (slideWidth / 2);
    const slideWithGap = getSlideWithGap();
    
    const startOfSecondRepeat = centerOffset - (MIDDLE_START * slideWithGap);
    const endOfSecondRepeat = centerOffset - ((ORIGINAL_LENGTH * 2) * slideWithGap);
    const buffer = slideWithGap;
    
    return {
      left: endOfSecondRepeat - buffer,
      right: startOfSecondRepeat + (ORIGINAL_LENGTH * slideWithGap) + buffer
    };
  };

  // Los videos solo se reproducen en hover, no automáticamente

  // Drag handlers - SIMPLIFICADOS: solo marcar estado, sin modificar x
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Reset infinito SOLO al soltar, nunca durante el drag
    if (!containerRef.current) return;
    
    const currentX = x.get();
    const slideWidth = getSlideWidth();
    // Usar valor cacheado
    if (containerWidthRef.current === 0 && containerRef.current) {
      containerWidthRef.current = containerRef.current.offsetWidth;
    }
    const containerWidth = containerWidthRef.current;
    const centerOffset = (containerWidth / 2) - (slideWidth / 2);
    const slideWithGap = getSlideWithGap();
    
    const startOfSecondRepeat = centerOffset - (MIDDLE_START * slideWithGap);
    const endOfSecondRepeat = centerOffset - ((ORIGINAL_LENGTH * 2) * slideWithGap);
    
    // Reset invisible si está fuera de límites
    if (currentX <= endOfSecondRepeat) {
      x.set(startOfSecondRepeat);
    } else if (currentX >= startOfSecondRepeat + (ORIGINAL_LENGTH * slideWithGap)) {
      x.set(startOfSecondRepeat);
    }
  };

  return (
    <div className="multimedia-video-slider-container">
      <div ref={containerRef} className="multimedia-video-slider-track">
        <motion.div
          ref={wrapperRef}
          className="multimedia-video-slider-wrapper"
          drag="x"
          dragConstraints={getDragConstraints}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ 
            x: x,
            cursor: isDragging ? "grabbing" : "grab"
          }}
        >
          {videoData.map((video, index) => (
            <CurvedSlide
              key={index}
              video={video}
              index={index}
              x={x}
              containerRef={containerRef}
              wrapperRef={wrapperRef}
              videoRefs={videoRefs}
              isDragging={isDragging}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SemicircularVideoSlider;

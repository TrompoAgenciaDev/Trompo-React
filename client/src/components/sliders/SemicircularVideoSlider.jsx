import React, { useRef, useEffect, useState } from "react";
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
  
  // Calcular Y basado en posición real del slide
  const y = useTransform(x, () => {
    if (!containerRef.current || !slideRef.current) return 0;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const slideRect = slideRef.current.getBoundingClientRect();
    
    const viewportCenterX = containerRect.left + (containerRect.width / 2);
    const slideCenterX = slideRect.left + (slideRect.width / 2);
    const distanceFromCenter = slideCenterX - viewportCenterX;
    const normalizedDistance = distanceFromCenter / (containerRect.width / 2);
    const clampedDistance = Math.max(-1, Math.min(1, normalizedDistance));
    
    return -maxCurveHeight * (1 - Math.pow(clampedDistance, 2));
  });
  
  // Calcular rotación Z basada en posición real
  const rotateZ = useTransform(x, () => {
    if (!containerRef.current || !slideRef.current) return 0;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const slideRect = slideRef.current.getBoundingClientRect();
    
    const viewportCenterX = containerRect.left + (containerRect.width / 2);
    const slideCenterX = slideRect.left + (slideRect.width / 2);
    const distanceFromCenter = slideCenterX - viewportCenterX;
    const normalizedDistance = distanceFromCenter / (containerRect.width / 2);
    const clampedDistance = Math.max(-1, Math.min(1, normalizedDistance));
    
    return clampedDistance * maxRotation;
  });
  
  // Calcular zIndex basado en distancia del centro
  const zIndex = useTransform(x, () => {
    if (!containerRef.current || !slideRef.current) return 50;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const slideRect = slideRef.current.getBoundingClientRect();
    
    const viewportCenterX = containerRect.left + (containerRect.width / 2);
    const slideCenterX = slideRect.left + (slideRect.width / 2);
    const distanceFromCenter = Math.abs(slideCenterX - viewportCenterX);
    const normalizedDistance = distanceFromCenter / (containerRect.width / 2);
    
    return Math.round(100 - Math.min(1, normalizedDistance) * 50);
  });
  
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
  
  // ÚNICA fuente de verdad: motionValue x
  const x = useMotionValue(0);
  
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

  // Inicializar posición al montar (solo una vez)
  useEffect(() => {
    if (!containerRef.current) return;
    
    const initializePosition = () => {
      const slideWidth = getSlideWidth();
      const containerWidth = containerRef.current.offsetWidth;
      const centerOffset = (containerWidth / 2) - (slideWidth / 2);
      const slideWithGap = getSlideWithGap();
      const initialX = centerOffset - (MIDDLE_START * slideWithGap);
      
      x.set(initialX);
    };
    
    // Esperar a que el DOM esté listo
    requestAnimationFrame(() => {
      initializePosition();
    });
  }, []);

  // Calcular límites del carrusel infinito
  const getDragConstraints = () => {
    if (!containerRef.current) return { left: 0, right: 0 };
    
    const slideWidth = getSlideWidth();
    const containerWidth = containerRef.current.offsetWidth;
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
    const containerWidth = containerRef.current.offsetWidth;
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

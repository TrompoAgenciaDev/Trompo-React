import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Puedes cambiar estos paths por videos reales si lo deseas
const sliderVideos = [
  "/assets/heroImages/home-video.mp4",
  "/assets/heroImages/home-video.mp4",
  "/assets/heroImages/home-video.mp4",
  "/assets/heroImages/home-video.mp4",
];

function isMobile() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ))
  );
}

function VideoSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const duration = 800;
  const interval = 2800;

  // Avanza al siguiente slide
  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % sliderVideos.length);
  };

  // Maneja el timer de auto-slide
  useEffect(() => {
    if (!paused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }
    return () => clearInterval(timerRef.current);
  }, [paused, index]);

  // Pausar/resumir por hover/touch
  useEffect(() => {
    const handleScrollOrClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setPaused(false);
      }
    };

    if (paused) {
      window.addEventListener("scroll", handleScrollOrClickOutside, true);
      window.addEventListener("mousedown", handleScrollOrClickOutside, true);
      window.addEventListener("touchstart", handleScrollOrClickOutside, true);
    } else {
      window.removeEventListener("scroll", handleScrollOrClickOutside, true);
      window.removeEventListener("mousedown", handleScrollOrClickOutside, true);
      window.removeEventListener("touchstart", handleScrollOrClickOutside, true);
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrClickOutside, true);
      window.removeEventListener("mousedown", handleScrollOrClickOutside, true);
      window.removeEventListener("touchstart", handleScrollOrClickOutside, true);
    };
  }, [paused]);

  // Handlers para pausar/reanudar
  const handlePause = () => setPaused(true);

  // Mobile: tap para pausar
  const handleTouch = (e) => {
    if (isMobile()) {
      setPaused(true);
    }
  };

  // Reproduce el video solo cuando el slide es visible
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      // Espera a que la animación de entrada termine antes de reproducir
      // para asegurar que el video está visible
      const playTimeout = setTimeout(() => {
        videoRef.current.play().catch(() => {});
      }, duration);
      return () => clearTimeout(playTimeout);
    }
  }, [index]);

  // Pausa el video cuando el componente se desmonta o el slide cambia
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [index]);

  // Cuando termina el video, avanza al siguiente slide y reanuda animación
  const handleVideoEnded = () => {
    nextSlide();
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        touchAction: "manipulation",
        cursor: paused ? "pointer" : "default",
      }}
      onMouseEnter={!isMobile() ? handlePause : undefined}
      onTouchStart={handleTouch}
    >
      <AnimatePresence initial={false}>
        
        <motion.div
          key={index}
          style={{
            width: "100%",
            height: "300px",
            position: "absolute",
            left: 0,
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: duration / 1000 }}
        >
          <video
            ref={videoRef}
            src={sliderVideos[index]}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              border: "none",
              outline: "none",
              pointerEvents: "none", // para que el touch/mouse pase al contenedor
            }}
            muted
            playsInline
            onEnded={handleVideoEnded}
            autoPlay={false}
            controls={false}
          />
        </motion.div>
      </AnimatePresence>
      {/* Overlay para indicar pausa */}
      {paused && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          
        </div>
      )}
    </div>
  );
}

export default VideoSlider;
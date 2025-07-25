import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import "../assets/styles/video-slider.css";

const sliderVideos = [
  "/assets/portfolioImg/videos/volvo.mp4",
  "/assets/portfolioImg/videos/denso.mp4",
  "/assets/portfolioImg/videos/sw.mp4",
  "/assets/portfolioImg/videos/viditec.mp4",
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
  const [animating, setAnimating] = useState(true);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const duration = 800;
  const interval = 4000;

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const visibleCount = getVisibleCount();
  const totalSlides = sliderVideos.length;
  const clonedSlides = [...sliderVideos, ...sliderVideos, ...sliderVideos];
  const totalCloned = clonedSlides.length;

  const nextSlide = () => {
    setIndex((prev) => prev + 1);
    setAnimating(true);
  };

  useEffect(() => {
    if (!paused) {
      timerRef.current = setInterval(nextSlide, interval);
    }
    return () => clearInterval(timerRef.current);
  }, [paused, index]);

  useEffect(() => {
    const handleScrollOrClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPaused(false);
      }
    };

    const events = ["scroll", "mousedown", "touchstart"];
    if (paused) {
      events.forEach((ev) =>
        window.addEventListener(ev, handleScrollOrClickOutside, true)
      );
    } else {
      events.forEach((ev) =>
        window.removeEventListener(ev, handleScrollOrClickOutside, true)
      );
    }

    return () =>
      events.forEach((ev) =>
        window.removeEventListener(ev, handleScrollOrClickOutside, true)
      );
  }, [paused]);

  const handlePause = () => setPaused(true);
  const handleTouch = () => isMobile() && setPaused(true);

  // Detecta fin del loop y resetea sin animación
  useEffect(() => {
    if (index >= totalSlides) {
      const resetTimeout = setTimeout(() => {
        setAnimating(false);
        setIndex(0);
      }, duration);
      return () => clearTimeout(resetTimeout);
    }
  }, [index]);

  const offset = (index * 100) / visibleCount;

  return (
    <div
      ref={containerRef}
      className="video-slider-container"
      style={{ cursor: paused ? "pointer" : "default" }}
      onMouseEnter={!isMobile() ? handlePause : undefined}
      onTouchStart={handleTouch}
    >
      <motion.div
        className="video-slider-track"
        animate={{ x: `-${offset}%` }}
        transition={animating ? { duration: duration / 1000 } : { duration: 0 }}
      >
        {clonedSlides.map((videoSrc, i) => (
          <div className="video-slide" key={i}>
            <video
              src={videoSrc}
              muted
              playsInline
              autoPlay
              loop
              className="video-element"
            />
          </div>
        ))}
      </motion.div>

      {paused && <div className="video-slider-overlay"></div>}
    </div>
  );
}

export default VideoSlider;

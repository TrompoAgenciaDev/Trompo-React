import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import "../../assets/styles/image-slider.css";

const sliderImages = [
  "/assets/customerImg/denso.png",
  "/assets/customerImg/femesa.png",
  "/assets/customerImg/guanaco.png",
  "/assets/customerImg/lhaka.png",
  "/assets/customerImg/ranko.png",
  "/assets/customerImg/raulito.png",
  "/assets/customerImg/ravana.png",
  "/assets/customerImg/renault-trucks.png",
  "/assets/customerImg/sw.png",
  "/assets/customerImg/viditec.png",
  "/assets/customerImg/volvo.png",
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

function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(true);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const duration = 800;
  const interval = 2800;

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 2;
    if (window.innerWidth >= 1024) return 6;
    if (window.innerWidth >= 768) return 4;
    return 1;
  };

  const visibleCount = getVisibleCount();
  const totalSlides = sliderImages.length;
  const clonedSlides = [...sliderImages, ...sliderImages, ...sliderImages];
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
      className="image-slider-container container"
      style={{ cursor: paused ? "pointer" : "default" }}
      onMouseEnter={!isMobile() ? handlePause : undefined}
      onTouchStart={handleTouch}
    >
      <motion.div
        className="image-slider-track"
        animate={{ x: `-${offset}%` }}
        transition={animating ? { duration: duration / 1000 } : { duration: 0 }}
      >
        {clonedSlides.map((imgSrc, i) => (
          <div className="image-slide" key={i}>
            <img src={imgSrc} alt={`slide-${i}`} className="image-element" />
          </div>
        ))}
      </motion.div>

      {paused && <div className="image-slider-overlay"></div>}
    </div>
  );
}

export default ImageSlider;
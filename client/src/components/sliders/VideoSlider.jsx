import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import "../../assets/styles/video-slider.css";

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

function wrapIndex(idx, length) {
  return (idx + length) % length;
}

function VideoSlider({ location }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(true);
  const [animating, setAnimating] = useState(true);
  const [interactionAllowed, setInteractionAllowed] = useState(false);

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

  const prevSlide = () => {
    setIndex((prev) => wrapIndex(prev - 1, totalSlides));
    setAnimating(true);
  };

  const goForward = () => {
    setIndex((prev) => wrapIndex(prev + 1, totalSlides));
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

  useEffect(() => {
    const enableInteraction = () => setInteractionAllowed(true);
    window.addEventListener("click", enableInteraction, { once: true });
    window.addEventListener("touchstart", enableInteraction, { once: true });
    return () => {
      window.removeEventListener("click", enableInteraction);
      window.removeEventListener("touchstart", enableInteraction);
    };
  }, []);

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
              loop
              playsInline
              className="video-element"
              onMouseEnter={(e) => {
                if (interactionAllowed) e.currentTarget.play();
              }}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          </div>
        ))}
      </motion.div>

      {paused && <div className="video-slider-overlay"></div>}

      {location !== "home" && (
        <>
          <button onClick={prevSlide} className="button-prev">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
            >
              <path
                d="M31.9687 16.1926L1.08382 16.1926M1.08382 16.1926L16.5263 31.3777M1.08382 16.1926L16.5263 1.00751"
                stroke="#1D1D1B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button onClick={goForward} className="button-next">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="33"
              viewBox="0 0 33 33"
              fill="none"
            >
              <path
                d="M1.03125 16.1926L31.9161 16.1926M31.9161 16.1926L16.4737 1.00751M31.9161 16.1926L16.4737 31.3777"
                stroke="#1D1D1B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default VideoSlider;

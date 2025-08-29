// testimonios.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import useFetchTestimonials from "../hooks/useFetchTestimonials"; // ajusta la ruta si cambia
import "../assets/styles/testimonials.css";

const INTERVAL = 100000;
const TRANSITION_S = 0.6;
const REPEAT = 5;

function isDesktop() {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 1280;
}
const norm = (i, n) => ((i % n) + n) % n;

export default function Testimonials({ size = 1 }) {
  const { testimonials, loading, error } = useFetchTestimonials();

  const total = testimonials.length;
  const [desktop, setDesktop] = useState(isDesktop());
  useEffect(() => {
    const onResize = () => setDesktop(isDesktop());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const visibleCount = desktop ? Math.max(1, Number(size) || 1) : 1;

  // clonar para loop infinito
  const cloned = useMemo(
    () => (total ? Array.from({ length: REPEAT }, () => testimonials).flat() : []),
    [testimonials, total]
  );

  const middle = total * Math.floor(REPEAT / 2);
  const [index, setIndex] = useState(middle);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(true);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // autoplay: avanza 1 testimonio por tick
  useEffect(() => {
    if (!total || paused || dragging) return;
    timerRef.current = setInterval(() => setIndex((p) => p + 1), INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, dragging, total]);

  // recentrar cuando nos acercamos a los bordes del buffer
  useEffect(() => {
    if (!total) return;
    const min = total * 2;
    const max = total * (REPEAT - 2);
    if (index < min || index > max) {
      const mod = norm(index, total);
      setAnimating(false);
      setIndex(middle + mod);
    } else {
      setAnimating(true);
    }
  }, [index, total, middle]);

  if (loading) return <div>Cargando testimonios...</div>;
  if (error) return <div>{error}</div>;
  if (!total) return <div>No hay testimonios disponibles.</div>;

  // offset en %: siempre se mueve de a 1, aunque se muestren 2+
  const offset = (index * 100) / visibleCount;

  // dots: uno por testimonio real
  const activeDot = norm(index, total);
  const goTo = (i) => {
    setAnimating(true);
    setIndex(middle + norm(i, total));
    setPaused(true);
    // reanuda luego de un frame
    requestAnimationFrame(() => setPaused(false));
  };

  // drag con “imán”
  const onDragStart = () => {
    setDragging(true);
    setPaused(true);
    setAnimating(false);
  };
  const onDragEnd = (_e, info) => {
    const w = containerRef.current?.offsetWidth || 0;
    const slideW = w / visibleCount;
    const threshold = Math.max(40, slideW * 0.2);
    const dx = info.offset.x;
    setAnimating(true);
    if (dx <= -threshold) setIndex((p) => p + 1);
    else if (dx >= threshold) setIndex((p) => p - 1);
    // snap al actual si no superó umbral
    setDragging(false);
    setPaused(false);
  };

  return (
    <div
      ref={containerRef}
      className="testimoniales-container"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="testimoniales-viewport" style={{ overflow: "hidden" }}>
        <motion.div
          className="testimoniales-track"
          animate={{ x: `-${offset}%` }}
          transition={animating ? { duration: TRANSITION_S, ease: "easeInOut" } : { duration: 0 }}
          drag="x"
          dragMomentum={true}
          dragElastic={0.08}
          dragTransition={{ power: 0.2, timeConstant: 200 }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          style={{ display: "flex", willChange: "transform" }}
        >
          {cloned.map((item, i) => (
            <div
              key={i}
              style={{
                flex: `0 0 ${100 / visibleCount}%`,
                maxWidth: `${100 / visibleCount}%`,
                boxSizing: "border-box",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            >
              <div className="testimoniales-card">
                <div className="testimoniales-img">
                  <img src={item.image} />
                  <div className="testimoniales-author">
                    {item.author}
                  </div>
                </div>
                <div className="testimonial-content">
                  <div className="testimonial-header-card">
                    {/* <div className="testimoniales-rating">
                      {"★".repeat(item.rating)}
                      <span className="testimoniales-rating-empty">
                        {"★".repeat(5 - item.rating)}
                      </span>
                    </div> */}
                  </div>
                  <div className="testimoniales-text">
                    {/* <span className="testimoniales-rating">{"★ "}</span> */}
                    {item.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Puntos de navegación: mueven 1 a la vez al índice elegido */}
      <div className="testimoniales-dots">
        {Array.from({ length: total }).map((_, p) => (
          <div
            key={p}
            onClick={() => goTo(p)}
            className={`testimoniales-dot${p === activeDot ? " active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

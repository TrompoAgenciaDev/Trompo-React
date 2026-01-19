import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import useFetchTestimonials from "../hooks/useFetchTestimonials"; // ajusta la ruta si cambia
import "../assets/styles/testimonials.css";

const INTERVAL = 4000;
const TRANSITION_S = 1.2;
const REPEAT = 5;

function getVisibleCount() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}
const norm = (i, n) => ((i % n) + n) % n;

export default function Testimonials({ size = null }) {
  const { testimonials, loading, error } = useFetchTestimonials();

  const total = testimonials.length;
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const displayCount = size !== null ? Number(size) : visibleCount;

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
  const offset = (index * 100) / displayCount;

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
    const slideW = w / displayCount;
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
                flex: `0 0 ${100 / displayCount}%`,
                maxWidth: `${100 / displayCount}%`,
                boxSizing: "border-box",
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <div className="testimoniales-card" style={{ width: "100%" }}>
                <div className="testimoniales-text">
                  {item.text.replace(/^✨\s*/, '')}
                </div>
                <div className="testimoniales-author-info">
                  <img src={item.image} alt={item.name || item.author} className="testimoniales-avatar" />
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

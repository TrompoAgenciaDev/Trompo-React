import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import useFetchTestimonials from "../hooks/useFetchTestimonials";
import "../assets/styles/testimonials.css";

const SLIDE_DURATION = 3000;
const ANIMATION_DURATION = 0.6;

function wrapIndex(idx, length) {
  return (idx + length) % length;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1280 : false
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1280);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isDesktop;
}

export default function Testimoniales() {
  const { testimonials, loading, error } = useFetchTestimonials();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);

  const isDesktop = useIsDesktop();
  const itemsPerSlide = isDesktop ? 2 : 1;

  // autoplay
  useEffect(() => {
    if (!testimonials.length) return;
    if (isPaused || isDragging) return;
    timerRef.current = setTimeout(() => {
      setIndex((prev) => wrapIndex(prev + itemsPerSlide, testimonials.length));
    }, SLIDE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [index, isPaused, isDragging, testimonials.length, itemsPerSlide]);

  if (loading) return <div>Cargando testimonios...</div>;
  if (error) return <div>{error}</div>;
  if (!testimonials.length) return <div>No hay testimonios disponibles.</div>;

  const onDragStart = (_e, info) => {
    setIsDragging(true);
    dragStartX.current = info.point.x;
    dragDelta.current = 0;
  };
  const onDrag = (_e, info) => {
    dragDelta.current = info.point.x - dragStartX.current;
  };
  const onDragEnd = () => {
    setIsDragging(false);
    const t = 80;
    if (dragDelta.current > t) {
      setIndex((prev) => wrapIndex(prev - itemsPerSlide, testimonials.length));
    } else if (dragDelta.current < -t) {
      setIndex((prev) => wrapIndex(prev + itemsPerSlide, testimonials.length));
    }
    dragDelta.current = 0;
  };

  const renderCard = (item, key) => (
    <div className="testimoniales-card" key={key}>
      <div className="testimoniales-img">
        <img
          src={item.image || "/favicon.png"}
          alt={item.author_name || item.author}
        />
      </div>
      <div className="testimonial-content">
        <div className="testimonial-header-card">
          <div className="testimoniales-author">
            {item.author_name || item.author}
          </div>
          <div className="testimoniales-rating">
            {"★".repeat(item.rating)}
            <span className="testimoniales-rating-empty">
              {"★".repeat(5 - item.rating)}
            </span>
          </div>
        </div>
        <div className="testimoniales-text">{item.text}</div>
      </div>
    </div>
  );

  // ancho de cada paso = 100% viewport / itemsPerSlide
  const translateX = `-${(index * 100) / itemsPerSlide}%`;

  // paginación corregida
  const totalPages = Math.ceil(testimonials.length / itemsPerSlide);
  const currentPage = Math.floor(index / itemsPerSlide);

  return (
    <div
      className="testimoniales-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="testimoniales-viewport">
        <motion.div
          className={`testimoniales-track ${isDesktop ? "two-cols" : ""}`}
          animate={{ x: translateX }}
          transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "pan-y" }}
        >
          {testimonials.map((item, i) => renderCard(item, i))}
        </motion.div>
      </div>

      {/* dots por página */}
      <div className="testimoniales-dots">
        {Array.from({ length: totalPages }).map((_, page) => (
          <div
            key={page}
            onClick={() => setIndex(page * itemsPerSlide)}
            className={`testimoniales-dot${page === currentPage ? " active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

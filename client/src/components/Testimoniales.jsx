import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import useFetchTestimonials from "../hooks/useFetchTestimonials";
import "../assets/styles/testimonials.css"; // Asegúrate de crear este archivo y definir las clases

const SLIDE_DURATION = 3000;
const ANIMATION_DURATION = 0.6;

function wrapIndex(idx, length) {
  return (idx + length) % length;
}

export default function Testimoniales() {
  const { testimonials, loading, error } = useFetchTestimonials();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);

  useEffect(() => {
    if (!testimonials.length) return;
    if (isPaused || isDragging) return;
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setIndex((prev) => wrapIndex(prev + 1, testimonials.length));
    }, SLIDE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [index, isPaused, isDragging, testimonials.length]);

  if (loading) return <div>Cargando testimonios...</div>;
  if (error) return <div>{error}</div>;
  if (!testimonials.length) return <div>No hay testimonios disponibles.</div>;

  // Drag handlers
  function handleDragStart(event, info) {
    setIsDragging(true);
    dragStartX.current = info.point.x;
    dragDelta.current = 0;
  }
  function handleDrag(event, info) {
    dragDelta.current = info.point.x - dragStartX.current;
  }
  function handleDragEnd(event, info) {
    setIsDragging(false);
    const threshold = 80; // px
    if (dragDelta.current > threshold) {
      setDirection(-1);
      setIndex((prev) => wrapIndex(prev - 1, testimonials.length));
    } else if (dragDelta.current < -threshold) {
      setDirection(1);
      setIndex((prev) => wrapIndex(prev + 1, testimonials.length));
    }
    dragDelta.current = 0;
  }

  // Animation variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: ANIMATION_DURATION },
    },
    exit: (dir) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
      scale: 0.98,
      transition: { duration: ANIMATION_DURATION * 0.7 },
    }),
  };

  // For infinite loop even with 2 cards, always wrapIndex
  const current = testimonials[wrapIndex(index, testimonials.length)];

  return (
    <div
      className="testimoniales-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "pan-y",
          }}
          className="testimoniales-card"
        >
          <div className="testimoniales-img">
            <img src={current.image || "/default-avatar.png"} alt={current.author_name || current.author} />
          </div>
          
          <div className="testimoniales-rating">
            {"★".repeat(current.rating)}
            <span className="testimoniales-rating-empty">
              {"★".repeat(5 - current.rating)}
            </span>
          </div>

          <div className="testimoniales-author">
            {current.author_name || current.author}
          </div>
          <div className="testimoniales-text">
            {current.text}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="testimoniales-dots">
        {testimonials.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`testimoniales-dot${i === wrapIndex(index, testimonials.length) ? " active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

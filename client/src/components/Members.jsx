import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import useMembers from "../hooks/useMembers";
import "../assets/styles/members.css";

const SLIDE_DURATION = 3000;
const ANIMATION_DURATION = 0.6;

function wrapIndex(idx, length) {
  return (idx + length) % length;
}

export default function Members() {
  const { members, loading, error } = useMembers();

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(1);

  const timerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);

  // Autoplay
  useEffect(() => {
    if (!members.length) return;
    if (isPaused || isDragging) return;
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setIndex((prev) => wrapIndex(prev + 1, members.length));
    }, SLIDE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [index, isPaused, isDragging, members.length]);

  if (loading) return <div>Cargando miembros…</div>;
  if (error) return <div>{error}</div>;
  if (!members.length) return <div>No hay miembros de equipo disponibles.</div>;

  function handleDragStart(_e, info) {
    setIsDragging(true);
    dragStartX.current = info.point.x;
    dragDelta.current = 0;
  }
  function handleDrag(_e, info) {
    dragDelta.current = info.point.x - dragStartX.current;
  }
  function handleDragEnd() {
    setIsDragging(false);
    const threshold = 80;
    if (dragDelta.current > threshold) {
      setDirection(-1);
      setIndex((prev) => wrapIndex(prev - 1, members.length));
    } else if (dragDelta.current < -threshold) {
      setDirection(1);
      setIndex((prev) => wrapIndex(prev + 1, members.length));
    }
    dragDelta.current = 0;
  }

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: ANIMATION_DURATION } },
    exit: (dir) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
      scale: 0.98,
      transition: { duration: ANIMATION_DURATION * 0.7 },
    }),
  };

  const current = members[wrapIndex(index, members.length)];

  return (
    <div
      className="members-container"
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
          style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "pan-y" }}
          className="member-card"
        >
          <div className="member-content">
            <div className="member-header-card">
              <div className="member-author">
                <strong>{current.name}</strong> - {current.position}
              </div>
            </div>
            <div className="member-text">{current.portfolio}</div>
          </div>

          <div
            style={{ backgroundImage: `url(${current.featured_image})` }}
            className="member-img"
          />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => {
          setDirection(-1);
          setIndex((prev) => wrapIndex(prev - 1, members.length));
        }}
        className="button-prev"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
          <path d="M31.9687 16.1926L1.08382 16.1926M1.08382 16.1926L16.5263 31.3777M1.08382 16.1926L16.5263 1.00751"
            stroke="#1D1D1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={() => {
          setDirection(1);
          setIndex((prev) => wrapIndex(prev + 1, members.length));
        }}
        className="button-next"
        aria-label="Siguiente"
      >
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084"
            stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

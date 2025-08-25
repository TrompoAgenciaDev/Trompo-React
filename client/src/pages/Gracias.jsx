import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//styles
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import "../assets/styles/gracias.css";

export default function Gracias() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    document.title = "Gracias";
    document.body.classList.add("hide-chrome");
    return () => document.body.classList.remove("hide-chrome");
  }, []);

  return (
    <section className="ty-wrapper" aria-label="Gracias">
      <div className="ty-band ty-band-top" aria-hidden />
      <div className="ty-band ty-band-bottom" aria-hidden />

      <motion.div
        className="ty-card"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <AnimatePresence>
          {!prefersReduced && (
            <>
              <motion.span
                className="ty-dot ty-dot-a"
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: [0, -10, 0], opacity: 1 }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.span
                className="ty-dot ty-dot-b"
                initial={{ x: 8, opacity: 0 }}
                animate={{ x: [0, 12, 0], opacity: 1 }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </>
          )}
        </AnimatePresence>

        <div className="ty-icon" aria-hidden>
          <svg viewBox="0 0 120 120" className="ty-icon-svg">
            <motion.circle
              cx="60"
              cy="60"
              r="46"
              className="ty-circle"
              initial={{ pathLength: 0, opacity: 0.6 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              fill="none"
            />
            <motion.path
              d="M40 61 L55 76 L82 49"
              className="ty-check"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              fill="none"
            />
          </svg>
        </div>

        <motion.h1
          className="ty-title"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          Gracias
        </motion.h1>

        <motion.p
          className="ty-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Recibimos tu envío. Te contactaremos a la brevedad.
        </motion.p>

        <motion.div
          className="ty-actions"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <button
            className="ty-btn ty-btn-primary"
            onClick={() => navigate("/")}
          >
            Ir al inicio
          </button>
          <button className="ty-btn ty-btn-ghost" onClick={() => navigate(-1)}>
            Volver
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

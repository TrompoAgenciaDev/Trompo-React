import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import "../assets/styles/notfound.css";

export default function NotFound() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    document.title = "404 • Página no encontrada";
    document.body.classList.add("hide-chrome");
    return () => document.body.classList.remove("hide-chrome");
  }, []);

  // Parallax leve con el mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-50, 50], [-6, 6]), {
    stiffness: 120,
    damping: 18,
  });
  const rotX = useSpring(useTransform(my, [-50, 50], [6, -6]), {
    stiffness: 120,
    damping: 18,
  });

  function onMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 50;
    const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 50;
    mx.set(Math.max(-50, Math.min(50, dx)));
    my.set(Math.max(-50, Math.min(50, dy)));
  }
  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.08 },
    },
  };
  const pop = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  return (
    <section
      className="nf-wrapper"
      onMouseMove={prefersReduced ? undefined : onMouseMove}
      onMouseLeave={prefersReduced ? undefined : onMouseLeave}
    >
      <div className="nf-grid-bg" aria-hidden />
      <motion.div
        className="nf-card"
        style={prefersReduced ? {} : { rotateX: rotX, rotateY: rotY }}
      >
        {/* Figuras decorativas */}
        <AnimatePresence>
          {!prefersReduced && (
            <>
              <motion.span
                className="nf-dot nf-dot-a"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: [0, -12, 0], opacity: 1 }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.span
                className="nf-dot nf-dot-b"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: [0, 10, 0], opacity: 1 }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.span
                className="nf-dot nf-dot-c"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: [0, 16, 0], opacity: 1 }}
                transition={{ duration: 3.6, repeat: Infinity }}
              />
            </>
          )}
        </AnimatePresence>

        <motion.div
          className="nf-inner"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="nf-code" variants={pop} aria-hidden>
            <motion.span className="nf-digit" variants={pop}>
              4
            </motion.span>
            <motion.span className="nf-zero" variants={pop}>
              {/* cero como “lupa rota” */}
              <svg
                width="140"
                height="140"
                viewBox="0 0 140 140"
                className="nf-zero-svg"
              >
                <defs>
                  <radialGradient id="g" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#FEE070" stopOpacity="1" />
                    <stop offset="100%" stopColor="#FEE070" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="70" cy="70" r="50" className="nf-zero-ring" />
                <line
                  x1="100"
                  y1="100"
                  x2="128"
                  y2="128"
                  className="nf-zero-handle"
                />
                <circle cx="70" cy="70" r="50" fill="url(#g)" opacity="0.2" />
              </svg>
            </motion.span>
            <motion.span className="nf-digit" variants={pop}>
              4
            </motion.span>
          </motion.div>

          <motion.h1 className="nf-title" variants={pop}>
            Página no encontrada
          </motion.h1>

          <motion.p className="nf-text" variants={pop}>
            El enlace no existe o cambió de ubicación.
          </motion.p>

          <motion.div className="nf-actions" variants={pop}>
            <button className="nf-btn nf-btn-primary" onClick={() => navigate("/")}>
              Ir al inicio
            </button>
            <button className="nf-btn nf-btn-ghost" onClick={() => navigate(-1)}>
              Volver
            </button>
            <button
              className="nf-btn nf-btn-copy"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(window.location.href);
                } catch {}
              }}
            >
              Copiar URL
            </button>
          </motion.div>

          <motion.a variants={pop} className="nf-help" href="/contacto">
            ¿Creés que es un error? Avisanos
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

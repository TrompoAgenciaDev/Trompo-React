// src/pages/Maintenance.jsx
import { useEffect } from "react";
import Icons from "../components/Icons";

//styles
import "../assets/styles/maintenance.css";
import { motion, AnimatePresence } from "motion/react";

export default function Maintenance() {
  useEffect(() => {
    document.title = "Mantenimiento";
    document.body.classList.add("hide-chrome");
    return () => document.body.classList.remove("hide-chrome");
  }, []);

  return (
    <section className="maintenance-wrapper" aria-label="Página en mantenimiento">
      <div className="maintenance-grid-bg" aria-hidden />

      <motion.div
        className="maintenance-card"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <AnimatePresence>
          <motion.span
            className="m-dot m-dot-a"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: [0, -10, 0], opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.span
            className="m-dot m-dot-b"
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: [0, 12, 0], opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </AnimatePresence>

        <motion.div
          initial={{ rotate: -2, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          className="maintenance-icon"
          aria-hidden
        >
          <Icons iconName="logoWhite" />
        </motion.div>

        <motion.h1
          className="maintenance-title"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Estamos en mantenimiento
        </motion.h1>

        <motion.p
          className="maintenance-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          Volveremos pronto. Gracias por tu paciencia.
        </motion.p>
      </motion.div>
    </section>
  );
}

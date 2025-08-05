import React from "react";
import { motion } from "framer-motion";

export default function Page404() {
  return (
    <main className="page404-wrapper" role="main">
      <motion.div
        className="page404-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="error-code"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          aria-label="Error 404"
        >
          404
        </motion.h1>
        <motion.p
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          Lo sentimos, la página que buscas no fue encontrada.
        </motion.p>
        <motion.button
          className="btn-home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Volver al inicio"
          onClick={() => (window.location.href = "/")}
        >
          Volver al inicio
        </motion.button>
      </motion.div>
    </main>
  );
}

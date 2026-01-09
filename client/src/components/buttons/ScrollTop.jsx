import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { animate } from "framer-motion";
import "../../assets/styles/scrollTop.css";

function ScrollTop() {
  const [visible, setVisible] = useState(false);
  const { pathname, hash } = useLocation();

  // reset de scroll en cada cambio de ruta
  useEffect(() => {
    if (hash) return; // si vas a /ruta#ancla, respetá el ancla
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, hash]);

  // opcional: desactivar restauración del navegador
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón cuando el usuario haya hecho scroll más de 300px
      // o más de la mitad de la altura de la ventana
      const threshold = Math.max(300, window.innerHeight * 0.5);
      setVisible(window.scrollY > threshold);
    };
    
    // Verificar estado inicial
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    
    // Usar Framer Motion para animación suave con easing progresivo
    const startPosition = window.scrollY;
    animate(startPosition, 0, {
      duration: 1.0,
      ease: [0.25, 0.1, 0.25, 1], // Cubic bezier para transición suave con frenado progresivo
      onUpdate: (latest) => {
        window.scrollTo({
          top: latest,
          left: 0,
          behavior: "auto"
        });
      }
    });
  };

  return (
    <button
      type="button"
      className={`scroll-top-button ${visible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <svg
        width="23"
        height="24"
        viewBox="0 0 23 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6526 22.231L11.6526 1.83985M11.6526 1.83985L1.62695 12.0354M11.6526 1.83985L21.6782 12.0354"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default ScrollTop;

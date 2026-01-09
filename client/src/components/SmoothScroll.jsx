import { useEffect } from "react";

/**
 * Componente que mejora el scroll suave globalmente usando CSS y optimizaciones
 * No intercepta eventos, solo mejora la experiencia visual
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Agregar clase al body para estilos de scroll mejorados
    document.body.classList.add("smooth-scroll-enabled");
    
    // Optimizar el scroll con mejor rendimiento
    if (CSS.supports("scroll-behavior", "smooth")) {
      // El navegador soporta scroll-behavior nativo
      document.documentElement.style.scrollBehavior = "smooth";
    }
    
    return () => {
      document.body.classList.remove("smooth-scroll-enabled");
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
  
  return <>{children}</>;
};

export default SmoothScroll;

import { useState, useEffect, useRef } from "react";
import Icons from "../components/Icons";

import "../assets/styles/header.css";
import { motion } from "framer-motion";

const Header = ({ onTogglePopup }) => {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    // Mobile isolation: salir temprano en <1024px
    if (window.innerWidth < 1024) {
      return;
    }

    // Solo desktop: detectar cuando el header se vuelve sticky usando scroll
    const handleScroll = () => {
      if (!headerRef.current) return;
      
      // Obtener la posición del header respecto al viewport
      const rect = headerRef.current.getBoundingClientRect();
      // Cuando top es 0, significa que está sticky
      setIsSticky(rect.top <= 0);
    };

    // Verificar estado inicial
    handleScroll();

    // Escuchar scroll con passive para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.header 
      ref={headerRef}
      className="full-container header header-sticky"
      animate={{
        background: isSticky 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.62) 20%, rgba(255, 255, 255, 0) 75%)',
        backdropFilter: isSticky ? 'blur(10px)' : 'blur(0px)',
        boxShadow: isSticky 
          ? '0 2px 10px rgba(0, 0, 0, 0.1)' 
          : 'none',
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className="container">
        <motion.a
          className="logo-img"
          href="/"
          initial={{
            y: -250,
          }}
          animate={{
            y: 0,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 350,
          }}
        >
          <Icons iconName="logoBlack" />
        </motion.a>

        <motion.button
          className="nav-button"
          initial={{
            y: -250,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            type: "spring",
            damping: 28,
            stiffness: 350,
          }}
          onClick={onTogglePopup}
        >
          <Icons iconName={"burguer"}/>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;

import { useState, useEffect } from "react";
import Icons from "../components/Icons";

import "../assets/styles/header.css";
import { motion } from "framer-motion";

const Header = ({ onTogglePopup }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // Detectar cuando el scroll alcanza 85svh (promedio entre 80-90svh)
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.85; // 85svh
      setIsSticky(window.scrollY >= scrollThreshold);
    };

    // Verificar estado inicial
    handleScroll();

    // Escuchar scroll con passive para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
    };
  }, []);

  return (
    <motion.header 
      className={`full-container header header-sticky ${isSticky ? 'header-is-sticky' : ''}`}
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

import { useState, useEffect, useRef } from "react";
import Icons from "../components/Icons";

import "../assets/styles/header.css";
import { motion } from "framer-motion";

const Header = ({ onTogglePopup }) => {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Solo aplicar sticky en desktop
      if (window.innerWidth < 1024) {
        setIsSticky(false);
        return;
      }

      // Buscar el elemento del hero video (puede ser desktop-only o mobile-only)
      const heroVideo = document.querySelector('.hero-video.desktop-only') || 
                        document.querySelector('.hero-video.mobile-only') ||
                        document.querySelector('.hero-video');
      
      if (heroVideo) {
        const heroRect = heroVideo.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        // Cuando el bottom del hero llega al top de la ventana (o antes)
        if (heroBottom <= 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Verificar estado inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`full-container header ${isSticky ? 'sticky' : ''}`}
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
    </header>
  );
};

export default Header;

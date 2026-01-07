import { useState, useEffect, useRef } from "react";
import Icons from "../components/Icons";

import "../assets/styles/header.css";
import { motion } from "framer-motion";

const Header = ({ onTogglePopup }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        // Usar requestAnimationFrame para asegurar que el DOM esté actualizado
        requestAnimationFrame(() => {
          if (headerRef.current) {
            const height = headerRef.current.offsetHeight;
            setHeaderHeight(height);
          }
        });
      }
    };

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

    // Actualizar altura inicial
    updateHeaderHeight();
    
    // Usar ResizeObserver para detectar cambios en la altura del header
    let resizeObserver;
    const initResizeObserver = () => {
      if (headerRef.current && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          updateHeaderHeight();
        });
        resizeObserver.observe(headerRef.current);
      }
    };
    
    // Inicializar ResizeObserver después de que el componente se monte
    initResizeObserver();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateHeaderHeight();
      handleScroll();
    }, { passive: true });
    
    // Actualizar altura después de que las animaciones iniciales terminen
    setTimeout(updateHeaderHeight, 100);
    handleScroll(); // Verificar estado inicial

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div 
      className="header-wrapper" 
      style={{ 
        minHeight: headerHeight > 0 ? `${headerHeight}px` : 'auto',
        height: isSticky && headerHeight > 0 ? `${headerHeight}px` : 'auto'
      }}
    >
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
    </div>
  );
};

export default Header;

import { useState, useEffect, useRef, useCallback } from "react";
import Icons from "../components/Icons";

import "../assets/styles/header.css";
import { motion } from "framer-motion";

const Header = ({ onTogglePopup }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const headerRef = useRef(null);
  const heroObserverRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // Función para encontrar el elemento hero
  const findHeroElement = useCallback(() => {
    // Buscar video hero (prioridad: desktop-only, luego mobile-only, luego cualquier hero-video)
    const heroVideo = document.querySelector('.hero-video.desktop-only') || 
                      document.querySelector('.hero-video.mobile-only') ||
                      document.querySelector('video.hero-video') ||
                      document.querySelector('.hero-video');
    
    if (heroVideo) return heroVideo;
    
    // Buscar contenedores alternativos
    return document.querySelector('[data-vjs-player]') ||
           document.querySelector('video[poster]');
  }, []);

  // Función para actualizar la altura del header
  const updateHeaderHeight = useCallback(() => {
    if (headerRef.current) {
      requestAnimationFrame(() => {
        if (headerRef.current) {
          const height = headerRef.current.offsetHeight;
          setHeaderHeight(height);
        }
      });
    }
  }, []);

  // Función para verificar el estado sticky basado en scroll
  const checkStickyState = useCallback(() => {
    // Solo aplicar sticky en desktop
    if (window.innerWidth < 1024) {
      setIsSticky(false);
      return;
    }

    const heroElement = findHeroElement();
    
    if (heroElement) {
      const rect = heroElement.getBoundingClientRect();
      // Cuando el bottom del hero pasa el top de la ventana
      setIsSticky(rect.bottom <= 0);
    } else {
      // Fallback: hacer sticky después de cierto scroll si no hay hero
      setIsSticky(window.scrollY > window.innerHeight * 0.5);
    }
  }, [findHeroElement]);

  useEffect(() => {
    // Verificar si es desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();

    // Actualizar altura inicial
    updateHeaderHeight();

    // Configurar ResizeObserver para el header
    if (headerRef.current && window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      resizeObserverRef.current.observe(headerRef.current);
    }

    // Configurar IntersectionObserver para el hero (más eficiente que scroll)
    let heroElement = findHeroElement();
    
    if (heroElement && window.IntersectionObserver) {
      heroObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Cuando el hero sale completamente del viewport por arriba
            // (isIntersecting = false y bottom < 0 significa que está arriba)
            if (!entry.isIntersecting) {
              const rect = entry.boundingClientRect;
              setIsSticky(rect.bottom <= 0);
            } else {
              // Si está intersectando, no hacer sticky
              setIsSticky(false);
            }
          });
        },
        {
          threshold: 0,
          rootMargin: '0px'
        }
      );
      
      heroObserverRef.current.observe(heroElement);
    }

    // Fallback con scroll listener (solo si no hay IntersectionObserver o hero)
    const handleScroll = () => {
      if (!heroObserverRef.current) {
        checkStickyState();
      }
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      updateHeaderHeight();
      // Reconfigurar observer si el hero cambia
      const currentHero = findHeroElement();
      if (currentHero && (!heroObserverRef.current || currentHero !== heroElement)) {
        if (heroObserverRef.current) {
          heroObserverRef.current.disconnect();
        }
        if (window.IntersectionObserver) {
          heroElement = currentHero;
          heroObserverRef.current = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                  const rect = entry.boundingClientRect;
                  setIsSticky(rect.bottom <= 0);
                } else {
                  setIsSticky(false);
                }
              });
            },
            { threshold: 0, rootMargin: '0px' }
          );
          heroObserverRef.current.observe(currentHero);
        }
      }
      checkStickyState();
    };

    // Verificar estado inicial después de que el DOM esté listo
    const initTimeout = setTimeout(() => {
      updateHeaderHeight();
      checkStickyState();
    }, 100);

    // Verificar después de que la página esté completamente cargada
    const loadHandler = () => {
      setTimeout(() => {
        updateHeaderHeight();
        checkStickyState();
        // Reconfigurar observer después de la carga si no existe
        const loadedHeroElement = findHeroElement();
        if (loadedHeroElement && !heroObserverRef.current && window.IntersectionObserver) {
          heroElement = loadedHeroElement;
          heroObserverRef.current = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                  const rect = entry.boundingClientRect;
                  setIsSticky(rect.bottom <= 0);
                } else {
                  setIsSticky(false);
                }
              });
            },
            { threshold: 0, rootMargin: '0px' }
          );
          heroObserverRef.current.observe(loadedHeroElement);
        }
      }, 200);
    };

    if (document.readyState === 'loading') {
      window.addEventListener('load', loadHandler, { once: true });
    } else {
      loadHandler();
    }

    // Solo usar scroll listener si no hay IntersectionObserver
    if (!heroObserverRef.current) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (heroObserverRef.current) {
        heroObserverRef.current.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', loadHandler);
      clearTimeout(initTimeout);
    };
  }, [updateHeaderHeight, checkStickyState, findHeroElement]);

  // Solo aplicar sticky en desktop (>= 1024px)
  const shouldBeSticky = isSticky && isDesktop;

  return (
    <div 
      className="header-wrapper" 
      style={{ 
        minHeight: headerHeight > 0 ? `${headerHeight}px` : 'auto',
        height: shouldBeSticky && headerHeight > 0 ? `${headerHeight}px` : 'auto'
      }}
    >
      <motion.header 
        ref={headerRef}
        className="full-container header"
        style={{
          position: shouldBeSticky ? 'fixed' : 'relative',
          top: shouldBeSticky ? 0 : 'auto',
          left: shouldBeSticky ? 0 : 'auto',
          width: shouldBeSticky ? '100%' : 'auto',
          zIndex: 99999999,
        }}
        animate={{
          background: shouldBeSticky 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.62) 20%, rgba(255, 255, 255, 0) 75%)',
          backdropFilter: shouldBeSticky ? 'blur(10px)' : 'blur(0px)',
          boxShadow: shouldBeSticky 
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
    </div>
  );
};

export default Header;

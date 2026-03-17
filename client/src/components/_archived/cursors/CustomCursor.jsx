import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useHover } from "../../context/HoverContext";
import Icons from "../Icons"; 
import '../../assets/styles/custom-cursor.css';
import { motion } from "framer-motion";

const CustomCursor = ({ icon }) => {
  const location = useLocation();
  
  // Verificar si estamos en una ruta de servicios
  const isServiciosRoute = location.pathname.startsWith('/servicios');
  
  // Constantes de tamaño del cursor - deben coincidir con CSS
  const CURSOR_SIZE = 50; // px - tamaño del SVG del trompo
  const CURSOR_ANCHOR_OFFSET = CURSOR_SIZE / 2; // 25px - offset para centrar
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [displayPosition, setDisplayPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [cursorType, setCursorType] = useState(null);
  const [cursorColor, setCursorColor] = useState("#FED332");
  const [isDragging, setIsDragging] = useState(false);
  const cursorRef = useRef(null);
  const rafIdRef = useRef(null);

  const COLOR_DARK = "#000000";
  const COLOR_LIGHT = "#FED332";

  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getBackgroundColor = (element, maxDepth = 15, currentDepth = 0) => {
    if (!element || currentDepth >= maxDepth || element === document.body || element === document.documentElement) {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      return bodyBg || "rgb(255, 255, 255)";
    }
    
    const computed = window.getComputedStyle(element);
    let bgColor = computed.backgroundColor;
    const bgImage = computed.backgroundImage;
    
    if (bgImage && bgImage !== "none" && bgImage !== "initial") {
      const parent = element.parentElement;
      if (parent) {
        return getBackgroundColor(parent, maxDepth, currentDepth + 1);
      }
    }
    
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
      const alpha = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
      if (alpha < 0.1 || bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
        const parent = element.parentElement;
        if (parent) {
          return getBackgroundColor(parent, maxDepth, currentDepth + 1);
        }
      }
      return bgColor;
    }
    
    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent" || !bgColor || bgColor === "initial" || bgColor === "inherit") {
      const parent = element.parentElement;
      if (parent) {
        return getBackgroundColor(parent, maxDepth, currentDepth + 1);
      }
    }
    
    return bgColor || "rgb(255, 255, 255)";
  };

  const isLightBackground = (element) => {
    if (!element) return true;

    const themeAttr = element.closest("[data-theme]");
    if (themeAttr) {
      return themeAttr.getAttribute("data-theme") === "light";
    }

    const hasBlackBg = element.closest(".black-bg");
    if (hasBlackBg) return false;
    
    const hasWhiteBg = element.closest(".bg-white");
    if (hasWhiteBg) return true;

    const bgColor = getBackgroundColor(element);
    if (bgColor) {
      const rgbMatch = bgColor.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0]);
        const g = parseInt(rgbMatch[1]);
        const b = parseInt(rgbMatch[2]);
        const luminance = getLuminance(r, g, b);
        return luminance > 0.5;
      }
    }

    return true;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ocultar cursor por defecto solo en rutas de servicios
  useEffect(() => {
    if (isServiciosRoute) {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [isServiciosRoute]);

  // Animación suave del cursor usando requestAnimationFrame
  useEffect(() => {
    // Solo animar si estamos en una ruta de servicios
    if (!isServiciosRoute) {
      return;
    }

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const animate = () => {
      setDisplayPosition(prev => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        // Interpolación suave (lerp)
        const lerp = 0.15;
        return {
          x: prev.x + dx * lerp,
          y: prev.y + dy * lerp
        };
      });
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [mousePosition, isServiciosRoute]);

  useEffect(() => {
    // Solo agregar event listeners si estamos en una ruta de servicios
    if (!isServiciosRoute) {
      return;
    }

    const handleMouseMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      
      setMousePosition({
        x,
        y,
      });

      requestAnimationFrame(() => {
        const element = document.elementFromPoint(x, y);
        if (!element) {
          setCursorType(null);
          setCursorColor(COLOR_LIGHT);
          return;
        }

        const isLight = isLightBackground(element);
        const newColor = isLight ? COLOR_DARK : COLOR_LIGHT;
        setCursorColor(newColor);

        // Detectar si está en un carrusel con drag activo
        const isInCarousel = element.closest('.portfolio-carrusel') || 
          element.closest('.portfolio-slider') || 
          element.closest('.portfolio-section') || 
          element.closest('.slider') || 
          element.closest('.carrusel') ||
          element.closest('.infinite-slider-container') ||
          element.closest('[class*="slider"]') || 
          element.closest('[class*="carrusel"]') || 
          element.closest('[class*="portfolio"]');

        // Detectar enlaces
        const linkElement = element.closest('a[href]');
        if (linkElement) {
          const href = linkElement.getAttribute('href');
          const target = linkElement.getAttribute('target');
          const isExternal = target === '_blank' || (href && (href.startsWith('http') || href.startsWith('//')));
          
          if (isExternal) {
            setCursorType("external");
            return;
          }
          // Enlace interno - mostrar cursor
          setCursorType("link");
          return;
        }

        const cursorElement = element.closest('[data-cursor]');
        const cursorAttr = cursorElement?.getAttribute('data-cursor');
        
        if (cursorAttr === "next" || cursorAttr === "prev" || cursorAttr === "external") {
          setCursorType(cursorAttr);
          return;
        }

        const checkElementForNav = (el) => {
          if (!el) return null;
          
          const className = el.className || "";
          const classNameLower = className.toLowerCase();
          
          const hasNext = /(next|right)/i.test(classNameLower);
          const hasPrev = /(prev|left)/i.test(classNameLower);
          
          if (hasNext && !hasPrev) return "next";
          if (hasPrev && !hasNext) return "prev";
          
          const ariaLabel = el.getAttribute('aria-label');
          if (ariaLabel) {
            const labelLower = ariaLabel.toLowerCase();
            if ((labelLower.includes('prev') || labelLower.includes('anterior')) && !labelLower.includes('next')) return "prev";
            if ((labelLower.includes('next') || labelLower.includes('siguiente')) && !labelLower.includes('prev')) return "next";
          }
          
          return null;
        };

        let navType = checkElementForNav(element);
        if (!navType && element.parentElement) {
          navType = checkElementForNav(element.parentElement);
        }
        if (!navType) {
          const buttonElement = element.closest('button, [role="button"], div[onclick]');
          if (buttonElement) {
            navType = checkElementForNav(buttonElement);
          }
        }

        if (navType) {
          setCursorType(navType);
          return;
        }

        // Si está en carrusel y está arrastrando, mostrar cursor
        if (isInCarousel && isDragging) {
          setCursorType("drag");
          return;
        }

        // Si está en carrusel pero no está arrastrando, ocultar cursor
        if (isInCarousel && !isDragging) {
          setCursorType("hidden");
          return;
        }

        // Por defecto, mostrar el SVG del trompo (cursorType = null)
        setCursorType(null);
      });
    };

    const handleMouseDown = (event) => {
      const element = document.elementFromPoint(event.clientX, event.clientY);
      const isInCarousel = element?.closest('.portfolio-carrusel') || 
        element?.closest('.portfolio-slider') || 
        element?.closest('.portfolio-section') || 
        element?.closest('.slider') || 
        element?.closest('.carrusel') ||
        element?.closest('.infinite-slider-container') ||
        element?.closest('[class*="slider"]') || 
        element?.closest('[class*="carrusel"]') || 
        element?.closest('[class*="portfolio"]');
      
      if (isInCarousel) {
        setIsDragging(true);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isServiciosRoute]);

  const { hoverComponent } = useHover();

  const isNavCursor = cursorType === "next" || cursorType === "prev" || cursorType === "external";
  const shouldShow = cursorType !== "hidden";

  // Calcular posición anclada - el punto activo del cursor está en mousePosition
  // El SVG debe estar centrado en ese punto
  // Para cursores de navegación, usar el centro del elemento (50% del tamaño)
  // El contenedor flex ya centra el contenido, así que solo necesitamos el offset del contenedor
  const anchoredX = displayPosition.x - CURSOR_ANCHOR_OFFSET;
  const anchoredY = displayPosition.y - CURSOR_ANCHOR_OFFSET;

  const cursorContent = isNavCursor && shouldShow ? (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        left: `${displayPosition.x}px`,
        top: `${displayPosition.y}px`,
        pointerEvents: "none",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translate(-50%, -50%)",
      }}
      className='custom-cursor'
    >
      {cursorType === "next" ? (
        <img
          src={`${import.meta.env.BASE_URL}arrow-vector.svg`}
          alt="next"
          className="custom-cursor-nav"
          style={{ pointerEvents: "none", width: "38px", height: "38px", display: "block" }}
        />
      ) : cursorType === "prev" ? (
        <img
          src={`${import.meta.env.BASE_URL}arrow-vector-p.svg`}
          alt="prev"
          className="custom-cursor-nav"
          style={{ pointerEvents: "none", width: "38px", height: "38px", display: "block" }}
        />
      ) : cursorType === "external" ? (
        <svg
          width="103"
          height="26"
          viewBox="0 0 103 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="custom-cursor-external"
          style={{ pointerEvents: "none", display: "block" }}
        >
          <rect x="0.5" y="0.5" width="102" height="25" rx="12.5" fill="black" stroke="url(#paint0_linear_3169_519)"/>
          <path d="M31.76 17L28.976 10.64H30.176L32.648 16.4H32.072L34.592 10.64H35.72L32.936 17H31.76ZM39.4513 17.072C38.7713 17.072 38.1713 16.932 37.6513 16.652C37.1393 16.372 36.7393 15.988 36.4513 15.5C36.1713 15.012 36.0313 14.452 36.0313 13.82C36.0313 13.188 36.1673 12.628 36.4393 12.14C36.7193 11.652 37.0993 11.272 37.5793 11C38.0673 10.72 38.6153 10.58 39.2233 10.58C39.8393 10.58 40.3833 10.716 40.8553 10.988C41.3273 11.26 41.6953 11.644 41.9593 12.14C42.2313 12.628 42.3673 13.2 42.3673 13.856C42.3673 13.904 42.3633 13.96 42.3553 14.024C42.3553 14.088 42.3513 14.148 42.3433 14.204H36.9313V13.376H41.7433L41.2753 13.664C41.2833 13.256 41.1993 12.892 41.0233 12.572C40.8473 12.252 40.6033 12.004 40.2913 11.828C39.9873 11.644 39.6313 11.552 39.2233 11.552C38.8233 11.552 38.4673 11.644 38.1553 11.828C37.8433 12.004 37.5993 12.256 37.4233 12.584C37.2473 12.904 37.1593 13.272 37.1593 13.688V13.88C37.1593 14.304 37.2553 14.684 37.4473 15.02C37.6473 15.348 37.9233 15.604 38.2753 15.788C38.6273 15.972 39.0313 16.064 39.4873 16.064C39.8633 16.064 40.2033 16 40.5073 15.872C40.8193 15.744 41.0913 15.552 41.3233 15.296L41.9593 16.04C41.6713 16.376 41.3113 16.632 40.8793 16.808C40.4553 16.984 39.9793 17.072 39.4513 17.072ZM43.967 17V10.64H45.071V12.368L44.963 11.936C45.139 11.496 45.435 11.16 45.851 10.928C46.267 10.696 46.779 10.58 47.387 10.58V11.696C47.339 11.688 47.291 11.684 47.243 11.684C47.203 11.684 47.163 11.684 47.123 11.684C46.507 11.684 46.019 11.868 45.659 12.236C45.299 12.604 45.119 13.136 45.119 13.832V17H43.967ZM60.0675 10.58C60.5795 10.58 61.0315 10.68 61.4235 10.88C61.8155 11.08 62.1195 11.384 62.3355 11.792C62.5595 12.2 62.6715 12.716 62.6715 13.34V17H61.5195V13.472C61.5195 12.856 61.3755 12.392 61.0875 12.08C60.7995 11.768 60.3955 11.612 59.8755 11.612C59.4915 11.612 59.1555 11.692 58.8675 11.852C58.5795 12.012 58.3555 12.248 58.1955 12.56C58.0435 12.872 57.9675 13.26 57.9675 13.724V17H56.8155V13.472C56.8155 12.856 56.6715 12.392 56.3835 12.08C56.1035 11.768 55.6995 11.612 55.1715 11.612C54.7955 11.612 54.4635 11.692 54.1755 11.852C53.8875 12.012 53.6635 12.248 53.5035 12.56C53.3435 12.872 53.2635 13.26 53.2635 13.724V17H52.1115V10.64H53.2155V12.332L53.0355 11.9C53.2355 11.484 53.5435 11.16 53.9595 10.928C54.3755 10.696 54.8595 10.58 55.4115 10.58C56.0195 10.58 56.5435 10.732 56.9835 11.036C57.4235 11.332 57.7115 11.784 57.8475 12.392L57.3795 12.2C57.5715 11.712 57.9075 11.32 58.3875 11.024C58.8675 10.728 59.4275 10.58 60.0675 10.58ZM68.7392 17V15.656L68.6792 15.404V13.112C68.6792 12.624 68.5352 12.248 68.2472 11.984C67.9672 11.712 67.5432 11.576 66.9752 11.576C66.5992 11.576 66.2312 11.64 65.8712 11.768C65.5112 11.888 65.2072 12.052 64.9592 12.26L64.4792 11.396C64.8072 11.132 65.1992 10.932 65.6552 10.796C66.1192 10.652 66.6032 10.58 67.1072 10.58C67.9792 10.58 68.6512 10.792 69.1232 11.216C69.5952 11.64 69.8312 12.288 69.8312 13.16V17H68.7392ZM66.6512 17.072C66.1792 17.072 65.7632 16.992 65.4032 16.832C65.0512 16.672 64.7792 16.452 64.5872 16.172C64.3952 15.884 64.2992 15.56 64.2992 15.2C64.2992 14.856 64.3792 14.544 64.5392 14.264C64.7072 13.984 64.9752 13.76 65.3432 13.592C65.7192 13.424 66.2232 13.34 66.8552 13.34H68.8712V14.168H66.9032C66.3272 14.168 65.9392 14.264 65.7392 14.456C65.5392 14.648 65.4392 14.88 65.4392 15.152C65.4392 15.464 65.5632 15.716 65.8112 15.908C66.0592 16.092 66.4032 16.184 66.8432 16.184C67.2752 16.184 67.6512 16.088 67.9712 15.896C68.2992 15.704 68.5352 15.424 68.6792 15.056L68.9072 15.848C68.7552 16.224 68.4872 16.524 68.1032 16.748C67.7192 16.964 67.2352 17.072 66.6512 17.072ZM66.2912 9.716L67.9232 8.156H69.3872L67.3712 9.716H66.2912ZM73.7871 17.072C73.2591 17.072 72.7551 17 72.2751 16.856C71.8031 16.712 71.4311 16.536 71.1591 16.328L71.6391 15.416C71.9111 15.6 72.2471 15.756 72.6471 15.884C73.0471 16.012 73.4551 16.076 73.8711 16.076C74.4071 16.076 74.7911 16 75.0231 15.848C75.2631 15.696 75.3831 15.484 75.3831 15.212C75.3831 15.012 75.3111 14.856 75.1671 14.744C75.0231 14.632 74.8311 14.548 74.5911 14.492C74.3591 14.436 74.0991 14.388 73.8111 14.348C73.5231 14.3 73.2351 14.244 72.9471 14.18C72.6591 14.108 72.3951 14.012 72.1551 13.892C71.9151 13.764 71.7231 13.592 71.5791 13.376C71.4351 13.152 71.3631 12.856 71.3631 12.488C71.3631 12.104 71.4711 11.768 71.6871 11.48C71.9031 11.192 72.2071 10.972 72.5991 10.82C72.9991 10.66 73.4711 10.58 74.0151 10.58C74.4311 10.58 74.8511 10.632 75.2751 10.736C75.7071 10.832 76.0591 10.972 76.3311 11.156L75.8391 12.068C75.5511 11.876 75.2511 11.744 74.9391 11.672C74.6271 11.6 74.3151 11.564 74.0031 11.564C73.4991 11.564 73.1231 11.648 72.8751 11.816C72.6271 11.976 72.5031 12.184 72.5031 12.44C72.5031 12.656 72.5751 12.824 72.7191 12.944C72.8711 13.056 73.0631 13.144 73.2951 13.208C73.5351 13.272 73.7991 13.328 74.0871 13.376C74.3751 13.416 74.6631 13.472 74.9511 13.544C75.2391 13.608 75.4991 13.7 75.7311 13.82C75.9711 13.94 76.1631 14.108 76.3071 14.324C76.4591 14.54 76.5351 14.828 76.5351 15.188C76.5351 15.572 76.4231 15.904 76.1991 16.184C75.9751 16.464 75.6591 16.684 75.2511 16.844C74.8431 16.996 74.3551 17.072 73.7871 17.072Z" fill="white"/>
          <defs>
            <linearGradient id="paint0_linear_3169_519" x1="0" y1="13" x2="103" y2="13" gradientUnits="userSpaceOnUse">
              <stop/>
              <stop offset="1" stopColor="#FED332"/>
            </linearGradient>
          </defs>
        </svg>
      ) : hoverComponent ? (
        <motion.span 
          className="custom-cursor-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          Ver
          <Icons iconName='arrowTr'/>
        </motion.span>
      ) : (
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1080 1080" 
          fill="none"
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: 1
          }}
          transition={{ 
            scale: { type: "spring", stiffness: 250, damping: 15 }
          }}
          className="custom-cursor-icon"
          style={{ 
            transformOrigin: "center center",
            color: cursorColor,
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
          }}
        >
          <motion.g
            animate={{
              rotateZ: [0, 5, -5, 0],
              scaleX: [1, 1.02, 0.98, 1],
              scaleY: [1, 0.98, 1.02, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1]
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M683.64,708.47c-34.71,10.68-70.34,19.3-107.28,24.69-82.9,11.9-166.85,6.52-251.59-15.01,39.26,89.16,77.65,161.91,71.21,193.38l-.44,1.44-30.25-8.23-.79,2.67,32.43,55.89,2.63.7,55.76-32.17.66-2.63-29.81-8.14v-.09c12.47-43.6,146.5-113.67,257.46-212.51Z"
              fill={cursorColor}
            />
          </motion.g>
          <motion.g
            animate={{
              rotateZ: [0, -4, 4, 0],
              scaleX: [1, 0.98, 1.02, 1],
              scaleY: [1, 1.02, 0.98, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: 0.25
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M653.57,133.36l-60.36-16.15c-18.56-5.03-37.69,6.09-42.59,24.64l-5.47,20.66-27.53-7.44c-18.6-4.94-37.6,6-42.55,24.56l-.87,3.06c-67.98,2.32-131.05,35.15-173.29,87.63,67.01,52,143.48,89.6,229.14,112.58,87.45,23.37,173.77,28.98,259.25,16.76,12.61-1.71,24.47-4.51,36.68-7-14.01-58.74-50.77-110.78-102.82-143.26l.66-2.93c5.08-18.78-6.22-37.86-24.51-42.81l-26.52-7.09,5.56-20.44c4.99-18.65-6.04-37.73-24.77-42.76Z"
              fill={cursorColor}
            />
          </motion.g>
          <motion.g
            animate={{
              rotateZ: [0, 6, -6, 0],
              scaleX: [1, 1.03, 0.97, 1],
              scaleY: [1, 0.97, 1.03, 1],
            }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: 0.5
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M824.71,507.65c6.39-24.03,8.62-48.32,7.53-72-19.08,4.46-38.56,8.4-58.22,11.03-85.75,12.34-172.11,6.61-259.21-16.72-87.19-23.37-165.1-61.76-232.86-114.99l-6.61-5.56c-7.35,14.53-13.92,29.63-18.3,46.22-26.39,98.09,6.08,211.11,46.27,310.86,6,1.8,11.64,4.03,17.95,5.73,87.28,23.24,173.64,29.06,259.21,16.76,59.57-8.49,115.73-24.64,168.82-47.36,34.62-40.62,62.33-85.18,75.42-133.98Z"
              fill={cursorColor}
            />
          </motion.g>
        </motion.svg>
      )}
    </div>
  ) : shouldShow ? (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        width: `${CURSOR_SIZE}px`,
        height: `${CURSOR_SIZE}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      animate={{
        x: anchoredX,
        y: anchoredY,
        scale: hoverComponent ? 1.3 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.4,
      }}
      className='custom-cursor'
    >
      {cursorType === "drag" ? (
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1080 1080" 
          fill="none"
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: 1.1
          }}
          transition={{ 
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
          className="custom-cursor-icon"
          style={{ 
            transformOrigin: "center center",
            color: cursorColor,
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
          }}
        >
          <motion.g
            animate={{
              rotateZ: [0, 5, -5, 0],
              scaleX: [1, 1.02, 0.98, 1],
              scaleY: [1, 0.98, 1.02, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1]
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M683.64,708.47c-34.71,10.68-70.34,19.3-107.28,24.69-82.9,11.9-166.85,6.52-251.59-15.01,39.26,89.16,77.65,161.91,71.21,193.38l-.44,1.44-30.25-8.23-.79,2.67,32.43,55.89,2.63.7,55.76-32.17.66-2.63-29.81-8.14v-.09c12.47-43.6,146.5-113.67,257.46-212.51Z"
              fill={cursorColor}
            />
          </motion.g>
          <motion.g
            animate={{
              rotateZ: [0, -4, 4, 0],
              scaleX: [1, 0.98, 1.02, 1],
              scaleY: [1, 1.02, 0.98, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: 0.25
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M653.57,133.36l-60.36-16.15c-18.56-5.03-37.69,6.09-42.59,24.64l-5.47,20.66-27.53-7.44c-18.6-4.94-37.6,6-42.55,24.56l-.87,3.06c-67.98,2.32-131.05,35.15-173.29,87.63,67.01,52,143.48,89.6,229.14,112.58,87.45,23.37,173.77,28.98,259.25,16.76,12.61-1.71,24.47-4.51,36.68-7-14.01-58.74-50.77-110.78-102.82-143.26l.66-2.93c5.08-18.78-6.22-37.86-24.51-42.81l-26.52-7.09,5.56-20.44c4.99-18.65-6.04-37.73-24.77-42.76Z"
              fill={cursorColor}
            />
          </motion.g>
          <motion.g
            animate={{
              rotateZ: [0, 6, -6, 0],
              scaleX: [1, 1.03, 0.97, 1],
              scaleY: [1, 0.97, 1.03, 1],
            }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: 0.5
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M824.71,507.65c6.39-24.03,8.62-48.32,7.53-72-19.08,4.46-38.56,8.4-58.22,11.03-85.75,12.34-172.11,6.61-259.21-16.72-87.19-23.37-165.1-61.76-232.86-114.99l-6.61-5.56c-7.35,14.53-13.92,29.63-18.3,46.22-26.39,98.09,6.08,211.11,46.27,310.86,6,1.8,11.64,4.03,17.95,5.73,87.28,23.24,173.64,29.06,259.21,16.76,59.57-8.49,115.73-24.64,168.82-47.36,34.62-40.62,62.33-85.18,75.42-133.98Z"
              fill={cursorColor}
            />
          </motion.g>
        </motion.svg>
      ) : hoverComponent ? (
        <motion.span 
          className="custom-cursor-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          Ver
          <Icons iconName='arrowTr'/>
        </motion.span>
      ) : cursorType === "link" || cursorType === null ? (
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1080 1080" 
          fill="none"
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: 1
          }}
          transition={{ 
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
          className="custom-cursor-icon"
          style={{ 
            transformOrigin: "center center",
            color: cursorColor,
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
          }}
        >
          <motion.g
            animate={{
              rotateZ: [0, 5, -5, 0],
              scaleX: [1, 1.02, 0.98, 1],
              scaleY: [1, 0.98, 1.02, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1]
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M683.64,708.47c-34.71,10.68-70.34,19.3-107.28,24.69-82.9,11.9-166.85,6.52-251.59-15.01,39.26,89.16,77.65,161.91,71.21,193.38l-.44,1.44-30.25-8.23-.79,2.67,32.43,55.89,2.63.7,55.76-32.17.66-2.63-29.81-8.14v-.09c12.47-43.6,146.5-113.67,257.46-212.51Z"
              fill={cursorColor}
            />
          </motion.g>
          <motion.g
            animate={{
              rotateZ: [0, -4, 4, 0],
              scaleX: [1, 0.98, 1.02, 1],
              scaleY: [1, 1.02, 0.98, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: 0.25
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M653.57,133.36l-60.36-16.15c-18.56-5.03-37.69,6.09-42.59,24.64l-5.47,20.66-27.53-7.44c-18.6-4.94-37.6,6-42.55,24.56l-.87,3.06c-67.98,2.32-131.05,35.15-173.29,87.63,67.01,52,143.48,89.6,229.14,112.58,87.45,23.37,173.77,28.98,259.25,16.76,12.61-1.71,24.47-4.51,36.68-7-14.01-58.74-50.77-110.78-102.82-143.26l.66-2.93c5.08-18.78-6.22-37.86-24.51-42.81l-26.52-7.09,5.56-20.44c4.99-18.65-6.04-37.73-24.77-42.76Z"
              fill={cursorColor}
            />
          </motion.g>
          <motion.g
            animate={{
              rotateZ: [0, 6, -6, 0],
              scaleX: [1, 1.03, 0.97, 1],
              scaleY: [1, 0.97, 1.03, 1],
            }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: 0.5
            }}
            style={{ transformOrigin: "540px 540px" }}
          >
            <path 
              d="M824.71,507.65c6.39-24.03,8.62-48.32,7.53-72-19.08,4.46-38.56,8.4-58.22,11.03-85.75,12.34-172.11,6.61-259.21-16.72-87.19-23.37-165.1-61.76-232.86-114.99l-6.61-5.56c-7.35,14.53-13.92,29.63-18.3,46.22-26.39,98.09,6.08,211.11,46.27,310.86,6,1.8,11.64,4.03,17.95,5.73,87.28,23.24,173.64,29.06,259.21,16.76,59.57-8.49,115.73-24.64,168.82-47.36,34.62-40.62,62.33-85.18,75.42-133.98Z"
              fill={cursorColor}
            />
          </motion.g>
        </motion.svg>
      ) : null}
    </motion.div>
  ) : null;

  // No mostrar el cursor si no estamos en una ruta de servicios
  if (!isServiciosRoute || !mounted || !shouldShow) return null;

  return createPortal(cursorContent, document.body);
};

export default CustomCursor;

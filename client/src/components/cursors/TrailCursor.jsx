import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./trail-cursor.css";

const TrailCursor = () => {
  const circlesRef = useRef([]);
  const cursorCoreRef = useRef(null);
  const coordsRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const currentColorRef = useRef("#000000");
  const cursorTextRef = useRef(null);
  const isBlendModeRef = useRef(false);
  const [showSvg, setShowSvg] = useState(false);
  const [svgPosition, setSvgPosition] = useState({ x: 0, y: 0 });
  const svgIdRef = useRef(`vermas-gradient-${Math.random().toString(36).substr(2, 9)}`);
  const showSvgRef = useRef(false);
  const modeRef = useRef("normal");

  const COLOR_DARK = "#000000";
  const COLOR_LIGHT = "#FED332";

  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getBackgroundColor = (element, maxDepth = 10, currentDepth = 0) => {
    if (!element || currentDepth >= maxDepth || element === document.body) {
      return null;
    }
    
    const computed = window.getComputedStyle(element);
    let bgColor = computed.backgroundColor;
    
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
      const alpha = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
      if (alpha < 0.1) {
        const parent = element.parentElement;
        if (parent) {
          return getBackgroundColor(parent, maxDepth, currentDepth + 1);
        }
      }
      return bgColor;
    }
    
    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      const parent = element.parentElement;
      if (parent) {
        return getBackgroundColor(parent, maxDepth, currentDepth + 1);
      }
    }
    
    return bgColor;
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

  const isFormElement = (element) => {
    if (!element) return false;
    
    const tagName = element.tagName?.toLowerCase();
    const formElements = ["input", "textarea", "select", "button"];
    
    if (formElements.includes(tagName)) return true;
    
    const closestFormElement = element.closest("input, textarea, select, button");
    if (closestFormElement) return true;
    
    if (element.hasAttribute("contenteditable") && element.getAttribute("contenteditable") !== "false") return true;
    
    return false;
  };

  const isInteractiveElement = (element) => {
    if (!element) return false;
    
    const tagName = element.tagName?.toLowerCase();
    if (tagName === "a" || tagName === "button") return true;
    
    if (element.getAttribute("role") === "button") return true;
    if (element.getAttribute("data-cursor") === "link" || element.getAttribute("data-cursor") === "view") return true;
    if (element.hasAttribute("onclick")) return true;
    if (element.getAttribute("tabindex") && element.getAttribute("tabindex") !== "-1") return true;
    
    const closestLink = element.closest("a, button, [role='button']");
    if (closestLink) return true;
    
    return false;
  };

  const resetTrailPositions = (x, y) => {
    const circles = circlesRef.current;
    circles.forEach((circle) => {
      if (circle) {
        circle.x = x;
        circle.y = y;
      }
    });
  };

  const setMode = (newMode, x, y) => {
    if (modeRef.current === newMode) return;
    
    const prevMode = modeRef.current;
    modeRef.current = newMode;
    
    if (newMode === "slider") {
      resetTrailPositions(x, y);
      
      circlesRef.current.forEach((circle, index) => {
        if (circle) {
          circle.style.transition = "none";
          circle.style.display = "none";
          circle.style.visibility = "hidden";
          circle.style.opacity = "0";
          circle.style.transform = "translate(-9999px, -9999px)";
        }
      });
      
      if (cursorCoreRef.current) {
        cursorCoreRef.current.style.display = "block";
        cursorCoreRef.current.style.visibility = "visible";
        cursorCoreRef.current.style.opacity = "1";
        cursorCoreRef.current.style.transition = "none";
      }
    } else if (newMode === "normal") {
      // CRÍTICO: Al volver a modo normal, restaurar explícitamente todos los circles
      // Esto asegura que vuelvan a su estado base sin importar cómo fueron ocultados
      // (ya sea desde slider, SVG, o cualquier otro estado)
      if (prevMode === "slider") {
        resetTrailPositions(x, y);
      }
      
      // Restaurar explícitamente todas las propiedades de los circles al estado base
      circlesRef.current.forEach((circle) => {
        if (circle) {
          // Restaurar todas las propiedades que pueden haber sido modificadas
          circle.style.transition = "";
          circle.style.display = "block";
          circle.style.visibility = "visible";
          circle.style.opacity = "1"; // Restaurar opacidad a 1 (se ajustará después según el estado)
          circle.style.transform = ""; // Resetear transform para que animateCircles lo maneje
          // Asegurar que no queden estilos residuales
          circle.style.left = "";
          circle.style.top = "";
          circle.style.width = "";
          circle.style.height = "";
          circle.style.borderRadius = "";
        }
      });
      
      if (cursorCoreRef.current) {
        cursorCoreRef.current.style.display = "none";
        cursorCoreRef.current.style.visibility = "hidden";
        cursorCoreRef.current.style.opacity = "0";
      }
    }
  };

  const updateTrailColor = (color, useBlendMode = false) => {
    if (currentColorRef.current === color && isBlendModeRef.current === useBlendMode) {
      return;
    }

    currentColorRef.current = color;
    isBlendModeRef.current = useBlendMode;

    circlesRef.current.forEach((circle) => {
      if (circle) {
        circle.style.backgroundColor = color;
        circle.style.mixBlendMode = "normal";
      }
    });

    if (cursorCoreRef.current) {
      cursorCoreRef.current.style.backgroundColor = color;
      if (useBlendMode && modeRef.current === "slider") {
        cursorCoreRef.current.style.mixBlendMode = "difference";
      } else {
        cursorCoreRef.current.style.mixBlendMode = "normal";
      }
    }
  };

  const detectCursorState = (x, y) => {
    const element = document.elementFromPoint(x, y);
    if (!element) return { color: COLOR_DARK, showSvg: false, useBlendMode: false, hideTrail: false, isFormElement: false, isInSlider: false };

    const isForm = isFormElement(element);

    const infiniteSliderContainer = element.closest(".infinite-slider-container");
    const isInSlider = !!infiniteSliderContainer;

    const cursorViewElement = element.closest("[data-cursor='view']");
    const showSvg = !!cursorViewElement;
    
    if (showSvg) {
      const isLight = isLightBackground(element);
      const color = isLight ? COLOR_DARK : COLOR_LIGHT;
      return { 
        color, 
        showSvg: true, 
        useBlendMode: false,
        hideTrail: true,
        isFormElement: isForm,
        isInSlider: false
      };
    }

    const isInteractive = isInteractiveElement(element);
    
    const menuTextElement = element.closest(
      ".menu-item, .submenu-item, .popup-menu h3, .popup-menu span, .servicios-header span, .servicios-options a span"
    );
    const isOverMenuText = !!menuTextElement && (
      element.closest("header.full-container") || 
      element.closest(".popup-menu")
    );

    const isLight = isInSlider ? true : isLightBackground(element);
    const color = isInSlider ? "#FFFFFF" : (isLight ? COLOR_DARK : COLOR_LIGHT);

    return { 
      color, 
      showSvg: false, 
      useBlendMode: isOverMenuText,
      hideTrail: isInteractive,
      isFormElement: isForm,
      isInSlider: isInSlider
    };
  };

  useEffect(() => {
    const circles = circlesRef.current;
    
    document.body.classList.add("trail-cursor-active");
    
    if (cursorCoreRef.current) {
      cursorCoreRef.current.style.backgroundColor = currentColorRef.current;
      cursorCoreRef.current.style.mixBlendMode = "normal";
      cursorCoreRef.current.style.opacity = "0";
      cursorCoreRef.current.style.display = "none";
      cursorCoreRef.current.style.visibility = "hidden";
    }

    circles.forEach((circle, index) => {
      if (circle) {
        circle.x = 0;
        circle.y = 0;
        circle.style.backgroundColor = currentColorRef.current;
        circle.style.mixBlendMode = "normal";
        circle.style.display = "block";
        circle.style.visibility = "visible";
      }
    });

    const textElement = document.createElement("div");
    textElement.className = "cursor-text";
    textElement.textContent = "ver";
    textElement.style.display = "none";
    document.body.appendChild(textElement);
    cursorTextRef.current = textElement;

    // Función centralizada para restaurar los circles al estado base
    // Optimizada para ser llamada inmediatamente cuando se sale del SVG
    const restoreCirclesToBase = (currentX, currentY) => {
      const circles = circlesRef.current;
      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        if (circle) {
          // Restaurar todas las propiedades al estado base de forma explícita
          circle.style.display = "block";
          circle.style.visibility = "visible";
          circle.style.opacity = "1";
          circle.style.transform = "";
          circle.style.transition = "";
          // Resetear posiciones para que animateCircles las recalcule desde la posición actual
          circle.x = currentX;
          circle.y = currentY;
        }
      }
    };

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      coordsRef.current.x = x;
      coordsRef.current.y = y;

      const state = detectCursorState(x, y);
      const wasShowingSvg = showSvgRef.current;
      
      // Manejar el estado del SVG
      if (state.showSvg) {
        if (!wasShowingSvg) {
          setShowSvg(true);
          showSvgRef.current = true;
        }
        setSvgPosition({ x, y });
        setMode("normal", x, y);
        // Ocultar circles cuando se muestra el SVG
        circlesRef.current.forEach((circle) => {
          if (circle) {
            circle.style.display = "none";
            circle.style.visibility = "hidden";
            circle.style.opacity = "0";
            circle.style.transform = "translate(-9999px, -9999px)";
          }
        });
      } else {
        // CRÍTICO: Al salir del hover del SVG, restaurar inmediatamente los circles
        // Esto debe hacerse ANTES de cualquier otra lógica para evitar estados inconsistentes
        if (wasShowingSvg) {
          setShowSvg(false);
          showSvgRef.current = false;
          // Restaurar circles inmediatamente al estado base con las coordenadas actuales
          restoreCirclesToBase(x, y);
        }
        
        // Aplicar el modo correcto
        if (state.isInSlider) {
          document.body.classList.add("trail-cursor-in-slider");
          setMode("slider", x, y);
        } else {
          document.body.classList.remove("trail-cursor-in-slider");
          setMode("normal", x, y);
          
          // Aplicar opacidad según el estado actual
          // Solo ajustar opacidad, no display/visibility (ya están restaurados)
          if (state.hideTrail || state.isFormElement) {
            circlesRef.current.forEach((circle) => {
              if (circle) {
                circle.style.opacity = "0";
              }
            });
          } else {
            circlesRef.current.forEach((circle) => {
              if (circle) {
                circle.style.opacity = "1";
              }
            });
          }
        }
      }
      
      // Manejar cursor del body
      if (state.isFormElement) {
        document.body.style.cursor = "";
      } else {
        document.body.style.cursor = "none";
      }
      
      updateTrailColor(state.color, state.isInSlider);

      if (cursorTextRef.current) {
        cursorTextRef.current.style.display = "none";
      }
    };

    const animateCircles = () => {
      const x = coordsRef.current.x;
      const y = coordsRef.current.y;

      const element = document.elementFromPoint(x, y);
      const isInSlider = element && element.closest(".infinite-slider-container");
      const baseSize = 24;
      const coreSize = isInSlider ? baseSize + 20 : baseSize;
      const coreOffset = coreSize / 2;

      if (cursorCoreRef.current && modeRef.current === "slider") {
        cursorCoreRef.current.style.left = x - coreOffset + "px";
        cursorCoreRef.current.style.top = y - coreOffset + "px";
        cursorCoreRef.current.style.width = coreSize + "px";
        cursorCoreRef.current.style.height = coreSize + "px";
        cursorCoreRef.current.style.borderRadius = coreSize + "px";
      }

      if (modeRef.current === "normal") {
        const circleSize = baseSize;
        const circleOffset = circleSize / 2;
        let trailX = x;
        let trailY = y;

        circles.forEach((circle, index) => {
          if (!circle) return;

          // CRÍTICO: Asegurar que los circles estén visibles en modo normal
          // Esto previene que queden ocultos después de salir del hover del SVG
          // Verificamos y restauramos si están ocultos
          if (circle.style.display === "none" || circle.style.visibility === "hidden") {
            circle.style.display = "block";
            circle.style.visibility = "visible";
            // Solo restaurar opacidad si no está explícitamente en 0 por hideTrail o isFormElement
            if (circle.style.opacity === "0" && !showSvgRef.current) {
              // Verificar si realmente debería estar oculto
              const element = document.elementFromPoint(x, y);
              const isForm = element && (
                ["input", "textarea", "select", "button"].includes(element.tagName?.toLowerCase()) ||
                element.closest("input, textarea, select, button")
              );
              const isInteractive = element && (
                element.tagName?.toLowerCase() === "a" ||
                element.tagName?.toLowerCase() === "button" ||
                element.getAttribute("role") === "button" ||
                element.closest("a, button, [role='button']")
              );
              
              // Solo restaurar opacidad si no es form ni interactive
              if (!isForm && !isInteractive) {
                circle.style.opacity = "1";
              }
            }
          }

          // Aplicar animación solo si el circle está visible
          if (circle.style.display !== "none" && circle.style.visibility !== "hidden") {
            circle.style.left = trailX - circleOffset + "px";
            circle.style.top = trailY - circleOffset + "px";
            circle.style.width = circleSize + "px";
            circle.style.height = circleSize + "px";
            circle.style.borderRadius = circleSize + "px";
            const scale = (circles.length - index) / circles.length;
            circle.style.transform = `scale(${scale})`;

            circle.x = trailX;
            circle.y = trailY;

            const nextCircle = circles[index + 1] || circles[0];
            if (nextCircle) {
              trailX += (nextCircle.x - trailX) * 0.3;
              trailY += (nextCircle.y - trailY) * 0.3;
            }
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(animateCircles);
    };

    animateCircles();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (cursorTextRef.current && cursorTextRef.current.parentNode) {
        cursorTextRef.current.parentNode.removeChild(cursorTextRef.current);
      }
      document.body.classList.remove("trail-cursor-active");
      document.body.classList.remove("trail-cursor-in-slider");
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        ref={cursorCoreRef}
        className="cursor-core"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 999999999,
          opacity: 0,
          display: "none",
          visibility: "hidden",
        }}
      />
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (circlesRef.current[index] = el)}
          className="trail-circle"
        />
      ))}
      {showSvg && (
        <motion.div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            pointerEvents: "none",
            zIndex: 99999999,
          }}
          initial={{ 
            x: svgPosition.x - 66.5, 
            y: svgPosition.y - 16.75,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: svgPosition.x - 66.5,
            y: svgPosition.y - 16.75,
            opacity: 1,
            scale: 1
          }}
          transition={{
            x: {
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            },
            y: {
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            },
            opacity: {
              duration: 0.2,
              ease: "easeOut"
            },
            scale: {
              duration: 0.2,
              ease: "easeOut"
            }
          }}
        >
          <svg 
            width="133" 
            height="33.5" 
            viewBox="0 0 103 26" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              display: "block",
              pointerEvents: "none"
            }}
          >
            <rect x="0.5" y="0.5" width="102" height="25" rx="12.5" fill="black" stroke={`url(#${svgIdRef.current})`}/>
            <path d="M31.76 17L28.976 10.64H30.176L32.648 16.4H32.072L34.592 10.64H35.72L32.936 17H31.76ZM39.4513 17.072C38.7713 17.072 38.1713 16.932 37.6513 16.652C37.1393 16.372 36.7393 15.988 36.4513 15.5C36.1713 15.012 36.0313 14.452 36.0313 13.82C36.0313 13.188 36.1673 12.628 36.4393 12.14C36.7193 11.652 37.0993 11.272 37.5793 11C38.0673 10.72 38.6153 10.58 39.2233 10.58C39.8393 10.58 40.3833 10.716 40.8553 10.988C41.3273 11.26 41.6953 11.644 41.9593 12.14C42.2313 12.628 42.3673 13.2 42.3673 13.856C42.3673 13.904 42.3633 13.96 42.3553 14.024C42.3553 14.088 42.3513 14.148 42.3433 14.204H36.9313V13.376H41.7433L41.2753 13.664C41.2833 13.256 41.1993 12.892 41.0233 12.572C40.8473 12.252 40.6033 12.004 40.2913 11.828C39.9873 11.644 39.6313 11.552 39.2233 11.552C38.8233 11.552 38.4673 11.644 38.1553 11.828C37.8433 12.004 37.5993 12.256 37.4233 12.584C37.2473 12.904 37.1593 13.272 37.1593 13.688V13.88C37.1593 14.304 37.2553 14.684 37.4473 15.02C37.6473 15.348 37.9233 15.604 38.2753 15.788C38.6273 15.972 39.0313 16.064 39.4873 16.064C39.8633 16.064 40.2033 16 40.5073 15.872C40.8193 15.744 41.0913 15.552 41.3233 15.296L41.9593 16.04C41.6713 16.376 41.3113 16.632 40.8793 16.808C40.4553 16.984 39.9793 17.072 39.4513 17.072ZM43.967 17V10.64H45.071V12.368L44.963 11.936C45.139 11.496 45.435 11.16 45.851 10.928C46.267 10.696 46.779 10.58 47.387 10.58V11.696C47.339 11.688 47.291 11.684 47.243 11.684C47.203 11.684 47.163 11.684 47.123 11.684C46.507 11.684 46.019 11.868 45.659 12.236C45.299 12.604 45.119 13.136 45.119 13.832V17H43.967ZM60.0675 10.58C60.5795 10.58 61.0315 10.68 61.4235 10.88C61.8155 11.08 62.1195 11.384 62.3355 11.792C62.5595 12.2 62.6715 12.716 62.6715 13.34V17H61.5195V13.472C61.5195 12.856 61.3755 12.392 61.0875 12.08C60.7995 11.768 60.3955 11.612 59.8755 11.612C59.4915 11.612 59.1555 11.692 58.8675 11.852C58.5795 12.012 58.3555 12.248 58.1955 12.56C58.0435 12.872 57.9675 13.26 57.9675 13.724V17H56.8155V13.472C56.8155 12.856 56.6715 12.392 56.3835 12.08C56.1035 11.768 55.6995 11.612 55.1715 11.612C54.7955 11.612 54.4635 11.692 54.1755 11.852C53.8875 12.012 53.6635 12.248 53.5035 12.56C53.3435 12.872 53.2635 13.26 53.2635 13.724V17H52.1115V10.64H53.2155V12.332L53.0355 11.9C53.2355 11.484 53.5435 11.16 53.9595 10.928C54.3755 10.696 54.8595 10.58 55.4115 10.58C56.0195 10.58 56.5435 10.732 56.9835 11.036C57.4235 11.332 57.7115 11.784 57.8475 12.392L57.3795 12.2C57.5715 11.712 57.9075 11.32 58.3875 11.024C58.8675 10.728 59.4275 10.58 60.0675 10.58ZM68.7392 17V15.656L68.6792 15.404V13.112C68.6792 12.624 68.5352 12.248 68.2472 11.984C67.9672 11.712 67.5432 11.576 66.9752 11.576C66.5992 11.576 66.2312 11.64 65.8712 11.768C65.5112 11.888 65.2072 12.052 64.9592 12.26L64.4792 11.396C64.8072 11.132 65.1992 10.932 65.6552 10.796C66.1192 10.652 66.6032 10.58 67.1072 10.58C67.9792 10.58 68.6512 10.792 69.1232 11.216C69.5952 11.64 69.8312 12.288 69.8312 13.16V17H68.7392ZM66.6512 17.072C66.1792 17.072 65.7632 16.992 65.4032 16.832C65.0512 16.672 64.7792 16.452 64.5872 16.172C64.3952 15.884 64.2992 15.56 64.2992 15.2C64.2992 14.856 64.3792 14.544 64.5392 14.264C64.7072 13.984 64.9752 13.76 65.3432 13.592C65.7192 13.424 66.2232 13.34 66.8552 13.34H68.8712V14.168H66.9032C66.3272 14.168 65.9392 14.264 65.7392 14.456C65.5392 14.648 65.4392 14.88 65.4392 15.152C65.4392 15.464 65.5632 15.716 65.8112 15.908C66.0592 16.092 66.4032 16.184 66.8432 16.184C67.2752 16.184 67.6512 16.088 67.9712 15.896C68.2992 15.704 68.5352 15.424 68.6792 15.056L68.9072 15.848C68.7552 16.224 68.4872 16.524 68.1032 16.748C67.7192 16.964 67.2352 17.072 66.6512 17.072ZM66.2912 9.716L67.9232 8.156H69.3872L67.3712 9.716H66.2912ZM73.7871 17.072C73.2591 17.072 72.7551 17 72.2751 16.856C71.8031 16.712 71.4311 16.536 71.1591 16.328L71.6391 15.416C71.9111 15.6 72.2471 15.756 72.6471 15.884C73.0471 16.012 73.4551 16.076 73.8711 16.076C74.4071 16.076 74.7911 16 75.0231 15.848C75.2631 15.696 75.3831 15.484 75.3831 15.212C75.3831 15.012 75.3111 14.856 75.1671 14.744C75.0231 14.632 74.8311 14.548 74.5911 14.492C74.3591 14.436 74.0991 14.388 73.8111 14.348C73.5231 14.3 73.2351 14.244 72.9471 14.18C72.6591 14.108 72.3951 14.012 72.1551 13.892C71.9151 13.764 71.7231 13.592 71.5791 13.376C71.4351 13.152 71.3631 12.856 71.3631 12.488C71.3631 12.104 71.4711 11.768 71.6871 11.48C71.9031 11.192 72.2071 10.972 72.5991 10.82C72.9991 10.66 73.4711 10.58 74.0151 10.58C74.4311 10.58 74.8511 10.632 75.2751 10.736C75.7071 10.832 76.0591 10.972 76.3311 11.156L75.8391 12.068C75.5511 11.876 75.2511 11.744 74.9391 11.672C74.6271 11.6 74.3151 11.564 74.0031 11.564C73.4991 11.564 73.1231 11.648 72.8751 11.816C72.6271 11.976 72.5031 12.184 72.5031 12.44C72.5031 12.656 72.5751 12.824 72.7191 12.944C72.8711 13.056 73.0631 13.144 73.2951 13.208C73.5351 13.272 73.7991 13.328 74.0871 13.376C74.3751 13.416 74.6631 13.472 74.9511 13.544C75.2391 13.608 75.4991 13.7 75.7311 13.82C75.9711 13.94 76.1631 14.108 76.3071 14.324C76.4591 14.54 76.5351 14.828 76.5351 15.188C76.5351 15.572 76.4231 15.904 76.1991 16.184C75.9751 16.464 75.6591 16.684 75.2511 16.844C74.8431 16.996 74.3551 17.072 73.7871 17.072Z" fill="white"/>
            <defs>
              <linearGradient id={svgIdRef.current} x1="0" y1="13" x2="103" y2="13" gradientUnits="userSpaceOnUse">
                <stop/>
                <stop offset="1" stopColor="#FED332"/>
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )}
    </>
  );
};

export default TrailCursor;

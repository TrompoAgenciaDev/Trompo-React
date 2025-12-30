import React, { useEffect, useRef } from "react";
import "./trail-cursor.css";

const TrailCursor = () => {
  const circlesRef = useRef([]);
  const coordsRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const currentColorRef = useRef("#000000");
  const cursorTextRef = useRef(null);
  const isBlendModeRef = useRef(false);
  const isTrailVisibleRef = useRef(true);
  const isInteractiveElementRef = useRef(false);

  // Colores según el fondo
  const COLOR_DARK = "#000000"; // Negro para fondos claros
  const COLOR_LIGHT = "#FED332"; // Amarillo para fondos oscuros

  // Función para calcular luminancia de un color RGB
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Función mejorada para obtener el color de fondo real subiendo por el DOM
  const getBackgroundColor = (element, maxDepth = 10, currentDepth = 0) => {
    if (!element || currentDepth >= maxDepth || element === document.body) {
      return null;
    }
    
    const computed = window.getComputedStyle(element);
    let bgColor = computed.backgroundColor;
    
    // Verificar si el color tiene opacidad
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
      const alpha = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
      // Si es transparente o casi transparente, buscar en el padre
      if (alpha < 0.1) {
        const parent = element.parentElement;
        if (parent) {
          return getBackgroundColor(parent, maxDepth, currentDepth + 1);
        }
      }
      return bgColor;
    }
    
    // Si el background es transparente, buscar en el padre
    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      const parent = element.parentElement;
      if (parent) {
        return getBackgroundColor(parent, maxDepth, currentDepth + 1);
      }
    }
    
    return bgColor;
  };

  // Función mejorada para detectar si el fondo es claro u oscuro
  const isLightBackground = (element) => {
    if (!element) return true;

    // Prioridad 1: Verificar data-theme
    const themeAttr = element.closest("[data-theme]");
    if (themeAttr) {
      return themeAttr.getAttribute("data-theme") === "light";
    }

    // Prioridad 2: Verificar clases comunes
    const hasBlackBg = element.closest(".black-bg");
    if (hasBlackBg) return false;
    
    const hasWhiteBg = element.closest(".bg-white");
    if (hasWhiteBg) return true;

    // Prioridad 3: Calcular luminancia del background real subiendo por DOM
    const bgColor = getBackgroundColor(element);
    if (bgColor) {
      const rgbMatch = bgColor.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0]);
        const g = parseInt(rgbMatch[1]);
        const b = parseInt(rgbMatch[2]);
        const luminance = getLuminance(r, g, b);
        return luminance > 0.5; // Umbral para considerar claro
      }
    }

    // Fallback: asumir fondo claro (negro por defecto)
    return true;
  };

  // Función para detectar si es un elemento interactivo (enlace, botón, etc.)
  const isInteractiveElement = (element) => {
    if (!element) return false;
    
    // Verificar si es un enlace o botón
    const tagName = element.tagName?.toLowerCase();
    if (tagName === "a" || tagName === "button") return true;
    
    // Verificar atributos
    if (element.getAttribute("role") === "button") return true;
    if (element.getAttribute("data-cursor") === "link" || element.getAttribute("data-cursor") === "view") return true;
    if (element.hasAttribute("onclick")) return true;
    if (element.getAttribute("tabindex") && element.getAttribute("tabindex") !== "-1") return true;
    
    // Verificar si está dentro de un enlace o botón
    const closestLink = element.closest("a, button, [role='button']");
    if (closestLink) return true;
    
    return false;
  };

  // Función para actualizar la visibilidad del trail
  const updateTrailVisibility = (visible) => {
    if (isTrailVisibleRef.current === visible) return;
    
    isTrailVisibleRef.current = visible;
    
    circlesRef.current.forEach((circle) => {
      if (circle) {
        circle.style.opacity = visible ? "1" : "0";
        circle.style.pointerEvents = visible ? "none" : "none";
      }
    });
    
    if (cursorTextRef.current) {
      cursorTextRef.current.style.opacity = visible ? "1" : "0";
    }
  };

  // Función para actualizar el color del trail
  const updateTrailColor = (color, useBlendMode = false) => {
    if (currentColorRef.current === color && isBlendModeRef.current === useBlendMode) {
      return; // No actualizar si ya está en el color correcto
    }

    currentColorRef.current = color;
    isBlendModeRef.current = useBlendMode;

    circlesRef.current.forEach((circle) => {
      if (circle) {
        circle.style.backgroundColor = color;
        if (useBlendMode) {
          circle.style.mixBlendMode = "difference";
        } else {
          circle.style.mixBlendMode = "normal";
        }
      }
    });

    // Actualizar también el texto del cursor
    if (cursorTextRef.current) {
      cursorTextRef.current.style.color = color;
      if (useBlendMode) {
        cursorTextRef.current.style.mixBlendMode = "difference";
      } else {
        cursorTextRef.current.style.mixBlendMode = "normal";
      }
    }
  };

  // Función para detectar el estado del cursor (hover, blend mode, etc.)
  const detectCursorState = (x, y) => {
    const element = document.elementFromPoint(x, y);
    if (!element) return { color: COLOR_DARK, showText: false, useBlendMode: false, hideTrail: false };

    // Detectar si está sobre un elemento interactivo (enlace, botón)
    const isInteractive = isInteractiveElement(element);
    
    // Detectar si está sobre textos del menú (para aplicar blend-mode)
    const menuTextElement = element.closest(
      ".menu-item, .submenu-item, .popup-menu h3, .popup-menu span, .servicios-header span, .servicios-options a span"
    );
    const isOverMenuText = !!menuTextElement && (
      element.closest("header.full-container") || 
      element.closest(".popup-menu")
    );

    // Detectar si está sobre un elemento con data-cursor="view" (Portfolio3D links)
    const cursorViewElement = element.closest("[data-cursor='view']");
    const showViewText = !!cursorViewElement;

    // Detectar fondo real del elemento
    const isLight = isLightBackground(element);
    const color = isLight ? COLOR_DARK : COLOR_LIGHT;

    return { 
      color, 
      showText: showViewText, 
      useBlendMode: isOverMenuText, // Aplicar blend-mode cuando está sobre textos del menú
      hideTrail: isInteractive
    };
  };

  useEffect(() => {
    const circles = circlesRef.current;
    
    // Agregar clase al body para ocultar cursor por defecto
    document.body.classList.add("trail-cursor-active");
    
    // Inicializar posiciones y colores de los círculos
    circles.forEach((circle, index) => {
      if (circle) {
        circle.x = 0;
        circle.y = 0;
        circle.style.backgroundColor = currentColorRef.current;
      }
    });

    // Crear elemento de texto para "ver"
    const textElement = document.createElement("div");
    textElement.className = "cursor-text";
    textElement.textContent = "ver";
    textElement.style.display = "none";
    document.body.appendChild(textElement);
    cursorTextRef.current = textElement;

    // Manejar el movimiento del mouse
    const handleMouseMove = (e) => {
      coordsRef.current.x = e.clientX;
      coordsRef.current.y = e.clientY;

      // Detectar estado del cursor
      const state = detectCursorState(e.clientX, e.clientY);
      
      // Actualizar visibilidad del trail (ocultar en enlaces)
      updateTrailVisibility(!state.hideTrail);
      
      // Actualizar color y blend-mode
      updateTrailColor(state.color, state.useBlendMode);

      // Mostrar/ocultar texto "ver"
      if (cursorTextRef.current) {
        if (state.showText && !state.hideTrail) {
          cursorTextRef.current.style.display = "block";
          cursorTextRef.current.style.left = `${e.clientX + 20}px`;
          cursorTextRef.current.style.top = `${e.clientY + 20}px`;
        } else {
          cursorTextRef.current.style.display = "none";
        }
      }
    };

    // Función de animación
    const animateCircles = () => {
      let x = coordsRef.current.x;
      let y = coordsRef.current.y;

      circles.forEach((circle, index) => {
        if (!circle) return;

        circle.style.left = x - 12 + "px";
        circle.style.top = y - 12 + "px";

        const scale = (circles.length - index) / circles.length;
        circle.style.transform = `scale(${scale})`;

        circle.x = x;
        circle.y = y;

        const nextCircle = circles[index + 1] || circles[0];
        if (nextCircle) {
          x += (nextCircle.x - x) * 0.3;
          y += (nextCircle.y - y) * 0.3;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animateCircles);
    };

    // Iniciar la animación
    animateCircles();

    // Agregar el listener de mouse
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (cursorTextRef.current && cursorTextRef.current.parentNode) {
        cursorTextRef.current.parentNode.removeChild(cursorTextRef.current);
      }
      // Remover clase del body para restaurar cursor por defecto
      document.body.classList.remove("trail-cursor-active");
    };
  }, []);

  return (
    <>
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (circlesRef.current[index] = el)}
          className="trail-circle"
        />
      ))}
    </>
  );
};

export default TrailCursor;

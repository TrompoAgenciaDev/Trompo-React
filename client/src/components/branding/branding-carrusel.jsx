import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../assets/styles/branding-carrusel.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const BrandingCarrusel = ({ category }) => {
  const [clientsData, setClientsData] = useState([]);
  const [hoveredClientIndex, setHoveredClientIndex] = useState(null);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRefs = useRef({});
  const isAnimatingRefs = useRef({});
  const isHoveredRefs = useRef({});
  const lastHoveredIndexRef = useRef(null);

  // Detectar si estamos en responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar datos de la categoría desde el JSON
  useEffect(() => {
    const loadClientsData = async () => {
      try {
        const response = await fetch(`${base}assets/creatividad/branding/carrusel/carrusel.json`);
        const data = await response.json();
        
        // Obtener los proyectos de la categoría especificada
        const categoryData = data[category] || [];
        setClientsData(categoryData);
        
        // Inicializar índices de imagen para cada cliente
        const initialIndices = {};
        categoryData.forEach((_, index) => {
          initialIndices[index] = 0;
        });
        setCurrentImageIndices(initialIndices);
      } catch (error) {
        console.error("Error loading clients data:", error);
      }
    };

    if (category) {
      loadClientsData();
    }
  }, [category]);

  // Actualizar refs cuando cambia hoveredClientIndex
  useEffect(() => {
    if (hoveredClientIndex !== null) {
      isHoveredRefs.current[hoveredClientIndex] = true;
    }
  }, [hoveredClientIndex]);

  // Slide automático solo cuando hay hover en un cliente específico (solo desktop, no responsive)
  useEffect(() => {
    // Desactivar slider automático en responsive para institucional
    if (category === "institucional") {
      // Verificar si estamos en responsive (ancho de ventana <= 1023px)
      const isMobile = window.innerWidth <= 1023;
      if (isMobile) {
        return; // No ejecutar slider automático en responsive
      }
    }

    if (hoveredClientIndex === null) return;
    
    const clientData = clientsData[hoveredClientIndex];
    if (!clientData || clientData.gallery.length <= 1) return;

    // Limpiar timeout anterior si existe
    if (timeoutRefs.current[hoveredClientIndex]) {
      clearTimeout(timeoutRefs.current[hoveredClientIndex]);
      timeoutRefs.current[hoveredClientIndex] = null;
    }

    // Función recursiva para el slider automático infinito
    const startSlider = () => {
      if (!isHoveredRefs.current[hoveredClientIndex] || !clientData || clientData.gallery.length <= 1) {
        isAnimatingRefs.current[hoveredClientIndex] = false;
        return;
      }

      isAnimatingRefs.current[hoveredClientIndex] = true;
      
      timeoutRefs.current[hoveredClientIndex] = setTimeout(() => {
        if (!isHoveredRefs.current[hoveredClientIndex] || !clientData || clientData.gallery.length <= 1) {
          isAnimatingRefs.current[hoveredClientIndex] = false;
          return;
        }

        // Actualizar el índice con loop infinito
        setCurrentImageIndices((prev) => ({
          ...prev,
          [hoveredClientIndex]: (prev[hoveredClientIndex] + 1) % clientData.gallery.length
        }));

        // Continuar el slider infinitamente si aún hay hover
        if (isHoveredRefs.current[hoveredClientIndex]) {
          startSlider();
        } else {
          isAnimatingRefs.current[hoveredClientIndex] = false;
        }
      }, 2000); // Cada slide dura 2 segundos
    };

    // Iniciar el slider
    startSlider();

    return () => {
      if (timeoutRefs.current[hoveredClientIndex]) {
        clearTimeout(timeoutRefs.current[hoveredClientIndex]);
        timeoutRefs.current[hoveredClientIndex] = null;
      }
      isAnimatingRefs.current[hoveredClientIndex] = false;
    };
  }, [hoveredClientIndex, clientsData, category]);

  // Resetear al salir del hover
  useEffect(() => {
    if (hoveredClientIndex === null) {
      // Limpiar todos los timeouts
      Object.keys(timeoutRefs.current).forEach(key => {
        if (timeoutRefs.current[key]) {
          clearTimeout(timeoutRefs.current[key]);
          timeoutRefs.current[key] = null;
        }
      });
      // Resetear todos los índices a 0
      const resetIndices = {};
      clientsData.forEach((_, index) => {
        resetIndices[index] = 0;
      });
      setCurrentImageIndices(resetIndices);
    }
  }, [hoveredClientIndex, clientsData]);

  // Handlers memoizados para optimización
  const handleMouseEnter = useCallback((index) => {
    setHoveredClientIndex(index);
    isHoveredRefs.current[index] = true;
    lastHoveredIndexRef.current = index;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const lastIndex = lastHoveredIndexRef.current;
    
    // Limpiar timeout del cliente que perdió el hover
    if (lastIndex !== null && timeoutRefs.current[lastIndex]) {
      clearTimeout(timeoutRefs.current[lastIndex]);
      timeoutRefs.current[lastIndex] = null;
    }
    
    // Resetear inmediatamente el índice del cliente que perdió el hover a 0
    if (lastIndex !== null) {
      setCurrentImageIndices((prev) => ({
        ...prev,
        [lastIndex]: 0
      }));
    }
    
    setHoveredClientIndex(null);
    Object.keys(isHoveredRefs.current).forEach(key => {
      isHoveredRefs.current[key] = false;
    });
    lastHoveredIndexRef.current = null;
  }, []);

  // Handlers para navegación manual de galería (solo responsive)
  const handlePreviousImage = useCallback((index, e) => {
    e.stopPropagation();
    const clientData = clientsData[index];
    if (!clientData || clientData.gallery.length <= 1) return;
    
    setCurrentImageIndices((prev) => ({
      ...prev,
      [index]: prev[index] === 0 ? clientData.gallery.length - 1 : prev[index] - 1
    }));
  }, [clientsData]);

  const handleNextImage = useCallback((index, e) => {
    e.stopPropagation();
    const clientData = clientsData[index];
    if (!clientData || clientData.gallery.length <= 1) return;
    
    setCurrentImageIndices((prev) => ({
      ...prev,
      [index]: (prev[index] + 1) % clientData.gallery.length
    }));
  }, [clientsData]);

  if (!clientsData || clientsData.length === 0) {
    return null;
  }

  return (
    <>
      {clientsData.map((clientData, index) => {
        const isHovered = hoveredClientIndex === index;
        const currentImageIndex = currentImageIndices[index] || 0;
        // Ruta de imágenes: las imágenes en el JSON ya incluyen la ruta relativa desde carrusel
        // Por ejemplo: "institucional/lema1.webp" o "vox1.webp"
        const getImagePath = (imageName) => {
          // Si la imagen ya incluye una carpeta (tiene /), usar la ruta completa desde carrusel
          if (imageName.includes('/')) {
            return `${base}assets/creatividad/branding/carrusel/${imageName}`;
          }
          // Si no tiene carpeta, está en la carpeta principal de branding
          return `${base}assets/creatividad/branding/${imageName}`;
        };
        const firstImage = clientData.gallery && clientData.gallery.length > 0
          ? getImagePath(clientData.gallery[0])
          : null;
        const currentImage = clientData.gallery && clientData.gallery.length > 0
          ? getImagePath(clientData.gallery[currentImageIndex])
          : null;

        const isInstitucional = category === "institucional";
        const hasMultipleImages = clientData.gallery && clientData.gallery.length > 1;

        return (
          <div
            key={clientData.id || index}
            className={`full-container brand-item ${isInstitucional ? "brand-item-institucional" : ""}`}
            onMouseEnter={() => {
              // Solo activar hover en desktop (no responsive)
              if (!isInstitucional || window.innerWidth > 1023) {
                handleMouseEnter(index);
              }
            }}
            onMouseLeave={() => {
              // Solo desactivar hover en desktop (no responsive)
              if (!isInstitucional || window.innerWidth > 1023) {
                handleMouseLeave();
              }
            }}
          >
            {/* Galería de fondo */}
            <div className="brand-gallery-background">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { duration: 0.2, ease: "easeIn" }
                  }}
                  exit={{ 
                    opacity: 0,
                    transition: { duration: 0.1, ease: "easeOut" }
                  }}
                  className="brand-gallery-image"
                  style={{
                    backgroundImage: `url(${currentImage || firstImage})`
                  }}
                />
              </AnimatePresence>
            </div>

            {/* Container y Panel solo en desktop o cuando no es institucional en responsive */}
            {(!isInstitucional || !isMobile) && (
              <div className="container">
                {/* Panel de contenido del cliente */}
                <motion.div
                  className="brand-item-panel"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{
                    x: isHovered ? 0 : -300,
                    opacity: isHovered ? 1 : 0
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                >
                  <h2 className="brand-item-title">
                    {clientData.name}
                  </h2>
                  <p dangerouslySetInnerHTML={{ __html: clientData.description }} />
                </motion.div>
              </div>
            )}

            {/* Grid responsive para institucional (hasta tablet) */}
            {isInstitucional && (
              <div className="brand-item-responsive-grid">
                {/* Primera fila: Container con texto */}
                <div className="brand-item-responsive-text">
                  <h2 className="brand-item-title">
                    {clientData.name}
                  </h2>
                  <p dangerouslySetInnerHTML={{ __html: clientData.description }} />
                </div>
                
                {/* Segunda fila: Galería manual con flechas */}
                <div className="brand-item-responsive-gallery">
                  <div className="brand-gallery-responsive-image">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={currentImage || firstImage}
                        alt={clientData.name}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </AnimatePresence>
                  </div>
                  {hasMultipleImages && (
                    <>
                      <button 
                        className="brand-gallery-arrow brand-gallery-arrow-prev"
                        onClick={(e) => handlePreviousImage(index, e)}
                        aria-label="Imagen anterior"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                      </button>
                      <button 
                        className="brand-gallery-arrow brand-gallery-arrow-next"
                        onClick={(e) => handleNextImage(index, e)}
                        aria-label="Imagen siguiente"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default BrandingCarrusel;

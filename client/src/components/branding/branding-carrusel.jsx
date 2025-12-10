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
  const timeoutRefs = useRef({});
  const isAnimatingRefs = useRef({});
  const isHoveredRefs = useRef({});
  const lastHoveredIndexRef = useRef(null);

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

  // Slide automático solo cuando hay hover en un cliente específico
  useEffect(() => {
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
  }, [hoveredClientIndex, clientsData]);

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

        return (
          <div
            key={clientData.id || index}
            className="full-container brand-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
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

            {/* Container vacío */}
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
          </div>
        );
      })}
    </>
  );
};

export default BrandingCarrusel;

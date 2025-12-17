import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../assets/styles/branding-accordion.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const BrandingAccordion = ({ category }) => {
  const [clientsData, setClientsData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const timeoutRefs = useRef({});
  const isAnimatingRefs = useRef({});
  const isExpandedRefs = useRef({});
  const lastExpandedIndexRef = useRef(null);

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
        
        // Abrir la última solapa por defecto después de que los datos estén cargados
        if (categoryData.length > 0) {
          const lastIndex = categoryData.length - 1;
          // Usar setTimeout para asegurar que el estado se actualice correctamente
          setTimeout(() => {
            setExpandedIndex(lastIndex);
            isExpandedRefs.current[lastIndex] = true;
            lastExpandedIndexRef.current = lastIndex;
          }, 0);
        }
      } catch (error) {
        console.error("Error loading clients data:", error);
      }
    };

    if (category) {
      loadClientsData();
    }
  }, [category]);

  // Actualizar refs cuando cambia expandedIndex
  useEffect(() => {
    if (expandedIndex !== null) {
      isExpandedRefs.current[expandedIndex] = true;
    }
  }, [expandedIndex]);

  // Slide automático cuando hay un item expandido
  useEffect(() => {
    if (expandedIndex === null) return;
    if (clientsData.length === 0) return; // Esperar a que los datos estén cargados
    
    const clientData = clientsData[expandedIndex];
    if (!clientData || !clientData.gallery || clientData.gallery.length <= 1) return;

    // Asegurar que el ref esté actualizado
    isExpandedRefs.current[expandedIndex] = true;

    // Limpiar timeout anterior si existe
    if (timeoutRefs.current[expandedIndex]) {
      clearTimeout(timeoutRefs.current[expandedIndex]);
      timeoutRefs.current[expandedIndex] = null;
    }

    // Función recursiva para el slider automático infinito
    const startSlider = () => {
      if (!isExpandedRefs.current[expandedIndex] || !clientData || clientData.gallery.length <= 1) {
        isAnimatingRefs.current[expandedIndex] = false;
        return;
      }

      isAnimatingRefs.current[expandedIndex] = true;
      
      timeoutRefs.current[expandedIndex] = setTimeout(() => {
        if (!isExpandedRefs.current[expandedIndex] || !clientData || clientData.gallery.length <= 1) {
          isAnimatingRefs.current[expandedIndex] = false;
          return;
        }

        // Actualizar el índice con loop infinito
        setCurrentImageIndices((prev) => ({
          ...prev,
          [expandedIndex]: (prev[expandedIndex] + 1) % clientData.gallery.length
        }));

        // Continuar el slider infinitamente si aún está expandido
        if (isExpandedRefs.current[expandedIndex]) {
          startSlider();
        } else {
          isAnimatingRefs.current[expandedIndex] = false;
        }
      }, 2000); // Cada slide dura 2 segundos
    };

    // Iniciar el slider con un pequeño delay para asegurar que todo esté listo
    const initTimeout = setTimeout(() => {
      startSlider();
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (timeoutRefs.current[expandedIndex]) {
        clearTimeout(timeoutRefs.current[expandedIndex]);
        timeoutRefs.current[expandedIndex] = null;
      }
      isAnimatingRefs.current[expandedIndex] = false;
    };
  }, [expandedIndex, clientsData]);

  // Resetear índices de imágenes cuando cambia el acordeón expandido
  useEffect(() => {
    // Limpiar timeouts de los acordeones que no están expandidos
    Object.keys(timeoutRefs.current).forEach(key => {
      const keyIndex = parseInt(key);
      if (keyIndex !== expandedIndex && timeoutRefs.current[key]) {
        clearTimeout(timeoutRefs.current[key]);
        timeoutRefs.current[key] = null;
      }
    });
    
    // Resetear índices de imágenes de los acordeones cerrados
    if (expandedIndex !== null && clientsData.length > 0) {
      setCurrentImageIndices((prev) => {
        const resetIndices = { ...prev };
        clientsData.forEach((_, index) => {
          if (index !== expandedIndex) {
            resetIndices[index] = 0;
          }
        });
        return resetIndices;
      });
    }
  }, [expandedIndex, clientsData.length]);

  // Handler para toggle con click
  const handleToggle = useCallback((index) => {
    // No permitir cerrar si es el último abierto (siempre debe haber uno abierto)
    if (expandedIndex === index) {
      // Si hay más de un item, no permitir cerrar el último
      if (clientsData.length > 1) {
        return; // No hacer nada, siempre debe haber uno abierto
      }
    } else {
      // Mover la solapa clickeada al final y abrirla ahí
      const clickedClient = clientsData[index];
      const otherClients = clientsData.filter((_, i) => i !== index);
      const reorderedClients = [...otherClients, clickedClient];
      
      // El nuevo índice expandido será el último (length - 1)
      const newExpandedIndex = reorderedClients.length - 1;
      
      // Actualizar los índices de imágenes manteniendo el índice del cliente clickeado
      setCurrentImageIndices((prev) => {
        const newIndices = {};
        const clickedImageIndex = prev[index] || 0;
        
        // Mapear los índices antiguos a los nuevos
        otherClients.forEach((_, oldIndex) => {
          const originalIndex = oldIndex < index ? oldIndex : oldIndex + 1;
          newIndices[oldIndex] = prev[originalIndex] || 0;
        });
        
        // El cliente clickeado va al final
        newIndices[newExpandedIndex] = clickedImageIndex;
        
        return newIndices;
      });
      
      // Actualizar el array de clientes y el índice expandido de forma sincronizada
      setClientsData(reorderedClients);
      setExpandedIndex(newExpandedIndex);
      isExpandedRefs.current[newExpandedIndex] = true;
      lastExpandedIndexRef.current = newExpandedIndex;
    }
  }, [expandedIndex, clientsData]);

  if (!clientsData || clientsData.length === 0) {
    return null;
  }

  // Función para obtener la ruta de la imagen
  const getImagePath = (imageName) => {
    if (imageName.includes('/')) {
      return `${base}assets/creatividad/branding/carrusel/${imageName}`;
    }
    return `${base}assets/creatividad/branding/${imageName}`;
  };

  return (
    <div className="branding-accordion-container">
      {clientsData.map((clientData, index) => {
        const isExpanded = expandedIndex === index;
        const currentImageIndex = currentImageIndices[index] || 0;
        const firstImage = clientData.gallery && clientData.gallery.length > 0
          ? getImagePath(clientData.gallery[0])
          : null;
        const currentImage = clientData.gallery && clientData.gallery.length > 0
          ? getImagePath(clientData.gallery[currentImageIndex])
          : null;

        return (
          <motion.div
            key={clientData.id || `client-${clientData.name}-${index}`}
            layout
            className={`branding-accordion-item ${isExpanded ? "expanded" : ""}`}
            onClick={() => handleToggle(index)}
            transition={{
              layout: {
                type: "spring",
                stiffness: 500,
                damping: 40
              }
            }}
          >
            {!isExpanded ? (
              /* Panel cerrado - 100px de ancho */
              <div className="branding-accordion-closed">
                {/* Sticky amarillo animado - solo en hover */}
                <div className="branding-accordion-sticky" />
                {/* Flecha SVG - solo visible en hover cuando está cerrado */}
                <div className="branding-accordion-arrow">
                  <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="m.5 8.5 4-4-4-4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" transform="translate(9 6)"/>
                  </svg>
                </div>
                <div className="branding-accordion-name">
                  <span>{clientData.name}</span>
                </div>
              </div>
            ) : (
              /* Cuando está expandido: slider detrás y título encima */
              <div className="branding-accordion-expanded-wrapper">
                {/* Panel expandido - galería/slider que ocupa todo el ancho */}
                {clientData.gallery && clientData.gallery.length > 0 && (
                  <motion.div
                    className="branding-accordion-expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <div className="branding-accordion-gallery">
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
                          className="branding-accordion-gallery-image"
                          style={{
                            backgroundImage: `url(${currentImage || firstImage})`
                          }}
                        />
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
                {/* Panel cerrado posicionado encima del slider */}
                <div className={`branding-accordion-closed expanded-panel`}>
                  {/* Flecha con fondo blanco cuando está expandido */}
                  <div className="branding-accordion-arrow expanded-arrow">
                    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                      <path d="m.5 8.5 4-4-4-4" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" transform="translate(9 6)"/>
                    </svg>
                  </div>
                  <div className="branding-accordion-name">
                    <span>{clientData.name}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BrandingAccordion;


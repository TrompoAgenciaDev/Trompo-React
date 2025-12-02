import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const BrandingCarrusel = ({ clientName }) => {
  const [clientData, setClientData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const isHoveredRef = useRef(false);

  // Cargar datos del cliente desde el JSON
  useEffect(() => {
    const loadClientData = async () => {
      try {
        const response = await fetch(`${base}assets/creatividad/branding/carrusel/carrusel.json`);
        const data = await response.json();
        const client = data.clients.find(
          (c) => c.id.toLowerCase() === clientName.toLowerCase() || 
                 c.name.toLowerCase() === clientName.toLowerCase()
        );
        if (client) {
          setClientData(client);
        }
      } catch (error) {
        console.error("Error loading client data:", error);
      }
    };

    if (clientName) {
      loadClientData();
    }
  }, [clientName]);

  // Actualizar ref cuando cambia isHovered
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Slide automático solo cuando hay hover
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isHovered || !clientData || clientData.gallery.length <= 1) {
      isAnimatingRef.current = false;
      return;
    }

    // Función recursiva para el slider automático infinito
    const startSlider = () => {
      // Verificar el estado actual usando el ref
      if (!isHoveredRef.current || !clientData || clientData.gallery.length <= 1) {
        isAnimatingRef.current = false;
        return;
      }

      isAnimatingRef.current = true;
      
      timeoutRef.current = setTimeout(() => {
        // Verificar nuevamente antes de cambiar la imagen
        if (!isHoveredRef.current || !clientData || clientData.gallery.length <= 1) {
          isAnimatingRef.current = false;
          return;
        }

        // Actualizar el índice con loop infinito
        setCurrentImageIndex((prev) => {
          return (prev + 1) % clientData.gallery.length;
        });

        // Continuar el slider infinitamente si aún hay hover
        if (isHoveredRef.current) {
          startSlider();
        } else {
          isAnimatingRef.current = false;
        }
      }, 2000); // Cada slide dura 2 segundos
    };

    // Iniciar el slider
    startSlider();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, [isHovered, clientData]);

  // Resetear al salir del hover
  useEffect(() => {
    if (!isHovered) {
      // Limpiar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isAnimatingRef.current = false;
      // Resetear a la primera imagen
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  // Memoizar la primera imagen para optimización
  // Las imágenes están en assets/creatividad/branding/ (un nivel antes del JSON)
  const firstImage = useMemo(() => {
    if (!clientData || !clientData.gallery || clientData.gallery.length === 0) return null;
    return `${base}assets/creatividad/branding/${clientData.gallery[0]}`;
  }, [clientData]);

  // Memoizar la imagen actual
  // Las imágenes están en assets/creatividad/branding/ (un nivel antes del JSON)
  const currentImage = useMemo(() => {
    if (!clientData || !clientData.gallery || clientData.gallery.length === 0) return null;
    return `${base}assets/creatividad/branding/${clientData.gallery[currentImageIndex]}`;
  }, [clientData, currentImageIndex]);

  // Handlers memoizados para optimización
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  if (!clientData) {
    return null;
  }

  return (
    <div
      className="full-container brand-item"
      onMouseEnter={handleMouseEnter}
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
        {/* Panel institucional */}
        <motion.div
            className="institucional"
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
            <h2>
            {clientData.logo ? (
                <img
                src={`${base}assets/creatividad/branding/${clientData.logo}`}
                alt={clientData.name}
                style={{ maxWidth: "100%", height: "auto" }}
                />
            ) : (
                clientData.name
            )}
            </h2>
            <p>{clientData.description}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandingCarrusel;

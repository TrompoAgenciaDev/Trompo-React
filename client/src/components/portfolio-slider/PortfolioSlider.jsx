import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../../assets/styles/portfolio-slider.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const PortfolioSlider = ({ category = "institucional" }) => {
  const [clientsData, setClientsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' o 'prev'
  const autoRotateIntervalRef = useRef(null);

  // Cargar datos de la categoría desde el JSON
  useEffect(() => {
    const loadClientsData = async () => {
      try {
        const response = await fetch(`${base}assets/creatividad/branding/carrusel/carrusel.json`);
        const data = await response.json();
        
        const categoryData = data[category] || [];
        setClientsData(categoryData);
        
        if (categoryData.length > 0) {
          setCurrentIndex(0);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error("Error loading clients data:", error);
      }
    };

    if (category) {
      loadClientsData();
    }
  }, [category]);

  // Función para detener la auto-rotación
  const stopAutoRotate = () => {
    if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
      autoRotateIntervalRef.current = null;
    }
  };

  // Función para iniciar la auto-rotación
  const startAutoRotate = () => {
    if (clientsData.length === 0) return;
    
    // Limpiar intervalo anterior si existe
    stopAutoRotate();

    autoRotateIntervalRef.current = setInterval(() => {
      setDirection('next'); // Auto-rotación siempre avanza hacia adelante
      setCurrentIndex((prev) => {
        const oldIndex = prev;
        const nextIndex = (prev + 1) % clientsData.length;
        setPrevIndex(oldIndex);
        setCurrentImageIndex(0);
        setTimeout(() => {
          setPrevIndex(nextIndex);
        }, 200);
        return nextIndex;
      });
    }, 2500);
  };

  // Auto-rotación del carrusel (cambia de slide cada 2.5s)
  useEffect(() => {
    startAutoRotate();
    return () => {
      stopAutoRotate();
    };
  }, [clientsData.length]);

  // Auto-rotación de imágenes del slide actual (si tiene múltiples imágenes)
  useEffect(() => {
    if (clientsData.length === 0) return;
    
    const currentClient = clientsData[currentIndex];
    if (!currentClient || !currentClient.gallery || currentClient.gallery.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % currentClient.gallery.length;
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, clientsData]);

  const nextSlide = () => {
    if (isAnimating) return;
    
    // Detener auto-rotación
    stopAutoRotate();
    
    setIsAnimating(true);
    setDirection('next'); // Establecer dirección hacia adelante
    const oldIndex = currentIndex;
    setPrevIndex(oldIndex);
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % clientsData.length;
      setTimeout(() => {
        setIsAnimating(false);
        setPrevIndex(newIndex);
        // Reiniciar auto-rotación después de 2.5s
        setTimeout(() => {
          startAutoRotate();
        }, 2500);
      }, 200);
      return newIndex;
    });
    setCurrentImageIndex(0);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    
    // Detener auto-rotación
    stopAutoRotate();
    
    setIsAnimating(true);
    setDirection('prev'); // Establecer dirección hacia atrás
    const oldIndex = currentIndex;
    setPrevIndex(oldIndex);
    setCurrentIndex((prev) => {
      const newIndex = (prev - 1 + clientsData.length) % clientsData.length;
      setTimeout(() => {
        setIsAnimating(false);
        setPrevIndex(newIndex);
        // Reiniciar auto-rotación después de 2.5s
        setTimeout(() => {
          startAutoRotate();
        }, 2500);
      }, 200);
      return newIndex;
    });
    setCurrentImageIndex(0);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    
    // Detener auto-rotación
    stopAutoRotate();
    
    setIsAnimating(true);
    // Determinar dirección basándose en si el índice es mayor o menor
    const diff = index - currentIndex;
    const isForward = diff > 0 || (diff < 0 && Math.abs(diff) > clientsData.length / 2);
    setDirection(isForward ? 'next' : 'prev');
    const oldIndex = currentIndex;
    setPrevIndex(oldIndex);
    setCurrentIndex(index);
    setCurrentImageIndex(0);
    setTimeout(() => {
      setIsAnimating(false);
      setPrevIndex(index);
      // Reiniciar auto-rotación después de 2.5s
      setTimeout(() => {
        startAutoRotate();
      }, 2500);
    }, 200);
  };

  const handleControlClick = (direction) => {
    if (direction === 'prev') {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  if (!clientsData || clientsData.length === 0) {
    return null;
  }

  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    return `${base}assets/creatividad/branding/carrusel/${imagePath}`;
  };

  // Crear array circular de slides para la animación
  const getSlideData = (offset) => {
    const index = (currentIndex + offset + clientsData.length) % clientsData.length;
    return clientsData[index];
  };

  return (
    <div className="portfolio-slider-container">
      {/* Slider principal con rueda giratoria */}
      <div className="portfolio-slider-wrapper">
        <div className="portfolio-slider-track">
          {/* Slide previo (izquierda) - el que estaba activo se mueve aquí */}
          <motion.div
            className="portfolio-slider-control-left slider-control slider-control-prev slider-control-left"
            onClick={() => handleControlClick('prev')}
            key={`left-${prevIndex}-${currentIndex}`}
            initial={prevIndex !== currentIndex ? { x: 0, scale: 1, rotateY: 0, filter: 'blur(0px)', opacity: 1 } : false}
            animate={{ 
              x: '-15%', 
              scale: 0.75,
              rotateY: -15,
              filter: 'blur(8px)',
              opacity: 0.6
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {(() => {
              const slideToShow = prevIndex !== currentIndex 
                ? clientsData[prevIndex] 
                : getSlideData(-1);
              return slideToShow && slideToShow.gallery && slideToShow.gallery.length > 0 ? (
                <img
                  src={getImagePath(slideToShow.gallery[0])}
                  alt={slideToShow.name}
                  className="portfolio-slider-control-image"
                />
              ) : null;
            })()}
          </motion.div>

          {/* Slide actual (centro) - viene de la derecha o izquierda según la dirección */}
          <motion.div
            className="portfolio-slider-main"
            key={`main-${currentIndex}`}
            initial={direction === 'next' 
              ? { x: '15%', scale: 0.75, rotateY: 15, filter: 'blur(8px)', opacity: 0.6 }
              : { x: '-15%', scale: 0.75, rotateY: -15, filter: 'blur(8px)', opacity: 0.6 }
            }
            animate={{ 
              x: 0, 
              scale: 1,
              rotateY: 0,
              filter: 'blur(0px)',
              opacity: 1
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {getSlideData(0) && getSlideData(0).gallery && getSlideData(0).gallery.length > 0 && (
              <img
                key={`${currentIndex}-${currentImageIndex}`}
                src={getImagePath(getSlideData(0).gallery[currentImageIndex])}
                alt={getSlideData(0).name}
                className="portfolio-slider-main-image"
              />
            )}
          </motion.div>

          {/* Slide siguiente (derecha) - el que será el siguiente activo, más grande */}
          <motion.div
            className="portfolio-slider-control-right slider-control slider-control-next slider-control-right"
            onClick={() => handleControlClick('next')}
            key={`right-${currentIndex}`}
            initial={{ x: '15%', scale: 0.75, rotateY: 15, filter: 'blur(8px)', opacity: 0.6 }}
            animate={{ 
              x: '15%', 
              scale: 0.75,
              rotateY: 15,
              filter: 'blur(8px)',
              opacity: 0.6
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {getSlideData(1) && getSlideData(1).gallery && getSlideData(1).gallery.length > 0 && (
              <img
                src={getImagePath(getSlideData(1).gallery[0])}
                alt={getSlideData(1).name}
                className="portfolio-slider-control-image"
              />
            )}
          </motion.div>
        </div>
      </div>
      
    </div>
  );
};

export default PortfolioSlider;


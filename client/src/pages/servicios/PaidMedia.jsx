import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useMotionValue, useAnimation, useSpring } from "framer-motion";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo.jsx";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
import Icons from "../../components/Icons.jsx";
import Beneficios from "../../components/Beneficios.jsx";
import Inversiones from "../../components/Inversiones.jsx";

//styles
import "../../assets/styles/paid-media.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

// Componente de slider automático genérico y reutilizable con drag & drop
const AutoSlider = ({ 
  children, 
  isActive, 
  slideSelector = '.grafico-slide',
  containerClass = 'graficos-slider-container',
  sliderClass = 'graficos-slider',
  infinite = true // Por defecto infinito, pero puede desactivarse
}) => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const timeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const loopWidthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  
  // Clonar children solo si infinite es true
  const childrenArray = React.Children.toArray(children);
  const clonedChildren = infinite ? [...childrenArray, ...childrenArray, ...childrenArray] : childrenArray;

  // Calcular dimensiones
  useEffect(() => {
    if (!sliderRef.current || !containerRef.current) return;

    const updateDimensions = () => {
      const container = containerRef.current;
      const slider = sliderRef.current;
      if (!container || !slider) return;

      const containerRect = container.getBoundingClientRect();
      const sliderRect = slider.getBoundingClientRect();
      
      const slideElements = slider.querySelectorAll(slideSelector);
      if (slideElements.length > 0) {
        const firstSlide = slideElements[0];
        const slideRect = firstSlide.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(slider);
        const gap = parseFloat(computedStyle.gap) || 16;
        const width = slideRect.width + gap;
        
        // Calcular el ancho de un loop (un set de slides originales) solo si es infinito
        if (infinite) {
          const originalSlidesCount = childrenArray.length;
          const loopWidth = width * originalSlidesCount;
          loopWidthRef.current = loopWidth;
          
          // Inicializar desde el segundo loop (el del medio) para tener margen en ambos lados
          if (x.get() === 0 && loopWidth > 0) {
            const initialX = -loopWidth;
            x.set(initialX);
            setCurrentSlideIndex(originalSlidesCount);
          }
        } else {
          loopWidthRef.current = 0; // No usar loop si no es infinito
        }
        
        setSlideWidth(width);
        setContainerWidth(containerRect.width);
        setTotalWidth(sliderRect.width);
        setTotalSlides(slideElements.length);
      }
    };

    // Usar setTimeout para asegurar que el DOM esté renderizado
    const timeoutId = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [children, isActive, slideSelector, infinite]);

  // Función memoizada para mover al siguiente slide
  const moveToNextSlide = useCallback(() => {
    // Validaciones antes de ejecutar - usar refs para evitar dependencias
    if (isDragging || isAnimatingRef.current || !isActive) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Usar valores actuales de los refs y estados
    const currentSlideWidth = slideWidth;
    const currentLoopWidth = loopWidthRef.current;
    
    if (!currentSlideWidth) {
      return;
    }
    
    if (infinite && (!currentLoopWidth || currentLoopWidth <= 0)) {
      return;
    }

    isAnimatingRef.current = true;

    setCurrentSlideIndex((prevIndex) => {
      // Incrementar el índice
      const nextIndex = prevIndex + 1;
      let targetX = -nextIndex * currentSlideWidth;
      const currentPos = x.get();
      
      // Calcular el máximo offset permitido
      // Para el último slide, no necesitamos el gap extra, así que ajustamos el cálculo
      const maxOffset = Math.max(0, totalWidth - containerWidth);
      // Ajustar para que el último slide no se corte: usar Math.ceil en lugar de Math.floor
      const maxSlideIndex = Math.ceil(maxOffset / currentSlideWidth);
      
      // Si no es infinito y llegamos al final, volver al inicio
      if (!infinite && nextIndex > maxSlideIndex) {
        // Volver al inicio con animación
        const resetX = 0;
        
        controls.start({
          x: resetX,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }).then(() => {
          x.set(resetX);
          isAnimatingRef.current = false;
          if (!isDragging && isActive) {
            timeoutRef.current = setTimeout(moveToNextSlide, 2800);
          }
        });
        
        return 0;
      }
      
      // Wrap infinito: si nos salimos del primer loop, resetear a la posición equivalente en el segundo loop
      if (infinite && targetX <= -currentLoopWidth) {
        // Resetear a la posición equivalente en el segundo loop (sin animación visible)
        const wrappedX = targetX + currentLoopWidth;
        const wrappedIndex = Math.floor(-wrappedX / currentSlideWidth);
        
        // Actualizar directamente sin animación para el wrap (instantáneo)
        x.set(wrappedX);
        
        // Esperar el tiempo completo (2.8s) antes de continuar
        setTimeout(() => {
          isAnimatingRef.current = false;
          if (!isDragging && isActive) {
            timeoutRef.current = setTimeout(moveToNextSlide, 2800);
          }
        }, 2800);
        
        return wrappedIndex;
      }
      
      // Animar al siguiente slide usando controls
      controls.start({
        x: targetX,
        transition: {
          duration: 0.5,
          ease: "easeInOut"
        }
      }).then(() => {
        x.set(targetX);
        isAnimatingRef.current = false;
        
        // Esperar 2.8 segundos después de que termine la animación antes de mover al siguiente slide
        if (!isDragging && isActive) {
          timeoutRef.current = setTimeout(moveToNextSlide, 2800);
        }
      });
      
      return nextIndex;
    });
  }, [isActive, isDragging, slideWidth, x, infinite, containerWidth, totalWidth, controls]);

  // Animación automática slide por slide
  useEffect(() => {
    if (!isActive || isDragging || !slideWidth || !containerWidth || !totalWidth || totalSlides === 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isAnimatingRef.current = false;
      return;
    }

    if (infinite) {
      const loopWidth = loopWidthRef.current;
      if (!loopWidth || loopWidth <= 0) return;
    }

    // Limpiar cualquier timeout existente antes de iniciar uno nuevo
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Iniciar el ciclo de animación después de 2.8 segundos
    timeoutRef.current = setTimeout(moveToNextSlide, 2800);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, [isActive, isDragging, slideWidth, containerWidth, totalWidth, totalSlides, infinite, moveToNextSlide]);

  const handleDragStart = () => {
    setIsDragging(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDragEnd = (event, info) => {
    if (!slideWidth || !containerWidth || !totalWidth) {
      setIsDragging(false);
      isAnimatingRef.current = false;
      return;
    }

    const maxOffset = Math.max(0, totalWidth - containerWidth);
    const currentX = x.get();
    
    // Calcular el índice más cercano para snap
    const index = Math.round(-currentX / slideWidth);
    const maxSlideIndex = Math.ceil(maxOffset / slideWidth);
    const clampedIndex = Math.max(0, Math.min(index, maxSlideIndex));
    const targetX = -clampedIndex * slideWidth;
    const clampedX = Math.max(-maxOffset, Math.min(0, targetX));

    // Actualizar el índice actual
    setCurrentSlideIndex(clampedIndex);
    isAnimatingRef.current = true;

    // Animar al snap position usando controls
    controls.start({
      x: clampedX,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }).then(() => {
      x.set(clampedX);
      isAnimatingRef.current = false;
      setIsDragging(false);
    });
  };

  if (!isActive) {
    return <div className={sliderClass} ref={sliderRef}>{children}</div>;
  }

  const maxOffset = Math.max(0, totalWidth - containerWidth);

  return (
    <div className={containerClass} ref={containerRef} style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        className={sliderClass}
        ref={sliderRef}
        animate={controls}
        style={{ x }}
        drag="x"
        dragConstraints={{ 
          left: -Math.max(0, totalWidth - containerWidth), 
          right: 0 
        }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onUpdate={(latest) => {
          // Wrap infinito durante el drag también
          if (isDragging && infinite && loopWidthRef.current > 0) {
            const currentX = typeof latest.x === 'number' ? latest.x : x.get();
            const loopWidth = loopWidthRef.current;
            
            if (currentX <= -loopWidth) {
              x.set(currentX + loopWidth);
            } else if (currentX > 0) {
              x.set(currentX - loopWidth);
            }
          }
        }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {clonedChildren}
      </motion.div>
    </div>
  );
};

const PaidMediaItem = ({ title, subtitle, description, footerText, svgStroke = "currentColor" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="grid-item-paid-media"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="header-paid-container">
        <h2 className="paid-title">{title}</h2>
        <span className="paid-subtitle">{subtitle}</span>
      </div>
      <div className="footer-paid-container">
        <p>{description}</p>
        <div className="footer-paid-buttons">
          <span className="paid-subtitle">{footerText}</span>
          <div className="icon-container-media-paid-footer">
            <div className="icon-container-paid">
                {/* Fondo amarillo que se expande desde el centro */}
                <motion.div
                  className="icon-background-animated"
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{
                    clipPath: isHovered ? "circle(100% at 50% 50%)" : "circle(0% at 50% 50%)"
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="170" height="151" viewBox="0 0 170 151" fill="none" style={{ position: "relative", zIndex: 1 }}>
                  <path 
                    d="M128.404 77.1065L39.7873 77.1065M39.7873 77.1065L84.0958 115.66M39.7873 77.1065L84.0958 38.5533" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para animar frase por frase
const AnimatedPhrase = ({ phrase, index, phraseDelay, baseOpacity, hasAnimated }) => {
  // Calcular el delay: si NO ha animado, aplicar delay progresivo para animar frase por frase
  // Si ya animó, no aplicar delay (todas las frases aparecen juntas)
  const delay = hasAnimated ? 0 : index * phraseDelay;
  
  // Asegurar que cuando está visible, la opacidad sea 1
  // Si baseOpacity es >= 0.9, forzar a 1 para máxima visibilidad
  const targetOpacity = baseOpacity >= 0.9 ? 1 : Math.max(0.1, baseOpacity);

  return (
    <motion.span
      className="animated-phrase"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: targetOpacity }}
      transition={{
        delay: delay,
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      {phrase}
    </motion.span>
  );
};

const Estrategia = () => {
  const [activeTab, setActiveTab] = useState("graficos");
  const textRef = useRef(null);
  const animatedTextContainerRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  
  const tabs = [
    { id: "busqueda", label: "Anuncios de búsqueda" },
    { id: "graficos", label: "Anuncios Gráficos" },
    { id: "video", label: "Anuncios de video" },
  ];
  
  const { scrollYProgress } = useScroll({
    target: animatedTextContainerRef,
    offset: ["start end", "start start"]
  });

  // Transformar el scroll progress: cuando está visible (entre 0.1 y 0.9), opacidad 1
  // Usando easing suave para transiciones más fluidas
  const opacityValue = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.1, 1, 1, 0.1],
    {
      clamp: false, // Permitir valores fuera del rango para suavidad
    }
  );
  
  // Suavizar el valor de opacidad con un spring para transiciones más fluidas
  // Parámetros ajustados para scroll más suave con frenado progresivo
  const smoothedOpacity = useSpring(opacityValue, {
    stiffness: 80,   // Más bajo = más suave pero más lento
    damping: 30,     // Más alto = menos rebote, más controlado
    mass: 0.6,       // Más bajo = más responsivo, más fluido
  });

  // Convertir el motion value a un estado para usar en las animaciones
  const [baseOpacity, setBaseOpacity] = React.useState(0.1);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Escuchar cambios en el scroll progress y actualizar opacidad
  // Usar el valor suavizado para transiciones más fluidas
  useMotionValueEvent(smoothedOpacity, "change", (latest) => {
    setBaseOpacity(latest);
  });

  const text = "En el vasto océano digital, la publicidad pagada es la brújula y el viento que lleva tu mensaje directo a puertos de oportunidad. No es gasto; es inversión inteligente. Combinamos el arte de la persuasión con la ciencia de los datos para colocar la narrativa perfecta, frente a la persona ideal, en el momento exacto. No lanzamos campañas al azar; trazamos rutas de impacto";
  
  // Delay entre frases: 0.3s por frase para una animación fluida
  const phraseDelay = 0.3;
  
  // Dividir el texto en frases separadas por comas o puntos (incluyendo el espacio después)
  const phrases = React.useMemo(() => {
    // Dividir por comas o puntos seguidos de espacio, pero mantener el delimitador
    // Usamos lookahead para incluir el espacio en el split pero mantenerlo con la frase anterior
    const splitRegex = /([,.])\s+/g;
    const result = [];
    let lastIndex = 0;
    let match;
    
    // Encontrar todas las coincidencias de coma o punto seguido de espacio
    while ((match = splitRegex.exec(text)) !== null) {
      // Agregar la frase desde el último índice hasta la coma/punto (incluyéndolo)
      const phrase = text.substring(lastIndex, match.index + 1) + ' ';
      if (phrase.trim().length > 0) {
        result.push(phrase);
      }
      lastIndex = match.index + match[0].length; // Avanzar después del delimitador completo
    }
    
    // Agregar la última frase (desde el último índice hasta el final)
    if (lastIndex < text.length) {
      const lastPhrase = text.substring(lastIndex);
      if (lastPhrase.trim().length > 0) {
        result.push(lastPhrase);
      }
    }
    
    return result;
  }, [text]);

  // Controlar la animación frase por frase
  // Cuando baseOpacity es alta, iniciar animación progresiva
  // Cuando baja, resetear para que vuelva a animar cuando vuelva a subir
  React.useEffect(() => {
    if (baseOpacity >= 0.9) {
      // Cuando la opacidad es alta, mantener hasAnimated en false
      // para que se anime frase por frase
      // Después de un tiempo, marcar como animado para que todas las frases
      // se mantengan visibles sin delay en futuros cambios
      if (!hasAnimated) {
        const totalPhrases = phrases.length;
        const totalAnimationTime = (totalPhrases * phraseDelay + 0.4) * 1000;
        const timeout = setTimeout(() => {
          setHasAnimated(true);
        }, totalAnimationTime);
        
        return () => clearTimeout(timeout);
      }
    } else if (baseOpacity < 0.3) {
      // Cuando la opacidad baja mucho, resetear para que vuelva a animar
      setHasAnimated(false);
    }
  }, [baseOpacity, hasAnimated, phrases.length, phraseDelay]);
  return (
    <>
      <div style={{ margin: 0, padding: 0, lineHeight: 0, fontSize: 0 }}>
        <SimpleHeroVideo
          desktopSrc={`${base}assets/hero/estrategia-hero.mp4`}
          mobileSrc={`${base}assets/hero/mobile/estrategia-hero-mobile.mp4`}
          desktopPoster={`${base}assets/hero/estrategia-hero-poster.webp`}
          mobilePoster={`${base}assets/hero/mobile/estrategia-hero-mobile-poster.webp`}
        />
      </div>
      
      <ServiceTitle area="social media" titulo="Servicios de Paid Media" />


      <div className="full-container black-bg">
        <div className="container">
          <div className="grid-paid-media-container">
            <PaidMediaItem
              title="Google Ads"
              subtitle="Campañas de Alto Intento"
              description="Capturamos demanda real en el momento exacto de búsqueda. Diseñamos, optimizamos y escalamos campañas en Search, Display y Performance Max con foco en leads calificados, ventas y retorno medible."
              footerText="→ Ideal para captar usuarios "
              svgStroke="currentColor"
            />
            <PaidMediaItem
              title="Meta Ads"
              subtitle="Campañas de Alto Intento"
              description={<>Construimos audiencias, generamos demanda y convertimos atención en resultados.<br/> Creamos campañas en Instagram y Facebook combinando creatividad, segmentación y optimización continua para escalar ventas y reconocimiento de marca.</>}
              footerText="→ Ideal para crecer, testear y acelerar resultados."
              svgStroke="#FED332"
            />
          </div>
        </div>
      </div>

      <div ref={animatedTextContainerRef} className="full-container bg-yellow-2">
        <div className="container animated-text-container">
          <motion.span 
            ref={textRef}
            className="animated-text"
          >
            {phrases.map((phrase, phraseIndex) => (
              <AnimatedPhrase
                key={`phrase-${phraseIndex}`}
                phrase={phrase}
                index={phraseIndex}
                phraseDelay={phraseDelay}
                baseOpacity={baseOpacity}
                hasAnimated={hasAnimated}
              />
            ))}
          </motion.span>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="full-container black-bg tabs-container-ads">
        <div className="full-container tabs bg-white">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="full-container tab-content-container">
          <div className="container">
            <AnimatePresence mode="wait">
              {activeTab === "busqueda" && (
                <motion.div
                  key="busqueda"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="tab-content"
                >
                  <div className="container grid-tab bg-white">
                    <img src={`${base}assets/estrategia/google-ads/busqueda.webp`} alt="Busqueda Google Ads" />
                    <div className="text-container">
                      <h3>
                        <strong>Anuncios de búsqueda </strong> en Google y Buscadores asociados.
                      </h3>
                      <p>
                        Google Ads permite publicar los anuncios en los resultados de búsqueda de Google y en los buscadores asociados (Aol, Terra, Maps, YouTube, etc) mediante palabras claves de interés.
                      </p>
                    </div>
                  </div>
                  <div className="bento-grid">
                    <div className="bento-item bg-yellow-2">
                      <div className="content-bento">
                        <h3>Campañas Search</h3>
                        <p>Google Ads permite publicar los anuncios en los resultados de búsqueda de Google y en los buscadores asociados (Aol, Terra, Maps, YouTube,etc) mediante palabras claves de interés.</p>
                      </div>
                      <div className="img-bento">
                        <img src={`${base}assets/estrategia/google-ads/search.webp`} alt="Search" />
                      </div>
                    </div>
                    <div className="bento-item bg-yellow-2">
                      <div className="content-bento">
                        <h3>Campañas Shopping</h3>
                        <p>Las campañas de Google Shopping están especialmente pensadas para promocionar productos de tiendas online.</p>
                      </div>
                      <div className="img-bento">
                        <img src={`${base}assets/estrategia/google-ads/shopping.webp`} alt="Search" />
                      </div>
                    </div>
                    <div className="bento-item bg-yellow-2">
                      <div className="content-bento">
                        <h3>Campañas Apps Móviles</h3>
                        <p>Muestran anuncios tanto por búsqueda como en sitios web y App Moviles.</p>
                      </div>
                      <div className="img-bento">
                        <img src={`${base}assets/estrategia/google-ads/apps.webp`} alt="Search" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === "graficos" && (
                <motion.div
                  key="graficos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="tab-content"
                >
                  <div className="container grid-tab bg-white">
                    <img src={`${base}assets/estrategia/google-ads/display-google-ads.webp`} alt="Anuncios Gráficos Google Ads" />
                    <div className="text-container">
                      <h3>
                        <strong>Anuncios gráficos </strong> 
                        "banners" en los principales medios digitales.
                      </h3>
                      <p>
                        La red display es la red más grande de publicidad digital, compuesta por el 80% de los principales medios digitales.
                      </p>
                    </div>
                  </div>
                  <div className="container">
                    <AutoSlider isActive={activeTab === "graficos"}>
                      <div key="temas" className="grafico-slide">
                        <div className="item-header">
                          <div className="icon-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                              <path d="M20.9998 1.15088C10.0588 1.15088 1.15479 10.0549 1.15479 20.9959C1.15479 31.9369 10.0588 40.8367 20.9998 40.8367C31.9408 40.8367 40.8448 31.9369 40.8448 20.9959C40.8448 10.0549 31.9408 1.15088 20.9998 1.15088ZM25.771 22.9447L28.5258 31.4287L21.3064 26.1871C21.2178 26.1199 21.1086 26.0863 20.9998 26.0863C20.891 26.0863 20.7814 26.1199 20.6928 26.1871L13.4734 31.4287L16.2282 22.9447C16.2996 22.7305 16.224 22.4911 16.0396 22.3567L8.81979 17.1151H17.7448C17.9716 17.1151 18.1728 16.9681 18.2446 16.7497L20.9998 8.26568L23.755 16.7497C23.8268 16.9681 24.028 17.1151 24.2548 17.1151H33.1798L25.96 22.3567C25.7756 22.4911 25.6996 22.7305 25.771 22.9447Z" fill="#E1C025"/>
                            </svg>
                          </div>
                          <div className="title-item"><h3>Temas</h3></div>
                        </div>
                        <div className="item-body">
                          <p>Seleccionar páginas web clasificadas por temáticas</p>
                        </div>
                      </div>
                      <div key="ubicacion" className="grafico-slide">
                        <div className="item-header">
                          <div className="icon-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                              <path d="M36.0021 9.1324C35.1261 7.48382 33.8472 6.08367 32.2846 5.06225C30.7219 4.04083 28.9262 3.43134 27.0646 3.29053C26.7153 3.29053 26.374 3.29053 26.0246 3.29053C25.6753 3.29053 25.3259 3.29053 24.9846 3.29053C23.1231 3.42754 21.3267 4.03459 19.7636 5.05487C18.2005 6.07514 16.9218 7.47528 16.0471 9.12428C15.125 10.8008 14.638 12.6819 14.6309 14.5953C14.6238 16.5088 15.0968 18.3934 16.0065 20.0768L22.6121 32.3293L22.6853 32.4837L26.0003 38.6668L29.3559 32.4999C29.3559 32.4593 29.3559 32.4187 29.4128 32.3862L36.0346 20.1174C36.9506 18.4305 37.4277 16.5403 37.422 14.6207C37.4163 12.7012 36.9281 10.8139 36.0021 9.1324ZM26.0003 21.0437C24.8959 21.0679 23.8093 20.7624 22.8793 20.1663C21.9493 19.5702 21.2181 18.7105 20.7789 17.6969C20.3398 16.6832 20.2127 15.5618 20.4138 14.4756C20.6149 13.3894 21.1352 12.3878 21.9082 11.5986C22.6811 10.8095 23.6718 10.2686 24.7535 10.045C25.8353 9.82143 26.9592 9.9253 27.9817 10.3434C29.0042 10.7614 29.8789 11.4747 30.4941 12.3922C31.1094 13.3096 31.4372 14.3896 31.4359 15.4943C31.4489 16.9504 30.884 18.3522 29.8651 19.3925C28.8462 20.4327 27.4563 21.0265 26.0003 21.0437Z" fill="#E1C025"/>
                              <path d="M45.3783 41.1206C45.3783 44.8093 37.5946 48.7499 26.0002 48.7499C14.4058 48.7499 6.62207 44.8093 6.62207 41.1206C6.62207 37.6999 12.9514 34.5637 21.4258 33.7268C21.4258 33.7268 25.6996 41.2749 26.0002 41.2749C26.3008 41.2749 30.5746 33.7268 30.5746 33.7268C39.0489 34.5637 45.3783 37.6999 45.3783 41.1206Z" fill="#E1C025"/>
                            </svg>
                          </div>
                          <div className="title-item"><h3>Ubicación/Emplazamientos</h3></div>
                        </div>
                        <div className="item-body">
                          <p>Seleccionar páginas web clasificadas por ubicación</p>
                        </div>
                      </div>
                      <div key="demografia" className="grafico-slide">
                        <div className="item-header">
                          <div className="icon-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 63 63" fill="none">
                              <path d="M39.2175 36.0608C37.6338 35.1958 35.8177 34.7048 33.8871 34.7048H29.2987C27.3139 34.7048 25.451 35.2241 23.8378 36.1334C20.4454 38.0431 18.1543 41.6791 18.1543 45.8492V49.2871H45.0314V45.8492C45.0314 41.625 42.6812 37.9508 39.2175 36.0608Z" fill="#E1C025"/>
                              <path d="M51.8888 31.6506H48.0743C45.8472 31.6506 43.7714 32.3089 42.0303 33.4434C42.867 33.9922 43.6533 34.6333 44.378 35.358C47.1798 38.1598 48.7228 41.8857 48.7228 45.849V47.4658H62.9999V42.7618C62.9999 36.6353 58.0153 31.6506 51.8888 31.6506Z" fill="#E1C025"/>
                              <path d="M14.9256 31.6506H11.1111C4.98463 31.6506 0 36.6353 0 42.7618V47.4658H14.4629V45.849C14.4629 41.8857 16.0072 38.1598 18.8089 35.358C19.5066 34.6604 20.2609 34.0402 21.0632 33.505C19.3036 32.3335 17.1933 31.6506 14.9256 31.6506Z" fill="#E1C025"/>
                              <path d="M49.9759 14.9399C49.9564 14.9399 49.9361 14.9401 49.9164 14.9403C45.7872 14.9744 42.457 18.5434 42.493 22.8959C42.5288 27.2278 45.8848 30.7281 49.9873 30.7281C50.0069 30.7281 50.0271 30.728 50.0468 30.7277C52.0715 30.711 53.9609 29.858 55.3671 28.3257C56.7406 26.829 57.4875 24.8568 57.4704 22.7721C57.4345 18.4403 54.0786 14.9399 49.9759 14.9399Z" fill="#E1C025"/>
                              <path d="M13.0126 14.9399C12.993 14.9399 12.9727 14.9401 12.953 14.9403C8.8238 14.9744 5.49366 18.5434 5.52958 22.8959C5.56527 27.2278 8.92137 30.7281 13.0239 30.7281C13.0436 30.7281 13.0637 30.728 13.0834 30.7277C15.108 30.711 16.9976 29.858 18.4037 28.3257C19.7773 26.829 20.5242 24.8568 20.507 22.7721C20.4712 18.4403 17.1152 14.9399 13.0126 14.9399Z" fill="#E1C025"/>
                              <path d="M31.5934 13.7129C26.8327 13.7129 22.9604 17.8042 22.9604 22.8344C22.9604 26.4692 24.9833 29.6142 27.9032 31.0785C29.023 31.6408 30.2744 31.9546 31.5934 31.9546C32.9125 31.9546 34.1639 31.6408 35.2836 31.0785C38.2035 29.6142 40.2264 26.4692 40.2264 22.8344C40.2264 17.8042 36.3541 13.7129 31.5934 13.7129Z" fill="#E1C025"/>
                            </svg>
                          </div>
                          <div className="title-item"><h3>Demografía</h3></div>
                        </div>
                        <div className="item-body">
                          <p>Se orientan los anuncios a públicos determinados según datos tales como edad, sexo o estado civil.</p>
                        </div>
                      </div>
                      <div key="interes" className="grafico-slide">
                        <div className="item-header">
                          <div className="icon-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="48" viewBox="0 0 52 48" fill="none">
                              <g clipPath="url(#clip0_2310_223)">
                                <path d="M1.30008 7.19995H6.49998C7.21806 7.19995 7.80006 7.73718 7.80006 8.40002V27.5997C7.80006 28.2625 7.21806 28.7997 6.49998 28.7997H1.30008C0.581999 28.7997 0 28.2625 0 27.5997V8.40002C0 7.73718 0.581999 7.19995 1.30008 7.19995Z" fill="#E1C025"/>
                                <path d="M31.1999 22.7999V12C31.1972 9.35007 28.8707 7.20262 26 7.20006H23.3963C23.3507 3.09008 22.8349 0 16.8999 0C16.1822 0 15.5998 0.53723 15.5998 1.20007C15.5998 7.40074 13.6392 9.20213 10.3999 9.53281V27.5998C13.0001 27.5998 13.0001 28.7999 15.5998 28.7999H24.6999C28.2883 28.7962 31.196 26.1122 31.1999 22.7999Z" fill="#E1C025"/>
                                <path d="M45.4998 19.2H50.6997C51.4178 19.2 51.9998 19.7372 51.9998 20.4V39.5997C51.9998 40.2625 51.4178 40.7997 50.6997 40.7997H45.4998C44.7821 40.7997 44.1997 40.2625 44.1997 39.5997V20.4C44.1997 19.7372 44.7817 19.2 45.4998 19.2Z" fill="#E1C025"/>
                                <path d="M33.7998 19.2V22.7998C33.7938 27.4367 29.723 31.1944 24.6996 31.1999H20.7998V35.9998C20.8026 38.6497 23.129 40.7972 25.9997 40.8001H28.6034C28.6491 44.9097 29.1648 47.9998 35.0998 47.9998C35.8175 47.9998 36.3999 47.4626 36.3999 46.7997C36.3999 40.5991 38.3606 38.7977 41.5998 38.4674V20.4C38.9997 20.4 38.9997 19.2 36.3999 19.2H33.7998Z" fill="#E1C025"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_2310_223">
                                  <rect width="52" height="48" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div className="title-item"><h3>Interés</h3></div>
                        </div>
                        <div className="item-body">
                          <p>Se orientan los anuncios a públicos determinados según sus intereses, cookies y comportamientos</p>
                        </div>
                      </div>
                      <div key="remarketing" className="grafico-slide">
                        <div className="item-header">
                          <div className="icon-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M19.545 41.7089L24.7464 48.4689C25.2185 49.0825 25.1357 49.9511 24.5623 50.4713L22.7736 52.0946C22.4541 52.3845 22.0696 52.5134 21.64 52.4746C21.2105 52.4358 20.8567 52.239 20.593 51.8977L14.8264 44.4331L19.545 41.7089ZM48.0776 24.3601H53.3749C54.2223 24.3601 54.9079 23.6681 54.9062 22.8218C54.9044 21.9745 54.2135 21.2898 53.3673 21.2898H48.0699C47.2226 21.2898 46.5369 21.9818 46.5387 22.828C46.5403 23.6755 47.2312 24.3601 48.0776 24.3601ZM41.7897 10.4124L44.4385 5.82475C44.8616 5.09182 44.6142 4.1512 43.8812 3.72595C43.1493 3.30135 42.2071 3.54909 41.7835 4.28289L39.1347 8.87051C38.7116 9.60343 38.959 10.5441 39.692 10.9693C40.424 11.3939 41.366 11.1462 41.7897 10.4124ZM47.9187 15.9076L52.2677 13.3967C53.006 12.9704 53.2589 12.0266 52.8327 11.2882C52.4064 10.55 51.4626 10.2971 50.7242 10.7233L46.3753 13.2344C45.637 13.6606 45.3841 14.6044 45.8103 15.3428C46.2366 16.0809 47.1804 16.3338 47.9187 15.9076ZM41.0786 22.8166L46.2083 31.7016C47.1714 33.3696 46.5945 35.5225 44.9264 36.4856C43.3698 37.3844 41.3912 36.9419 40.351 35.5232H40.3508C34.6727 34.6595 27.2763 35.5873 19.9216 38.4544L12.851 26.2078C19.0136 21.2772 23.5292 15.3671 25.6204 10.0179L25.6205 10.0176C24.8859 8.4002 25.4893 6.44239 27.0581 5.53665C28.7263 4.57349 30.879 5.15045 31.8422 6.81853L36.9719 15.7035C37.1179 15.5906 37.2731 15.4862 37.4374 15.3913C39.4195 14.2469 41.9541 14.9261 43.0985 16.9083C44.2429 18.8905 43.5638 21.4251 41.5816 22.5695C41.4174 22.6643 41.2493 22.7466 41.0786 22.8166ZM18.1437 39.7499L10.7348 26.9174L4.84482 30.318C1.26585 32.3843 0.0283782 37.0031 2.09458 40.5819L2.09469 40.582C4.161 44.1609 8.77969 45.3985 12.3587 43.3323L18.2486 39.9317L18.1437 39.7499Z" fill="#E1C025"/>
                            </svg>
                          </div>
                          <div className="title-item"><h3>Remarketing</h3></div>
                        </div>
                        <div className="item-body">
                          <p>Muestra anuncios a públicos que han visitado anteriormente la página web, generando audiencias con distintos intereses con creatividades personalizadas.</p>
                        </div>
                      </div>
                      <div key="dispositivos" className="grafico-slide">
                        <div className="item-header">
                          <div className="icon-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 66 66" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M30.2821 47.8972L23.6621 59.3641H42.3386L35.7183 47.8972H30.2821Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M39.7294 21.9763L33.4231 25.6172C32.994 25.865 32.6291 26.1817 32.3336 26.545C32.3195 26.5647 32.3043 26.5837 32.2882 26.6018C31.4555 27.6654 31.2073 29.1106 31.6846 30.4109L37.5598 27.0188C37.8849 26.8312 38.2993 26.9425 38.4865 27.2671C38.674 27.5914 38.5631 28.0064 38.238 28.1935L32.3628 31.5858C33.5242 32.9781 35.5231 33.4179 37.1768 32.5888C37.1898 32.5818 37.2028 32.5752 37.2161 32.569C37.2727 32.54 37.3287 32.5095 37.3843 32.4773L40.5629 30.6419L40.5797 30.6322L44.0483 28.6292L40.088 21.7693L39.7559 21.961L39.7294 21.9763Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M38.6099 33.3352L44.3377 39.0633C44.5673 39.2919 44.8734 39.4182 45.2008 39.4182C45.5283 39.418 45.8343 39.2921 46.0628 39.0633C46.5386 38.5877 46.5385 37.8143 46.0628 37.3386L40.7971 32.0725L38.6099 33.3352Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M41.1802 20.947L45.307 28.095L57.0597 25.1378L54.9175 21.4281L54.9041 21.4061L54.8924 21.3841L49.6172 12.2478L41.1802 20.947Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M53.2856 15.8889L55.7403 20.1402L56.0985 19.9332C56.1929 19.8787 56.261 19.7893 56.2904 19.6818C56.3187 19.5742 56.3045 19.4629 56.2504 19.3682L54.2097 15.8333C54.1543 15.7387 54.0648 15.6708 53.9576 15.642C53.8507 15.6132 53.7386 15.6274 53.6444 15.6821L53.2856 15.8889Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M26.1611 15.8728V22.2868H28.1207C28.7354 22.2868 29.2368 21.9847 29.6125 21.3891C29.9847 20.7999 30.1977 19.9584 30.1977 19.0799C30.198 17.5354 29.5477 15.873 28.1205 15.873L26.1611 15.8728Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M20.0047 17.5706L19.3159 19.8832L20.6936 19.8831L20.0047 17.5706Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M9.83984 12.6868V25.4729H31.4669C31.8277 25.0749 32.2551 24.7253 32.7448 24.4425L38.7256 20.9897L38.7256 12.6868H9.83984ZM17.4963 23.6151C17.1372 23.508 16.9334 23.1305 17.0406 22.7714L19.3546 15.0011C19.4407 14.7137 19.7043 14.5166 20.0046 14.5166C20.305 14.5166 20.5698 14.7137 20.6546 15.0012L22.9699 22.7712C23.077 23.1305 22.8719 23.5082 22.5128 23.6151C22.1539 23.7216 21.7768 23.5177 21.6697 23.1587L21.0979 21.2397H18.9121L18.3406 23.1585C18.2524 23.4529 17.9826 23.6436 17.6907 23.6434C17.6261 23.6434 17.5611 23.6343 17.4963 23.6151ZM24.8043 22.9651L24.8044 15.1946C24.8044 14.8202 25.1082 14.5166 25.4826 14.5166L28.1206 14.5166C30.4792 14.5166 31.5542 16.882 31.5542 19.08C31.5544 21.2777 30.4791 23.6433 28.1206 23.6431H25.4827C25.1084 23.6431 24.8043 23.3397 24.8043 22.9651Z" fill="#E1C025" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M30.5733 26.8291H9.16155C8.7872 26.8291 8.48319 26.5258 8.48319 26.1512L8.48327 12.0084C8.48327 11.6338 8.78701 11.3302 9.16147 11.3302L39.4039 11.3301C39.7785 11.3301 40.0821 11.6339 40.0821 12.0085L40.0822 20.1303L49.2684 10.6585C49.4168 10.5056 49.6276 10.4314 49.8383 10.4577C50.0492 10.4836 50.2363 10.6075 50.3423 10.7917L52.6072 14.7142L52.9661 14.5069C53.3747 14.2711 53.8515 14.209 54.3084 14.3316C54.7665 14.4542 55.148 14.7468 55.3836 15.1552L57.4245 18.6898C57.6611 19.0983 57.7234 19.5753 57.5997 20.0329C57.4775 20.4904 57.1852 20.8724 56.7766 21.1082L56.4185 21.3149L58.6833 25.2373C58.7893 25.4214 58.8032 25.6451 58.7207 25.8409C58.6371 26.0367 58.4676 26.1824 58.2615 26.2344L45.2316 29.5126L42.0131 31.3707L47.0229 36.3794C48.0263 37.3838 48.0261 39.0182 47.0228 40.0227C46.5378 40.5077 45.8899 40.7748 45.2011 40.7747C44.5112 40.7747 43.8645 40.5077 43.3794 40.0227L37.3521 33.9948C36.7221 34.2435 36.0642 34.3635 35.4121 34.3634C33.5739 34.3634 31.7826 33.4099 30.7982 31.706C29.9051 30.158 29.8808 28.3427 30.5733 26.8291ZM4.7373 9.74858L4.73738 43.4285C4.73738 45.1449 6.13277 46.5411 7.84964 46.5411L29.8816 46.541C29.8883 46.5409 29.895 46.5409 29.9018 46.541H36.1004H36.1162L58.151 46.5409C59.8665 46.5409 61.2631 45.1449 61.2631 43.4287V9.74835C61.2631 8.03225 59.8665 6.63614 58.1508 6.63614L7.84986 6.63599C6.13296 6.63599 4.7373 8.03236 4.7373 9.74858ZM8.57858 32.5022L27.9699 32.5021C28.3442 32.5021 28.648 32.8058 28.648 33.1805C28.6481 33.555 28.3441 33.8586 27.9699 33.8586H8.57869C8.20431 33.8586 7.9003 33.5551 7.9003 33.1805C7.90041 32.8057 8.20408 32.5022 8.57858 32.5022ZM9.16147 39.5315L37.3007 39.5313C37.6764 39.5313 37.979 39.8351 37.979 40.2097C37.979 40.5842 37.6764 40.888 37.3007 40.8878H9.16155C8.7872 40.8878 8.48319 40.5844 8.48319 40.2097C8.48327 39.8349 8.78701 39.5315 9.16147 39.5315Z" fill="#E1C025" />
                            </svg>
                          </div>
                          <div className="title-item"><h3>Dispositivos</h3></div>
                        </div>
                        <div className="item-body">
                          <p>Muestra los anuncios a personas interesadas en productos /servicios relacionados a su historial de navegación.</p>
                        </div>
                      </div>
                      <div key="keywords" className="grafico-slide">
                        <div className="item-header">
                          <div className="icon-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="#E1C025">
                              <g clipPath="url(#clip0_2310_245)">
                                <path d="M11.1719 26.6406C11.1723 27.7801 11.6251 28.8728 12.4309 29.6785C13.2366 30.4843 14.3293 30.9371 15.4687 30.9375H50.5312C51.2091 29.6066 51.5625 28.1342 51.5625 26.6406C51.5625 25.147 51.2091 23.6746 50.5312 22.3438H15.4687C14.3293 22.3442 13.2366 22.797 12.4309 23.6027C11.6251 24.4085 11.1723 25.5011 11.1719 26.6406ZM43.218 25.532C43.1373 25.452 43.0732 25.3569 43.0294 25.252C42.9856 25.1472 42.963 25.0348 42.9627 24.9211C42.9625 24.8075 42.9847 24.695 43.0281 24.59C43.0715 24.485 43.1351 24.3896 43.2155 24.3092C43.2958 24.2289 43.3912 24.1652 43.4962 24.1218C43.6012 24.0785 43.7138 24.0563 43.8274 24.0565C43.941 24.0567 44.0535 24.0794 44.1583 24.1232C44.2631 24.167 44.3583 24.2311 44.4383 24.3117L45.5469 25.4289L46.6555 24.3117C46.7355 24.2311 46.8306 24.167 46.9355 24.1232C47.0403 24.0794 47.1527 24.0567 47.2664 24.0565C47.38 24.0563 47.4925 24.0785 47.5975 24.1218C47.7025 24.1652 47.7979 24.2289 47.8783 24.3092C47.9586 24.3896 48.0223 24.485 48.0657 24.59C48.109 24.695 48.1312 24.8075 48.131 24.9211C48.1308 25.0348 48.1081 25.1472 48.0643 25.252C48.0205 25.3569 47.9564 25.452 47.8758 25.532L46.7586 26.6406L47.8758 27.7492C48.0368 27.9115 48.1271 28.1308 48.1271 28.3594C48.1271 28.588 48.0368 28.8073 47.8758 28.9695C47.7129 29.1293 47.4938 29.2188 47.2656 29.2188C47.0375 29.2188 46.8184 29.1293 46.6555 28.9695L45.5469 27.8523L44.4383 28.9695C44.2754 29.1293 44.0563 29.2188 43.8281 29.2188C43.6 29.2188 43.3809 29.1293 43.218 28.9695C43.057 28.8073 42.9666 28.588 42.9666 28.3594C42.9666 28.1308 43.057 27.9115 43.218 27.7492L44.3352 26.6406L43.218 25.532ZM36.343 25.532C36.2623 25.452 36.1982 25.3569 36.1544 25.252C36.1106 25.1472 36.088 25.0348 36.0877 24.9211C36.0875 24.8075 36.1097 24.695 36.1531 24.59C36.1965 24.485 36.2601 24.3896 36.3405 24.3092C36.4208 24.2289 36.5162 24.1652 36.6212 24.1218C36.7262 24.0785 36.8388 24.0563 36.9524 24.0565C37.066 24.0567 37.1785 24.0794 37.2833 24.1232C37.3881 24.167 37.4833 24.2311 37.5633 24.3117L38.6719 25.4289L39.7805 24.3117C39.8605 24.2311 39.9556 24.167 40.0605 24.1232C40.1653 24.0794 40.2777 24.0567 40.3914 24.0565C40.505 24.0563 40.6175 24.0785 40.7225 24.1218C40.8275 24.1652 40.9229 24.2289 41.0033 24.3092C41.0836 24.3896 41.1473 24.485 41.1907 24.59C41.234 24.695 41.2562 24.8075 41.256 24.9211C41.2558 25.0348 41.2331 25.1472 41.1893 25.252C41.1455 25.3569 41.0814 25.452 41.0008 25.532L39.8836 26.6406L41.0008 27.7492C41.1618 27.9115 41.2521 28.1308 41.2521 28.3594C41.2521 28.588 41.1618 28.8073 41.0008 28.9695C40.8379 29.1293 40.6188 29.2188 40.3906 29.2188C40.1625 29.2188 39.9434 29.1293 39.7805 28.9695L38.6719 27.8523L37.5633 28.9695C37.4004 29.1293 37.1813 29.2188 36.9531 29.2188C36.725 29.2188 36.5059 29.1293 36.343 28.9695C36.182 28.8073 36.0916 28.588 36.0916 28.3594C36.0916 28.1308 36.182 27.9115 36.343 27.7492L37.4602 26.6406L36.343 25.532ZM29.468 25.532C29.3873 25.452 29.3232 25.3569 29.2794 25.252C29.2356 25.1472 29.213 25.0348 29.2127 24.9211C29.2125 24.8075 29.2347 24.695 29.2781 24.59C29.3215 24.485 29.3851 24.3896 29.4655 24.3092C29.5458 24.2289 29.6412 24.1652 29.7462 24.1218C29.8512 24.0785 29.9638 24.0563 30.0774 24.0565C30.191 24.0567 30.3035 24.0794 30.4083 24.1232C30.5131 24.167 30.6083 24.2311 30.6883 24.3117L31.7969 25.4289L32.9055 24.3117C32.9855 24.2311 33.0806 24.167 33.1855 24.1232C33.2903 24.0794 33.4027 24.0567 33.5164 24.0565C33.63 24.0563 33.7425 24.0785 33.8475 24.1218C33.9525 24.1652 34.0479 24.2289 34.1283 24.3092C34.2086 24.3896 34.2723 24.485 34.3157 24.59C34.359 24.695 34.3812 24.8075 34.381 24.9211C34.3808 25.0348 34.3581 25.1472 34.3143 25.252C34.2705 25.3569 34.2064 25.452 34.1258 25.532L33.0086 26.6406L34.1258 27.7492C34.2868 27.9115 34.3771 28.1308 34.3771 28.3594C34.3771 28.588 34.2868 28.8073 34.1258 28.9695C33.9629 29.1293 33.7438 29.2188 33.5156 29.2188C33.2875 29.2188 33.0684 29.1293 32.9055 28.9695L31.7969 27.8523L30.6883 28.9695C30.5254 29.1293 30.3063 29.2188 30.0781 29.2188C29.85 29.2188 29.6309 29.1293 29.468 28.9695C29.307 28.8073 29.2166 28.588 29.2166 28.3594C29.2166 28.1308 29.307 27.9115 29.468 27.7492L30.5852 26.6406L29.468 25.532ZM22.593 25.532C22.5123 25.452 22.4482 25.3569 22.4044 25.252C22.3606 25.1472 22.338 25.0348 22.3377 24.9211C22.3375 24.8075 22.3597 24.695 22.4031 24.59C22.4465 24.485 22.5101 24.3896 22.5905 24.3092C22.6708 24.2289 22.7662 24.1652 22.8712 24.1218C22.9762 24.0785 23.0888 24.0563 23.2024 24.0565C23.316 24.0567 23.4285 24.0794 23.5333 24.1232C23.6381 24.167 23.7333 24.2311 23.8133 24.3117L24.9219 25.4289L26.0305 24.3117C26.1105 24.2311 26.2056 24.167 26.3105 24.1232C26.4153 24.0794 26.5277 24.0567 26.6414 24.0565C26.755 24.0563 26.8675 24.0785 26.9725 24.1218C27.0775 24.1652 27.1729 24.2289 27.2533 24.3092C27.3336 24.3896 27.3973 24.485 27.4407 24.59C27.484 24.695 27.5062 24.8075 27.506 24.9211C27.5058 25.0348 27.4831 25.1472 27.4393 25.252C27.3955 25.3569 27.3314 25.452 27.2508 25.532L26.1336 26.6406L27.2508 27.7492C27.4118 27.9115 27.5021 28.1308 27.5021 28.3594C27.5021 28.588 27.4118 28.8073 27.2508 28.9695C27.0879 29.1293 26.8688 29.2188 26.6406 29.2188C26.4125 29.2188 26.1934 29.1293 26.0305 28.9695L24.9219 27.8523L23.8133 28.9695C23.6504 29.1293 23.4313 29.2188 23.2031 29.2188C22.975 29.2188 22.7559 29.1293 22.593 28.9695C22.432 28.8073 22.3416 28.588 22.3416 28.3594C22.3416 28.1308 22.432 27.9115 22.593 27.7492L23.7102 26.6406L22.593 25.532ZM16.9383 24.3117L18.0469 25.4289L19.1555 24.3117C19.2355 24.2311 19.3306 24.167 19.4355 24.1232C19.5403 24.0794 19.6527 24.0567 19.7664 24.0565C19.88 24.0563 19.9925 24.0785 20.0975 24.1218C20.2025 24.1652 20.2979 24.2289 20.3783 24.3092C20.4586 24.3896 20.5223 24.485 20.5657 24.59C20.609 24.695 20.6312 24.8075 20.631 24.9211C20.6308 25.0348 20.6081 25.1472 20.5643 25.252C20.5205 25.3569 20.4564 25.452 20.3758 25.532L19.2586 26.6406L20.3758 27.7492C20.5368 27.9115 20.6271 28.1308 20.6271 28.3594C20.6271 28.588 20.5368 28.8073 20.3758 28.9695C20.2129 29.1293 19.9938 29.2188 19.7656 29.2188C19.5375 29.2188 19.3184 29.1293 19.1555 28.9695L18.0469 27.8523L16.9383 28.9695C16.7754 29.1293 16.5563 29.2188 16.3281 29.2188C16.1 29.2188 15.8809 29.1293 15.718 28.9695C15.557 28.8073 15.4666 28.588 15.4666 28.3594C15.4666 28.1308 15.557 27.9115 15.718 27.7492L16.8352 26.6406L15.718 25.532C15.6373 25.452 15.5732 25.3569 15.5294 25.252C15.4856 25.1472 15.463 25.0348 15.4627 24.9211C15.4625 24.8075 15.4847 24.695 15.5281 24.59C15.5715 24.485 15.6351 24.3896 15.7155 24.3092C15.7958 24.2289 15.8912 24.1652 15.9962 24.1218C16.1012 24.0785 16.2138 24.0563 16.3274 24.0565C16.441 24.0567 16.5535 24.0794 16.6583 24.1232C16.7631 24.167 16.8583 24.2311 16.9383 24.3117Z" fill="#E1C025"/>
                                <path d="M19.0008 7.34766C19.0703 7.20447 19.1792 7.08401 19.3146 7.00032C19.45 6.91664 19.6064 6.87317 19.7656 6.875H42.9688V3.4375C42.9689 2.98605 42.8801 2.53899 42.7073 2.12188C42.5346 1.70476 42.2814 1.32576 41.9622 1.00654C41.643 0.687309 41.264 0.43411 40.8469 0.261404C40.4298 0.088699 39.9827 -0.000127453 39.5312 1.37257e-07H3.4375C2.98605 -0.000127453 2.53899 0.088699 2.12188 0.261404C1.70476 0.43411 1.32576 0.687309 1.00654 1.00654C0.687309 1.32576 0.43411 1.70476 0.261404 2.12188C0.088699 2.53899 -0.000127453 2.98605 1.37257e-07 3.4375V10.3125H17.5141L19.0008 7.34766ZM28.3594 2.57813H39.5312C39.7592 2.57813 39.9778 2.66867 40.1389 2.82983C40.3001 2.99099 40.3906 3.20958 40.3906 3.4375C40.3906 3.66542 40.3001 3.88401 40.1389 4.04517C39.9778 4.20633 39.7592 4.29688 39.5312 4.29688H28.3594C28.1315 4.29688 27.9129 4.20633 27.7517 4.04517C27.5905 3.88401 27.5 3.66542 27.5 3.4375C27.5 3.20958 27.5905 2.99099 27.7517 2.82983C27.9129 2.66867 28.1315 2.57813 28.3594 2.57813ZM5.56016 8.59375H3.4375C3.20958 8.59375 2.99099 8.50321 2.82983 8.34204C2.66867 8.18088 2.57813 7.9623 2.57813 7.73438C2.57813 7.50645 2.66867 7.28787 2.82983 7.12671C2.99099 6.96554 3.20958 6.875 3.4375 6.875H5.56016C5.78808 6.875 6.00666 6.96554 6.16783 7.12671C6.32899 7.28787 6.41953 7.50645 6.41953 7.73438C6.41953 7.9623 6.32899 8.18088 6.16783 8.34204C6.00666 8.50321 5.78808 8.59375 5.56016 8.59375ZM10.7164 8.59375H8.59375C8.36583 8.59375 8.14724 8.50321 7.98608 8.34204C7.82492 8.18088 7.73438 7.9623 7.73438 7.73438C7.73438 7.50645 7.82492 7.28787 7.98608 7.12671C8.14724 6.96554 8.36583 6.875 8.59375 6.875H10.7164C10.9443 6.875 11.1629 6.96554 11.3241 7.12671C11.4852 7.28787 11.5758 7.50645 11.5758 7.73438C11.5758 7.9623 11.4852 8.18088 11.3241 8.34204C11.1629 8.50321 10.9443 8.59375 10.7164 8.59375ZM15.8727 8.59375H13.75C13.5221 8.59375 13.3035 8.50321 13.1423 8.34204C12.9812 8.18088 12.8906 7.9623 12.8906 7.73438C12.8906 7.50645 12.9812 7.28787 13.1423 7.12671C13.3035 6.96554 13.5221 6.875 13.75 6.875H15.8727C16.1006 6.875 16.3192 6.96554 16.4803 7.12671C16.6415 7.28787 16.732 7.50645 16.732 7.73438C16.732 7.9623 16.6415 8.18088 16.4803 8.34204C16.3192 8.50321 16.1006 8.59375 15.8727 8.59375Z" fill="#E1C025"/>
                                <path d="M28.8062 32.6562H15.4688C14.6122 32.6554 13.7657 32.4718 12.9858 32.1178C12.2059 31.7638 11.5105 31.2474 10.946 30.6032C10.3815 29.959 9.96094 29.2018 9.7124 28.3821C9.46385 27.5625 9.39304 26.6992 9.50469 25.85C9.72909 24.3809 10.4774 23.0426 11.6116 22.0822C12.7457 21.1219 14.189 20.6043 15.675 20.625H28.8062C29.9635 18.0658 31.8337 15.8942 34.193 14.3701C36.5522 12.8461 39.3007 12.034 42.1094 12.0312C42.4016 12.0312 42.6852 12.0398 42.9688 12.057V8.59375H20.2984L18.8117 11.5586C18.7421 11.7018 18.6333 11.8222 18.4979 11.9059C18.3625 11.9896 18.2061 12.0331 18.0469 12.0312H1.27709e-07V40.3906C-0.000122944 40.8421 0.0887066 41.2891 0.261414 41.7062C0.434121 42.1234 0.68732 42.5024 1.00655 42.8216C1.32577 43.1408 1.70477 43.394 2.12188 43.5667C2.53899 43.7394 2.98605 43.8282 3.4375 43.8281H36.9531V40.3133C33.3358 38.9322 30.4087 36.1811 28.8062 32.6562Z" fill="#E1C025"/>
                                <path d="M38.6719 40.8462V43.8282H45.5469V40.8462C43.2872 41.3876 40.9316 41.3876 38.6719 40.8462Z" fill="#E1C025"/>
                                <path d="M39.5312 52.4219C39.5312 53.1056 39.8029 53.7614 40.2864 54.2449C40.7699 54.7284 41.4256 55 42.1094 55C42.7931 55 43.4489 54.7284 43.9324 54.2449C44.4159 53.7614 44.6875 53.1056 44.6875 52.4219V45.5469H39.5312V52.4219Z" fill="#E1C025"/>
                                <path d="M42.1092 13.75C39.7641 13.7513 37.4638 14.3922 35.4559 15.6036C33.448 16.815 31.8085 18.5511 30.7139 20.625H32.699C33.9997 18.5889 35.9256 17.0295 38.1877 16.1807C40.4497 15.3319 42.926 15.2395 45.2451 15.9173C47.5641 16.5951 49.6009 18.0066 51.0498 19.94C52.4987 21.8734 53.2816 24.2246 53.2811 26.6406C53.2848 28.5665 52.784 30.4598 51.8287 32.132C51.8057 32.1909 51.7738 32.246 51.7342 32.2953C50.7681 33.9439 49.3949 35.3167 47.7461 36.2824C46.0973 37.2481 44.2282 37.7743 42.3178 37.8105C40.4073 37.8467 38.5196 37.3918 36.8354 36.4893C35.1512 35.5868 33.7269 34.267 32.699 32.6562H30.7139C31.7799 34.6753 33.3631 36.3749 35.3016 37.5812C37.24 38.7875 39.4641 39.4572 41.7464 39.5219C44.0286 39.5865 46.2871 39.0438 48.2907 37.9491C50.2943 36.8544 51.9712 35.2472 53.1498 33.2917C54.3284 31.3363 54.9664 29.1029 54.9985 26.82C55.0307 24.537 54.4558 22.2865 53.3327 20.2987C52.2096 18.3108 50.5787 16.657 48.6066 15.5064C46.6346 14.3558 44.3923 13.7496 42.1092 13.75Z" fill="#E1C025"/>
                                <path d="M42.1096 36.0938C43.504 36.0944 44.8812 35.7865 46.1426 35.1922C47.4041 34.5979 48.5184 33.7319 49.4057 32.6562H34.8135C35.7012 33.7315 36.8155 34.5972 38.0769 35.1914C39.3382 35.7857 40.7153 36.0938 42.1096 36.0938Z" fill="#E1C025"/>
                                <path d="M42.1096 17.1875C40.7153 17.1874 39.3382 17.4956 38.0769 18.0898C36.8155 18.6841 35.7012 19.5498 34.8135 20.625H49.4057C48.5184 19.5494 47.4041 18.6833 46.1426 18.089C44.8812 17.4947 43.504 17.1869 42.1096 17.1875Z" fill="#E1C025"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_2310_245">
                                  <rect width="55" height="55" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div className="title-item"><h3>Keywords</h3></div>
                        </div>
                        <div className="item-body">
                          <p>Activar anuncios contextualmente en base al contenido del sitio web que coincida con las palabras claves que se asignan a la campaña.</p>
                        </div>
                      </div>
                    </AutoSlider>
                  </div>
                </motion.div>
              )}

              {activeTab === "video" && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="tab-content"
                >
                  <div className="container grid-tab bg-white">
                    <img src={`${base}assets/estrategia/google-ads/videos.webp`} alt="Anuncios Gráficos Google Ads" />
                    <div className="text-container">
                      <h3>
                        <strong>Anuncios de video </strong> 
                        en YouTube y otros soportes digitales.
                      </h3>
                      <p>
                        Son campañas específicas que centran su soporte publicitario en anuncios de vídeo. Gracias este recurso se puede dar más información que en imágenes estáticas y el impacto suele ser mayor. Los anuncios se activan en la previsualización de los videos de Youtube y en los sitios web de partners de vídeo.
                      </p>
                    </div>
                  </div>
                  <div className="container">
                    <AutoSlider 
                      isActive={activeTab === "video"}
                      slideSelector=".video-slide"
                      containerClass="videos-slider-container"
                      sliderClass="videos-slider"
                      infinite={false}
                    >
                      <div key="instream" className="video-slide">
                        <div className="item-header">
                          <div className="title-item"><h3>Anuncios <strong>In-stream</strong></h3></div>
                          <div className="img-header">
                            <img src={`${base}assets/estrategia/google-ads/instream.webp`} alt="InStream" />
                          </div>
                        </div>
                        <div className="item-body">
                          <p>
                            Se publican durante otros videos en YouTube, antes o después de ellos, o bien en sitios, juegos o aplicaciones de la Red de Display.
                          </p>
                        </div>
                      </div>
                      <div key="instream-no-omitir" className="video-slide">
                        <div className="item-header">
                          <div className="title-item"><h3>Anuncios <strong>In-stream no se omiten</strong></h3></div>
                          <div className="img-header">
                            <img src={`${base}assets/estrategia/google-ads/instream-2.webp`} alt="InStream" />
                          </div>
                        </div>
                        <div className="item-body">
                          <p>
                            Los anuncios que no se pueden omitir están diseñados para ayudarlo a llegar a los clientes con su mensaje completo. Estos anuncios duran 15 segundos o menos y los espectadores no pueden omitirlos.
                          </p>
                        </div>
                      </div>
                      <div key="video-discovery" className="video-slide">
                        <div className="item-header">
                          <div className="title-item"><h3>Anuncios <strong>Video discovery</strong></h3></div>
                          <div className="img-header">
                            <img src={`${base}assets/estrategia/google-ads/discovery.webp`} alt="InStream" />
                          </div>
                        </div>
                        <div className="item-body">
                          <p>
                            Solo se muestran en YouTube y llegan a las personas en los lugares en los que descubren contenido. Su aspecto varía según los tamaños y formatos de anuncio que admiten los publicadores de contenido.
                          </p>
                        </div>
                      </div>
                      <div key="outstream" className="video-slide">
                        <div className="item-header">
                          <div className="title-item"><h3>Anuncios <strong>Out-stream</strong></h3></div>
                          <div className="img-header">
                            <img src={`${base}assets/estrategia/google-ads/outstream.webp`} alt="InStream" />
                          </div>
                        </div>
                        <div className="item-body">
                          <p>
                            Se muestran en los sitios asociados. Estos anuncios solo están disponibles en dispositivos móviles y tablets y están diseñados para que los usuarios puedan presionar para reproducir su video con mayor facilidad.
                          </p>
                        </div>
                      </div>
                      <div key="bumpers" className="video-slide">
                        <div className="item-header">
                          <div className="title-item"><h3>Bumpers <strong>Publicitarios</strong></h3></div>
                          <div className="img-header">
                            <img src={`${base}assets/estrategia/google-ads/ads.webp`} alt="InStream" />
                          </div>
                        </div>
                        <div className="item-body">
                          <p>
                            Son un formato de anuncio de video corto diseñado para ayudarlo a llegar a una gran cantidad de clientes y aumentar el conocimiento de su marca a través de un mensaje breve y fácil de recordar.
                          </p>
                          <p>
                            Los bumpers publicitarios duran 6 segundos o menos, y los espectadores no pueden omitir el anuncio.
                          </p>
                        </div>
                      </div>
                    </AutoSlider>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="full-container black-bg">
        <div className="container">
          <div className="grid-paid-media-info-wrapper">
            <div className="grid-item-paid-media-info">
              <span>01</span>
              <h3 className="question-paid-media">PAID MEDIA & PERFORMANCE</h3>
              <p>Diseñamos y ejecutamos campañas de performance y branding en plataformas digitales como Meta Ads, Google Ads y LinkedIn. Cada acción responde a un objetivo claro: vender hoy y construir inteligencia para vender mejor mañana.</p>
            </div>
            <div className="grid-item-paid-media-info">
              <span>02</span>
              <h3 className="question-paid-media">PLANIFICACIÓN ESTRATÉGICA</h3>
              <p>Alineamos negocio, audiencias y KPIs desde el inicio. Definimos con precisión dónde estar, a quién impactar y con qué mensaje, evitando dispersiones y maximizando eficiencia publicitaria.</p>
            </div>
            <div className="grid-item-paid-media-info">
              <span>03</span>
              <h3 className="question-paid-media">ARQUITECTURA & EJECUCIÓN EN PLATAFORMAS</h3>
              <p>Construimos estructuras de cuentas sólidas, audiences hipersegmentadas y creativos diseñados para escalar resultados. Performance y posicionamiento trabajan juntos, no por separado.</p>
            </div>
            <div className="grid-item-paid-media-info">
              <span>04</span>
              <h3 className="question-paid-media">OPTIMIZACIÓN CONTINUA</h3>
              <p>Analizamos datos en tiempo real, testeamos variantes (A/B), ajustamos mensajes y redistribuimos inversión según rendimiento. Cada decisión se basa en evidencia, no en suposiciones.</p>
            </div>
            <div className="grid-item-paid-media-info">
              <span>05</span>
              <h3 className="question-paid-media">ANÁLISIS & APRENDIZAJE</h3>
              <p>Convertimos métricas en conocimiento accionable. Leemos patrones, entendemos comportamientos y adaptamos la estrategia para evolucionar junto al mercado, la audiencia y los objetivos del negocio.</p>
            </div>
          </div>
        </div>
      </div>

      <Inversiones />
      
      <Beneficios />

      <Contact form="estrategia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Estrategia;

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent, useSpring } from "framer-motion";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo.jsx";
import DisenioPortfolio from "../../components/portfolio/DisenioPortfolio.jsx";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
import Beneficios from "../../components/Beneficios.jsx";
import Testimonials from "../../components/Testimonials.jsx";

//styles
import "@as/hero.css";
import "../../assets/styles/design.css";
import "../../assets/styles/branding-video-carrusel.css";


const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

// Función para normalizar rutas de imágenes (similar a usePortfolioData)
const toPublic = (p = "") => {
  if (!p) return "";
  const ABS = /^(https?:|data:|blob:|mailto:|tel:)/i;
  if (ABS.test(p)) return p;
  let s = String(p).trim().replace(/^\/+/, "");
  const BASE_SEG = base.replace(/^\/|\/$/g, "");
  const STRIP = BASE_SEG ? new RegExp(`^(?:${BASE_SEG}\\/)+`, "i") : null;
  if (STRIP) s = s.replace(STRIP, "");
  return `${base}${s}`.replace(/\/{2,}/g, "/");
};

// Componente AnimatedLetter para animar letras individuales
const AnimatedLetter = ({ letter, index, letterDelay, baseOpacity, hasAnimated }) => {
  // Calcular el delay: si NO ha animado, aplicar delay progresivo para animar letra por letra
  // Si ya animó, no aplicar delay (todas las letras aparecen juntas)
  const delay = hasAnimated ? 0 : index * letterDelay;
  
  // Asegurar que cuando está visible, la opacidad sea 1
  // Si baseOpacity es >= 0.9, forzar a 1 para máxima visibilidad
  const targetOpacity = baseOpacity >= 0.9 ? 1 : Math.max(0.1, baseOpacity);

  return (
    <motion.span
      className="animated-letter"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: targetOpacity }}
      transition={{
        delay: delay,
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
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

// Componente de Carrusel de Branding con Scroll-Driven Pinning usando Framer Motion
const BrandingCarousel = () => {
  const [clientsData, setClientsData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Refs para la arquitectura de tres capas
  const sectionRef = useRef(null);
  const scrollSpacerRef = useRef(null);
  const pinnedRef = useRef(null);
  
  // Paso de scroll por slide (250-400px para scroll liviano)
  const SCROLL_STEP_PER_SLIDE = 300; // px por slide
  
  // Cargar datos de branding desde portfolio.json
  useEffect(() => {
    const loadClientsData = async () => {
      try {
        const response = await fetch(`${base}portfolio.json`);
        const data = await response.json();
        
        // Filtrar objetos de creatividad que tengan categoría "Branding"
        const creatividadData = data.creatividad || [];
        const brandingData = creatividadData.filter(item => {
          const categories = Array.isArray(item.category) ? item.category : [item.category];
          return categories.some(cat => cat && cat.toLowerCase() === 'branding');
        });

        // Procesar datos para incluir featured_image en la galería
        const processedData = brandingData.map(item => {
          const allImages = [];
          
          // Agregar featured_image si existe
          if (item.featured_image) {
            allImages.push(item.featured_image);
          }
          
          // Agregar imágenes de la galería
          if (Array.isArray(item.gallery) && item.gallery.length > 0) {
            allImages.push(...item.gallery);
          }
          
          return {
            id: item.id,
            name: item.title || item.name || 'Sin nombre',
            gallery: allImages.length > 0 ? allImages : [],
            category: item.category
          };
        }).filter(item => item.gallery.length > 0); // Solo incluir items con imágenes

        setClientsData(processedData);
      } catch (error) {
        console.error("Error loading branding data:", error);
      }
    };
    loadClientsData();
  }, []);

  // Calcular altura del scroll spacer dinámicamente
  const scrollSpacerHeight = clientsData.length > 0 
    ? clientsData.length * SCROLL_STEP_PER_SLIDE 
    : SCROLL_STEP_PER_SLIDE;

  if (clientsData.length === 0) {
    return (
      <div className="tab-content">
        <div className="full-container branding-tab-container">
          <div className="container">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <BrandingCarouselContent 
      sectionRef={sectionRef}
      scrollSpacerRef={scrollSpacerRef}
      pinnedRef={pinnedRef}
      clientsData={clientsData}
      scrollStep={SCROLL_STEP_PER_SLIDE}
      scrollSpacerHeight={scrollSpacerHeight}
      currentImageIndex={currentImageIndex}
      setCurrentImageIndex={setCurrentImageIndex}
    />
  );
};

// Componente interno con la lógica de scroll-driven usando Framer Motion
const BrandingCarouselContent = ({ 
  sectionRef,
  scrollSpacerRef, 
  pinnedRef, 
  clientsData, 
  scrollStep,
  scrollSpacerHeight,
  currentImageIndex,
  setCurrentImageIndex
}) => {
  // useScroll apuntando al scroll spacer - solo para avance entre slides
  const { scrollYProgress } = useScroll({
    target: scrollSpacerRef,
    offset: ["start start", "end end"],
    layoutEffect: false
  });

  // Mapear scrollYProgress a índice de slide (0 a clientsData.length - 1)
  // scrollYProgress solo controla el cambio de slides, NUNCA la visibilidad
  const slideIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(0, clientsData.length - 1)]
  );

  // Estado inicial: mostrar el primer slide (índice 0) - SIEMPRE VISIBLE
  const [currentClientIndex, setCurrentClientIndex] = useState(0);

  useEffect(() => {
    if (clientsData.length === 0) return;
    
    const unsubscribe = slideIndex.on("change", (latest) => {
      const newIndex = Math.round(Math.max(0, Math.min(latest, clientsData.length - 1)));
      if (newIndex !== currentClientIndex) {
        setCurrentClientIndex(newIndex);
        setCurrentImageIndex(0); // Resetear imagen al cambiar de cliente
      }
    });

    return () => unsubscribe();
  }, [slideIndex, clientsData.length, currentClientIndex, setCurrentImageIndex]);

  // Transformar scrollYProgress para controlar el pinning
  // Fase 1: entrada normal (progress = 0) → relative, visible
  // Fase 2: pinning activo (progress > 0 && < 1) → fixed a 10svh
  const pinnedPosition = useTransform(scrollYProgress, (progress) => {
    return progress > 0 && progress < 1 ? 'fixed' : 'relative';
  });
  
  const pinnedTop = useTransform(scrollYProgress, (progress) => {
    return progress > 0 && progress < 1 ? '10svh' : 'auto';
  });
  
  const pinnedZIndex = useTransform(scrollYProgress, (progress) => {
    return progress > 0 && progress < 1 ? 10 : 1;
  });

  // Obtener el cliente actual - SIEMPRE hay un cliente (el primero por defecto)
  const currentClient = clientsData[currentClientIndex] || clientsData[0];
  
  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    return toPublic(imagePath);
  };

  // SIEMPRE mostrar una imagen - visible desde el primer render
  // El primer slide corresponde a progreso 0 y está visible
  const currentImage = currentClient && currentClient.gallery && currentClient.gallery.length > 0
    ? getImagePath(currentClient.gallery[currentImageIndex] || currentClient.gallery[0])
    : null;

  return (
    <motion.div 
      ref={sectionRef}
      className="branding-section-wrapper"
    >
      {/* A) Scroll Spacer - Solo genera altura, NO visible, posicionado absolutamente */}
      <motion.div
        ref={scrollSpacerRef}
        className="branding-scroll-spacer"
        style={{ height: `${scrollSpacerHeight}px` }}
      />
      
      {/* B) Pinned Container - SIEMPRE visible desde el inicio, contiene tabs + slide */}
      {/* Visible desde el primer render, no depende de scrollYProgress para mostrarse */}
      <motion.div
        ref={pinnedRef}
        className="branding-pinned-container"
        style={{
          position: pinnedPosition,
          top: pinnedTop,
          zIndex: pinnedZIndex,
        }}
      >
        {/* Slide Content - Visible desde el primer render, sin ocultar */}
        <div className="branding-slide-content">
          <div className="full-container branding-tab-content">
            <div className="container branding-title-container">
              <span className="title-client">{currentClient?.name || ''}</span>
              <span className="category-client">Branding</span>
            </div>
            <div className="full-container img-tab-container">
              {currentImage ? (
                <motion.img
                  key={`${currentClientIndex}-${currentImageIndex}`}
                  src={currentImage}
                  alt={currentClient?.name || 'Branding'}
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    opacity: 1, 
                    display: 'block',
                    width: '100%',
                    height: 'auto'
                  }}
                  onError={(e) => {
                    console.error('Error loading image:', currentImage);
                  }}
                />
              ) : (
                <div className="no-image-message">
                  No hay imagen disponible
                </div>
              )}
            </div>
          </div>
          <div className="container">
            <span className="slide-counter">
              {clientsData.map((_, index) => (
                <span key={index} className={index === currentClientIndex ? 'active' : ''}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              ))}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OptimizedVideo = ({ src }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = React.useState(false);
  const [shouldLoad, setShouldLoad] = React.useState(false);

  // Usar Intersection Observer nativo para mejor rendimiento (más ligero que useInView)
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
          setIsInView(isVisible);
          
          // Cargar el video cuando está cerca de ser visible (25%)
          if (entry.intersectionRatio >= 0.25 && !shouldLoad) {
            setShouldLoad(true);
          }
        }
      },
      {
        threshold: [0.25, 0.5],
        rootMargin: "50px"
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  // Controlar la reproducción del video cuando alcanza scale 1 y está visible
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (isInView) {
      // Cuando está al 50% visible, reproducir con pequeño delay
      const timeoutId = setTimeout(() => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      }, 200);

      return () => clearTimeout(timeoutId);
    } else {
      // Cuando sale de vista, pausar
      if (!video.paused) {
        video.pause();
      }
    }
  }, [isInView, shouldLoad]);

  return (
    <motion.div 
      ref={containerRef} 
      className="optimized-video-container"
      initial={{ scale: 0.85 }}
      animate={{ 
        scale: isInView ? 1 : 0.85
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 18,
        mass: 0.8
      }}
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="optimized-video"
        />
      )}
    </motion.div>
  );
};

const EntregableItemsList = () => {
  const item1Ref = useRef(null);
  const item2Ref = useRef(null);
  const item3Ref = useRef(null);

  const items = [
    { number: 1, title: "Branding", ref: item1Ref, nextRef: item2Ref, isLast: false,
      children: <p>Creamos o renovamos tu identidad como un sistema de marca: logo, paleta, tipografías, recursos gráficos y reglas claras para que todo lo que comuniques se vea consistente, profesional y reconocible.</p>
    },
    { number: 2, title: "Material POP", ref: item2Ref, nextRef: item3Ref, isLast: false,
      children: <p>Diseño de piezas para punto de venta y acciones presenciales: cartelería, exhibidores, stoppers, folletos, packaging simple, señalética y materiales promocionales. POP que no adorna: atrae, guía y empuja a la decisión.</p>
    },
    { number: 3, title: "Gráfica y Publicidad", ref: item3Ref, nextRef: null, isLast: true,
      children: <p>Diseño para campañas y comunicación diaria: piezas para redes, anuncios, banners, vía pública, prensa, presentaciones y material comercial. Mensajes claros, buena jerarquía visual y estética alineada a la marca para que la idea se entienda en 3 segundos.</p>
    }
  ];

  return (
    <>
      {items.map((item) => (
        <EntregableItem
          key={item.number}
          number={item.number}
          title={item.title}
          itemRef={item.ref}
          nextItemRef={item.nextRef}
          isLast={item.isLast}
        >
          {item.children}
        </EntregableItem>
      ))}
    </>
  );
};

const EntregableItem = ({ number, title, children, isLast, itemRef, nextItemRef }) => {
  const isInView = useInView(itemRef, { once: false, amount: 0.1 });

  // Efecto para calcular la altura y posición de la línea
  const [lineHeight, setLineHeight] = React.useState(0);
  const [lineTop, setLineTop] = React.useState(0);

  React.useEffect(() => {
    if (isLast || !nextItemRef?.current || !itemRef.current) {
      setLineHeight(0);
      return;
    }

    const updateLineDimensions = () => {
      const currentRect = itemRef.current.getBoundingClientRect();
      const nextRect = nextItemRef.current.getBoundingClientRect();
      
      // El wrapper tiene padding-top: 15px
      // El número tiene height: 40px, así que el centro está a 15px (padding-top) + 20px (mitad del número) = 35px desde el top del wrapper
      const currentNumberCenterY = 35; // 15px padding-top + 20px (mitad de 40px)
      
      // Calcular la posición del siguiente wrapper relativa al actual
      // nextRect.top es la posición absoluta en el viewport
      // currentRect.top es la posición absoluta del wrapper actual
      // La diferencia nos da la posición relativa del siguiente wrapper
      const nextWrapperTopRelative = nextRect.top - currentRect.top;
      
      // Centro del número siguiente: desde el top del wrapper siguiente
      // Como ambos wrappers tienen la misma estructura, el centro del número siguiente también está a 35px desde el top de su wrapper
      const nextNumberCenterY = nextWrapperTopRelative + 35;
      
      // Altura de la línea: desde el centro del número actual hasta el centro del número siguiente
      const calculatedHeight = nextNumberCenterY - currentNumberCenterY;
      
      // Top de la línea: desde el centro del número actual
      const calculatedTop = currentNumberCenterY;
      
      setLineHeight(Math.max(0, calculatedHeight));
      setLineTop(calculatedTop);
    };

    updateLineDimensions();
    window.addEventListener('scroll', updateLineDimensions, { passive: true });
    window.addEventListener('resize', updateLineDimensions);

    return () => {
      window.removeEventListener('scroll', updateLineDimensions);
      window.removeEventListener('resize', updateLineDimensions);
    };
  }, [isLast, itemRef, nextItemRef]);

  return (
    <div ref={itemRef} className="design-entregable-item-wrapper">
      <div className="design-history-item">
        <div className="design-history-item-header">
          <motion.span
            className="design-entregable-number bg-yellow-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isInView ? 1 : 0,
              opacity: isInView ? 1 : 0
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            {number}
          </motion.span>
          <motion.h3
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isInView ? 1 : 0,
              opacity: isInView ? 1 : 0
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            {title}
          </motion.h3>
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isInView ? 1 : 0,
            opacity: isInView ? 1 : 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.div>
      </div>
      {!isLast && (
        <motion.div
          className="design-entregable-line"
          style={{
            top: `${lineTop}px`,
            height: `${lineHeight}px`,
            opacity: lineHeight > 0 ? 1 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        />
      )}
    </div>
  );
};

// Componente interno para la sección de texto animado
const AnimatedTextSection = ({ containerRef }) => {
  const textRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  
  // useScroll solo se llama cuando containerRef está disponible
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
    layoutEffect: false
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

  const animatedText = "El diseño define identidad, carácter y propósito. Trabajamos el diseño como una herramienta estratégica, no decorativa. Construimos marcas desde su núcleo, con sentido y coherencia. Creamos sistemas de marca sólidos que diferencian y posicionan. Hacemos visible lo esencial para que las marcas tengan presencia real.";
  
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
    while ((match = splitRegex.exec(animatedText)) !== null) {
      // Agregar la frase desde el último índice hasta la coma/punto (incluyéndolo)
      const phrase = animatedText.substring(lastIndex, match.index + 1) + ' ';
      if (phrase.trim().length > 0) {
        result.push(phrase);
      }
      lastIndex = match.index + match[0].length; // Avanzar después del delimitador completo
    }
    
    // Agregar la última frase (desde el último índice hasta el final)
    if (lastIndex < animatedText.length) {
      const lastPhrase = animatedText.substring(lastIndex);
      if (lastPhrase.trim().length > 0) {
        result.push(lastPhrase);
      }
    }
    
    return result;
  }, [animatedText]);

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
  );
};

const Disenio = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const accordionWrapperRef = useRef(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef(null);
  
  // Refs para la sección de texto animado
  const animatedTextContainerRef = useRef(null);
  const [isTextSectionMounted, setIsTextSectionMounted] = React.useState(false);

  // Esperar a que el componente esté montado antes de inicializar useScroll
  React.useEffect(() => {
    // Verificar que el ref esté disponible después de que el DOM se haya renderizado
    const checkRef = () => {
      if (animatedTextContainerRef.current) {
        setIsTextSectionMounted(true);
      }
    };
    
    // Iniciar verificación después de un pequeño delay para asegurar que el ref está hidratado
    const timer = setTimeout(checkRef, 100);
    
    // También verificar inmediatamente en caso de que el ref ya esté disponible
    checkRef();
    
    return () => clearTimeout(timer);
  }, []);

  // Datos del video (puedes cambiar estos valores)
  const videoData = {
    title: "movie trompo",
    duration: "00.58",
    thumbnail: `${base}assets/creatividad/volvo.png`,
    videoSrc: `${base}assets/creatividad/multimedia/volvo.mp4`
  };

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header.full-container');
      if (header) {
        const height = header.offsetHeight;
        setHeaderHeight(height);
        // Aplicar la altura al acordeón usando CSS variable
        if (accordionWrapperRef.current) {
          accordionWrapperRef.current.style.setProperty('--header-height', `${height}px`);
        }
      }
    };

    // Actualizar al montar y al cambiar el tamaño de la ventana
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    // También actualizar cuando el header se vuelve sticky
    const observer = new MutationObserver(updateHeaderHeight);
    const header = document.querySelector('header.full-container');
    if (header) {
      observer.observe(header, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, []);
  
  
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/creatividad-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/creatividad-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/creatividad-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/creatividad-hero-mobile-poster.webp`}
      />

      <ServiceTitle area="Diseño" titulo="Servicios de diseño" />

      <div ref={animatedTextContainerRef} className="full-container">
        <div className="container animated-text-container">
          {isTextSectionMounted && (
            <AnimatedTextSection containerRef={animatedTextContainerRef} />
          )}
        </div>
      </div>

      <div className="full-container bg-yellow-2 productos">
        <div className="container">
          <div className="grid-productos container">
            <div className="grid-item-productos">
              <EntregableItemsList />
            </div>
            <div className="grid-item-video">
              <OptimizedVideo src={`${base}assets/creatividad/multimedia/vertical/vanliving.mp4`} />
            </div>
          </div>
        </div>
      </div>

      <div className="full-container bg-white portfolio-section-container">
        <div className="container">
          <div className="container">
            <h1 className="portfolio-title">
              Portfolio de Diseño
            </h1>
          </div>        
          <DisenioPortfolio />
        </div>
      </div>

      <div className="full-container strategy-container black-bg">
        <div className="container">
          <h1>
            Diseño Estratégico
          </h1>
          <h2> Que Convierte Ideas En Identidad</h2>
        </div>

        <div className="full-container grid-strategy">
          <div className="full-container strategy-item black-bg">
            <div className="container">
              <div className="grid-item-strategy">
                <span>Diseño que transciende lo visual</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  El diseño consciente no se limita a verse bien. Piensa, comunica y construye sentido. Es estrategia aplicada a la identidad.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container strategy-item black-bg">
            <div className="container">
              <div className="grid-item-strategy">
                <span>Identidad con propósito</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  No decoramos ideas: les damos alma, carácter y presencia tangible. Diseñamos marcas que se reconocen antes de explicarse.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container strategy-item black-bg">
            <div className="container">
              <div className="grid-item-strategy">
                <span>Hacer visible lo esencial</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  El verdadero diseño revela lo importante. Ordena, potencia y convierte lo abstracto en algo claro, memorable y real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-container black-bg">
        <div className="container identidades">
            <div className="card-identidades">
              <h2>Las marcas son identidades vivas.</h2>
              <p>Nuestro propósito es concebirlas y cultivarlas desde su núcleo más auténtico. A través de un sistema de marca sólido, construimos el fundamento estratégico y visual que permite a las empresas posicionarse con claridad, diferenciarse con fuerza y potenciar su activo más valioso: su identidad en el mundo.</p>
            </div>
            <div className="span-identidades">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
      </div>      
      
      <Beneficios />

      <section className="full-container testimonial-wrapper">
        <Testimonials />
      </section>

      <Contact form="creative" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Disenio;
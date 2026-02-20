import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, useSpring, useMotionValue } from "framer-motion";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import StaticHero from "../../components/StaticHero.jsx";
import DisenioPortfolio from "../../components/portfolio/DisenioPortfolio.jsx";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
//styles
import "@as/hero.css";
import "../../assets/styles/design.css";
import "../../assets/styles/branding-video-carrusel.css";
import "../../assets/styles/beneficios.css";


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
                  width={1200}
                  height={800}
                  decoding="async"
                  style={{ 
                    opacity: 1, 
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '3/2',
                    maxWidth: '100%'
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

// Componente para imagen con tracking del mouse
const MouseTrackingImage = ({ src, srcSet, sizes, alt = "" }) => {
  const containerRef = useRef(null);
  const [isInViewport, setIsInViewport] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Valores suavizados con spring para movimiento fluido
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  
  // Validar srcSet: eliminar si solo tiene una imagen (srcSet falso)
  const hasValidSrcSet = srcSet && srcSet.split(',').length > 1;
  const finalSrcSet = hasValidSrcSet ? srcSet : undefined;

  // IntersectionObserver para detectar cuando la imagen está en viewport (al menos 10px visibles)
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Verificar si al menos 10px están visibles
          const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
          // También verificar si hay al menos 10px de altura visible
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          const hasMinVisible = visibleHeight >= 10;
          
          setIsInViewport(isVisible && hasMinVisible);
          
          // Si sale del viewport, volver al centro
          if (!isVisible || !hasMinVisible) {
            mouseX.set(0);
            mouseY.set(0);
          }
        });
      },
      {
        threshold: [0, 0.01, 0.1, 0.5, 1],
        rootMargin: "0px"
      }
    );

    observer.observe(container);

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [mouseX, mouseY]);

  // Tracking del mouse en toda la ventana cuando está en viewport
  React.useEffect(() => {
    if (!isInViewport) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calcular la distancia del mouse desde el centro de la imagen
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      // Movimiento reducido para no pisar el texto (15px máximo)
      mouseX.set(deltaX * 15);
      mouseY.set(deltaY * 15);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInViewport, mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative"
      }}
    >
      <motion.img
        src={src}
        srcSet={finalSrcSet}
        sizes={sizes}
        alt={alt}
        width={1200}
        height={1200}
        style={{
          x: smoothX,
          y: smoothY,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block"
        }}
        loading="lazy"
        decoding="async"
      />
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
  const item4Ref = useRef(null);
  const item5Ref = useRef(null);

  const items = [
    { number: 1, title: "Identidad Visual Corporativa", ref: item1Ref, nextRef: item2Ref, isLast: false,
      children: <p>Desarrollo y evolución de marcas con construcción de sistema visual completo: logotipo, paleta, tipografías y criterios de uso. Identidades pensadas para ser escalables y aplicables en entornos digitales y físicos.</p>
    },
    { number: 2, title: "Sistema Gráfico Institucional", ref: item2Ref, nextRef: item3Ref, isLast: false,
      children: <p>Estructuración de lenguaje visual coherente para presentaciones, piezas corporativas y comunicación formal. Diseño que ordena la marca y eleva su percepción profesional en todos los puntos de contacto.</p>
    },
    { number: 3, title: "Material Comercial y Publicitario", ref: item3Ref, nextRef: item4Ref, isLast: false,
      children: <p>Diseño de piezas para ventas y comunicación: brochures, catálogos, avisos, material POP y recursos gráficos aplicados a campañas. Enfoque en claridad, impacto y coherencia estratégica.</p>
    },
    { number: 4, title: "Aplicación Visual en Campañas", ref: item4Ref, nextRef: item5Ref, isLast: false,
      children: <p>Adaptación del sistema de marca a entornos digitales: creatividades para Paid Media, piezas para Social Media y contenidos visuales alineados a objetivos de performance y posicionamiento.</p>
    },
    { number: 5, title: "Diseño Orientado a Performance Digital", ref: item5Ref, nextRef: null, isLast: true,
      children: <p>Creatividades optimizadas para conversión: estructura visual pensada para mejorar CTR, legibilidad, jerarquía de mensaje y eficacia publicitaria en plataformas digitales.</p>
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

    let rafId = null;
    const updateLineDimensions = () => {
      // Cancelar frame anterior si existe
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      // Usar requestAnimationFrame para batch las lecturas geométricas
      rafId = requestAnimationFrame(() => {
        if (!itemRef.current || !nextItemRef.current) return;
        
        // Batch todas las lecturas en un solo frame para evitar múltiples reflows
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
        rafId = null;
      });
    };

    // Diferir medición inicial
    requestAnimationFrame(() => updateLineDimensions());
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
            className="design-entregable-number"
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
          <motion.h6
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
          </motion.h6>
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

  const animatedText = "El área de Diseño de Trompo construye sistemas visuales que ordenan y potencian la comunicación digital de las marcas. Desde identidad corporativa hasta aplicación en campañas y plataformas, desarrollamos estructuras gráficas coherentes, escalables y alineadas al negocio. Nuestro enfoque integra estrategia, creatividad y ejecución para asegurar consistencia en cada punto de contacto con la audiencia.";
  
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
      <StaticHero
        desktopSrc={`${base}assets/hero/hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <ServiceTitle titulo="Diseño Digital" tituloReplace="identidades que conectan" subtitulo="Construimos sistemas visuales que sostienen campañas, contenidos y plataformas digitales." />

      <div ref={animatedTextContainerRef} className="full-container">
        <div className="container animated-text-container">
          {isTextSectionMounted && (
            <AnimatedTextSection containerRef={animatedTextContainerRef} />
          )}
        </div>
      </div>

      <div className="full-container black-bg productos">
        <div className="container">
          <div className="grid-productos">
            <div className="grid-item-productos">
              <EntregableItemsList />
            </div>
            <div className="grid-item-video">
              {/* Imagen normal en mobile, MouseTrackingImage desde 1280px */}
              <div className="image-mobile-only">
                <img 
                  src={`${base}assets/metegol.webp`} 
                  alt="Diseño"
                  className="productos-image"
                />
              </div>
              <div className="image-desktop-only">
                <MouseTrackingImage 
                  src={`${base}assets/metegol.webp`} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  alt="Diseño" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-container bg-yellow-2 entregables-container">
        <div className="container">
          <h3 className="title-entregables">Entregables</h3>
          <h5>Sistema Visual Estratégico</h5>
        </div>
        <div className="container grid-entregables">
          <div className="item-entregables">
            <h5>Identidad Visual Corporativa Integral</h5>
            <p>Desarrollo o rediseño de marca con construcción completa del sistema visual: logotipo, versiones, paleta cromática, tipografías, grillas, criterios de uso y lineamientos de aplicación.</p>
          </div>
          <div className="item-entregables">
            <h5>Manual y Kit Operativo de Marca</h5>
            <p>Guías prácticas listas para implementar en equipos internos y proveedores. Incluye reglas claras para asegurar coherencia visual en todos los canales digitales y físicos.</p>
          </div>
          <div className="item-entregables">
            <h5>Piezas Institucionales y Comerciales</h5>
            <p>Diseño de presentaciones, brochures, catálogos, papelería, avisos, material POP y recursos gráficos aplicados a comunicación corporativa y comercial.</p>
          </div>
          <div className="item-entregables">
            <h5>Sistema Visual para Social Media (Social Brand)</h5>
            <p>Plantillas estructuradas para feed, historias, carruseles y piezas promocionales, alineadas al ADN de marca y optimizadas para producción continua de contenidos.</p>
          </div>
          <div className="item-entregables">
            <h5>Diseño Gráfico para Campañas Digitales</h5>
            <p>Creatividades estáticas y dinámicas orientadas a performance en Paid Media (Meta, Google, LinkedIn), diseñadas para mejorar CTR, conversión y coherencia visual en pauta.</p>
          </div>
          <div className="item-entregables">
            <h5>Branding Web y UI Visual</h5>
            <p>Diseño de layouts, banners, sliders, componentes gráficos y elementos visuales aplicados a sitios web y plataformas digitales, asegurando experiencia estética consistente y profesional.</p>
          </div>
          <div className="item-entregables">
            <h5>Sistemas de Grillas y Librerías Visuales</h5>
            <p>Creación de frameworks gráficos reutilizables que permiten escalar producción de piezas manteniendo coherencia, velocidad y calidad.</p>
          </div>
        </div>
      </div>

      <div className="full-container bg-white portfolio-section-container">
        <div className="container">
          <div className="container">
            <h3 className="portfolio-title">
              Portfolio de Diseño
            </h3>
          </div>        
          <DisenioPortfolio />
        </div>
      </div>

      <div className="full-container beneficios-container black-bg">
        <div className="container title-beneficios">
          <h3>Ventajas</h3>
          <h5>que aporta nuestra metodología</h5>
        </div>
        <div className="container">          
          <div className="grid-beneficios">
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="78" height="63" viewBox="0 0 78 63" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M45.9594 58.8817C31.3315 67.3724 12.5358 62.3091 4.09035 47.6028C-4.35509 32.8966 0.704931 14.0415 15.3328 5.55082C26.5503 -0.960289 40.4448 0.338323 50.2206 8.489L49.481 8.91831C48.6181 9.41916 48.0336 10.3093 47.9027 11.3216L47.3474 14.8385C39.8116 7.5357 28.1221 5.78348 18.6304 11.2929C7.12526 17.9709 3.18306 32.7622 9.80181 44.2877C16.4443 55.8544 31.1568 59.8177 42.6619 53.1397C52.1536 47.6303 56.4653 36.5352 53.9424 26.3226L57.2733 27.6389C58.1871 27.9898 59.2461 27.9259 60.109 27.4251L60.8486 26.9958C63.0055 39.6239 57.1769 52.3706 45.9594 58.8817ZM19.7216 13.1931C9.28485 19.2511 5.73107 32.7153 11.733 43.1667C17.7587 53.6594 31.1101 57.256 41.5469 51.1981C50.6688 45.9034 54.5221 34.9641 51.3309 25.3048L50.0456 24.784L45.197 27.5983C47.2983 34.3101 44.5598 41.8483 38.2731 45.4973C30.9592 49.7427 21.6261 47.2285 17.4034 39.8754C13.2044 32.5635 15.7052 23.1805 23.0191 18.9352C29.3059 15.2861 37.1685 16.6709 41.8758 21.815L46.7244 19.0006L46.9421 17.6625C40.1934 10.013 28.8435 7.89838 19.7216 13.1931ZM24.1104 20.8354C17.8648 24.4607 15.7524 32.5166 19.3346 38.7544C22.9405 45.0335 30.9125 47.181 37.1581 43.5558C42.3765 40.5268 44.7503 34.357 43.2247 28.7431L32.2949 35.0873C30.6924 36.0174 28.6832 35.4762 27.758 33.8651C26.8565 32.2954 27.3711 30.2341 28.9736 29.3039L39.9035 22.9598C35.8304 18.8246 29.3288 17.8064 24.1104 20.8354Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M62.3907 15.0847L31.2036 33.187C30.6695 33.4971 29.9565 33.305 29.6481 32.768C29.3397 32.231 29.5545 31.5555 30.0886 31.2455L61.2757 13.1432C61.8098 12.8331 62.458 13.0077 62.7664 13.5448C63.0748 14.0818 62.9248 14.7747 62.3907 15.0847Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M49.3983 22.1304L49.3335 22.1129L49.3097 22.0716L49.2686 22.0954L49.2212 22.0128L49.1801 22.0367L49.1327 21.9541L49.0916 21.9779L49.0204 21.854L48.9793 21.8778L48.6946 21.3821L48.7357 21.3583L48.6646 21.2343L48.7057 21.2105L48.6582 21.1279L48.6993 21.104L48.6756 21.0627L48.7167 21.0389L48.6692 20.9562L48.7103 20.9324L50.0699 11.661C50.0919 11.3177 50.3084 11.0268 50.596 10.8599L55.198 8.18864L53.7406 17.9575L53.7232 18.0227C53.747 18.064 53.7059 18.0878 53.7296 18.1291L53.7533 18.1704L53.7122 18.1943L53.736 18.2356L53.7186 18.3008C53.7249 18.4072 53.7961 18.5312 53.8262 18.6789L53.8974 18.8029C53.9859 18.8616 54.0333 18.9443 54.1219 19.003L54.1693 19.0856L54.2104 19.0618L54.2579 19.1444L54.299 19.1206L54.3227 19.1619L54.3875 19.1793L54.4112 19.2206L54.4523 19.1968L63.5786 22.8775L59.0177 25.5248C58.7301 25.6918 58.3475 25.6935 58.0646 25.5823L49.3983 22.1304ZM57.6634 6.75763L64.2377 2.9416L62.7392 12.7343L62.763 12.7756L62.7219 12.7995C62.7456 12.8408 62.7456 12.8408 62.7282 12.9059L62.752 12.9472L62.7109 12.9711L62.7583 13.0537C62.7647 13.1602 62.7947 13.308 62.8659 13.4319L62.9371 13.5558C62.9845 13.6384 63.032 13.7211 63.1205 13.7798L63.1442 13.8211L63.1853 13.7973L63.2328 13.8799L63.2976 13.8974L63.3213 13.9387C63.3624 13.9148 63.3861 13.9561 63.3861 13.9561L63.4509 13.9736L72.5773 17.6543L66.0029 21.4703L56.0688 17.4323L57.6634 6.75763ZM66.662 1.53444L69.0452 0.151124C69.415 -0.0635281 69.8624 -0.0477808 70.2165 0.187296C70.5707 0.422374 70.7668 0.859322 70.7274 1.26774L69.464 9.65717L77.3462 12.7932C77.7177 12.9631 77.9723 13.311 77.9977 13.7369C78.0231 14.1628 77.8368 14.6014 77.4669 14.8161L75.0427 16.2232L65.0674 12.2091L66.662 1.53444Z" fill="#E1C025"/>
              </svg>
              <h6>Reconocimiento</h6>
              <p>identidad sólida que aumenta recordación y posicionamiento</p>
            </div>
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M68.2188 60.5586H5.78125C4.48047 60.5586 3.46875 59.4023 3.46875 58.1016V15.8984C3.46875 14.4531 4.48047 13.4414 5.78125 13.4414H18.2109C18.6445 13.4414 19.0781 13.7305 19.0781 14.3086L17.3438 15.1758H5.78125C5.63672 15.1758 5.49219 15.1758 5.34766 15.3203C5.20312 15.4648 5.20312 15.6094 5.20312 15.8984V58.1016V52.0312H68.7969V15.8984C68.7969 15.4648 68.5078 15.1758 68.2188 15.1758H63.8828L63.7383 13.1523L68.2188 13.4414C69.5195 13.4414 70.5312 14.4531 70.5312 15.8984V58.1016C70.5312 59.4023 69.5195 60.5586 68.2188 60.5586ZM51.5977 59.1133C50.0078 59.1133 48.707 57.957 48.707 56.3672C48.707 54.7773 50.0078 53.4766 51.5977 53.4766C53.1875 53.4766 54.4883 54.7773 54.4883 56.3672C54.4883 57.957 53.1875 59.1133 51.5977 59.1133ZM59.1133 59.1133C57.5234 59.1133 56.2227 57.957 56.2227 56.3672C56.2227 54.7773 57.5234 53.4766 59.1133 53.4766C60.7031 53.4766 61.8594 54.7773 61.8594 56.3672C61.8594 57.957 60.7031 59.1133 59.1133 59.1133Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M42.6367 68.2188H31.3633C30.9297 68.2188 30.4961 67.9297 30.4961 67.3516V62.293H43.5039V67.3516C43.5039 67.9297 43.0703 68.2188 42.6367 68.2188Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M51.7422 74H22.2578C21.9688 74 21.8242 73.8555 21.6797 73.7109C21.5352 73.5664 21.3906 73.4219 21.3906 73.1328V70.2422C21.3906 68.2188 23.125 66.4844 25.1484 66.4844H48.8516C50.875 66.4844 52.6094 68.2188 52.6094 70.2422V73.1328C52.6094 73.5664 52.1758 74 51.7422 74Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M55.7891 47.4062H18.2109C17.7773 47.4062 17.3438 47.1172 17.3438 46.5391V2.89062C17.3438 2.45703 17.7773 2.02344 18.2109 2.02344H55.7891C56.2227 2.02344 56.6562 2.45703 56.6562 2.89062V5.92578L43.3594 29.0508V29.1953H43.2148V29.3398V29.4844H43.0703V29.6289V30.0625L41.9141 40.4688C42.2031 41.0469 42.6367 41.625 43.2148 41.9141C43.5039 42.0586 43.9375 42.2031 44.5156 42.2031C45.0938 42.2031 45.5273 42.0586 45.9609 41.7695L53.4766 36.1328H53.6211V35.9883H53.7656V35.8438H53.9102V35.6992H54.0547V35.5547V35.4102H54.1992V35.2656L56.6562 31.0742V46.5391C56.6562 47.1172 56.2227 47.4062 55.7891 47.4062ZM38.5898 40.4688H35.4102C34.9766 40.4688 34.543 40.1797 34.543 39.6016C34.543 39.168 34.9766 38.7344 35.4102 38.7344H38.5898C39.0234 38.7344 39.457 39.168 39.457 39.6016C39.457 40.1797 39.0234 40.4688 38.5898 40.4688ZM31.6523 40.4688H28.4727C28.0391 40.4688 27.6055 40.1797 27.6055 39.6016C27.6055 39.168 28.0391 38.7344 28.4727 38.7344H31.6523C32.0859 38.7344 32.5195 39.168 32.5195 39.6016C32.5195 40.1797 32.0859 40.4688 31.6523 40.4688ZM24.7148 40.4688H21.5352C20.957 40.4688 20.668 40.1797 20.668 39.6016C20.668 39.168 20.957 38.7344 21.5352 38.7344H24.7148C25.1484 38.7344 25.582 39.168 25.582 39.6016C25.582 40.1797 25.1484 40.4688 24.7148 40.4688ZM30.0625 25.1484C29.7734 25.1484 29.6289 25.0039 29.4844 24.8594L26.7383 22.2578C26.4492 21.8242 26.4492 21.2461 26.7383 20.957C27.1719 20.668 27.6055 20.668 28.0391 20.957L30.0625 22.9805L34.543 18.6445C34.832 18.2109 35.4102 18.2109 35.6992 18.6445C36.1328 18.9336 36.1328 19.5117 35.6992 19.8008L30.6406 24.8594C30.4961 25.0039 30.3516 25.1484 30.0625 25.1484ZM31.2188 32.0859C25.582 32.0859 20.957 27.4609 20.957 21.6797C20.957 16.043 25.582 11.418 31.2188 11.418C37 11.418 41.625 16.043 41.625 21.6797C41.625 27.4609 37 32.0859 31.2188 32.0859ZM31.2188 13.1523C26.4492 13.1523 22.6914 16.9102 22.6914 21.6797C22.6914 26.4492 26.4492 30.3516 31.2188 30.3516C35.9883 30.3516 39.8906 26.4492 39.8906 21.6797C39.8906 16.9102 35.9883 13.1523 31.2188 13.1523Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M44.5157 40.4688C44.3712 40.4688 44.2267 40.4688 44.0821 40.4688C43.7931 40.1797 43.504 39.8906 43.6486 39.6016L44.5157 32.6641L50.5861 36.1328L44.9493 40.3242C44.8048 40.4688 44.6603 40.4688 44.5157 40.4688Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M52.0313 34.832C51.8867 34.832 51.7422 34.832 51.5977 34.6875L45.2383 31.0742C44.9492 30.9297 44.8047 30.7852 44.8047 30.4961C44.6602 30.3516 44.8047 30.0625 44.8047 29.918L59.4024 4.76953C59.6914 4.33594 60.125 4.19141 60.5586 4.33594L66.918 8.09375C67.2071 8.23828 67.3516 8.38281 67.3516 8.52734C67.3516 8.81641 67.3516 9.10547 67.2071 9.25L52.7539 34.3984C52.6094 34.6875 52.3203 34.832 52.0313 34.832Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M66.4844 9.68359C66.3398 9.68359 66.1953 9.68359 66.0508 9.53906L59.6914 5.92578C59.2578 5.63672 59.1133 5.05859 59.4023 4.76953L61.8594 0.433594C62.0039 0.289062 62.1484 0.144531 62.4375 0C62.582 0 62.8711 0 63.0156 0.144531L69.375 3.75781C69.8086 4.04688 69.9531 4.625 69.6641 4.91406L67.207 9.25C67.0625 9.53906 66.7734 9.68359 66.4844 9.68359Z" fill="#E1C025"/>
              </svg>
              <h6>Consistencia</h6>
              <p>coherencia visual en todos los canales y puntos de contacto</p>
            </div>
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
                <g clipPath="url(#clip0_2493_937)">
                  <path d="M74.9878 33.1722C74.9241 32.5649 74.6116 32.011 74.125 31.6423L68.1841 27.1422L70.3456 20.01C70.5227 19.4254 70.45 18.7937 70.1447 18.2648C69.8395 17.736 69.3287 17.3572 68.7341 17.2183L61.4761 15.5236L60.5496 8.12865C60.4737 7.52279 60.1504 6.97523 59.6563 6.61649C59.1625 6.25731 58.5417 6.11874 57.9422 6.23402L50.6226 7.63793L46.7679 1.25926C46.4521 0.736754 45.934 0.368052 45.3367 0.241197C44.7394 0.114195 44.1162 0.240025 43.6151 0.589097L37.4998 4.84872L31.3842 0.589244C30.883 0.240318 30.2597 0.114342 29.6626 0.241344C29.0653 0.368199 28.5473 0.736754 28.2315 1.25956L24.3773 7.63836L17.0578 6.23446C16.4581 6.11962 15.8374 6.2579 15.3435 6.61693C14.8495 6.97582 14.5261 7.52308 14.4504 8.12909L13.5238 15.5241L6.26584 17.2187C5.67111 17.3576 5.16061 17.7364 4.85519 18.2652C4.54992 18.7942 4.47726 19.4257 4.65422 20.01L6.81545 27.1425L0.874921 31.6423C0.388153 32.011 0.0758483 32.5647 0.0121276 33.1721C-0.0517395 33.7794 0.138544 34.386 0.538153 34.8478L5.4133 40.4847L1.81638 47.0119C1.52165 47.5467 1.46159 48.1797 1.65026 48.7605C1.83908 49.341 2.25964 49.8178 2.81247 50.0772L9.55895 53.2436L8.92775 60.6698C8.8759 61.2783 9.07834 61.8811 9.48718 62.3349C9.89558 62.7887 10.474 63.053 11.0844 63.0653L18.5361 63.2138L20.9798 70.2544C21.1799 70.8313 21.6099 71.2997 22.1677 71.548C22.7258 71.7966 23.3614 71.8026 23.9242 71.5656L30.7923 68.6706L35.8885 74.1087C36.3061 74.5543 36.8894 74.8072 37.5 74.8072C38.1107 74.8072 38.694 74.5543 39.1116 74.1087L44.2079 68.6706L51.0754 71.5656C51.6381 71.8025 52.2739 71.7962 52.8318 71.548C53.3896 71.2997 53.8198 70.8316 54.0199 70.2546L56.4638 63.2138L63.9152 63.0653C64.5256 63.0531 65.1039 62.7887 65.5125 62.3349C65.921 61.8811 66.1236 61.2785 66.0719 60.6698L65.4407 53.2436L72.1876 50.0772C72.7406 49.8178 73.1611 49.341 73.3498 48.7603C73.5385 48.1798 73.4784 47.5467 73.1836 47.0117L69.5863 40.4846L74.4619 34.8477C74.8612 34.3861 75.0515 33.7794 74.9878 33.1722ZM37.4998 58.6344C25.8461 58.6344 16.3654 49.1535 16.3654 37.4999C16.3654 25.8464 25.8463 16.3655 37.4998 16.3655C49.1534 16.3655 58.6343 25.8465 58.6343 37.4999C58.6343 49.1534 49.1534 58.6344 37.4998 58.6344Z" fill="#E1C025"/>
                  <path d="M37.4998 20.7827C28.282 20.7827 20.7827 28.282 20.7827 37.4998C20.7827 46.7176 28.2821 54.2169 37.4998 54.2169C46.7179 54.2169 54.2169 46.7176 54.2169 37.4998C54.2169 28.282 46.7178 20.7827 37.4998 20.7827ZM46.1588 34.3303L36.696 43.7931C36.2646 44.2243 35.6995 44.4401 35.1342 44.4401C34.5691 44.4401 34.0038 44.2243 33.5727 43.7931L28.841 39.0616C27.9786 38.1993 27.9786 36.8008 28.841 35.9381C29.7033 35.0758 31.102 35.0755 31.9645 35.9381L35.1342 39.1078L43.0353 31.2068C43.8978 30.3445 45.2963 30.3442 46.1589 31.2068C47.0213 32.0693 47.0213 33.4678 46.1588 34.3303Z" fill="#E1C025"/>
                </g>
                <defs>
                  <clipPath id="clip0_2493_937">
                    <rect width="75" height="75" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <h6>Rendimiento</h6>
              <p>piezas optimizadas que potencian campañas y resultados</p>
            </div>
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 69 69" fill="none">
                <path d="M68.4545 26.6504C68.0819 25.9779 67.5356 25.4177 66.8726 25.0284C66.2096 24.6392 65.4542 24.4351 64.6853 24.4375H23.8227C22.445 24.4375 21.1044 24.8843 20.0023 25.7109C18.9001 26.5375 18.0958 27.6993 17.71 29.0219L9.62191 56.7525C9.1961 58.2123 8.30831 59.4946 7.09179 60.407C5.87526 61.3194 4.39564 61.8125 2.875 61.8125H54.2625C55.7834 61.8125 57.2633 61.3192 58.4801 60.4066C59.6968 59.4941 60.5848 58.2115 61.0107 56.7514L68.7752 30.1313C68.9558 29.5589 69.0205 28.9562 68.9654 28.3586C68.9103 27.7609 68.7366 27.1802 68.4545 26.6504Z" fill="#E1C025"/>
                <path d="M6.85687 55.9475L14.95 28.2181C15.5138 26.3011 16.6818 24.6176 18.2801 23.4183C19.8783 22.219 21.8212 21.568 23.8194 21.5625H60.375V20.125C60.375 18.6 59.7692 17.1375 58.6909 16.0591C57.6125 14.9808 56.15 14.375 54.625 14.375H32.7113C32.2829 14.375 31.8599 14.2795 31.4731 14.0955C31.0863 13.9115 30.7453 13.6436 30.475 13.3113L27.6493 9.83667C26.9762 9.00903 26.127 8.34182 25.1636 7.88356C24.2002 7.42531 23.1468 7.18752 22.08 7.1875H5.75C4.22501 7.1875 2.76247 7.7933 1.68414 8.87164C0.605802 9.94997 0 11.4125 0 12.9375L0 56.0625C0 56.825 0.302901 57.5563 0.842068 58.0954C1.38124 58.6346 2.1125 58.9375 2.875 58.9375C3.77236 58.935 4.6449 58.6426 5.36248 58.1038C6.08006 57.5649 6.60425 56.8086 6.85687 55.9475Z" fill="#E1C025"/>
              </svg>
              <h6>Profesionalización</h6>
              <p>imagen clara y estructurada que eleva la percepción del negocio</p>
            </div>
          </div>
        </div>
      </div>

      <Contact form="creative" />
    </>
  );
};

export default Disenio;
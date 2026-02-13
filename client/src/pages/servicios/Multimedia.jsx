import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent, useSpring, useMotionValue } from "framer-motion";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import StaticHero from "../../components/StaticHero";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
import SemicircularVideoSlider from "../../components/sliders/SemicircularVideoSlider.jsx";
import Beneficios from "../../components/Beneficios.jsx";

//styles
import "../../assets/styles/multimedia.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

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
        loading="lazy"
        decoding="async"
        style={{
          x: smoothX,
          y: smoothY,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block"
        }}
      />
    </motion.div>
  );
};

const AnimatedImageContainer = ({ src, alt, containerRef: parentContainerRef }) => {
  const imageRef = useRef(null);
  const isInView = useInView(imageRef, { once: false, amount: 0.2 });

  // Scroll progress para efecto parallax basado en el contenedor padre
  const { scrollYProgress } = useScroll({
    target: parentContainerRef || imageRef,
    offset: ["start end", "end start"]
  });

  // Transformar el scroll progress para animaciones más dinámicas
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  return (
    <motion.div
      ref={imageRef}
      className="image-multimedia-container"
      initial={{ 
        bottom: -100, 
        rotateZ: 120,
        opacity: 0,
        scale: 0.85
      }}
      animate={{ 
        bottom: isInView ? -200 : -300,
        rotateZ: isInView ? 10 : 30,
        opacity: isInView ? 1 : 0.6
      }}
      style={{
        y: parallaxY,
        rotate: parallaxRotate,
        scale: parallaxScale
      }}
      transition={{
        bottom: {
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 1
        },
        rotateZ: {
          type: "spring",
          stiffness: 40,
          damping: 12
        },
        opacity: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1]
        },
        scale: {
          type: "spring",
          stiffness: 100,
          damping: 20
        }
      }}
    >
      <motion.img 
        src={src} 
        alt={alt}
        loading="lazy"
        decoding="async"
        width={1200}
        height={900}
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: '4/3',
          maxWidth: '100%',
          display: 'block'
        }}
        initial={{ scale: 1 }}
        whileHover={{
          scale: 1.05,
          transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }}
      />
    </motion.div>
  );
};

const AnimatedLetterOpacity = ({ letter, index, letterDelay, baseOpacity, hasAnimated }) => {
  // Calcular el delay para esta letra específica (solo en la primera animación)
  const delay = hasAnimated ? 0 : index * letterDelay;

  return (
    <motion.span
      className="animated-letter-opacity"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: baseOpacity }}
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

const ProductosItemsList = () => {
  const item1Ref = useRef(null);
  const item2Ref = useRef(null);
  const item3Ref = useRef(null);
  const item4Ref = useRef(null);
  const item5Ref = useRef(null);

  const items = [
    { number: 1, title: "Redes Sociales", ref: item1Ref, nextRef: item2Ref, isLast: false,
      children: <p>Reels, Shorts (YouTube / Instagram), TikTok y piezas verticales para Stories. Contenidos pensados para impactar en los primeros segundos y adaptados al lenguaje de cada plataforma.</p>
    },
    { number: 2, title: "Videos Corporativos y Testimoniales", ref: item2Ref, nextRef: item3Ref, isLast: false,
      children: <p>Producciones ágiles y auténticas, grabadas en contextos reales, que comunican valores, servicios y casos de éxito con un ritmo moderno y cercano.</p>
    },
    { number: 3, title: "Animación & Motion Graphics", ref: item3Ref, nextRef: item4Ref, isLast: false,
      children: <p>Producciones ágiles y auténticas, grabadas en contextos reales, que comunican valores, servicios y casos de éxito con un ritmo moderno y cercano.</p>
    },
    { number: 4, title: "Contenido paraPublicidad Digital (Ads)", ref: item4Ref, nextRef: item5Ref, isLast: false,
      children: <p>Videos optimizados para campañas en Meta Ads, Google Video y LinkedIn, diseñados para conversión y ajustados a los formatos y objetivos de cada canal.</p>
    },
    { number: 5, title: "Audio, Subtitulado & Assets con IA", ref: item5Ref, nextRef: null, isLast: true,
      children: <p>Producción y edición de audio, podcasts y sound design. Subtitulado creativo integrado como parte de la narrativa visual. Generación de imágenes y assets visuales potenciados con inteligencia artificial para enriquecer cada proyecto.</p>
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
    <div ref={itemRef} className="multimedia-entregable-item-wrapper">
      <div className="multimedia-history-item black-bg">
        <div className="multimedia-history-item-header">
          <motion.span
            className="multimedia-entregable-number black-bg"
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
          className="multimedia-entregable-line"
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

const AnimatedOpacityText = ({ text, containerRef }) => {
  const textRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  const [baseOpacity, setBaseOpacity] = React.useState(0.1);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Cuando está en view, establecer opacidad a 1 (100%)
  // Cuando sale de view, volver a 0.1 (10%)
  React.useEffect(() => {
    if (isInView) {
      // Cuando entra en view, establecer opacidad a 1
      setBaseOpacity(1);
      // Reset hasAnimated para que se anime letra por letra
      setHasAnimated(false);
    } else {
      // Cuando sale de view, volver a opacidad 0.1
      setBaseOpacity(0.1);
      // Reset hasAnimated para que vuelva a animar cuando entre de nuevo
      setHasAnimated(false);
    }
  }, [isInView]);

  // Marcar como animado después de un pequeño delay para permitir la animación letra por letra
  React.useEffect(() => {
    if (isInView && baseOpacity === 1) {
      const timeout = setTimeout(() => {
        setHasAnimated(true);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isInView, baseOpacity]);

  // Dividir el texto en letras, preservando espacios
  const letters = text.split("");

  // 60ppm = 60 palabras por minuto = 1 palabra por segundo
  // Promedio de 5 letras por palabra = 5 letras por segundo = 0.2s por letra
  // Pero para una animación más fluida, usaremos 0.0167s (60 caracteres por segundo)
  const letterDelay = 0.0167;

  return (
    <motion.p
      ref={textRef}
      className="animated-opacity-text"
    >
      {letters.map((letter, index) => (
        <AnimatedLetterOpacity
          key={index}
          letter={letter}
          index={index}
          letterDelay={letterDelay}
          baseOpacity={baseOpacity}
          hasAnimated={hasAnimated}
        />
      ))}
    </motion.p>
  );
};

const Multimedia = () => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const enfoqueContainerRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
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

  const text = "Si el Diseño construye la identidad, la Multimedia le da movimiento y aliento. No se trata solo de ver, sino de sentir. Contamos historias que se experimentan, que capturan la atención en segundos y permanecen en la memoria, creamos momentos con intención, emoción y sentido. No producimos contenido: diseñamos experiencias sensoriales que hacen vivir a la marca.";
  
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
      <StaticHero
        desktopSrc={`${base}assets/hero/hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <ServiceTitle titulo="Multimedia" subtitulo="Dimensiones del patrón y momentos que conectan y dejan una imagen audaz." />

      <div ref={containerRef} className="full-container bg-yellow-2">
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

      <div className="full-container black-bg">
        <div className="container">
          <div className="grid-multimedia-wrapper">
            <div className="grid-item-multimedia">
              <span>01</span>
              <h6 className="question-multimedia">qué hacemos</h6>
              <p>Creamos contenido audiovisual estratégico que pone en movimiento la identidad de tu marca. Desde piezas breves y potentes para redes sociales hasta producciones corporativas ágiles, narramos, mostramos y hacemos sentir lo que la marca representa, con intención y coherencia en cada formato.</p>
            </div>
            <div className="grid-item-multimedia">
              <span>02</span>
              <h6 className="question-multimedia">Cómo lo hacemos</h6>
              <p>Nuestro proceso combina estrategia narrativa, producción ágil y tecnología aplicada con criterio. Partimos de ideas claras, guiones optimizados y storyboards pensados para captar atención en segundos y cumplir un objetivo concreto en cada plataforma.</p>
            </div>
            <div className="grid-item-multimedia">
              <span>03</span>
              <h6 className="question-multimedia">Producción y post con propósito</h6>
              <p>Grabamos en contextos reales o sets ligeros, priorizando autenticidad, ritmo visual y mensaje. En postproducción sumamos edición dinámica, motion graphics, animación 2D, transiciones y sonido para transformar la idea en una pieza lista para competir en entornos digitales.</p>
            </div>
            <div className="grid-item-multimedia">
              <span>04</span>
              <h6 className="question-multimedia">Tecnología e IA aplicada</h6>
              <p>Integramos inteligencia artificial de forma estratégica para potenciar resultados: asistencia creativa en guiones y copy, generación de assets visuales, locuciones sintéticas de alta calidad, limpieza de audio y subtitulado creativo diseñado como parte activa de la narrativa.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="full-container slider-container">
        <div className="full-container">
          <SemicircularVideoSlider />
        </div>
        <div className="container slider-text">
          <span className="">Producciones audiovisuales pensadas para captar atención, comunicar con claridad y generar impacto. </span>
        </div>
      </div>


      <div className="full-container black-bg productos-multimedia">
        <div className="container">
          <div className="grid-productos-multimedia">
            <div className="grid-item-video-multimedia">
              {/* Imagen normal en mobile, MouseTrackingImage desde 1280px */}
              <div className="image-mobile-only">
                <img 
                  src={`${base}assets/ofi.webp`} 
                  alt="Multimedia"
                  className="productos-image"
                />
              </div>
              <div className="image-desktop-only">
                <MouseTrackingImage 
                  src={`${base}assets/ofi.webp`} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  alt="Multimedia" 
                />
              </div>
            </div>
            <div className="grid-item-productos-multimedia">
              <ProductosItemsList />
            </div>
          </div>
        </div>
      </div>
      
      <div className="full-container bg-yellow-2 entregables-container">
        <div className="container">
          <h3 className="title-entregables">Entregables</h3>
        </div>
        <div className="container grid-entregables">
          <div className="item-entregables">
            <h5>Videos estratégicos para Redes Sociales</h5>
            <p>Reels, Shorts (YouTube/Instagram), TikTok y piezas verticales nativas para Stories, diseñados para captar atención en los primeros segundos.</p>
          </div>
          <div className="item-entregables">
            <h5>Videos Corporativos y Testimoniales de formato ágil</h5>
            <p>Producciones dinámicas y auténticas, grabadas en contexto real, que comunican valores, servicios o casos de éxito con un ritmo moderno.</p>
          </div>
          <div className="item-entregables">
            <h5>Animaciones 2D y Motion Graphics explicativos</h5>
            <p>Gráficos en movimiento que simplifican ideas complejas, presentan datos o dan vida a elementos de marca de forma clara y atractiva.</p>
          </div>
          <div className="item-entregables">
            <h5>Contenido para Publicidad Digital (Ads)</h5>
            <p>Videos optimizados específicamente para campañas en Meta Ads, Google Video o LinkedIn, con foco en conversión y adaptados al formato de cada plataforma.</p>
          </div>
          <div className="item-entregables">
            <h5>Recursos de Audio y Podcasts</h5>
            <p>Edición y producción sonora para podcasts, así como creación de pistas de audio y sound design para videos. Incluye locuciones generadas por IA de alta calidad para flexibilidad y escalabilidad.</p>
          </div>
          <div className="item-entregables">
            <h5>Piezas con Subtitulado Creativo Integrado</h5>
            <p>No solo subtitulamos; diseñamos el texto como parte esencial de la narrativa visual, garantizando accesibilidad y máximo engagement en reproducción sin sonido.</p>
          </div>
          <div className="item-entregables">
            <h5>Imágenes y Assets Visuales Potenciados con IA</h5>
            <p>Generación y edición de imágenes, ilustraciones o elementos gráficos únicos mediante inteligencia artificial, para complementar y enriquecer proyectos audiovisuales o de campaña.</p>
          </div>
        </div>
      </div>

      <Beneficios />

      <Contact form="multimedia" />
    </>
  );
};

export default Multimedia;
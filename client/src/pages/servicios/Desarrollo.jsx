import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, useInView, useSpring, useMotionValue } from "framer-motion";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import Portfolio3d from "../../layout/Portfolio3d.jsx";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
import Beneficios from "../../components/Beneficios.jsx";

import "../../assets/styles/servicios-page.css";
import "../../assets/styles/desarrollo.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const InfiniteSlider = ({ text }) => {
  const shouldReduceMotion = useReducedMotion();
  // 6 copias para crear un loop infinito más fluido
  const items = Array(16).fill(text);

  return (
    <motion.div 
      className="infinite-slider"
      animate={{
        x: shouldReduceMotion ? 0 : ['0%', '-10%']
      }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear"
        }
      }}
      style={{
        // Asegurar que el cursor funcione correctamente
        pointerEvents: 'auto',
        // Optimizar rendering
        willChange: 'transform'
      }}
    >
      {items.map((item, index) => (
        <h2 key={index} className="infinite-slider-item">{item}</h2>
      ))}
      {items.map((item, index) => (
        <h2 key={`duplicate-${index}`} className="infinite-slider-item">{item}</h2>
      ))}
    </motion.div>
  );
};

const WebDesignSection = () => {
  return (
    <div className="full-container web-design-container">
      <div className="container">
        <h2 className="text-highlight">
          Diseñamos y desarrollamos plataformas digitales escalables
        </h2>
      </div>
      <div className="container web-design-container-text">
        <div className="container-text">
          <p>
            <strong>Diseñamos y desarrollamos plataformas digitales escalables</strong> para transformar diseño en sistemas digitales reales. Planificamos la experiencia de usuario desde el primer prototipo, desarrollamos front-end y back-end a medida con código limpio y escalable, e integramos APIs, CRM y herramientas de marketing y analytics para que cada plataforma funcione como un núcleo sólido del negocio.
          </p>
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
      className="desarrollo-animated-phrase"
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

  const animatedText = "Una plataforma digital no es un folleto en línea; es la arquitectura donde ocurre la experiencia de marca. Es la función, la forma y la sensación trabajando en armonía. Construimos con código lo que el diseño imagina y la estrategia planea: espacios digitales intuitivos, robustos y con propósito, donde cada interacción tiene una razón de ser y cada línea de código está al servicio del negocio.";
  
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
      className="desarrollo-animated-text"
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

// Componente para imagen con tracking del mouse
const MouseTrackingImage = ({ src, alt = "" }) => {
  const containerRef = useRef(null);
  const [isInViewport, setIsInViewport] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Valores suavizados con spring para movimiento fluido
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });

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
        height: "100%"
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{
          x: smoothX,
          y: smoothY,
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
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
      style={{
        // Asegurar que el cursor funcione correctamente
        pointerEvents: 'auto',
        // Optimizar rendering
        willChange: 'transform'
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
    { number: 1, title: "Web Institucional", ref: item1Ref, nextRef: item2Ref, isLast: false,
      children: <p>Desarrollamos sitios web institucionales que superan lo básico: plataformas estratégicas donde convergen narrativa de marca clara, elementos de credibilidad demostrable (casos de estudio, certificaciones) y presentación efectiva de valor. </p>
    },
    { number: 2, title: "Landing Page", ref: item2Ref, nextRef: item3Ref, isLast: false,
      children: <p>Construimos experiencias focalizadas que transforman tráfico en leads cualificados, ventas directas o adopción de promociones. Método basado en arquitectura conversiva, microcopys estratégicos y eliminación sistemática de fricciones para maximizar ROI por visita.</p>
    },
    { number: 3, title: "E - Commerce", ref: item3Ref, nextRef: item4Ref, isLast: false,
      children: <p>Una tienda online moderna, rápida y funcional, que combina diseño atractivo con conversión optimizada y backend eficiente.</p>
    },
    { number: 4, title: "Formación Online", ref: item4Ref, nextRef: item5Ref, isLast: false,
      children: <p>Construimos experiencias focalizadas que transforman tráfico en leads cualificados, ventas directas o adopción de promociones. Método basado en arquitectura conversiva, microcopys estratégicos y eliminación sistemática de fricciones para maximizar ROI por visita.</p>
    },
    { number: 5, title: "Catálogo", ref: item5Ref, nextRef: null, isLast: true,
      children: <p>Desarrollamos sitios web institucionales que superan lo básico: plataformas estratégicas donde convergen narrativa de marca clara, elementos de credibilidad demostrable (casos de estudio, certificaciones) y presentación efectiva de valor. </p>
    }
  ];

  return (
    <>
      {items.map((item) => (
        <ProductoItem
          key={item.number}
          number={item.number}
          title={item.title}
          itemRef={item.ref}
          nextItemRef={item.nextRef}
          isLast={item.isLast}
        >
          {item.children}
        </ProductoItem>
      ))}
    </>
  );
};

const ProductoItem = ({ number, title, children, isLast, itemRef, nextItemRef }) => {
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
    <div ref={itemRef} className="desarrollo-producto-item-wrapper">
      <div className="desarrollo-producto-item black-bg">
        <div className="desarrollo-producto-item-header">
          <motion.span
            className="desarrollo-producto-number"
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
          className="desarrollo-producto-line"
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


const Desarrollo = () => {
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

  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <ServiceTitle titulo="Desarrollo" subtitulo="Dimensiones del patrón y momentos que conectan y dejan una imagen audaz." />

      <div ref={animatedTextContainerRef} className="full-container">
        <div className="container desarrollo-animated-text-container">
          {isTextSectionMounted && (
            <AnimatedTextSection containerRef={animatedTextContainerRef} />
          )}
        </div>
      </div>

      <div className="full-container black-bg productos-desarrollo">
        <div className="container">
          <div className="grid-productos-desarrollo container">
            <div className="grid-item-video-desarrollo">
              <MouseTrackingImage src={`${base}assets/sillon.webp`} alt="Desarrollo" />
            </div>
            <div className="grid-item-productos-desarrollo">
              <ProductosItemsList />
            </div>
          </div>
        </div>
      </div>

      <div className="full-container dev-container">
        <div className="full-container infinite-slider-container">
          <InfiniteSlider text="Qué hacemos" />
        </div>

        <div className="full-container grid-dev">
          <div className="full-container dev-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-dev">
                <span className="number-title">01</span>
                <h5>Infraestructura Digital</h5>
              </div>
              <div className="grid-item-dev">
                <p>
                  Desarrollamos sitios web, aplicaciones y plataformas sólidas, seguras y escalables, pensadas para sostener el crecimiento del negocio y adaptarse a futuras necesidades.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container dev-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-dev">
                <span className="number-title">02</span>
                <h5>Experiencia de Usuario (UX/UI)</h5>
              </div>
              <div className="grid-item-dev">
                <p>
                  Diseñamos interfaces intuitivas y funcionales que conectan diseño y usabilidad, optimizando cada interacción para que el recorrido del usuario sea claro, fluido y efectivo.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container dev-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-dev">
                <span className="number-title">03</span>
                <h5> Diseño, Tecnología y Conversión</h5>
              </div>
              <div className="grid-item-dev">
                <p>
                  Integramos estrategia, diseño y desarrollo para crear productos digitales que no solo se ven bien, sino que funcionan con precisión y convierten visitantes en clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="full-container black-bg">
        <div className="full-container title-portfolio-container">
          <div className="container"></div>
          <div className="container">
            <h1 className="portfolio-highlight-text">
              PORQUE<br/> LA EXPERIENCIA IMPORTA.
            </h1>
          </div>
        </div>
        <Portfolio3d location="desarrollo" categoria="3d" />
      </div>      

      <WebDesignSection />

      <Beneficios />

      <Contact form="desarrollo"/>
      
      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Desarrollo;

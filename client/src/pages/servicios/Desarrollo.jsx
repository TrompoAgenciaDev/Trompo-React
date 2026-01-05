import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, useInView } from "framer-motion";
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
        <h1 key={index} className="infinite-slider-item">{item}</h1>
      ))}
      {items.map((item, index) => (
        <h1 key={`duplicate-${index}`} className="infinite-slider-item">{item}</h1>
      ))}
    </motion.div>
  );
};

const ZoomInSection = () => {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Obtener el scrollY global para calcular el translateY preciso
  const { scrollY } = useScroll();
  
  // Scroll progress para detectar el rango de pin
  // El pin comienza cuando el top de la sección alcanza 10svh desde el top del viewport
  // El zoom debe completarse antes de que la sección llegue al 50% del viewport
  // La animación debe comenzar cuando el 120% de la imagen esté en el viewport
  // Si la sección tiene 90svh, el 120% = 108svh, entonces el top debe estar a -8vh (fuera por arriba)
  // Offset: ["start 10svh", ["start", -0.08]] para que progress vaya de 0 a 1 correctamente
  // - "start 10svh": cuando el top del contenedor está a 10svh del top del viewport (progress = 0, imagen pequeña)
  // - ["start", -0.08]: cuando el top del contenedor está a -8% del viewport (progress = 1, imagen grande, 120% visible)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10svh", ["start", -0.08]]
  });

  // Scroll progress para el rango completo del pin (más allá del zoom)
  // Necesitamos esto para calcular el translateY durante todo el pin
  const { scrollYProgress: pinProgress } = useScroll({
    target: containerRef,
    offset: ["start 10svh", "end start"]
  });

  // Calcular el translateY para mantener la sección fija durante el pin
  // Durante el pin (pinProgress de 0 a 1), compensamos el scroll con translateY negativo
  // El offset ["start 10svh", "end start"] define el rango completo de scroll durante el pin
  // Cuando pinProgress = 0, el top está a 10svh
  // Cuando pinProgress = 1, el bottom sale del viewport
  const translateY = useTransform(
    [scrollY, pinProgress],
    ([scroll, progress]) => {
      if (progress <= 0) {
        // Antes del pin, no hay translateY
        return 0;
      }
      if (progress >= 1) {
        // Después del pin, la sección continúa normalmente
        // El translateY final debe compensar todo el scroll durante el pin
        if (!containerRef.current) return 0;
        const containerHeight = containerRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const tenSvh = viewportHeight * 0.1;
        // El scroll durante el pin completo es la altura del contenedor
        // menos la parte visible cuando comienza el pin (viewport - 10svh)
        const pinScrollRange = containerHeight - (viewportHeight - tenSvh);
        return -pinScrollRange;
      }
      // Durante el pin (0 < progress < 1), compensamos el scroll proporcionalmente
      if (!containerRef.current) return 0;
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const tenSvh = viewportHeight * 0.1;
      // El rango de scroll durante el pin es la altura del contenedor
      // menos la parte visible cuando comienza el pin
      const pinScrollRange = containerHeight - (viewportHeight - tenSvh);
      // El scroll acumulado durante el pin es progress * pinScrollRange
      return -progress * pinScrollRange;
    }
  );

  // Zoom de la imagen durante el pin
  // Con el offset invertido, progress = 0 cuando el top está a -8% del viewport (120% de la imagen visible, imagen pequeña)
  // y progress = 1 cuando el top está a 10svh (imagen grande al 100%)
  const scale = useTransform(
    scrollYProgress,
    [0, 1], // Rango del zoom: desde -8% del viewport (progress = 0, 120% visible) hasta 10svh (progress = 1)
    shouldReduceMotion ? [1, 1] : [0.5, 1]
  );

  return (
    <section
      ref={containerRef}
      className="full-container black-bg zoomin-container"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Sección con pinning controlado por Motion usando translateY */}
      <motion.div
        ref={sectionRef}
        className="full-container black-bg zoomin-section"
        style={{
          height: "100svh",
          overflow: "hidden",
          // Usar translateY para mantener la sección fija durante el pin
          y: translateY,
          // Z-index para estar sobre el contenido siguiente, pero no tan alto que interfiera con el cursor
          // El cursor tiene z-index: 999999999, así que 5 está bien
          zIndex: 5,
          // Asegurar que el mouse funcione correctamente
          pointerEvents: 'auto',
          // Asegurar que no haya problemas de rendering
          willChange: 'transform'
        }}
      >
        <div className="full-container zoomin-img" style={{ pointerEvents: 'auto' }}>
          {/* Texto fijo detrás */}
          <div className="container zoomin-text" style={{ pointerEvents: 'none' }}>
            <h1 className="text-interaccion-desarrollo">
              Cada interacción, tiene un propósito cada línea de código también.
            </h1>
          </div>

          {/* Imagen escalada con transform continuo durante el pin */}
          <motion.div
            className="zoomin-image-wrapper"
            style={{
              scale,
              x: "-50%",
              y: "-50%",
              pointerEvents: 'none',
              willChange: 'transform'
            }}
          >
            <img
              src={`${base}assets/desarrollo/landing.webp`}
              alt="Desarrollo"
              className="zoomin-image"
              style={{ pointerEvents: 'none' }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
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
      <div className="desarrollo-producto-item">
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
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/desarrollo-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/desarrollo-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/desarrollo-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/desarrollo-hero-mobile-poster.webp`}
      />

      <ServiceTitle area="Desarrollo" titulo="Servicios de desarrollo" />

      <div className="full-container black-bg">
        <h1 className="highlight-text">código, diseño y estrategia en armonía</h1>
      </div>

      <ZoomInSection />


      <div className="full-container bg-yellow-2 productos-desarrollo">
        <div className="container">
          <div className="grid-productos-desarrollo container">
            <div className="grid-item-video-desarrollo">
              <div className="desarrollo-service-title-container">
                <h2>Servicios</h2>
                <h2>Servicios</h2>
                <h2>Servicios</h2>
                <h2>Servicios</h2>
              </div>
              <OptimizedVideo src={`${base}assets/creatividad/multimedia/vertical/vanliving.mp4`} />
            </div>
            <div className="grid-item-productos-desarrollo">
              <ProductosItemsList />
            </div>
          </div>
        </div>
      </div>

      

      <div className="full-container strategy-container">
        <div className="full-container infinite-slider-container">
          <InfiniteSlider text="Qué hacemos" />
        </div>

        <div className="full-container grid-strategy">
          <div className="full-container strategy-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-strategy">
                <span className="number-title">01</span>
                <span>Infraestructura Digital</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  Desarrollamos sitios web, aplicaciones y plataformas sólidas, seguras y escalables, pensadas para sostener el crecimiento del negocio y adaptarse a futuras necesidades.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container strategy-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-strategy">
                <span className="number-title">02</span>
                <span>Experiencia de Usuario (UX/UI)</span>
              </div>
              <div className="grid-item-strategy">
                <p>
                  Diseñamos interfaces intuitivas y funcionales que conectan diseño y usabilidad, optimizando cada interacción para que el recorrido del usuario sea claro, fluido y efectivo.
                </p>
              </div>
            </div>
          </div>
          <div className="full-container strategy-item bg-yellow-2">
            <div className="container">
              <div className="grid-item-strategy">
                <span className="number-title">03</span>
                <span> Diseño, Tecnología y Conversión</span>
              </div>
              <div className="grid-item-strategy">
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

      <div className="full-container web-design-container">
        <div className="container">
          <h1 className="text-highlight">Diseñamos y desarrollamos plataformas digitales escalables</h1>
        </div>
        <div className="container web-design-container-text">
          <div className="container-text">
            <p><strong>Diseñamos y desarrollamos plataformas digitales escalables</strong> para transformar diseño en sistemas digitales reales. Planificamos la experiencia de usuario desde el primer prototipo, desarrollamos front-end y back-end a medida con código limpio y escalable, e integramos APIs, CRM y herramientas de marketing y analytics para que cada plataforma funcione como un núcleo sólido del negocio.</p>
          </div>
        </div>
      </div>

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

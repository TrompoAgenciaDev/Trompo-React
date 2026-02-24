import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent, useMotionValue, useAnimation, useSpring, AnimatePresence } from "framer-motion";
import Faqs from "../../layout/Faqs.jsx";
import Contact from "../../layout/Contact.jsx";
import StaticHero from "../../components/StaticHero.jsx";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
import Icons from "../../components/Icons.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import AutoSlider from "../../components/sliders/AutoSlider.jsx";
import MiniROIBlock from "../../components/MiniROIBlock.jsx";
//styles
import "../../assets/styles/paid-media.css";
import "../../assets/styles/beneficios.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

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

// Componente para imagen con tracking del mouse (copiado de Disenio.jsx)
const MouseTrackingImage = ({ src, srcSet, sizes, alt = "" }) => {
  const containerRef = useRef(null);
  const [isInViewport, setIsInViewport] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  const hasValidSrcSet = srcSet && srcSet.split(',').length > 1;
  const finalSrcSet = hasValidSrcSet ? srcSet : undefined;

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          const hasMinVisible = visibleHeight >= 10;
          setIsInViewport(isVisible && hasMinVisible);
          if (!isVisible || !hasMinVisible) {
            mouseX.set(0);
            mouseY.set(0);
          }
        });
      },
      { threshold: [0, 0.01, 0.1, 0.5, 1], rootMargin: "0px" }
    );
    observer.observe(container);
    return () => { if (container) observer.unobserve(container); };
  }, [mouseX, mouseY]);

  React.useEffect(() => {
    if (!isInViewport) return;
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      mouseX.set(deltaX * 15);
      mouseY.set(deltaY * 15);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isInViewport, mouseX, mouseY]);

  return (
    <motion.div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <motion.img
        src={src}
        srcSet={finalSrcSet}
        sizes={sizes}
        alt={alt}
        width={1200}
        height={1200}
        style={{ x: smoothX, y: smoothY, width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        loading="lazy"
        decoding="async"
      />
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
    { number: 1, title: "Performance Acquisition", ref: item1Ref, nextRef: item2Ref, isLast: false,
      children: <p>Captación directa de leads o ventas. Search, conversiones, campañas optimizadas a resultados medibles. Foco: CPL, CPA, ROAS y rentabilidad.</p>
    },
    { number: 2, title: "Brand & Awareness Amplification", ref: item2Ref, nextRef: item3Ref, isLast: false,
      children: <p>Posicionamiento y expansión de marca. Video, Display, YouTube, campañas de alcance estratégico. Foco: presencia inteligente, no impresiones vacías.</p>
    },
    { number: 3, title: "Remarketing & Escalamiento", ref: item3Ref, nextRef: item4Ref, isLast: false,
      children: <p>Recaptura de tráfico y optimización de embudos. Segmentaciones avanzadas, públicos personalizados y automatizaciones que aumentan conversión.</p>
    },
    { number: 4, title: "B2B & LinkedIn Growth", ref: item4Ref, nextRef: item5Ref, isLast: false,
      children: <p>Estrategias para empresas que venden a empresas. Segmentación por cargo, industria y nivel jerárquico. Ideal para empresas industriales, tecnológicas y servicios corporativos.</p>
    },
    { number: 5, title: "Automatización & Funnels", ref: item5Ref, nextRef: null, isLast: true,
      children: <p>Integración de anuncios con: Email marketing, WhatsApp marketing, CRM, Landing pages optimizadas. No generamos leads. Generamos oportunidades calificadas.
     </p>
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
  const [lineHeight, setLineHeight] = React.useState(0);
  const [lineTop, setLineTop] = React.useState(0);

  React.useEffect(() => {
    if (isLast || !nextItemRef?.current || !itemRef.current) {
      setLineHeight(0);
      return;
    }
    let rafId = null;
    const updateLineDimensions = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!itemRef.current || !nextItemRef.current) return;
        const currentRect = itemRef.current.getBoundingClientRect();
        const nextRect = nextItemRef.current.getBoundingClientRect();
        const currentNumberCenterY = 35;
        const nextWrapperTopRelative = nextRect.top - currentRect.top;
        const nextNumberCenterY = nextWrapperTopRelative + 35;
        const calculatedHeight = nextNumberCenterY - currentNumberCenterY;
        const calculatedTop = currentNumberCenterY;
        setLineHeight(Math.max(0, calculatedHeight));
        setLineTop(calculatedTop);
        rafId = null;
      });
    };
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
            animate={{ scale: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {number}
          </motion.span>
          <motion.h6
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {title}
          </motion.h6>
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
      {!isLast && (
        <motion.div
          className="design-entregable-line"
          style={{ top: `${lineTop}px`, height: `${lineHeight}px`, opacity: lineHeight > 0 ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      )}
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

const Campaigns = () => {
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

  const text = "En Trompo, Paid Media no es “hacer campañas”, es diseñar sistemas de adquisición, optimización y escalamiento sostenido.Planificamos, ejecutamos y optimizamos inversiones digitales con foco en rentabilidad real. Cada peso invertido tiene una lógica estratégica, una hipótesis y un objetivo medible";
  
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
        <StaticHero
          desktopSrc={`${base}assets/hero/hero.mp4`}
          mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
          desktopPoster={`${base}assets/hero/home.webp`}
          mobilePoster={`${base}assets/hero/mobile/home.webp`}
        />
      </div>
      
      <ServiceTitle titulo="Paid Media" tituloReplace="inteligencia estratégica" subtitulo="Dimensiones del patrón y momentos que conectan y dejan una imagen audaz." />

      <div ref={animatedTextContainerRef} className="full-container white-bg">
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

      {/* Productos Section */}
      <div className="full-container black-bg">
        <div className="container">
          <div className="grid-paid-media-container">
            <PaidMediaItem
              title="Google Ads"
              subtitle="Performance & Branding de Alta Precisión"
              description={<>Capturamos demanda activa y convertimos intención en resultados medibles.<br/> Diseñamos campañas en Search, Display, YouTube y Performance Max enfocadas en establecer una comunicación eficiente con las audiencias objetivo, optimizando estrategia en buscadores, posicionamiento en medios digitales y comunicando el mensaje adecuado en el momento preciso a la audiencia interesada.</>}
              footerText="→ Ideal para generar leads, ventas, posicionamiento de marcas, control de ROI y métricas relevantes."
              svgStroke="currentColor"
            />
            <PaidMediaItem
              title="Meta Ads"
              subtitle="Demanda Estratégica y Escalamiento"
              description={<>Construimos audiencias, generamos interés y transformamos atención en oportunidades.<br/> Desarrollamos campañas en Instagram y Facebook combinando creatividad persuasiva, segmentación inteligente y optimización continua para impulsar reconocimiento, tráfico calificado y conversiones sostenidas.</>}
              footerText="→ Ideal para crecer, testear propuestas y escalar con creatividad orientada a resultados."
              svgStroke="#FED332"
            />

            <PaidMediaItem
              title="Linkedin Ads"
              subtitle="Expansión B2B de Alta Calidad"
              description={<>Conectamos marcas con decisores reales.<br/>Creamos campañas dirigidas a perfiles estratégicos por industria, cargo y nivel jerárquico, posicionando la propuesta de valor frente a audiencias empresariales específicas y potenciando generación de leads calificados.</>}
              footerText="→ Ideal para empresas B2B que necesitan precisión, autoridad y oportunidades concretas."
              svgStroke="#FED332"
            />

            <PaidMediaItem
              title="Email marketing"
              subtitle="Automatización que Nutre y Convierte"
              description={<>Transformamos bases de datos en activos estratégicos.<br/>Diseñamos flujos automatizados, secuencias de nutrición y campañas segmentadas que acompañan el recorrido del usuario, fortalecen relación de marca y aumentan tasa de cierre.</>}
              footerText="→ Ideal para consolidar leads, aumentar recurrencia y mejorar conversión comercial."
              svgStroke="#FED332"
            />
          </div>
        </div>
      </div>

      <div className="full-container">
        <CustomerSlider />
      </div>

      {/* Entregables Section */}
      <div className="full-container bg-yellow-2 entregables-container">
        <div className="container">
          <h3 className="title-entregables">Entregables</h3>
        </div>
        <div className="container grid-entregables">
          <div className="item-entregables">
            <h5>Estrategia y Dirección</h5>
            <p>Desarrollamos una arquitectura editorial sólida que define el rol de cada red, los pilares de contenido, el tono de comunicación y los objetivos medibles. Este entregable ordena el sistema conversacional y establece la base estratégica para el crecimiento sostenido.</p>
          </div>
          <div className="item-entregables">
            <h5>Planificación y Producción de Contenidos</h5>
            <p>Construimos un calendario editorial alineado a negocio, acompañado de piezas visuales y copies estratégicos adaptados a cada formato y plataforma. El contenido no es improvisado: responde a una lógica narrativa y a un objetivo claro dentro del ecosistema digital.</p>
          </div>
          <div className="item-entregables">
            <h5>Gestión e Interacción Profesional</h5>
            <p>Administramos la conversación de marca con criterio, coherencia y protocolos definidos. La gestión incluye moderación, respuestas estratégicas y derivación inteligente hacia instancias comerciales cuando corresponde.</p>
          </div>
          <div className="item-entregables">
            <h5>Integración con Ecosistema Digital</h5>
            <p>Conectamos Social Media con landing pages, WhatsApp, CRM y funnels activos. La presencia social deja de ser aislada para convertirse en parte del sistema de adquisición y conversión.</p>
          </div>
          <div className="item-entregables">
            <h5>Analítica y Evolución Continua</h5>
            <p>Entregamos reportes ejecutivos con interpretación estratégica, no solo métricas. Analizamos comportamiento, identificamos oportunidades y definimos ajustes que permitan mejorar alcance útil, interacción relevante y conversión asistida.</p>
          </div>
        </div>
      </div>

      {/* Calculadora ROI Section */}
      <div className="full-container bg-white roi-calculator-section">
        <div className="container">
          <MiniROIBlock />
        </div>
      </div>

      <div className="full-container beneficios-container black-bg">
        <div className="container title-beneficios">
          <h3>Beneficios diferenciales</h3>
          <h5>Nuestra metodología garantiza</h5>
        </div>
        <div className="container">
          <div className="grid-beneficios">
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="78" height="63" viewBox="0 0 78 63" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M45.9594 58.8817C31.3315 67.3724 12.5358 62.3091 4.09035 47.6028C-4.35509 32.8966 0.704931 14.0415 15.3328 5.55082C26.5503 -0.960289 40.4448 0.338323 50.2206 8.489L49.481 8.91831C48.6181 9.41916 48.0336 10.3093 47.9027 11.3216L47.3474 14.8385C39.8116 7.5357 28.1221 5.78348 18.6304 11.2929C7.12526 17.9709 3.18306 32.7622 9.80181 44.2877C16.4443 55.8544 31.1568 59.8177 42.6619 53.1397C52.1536 47.6303 56.4653 36.5352 53.9424 26.3226L57.2733 27.6389C58.1871 27.9898 59.2461 27.9259 60.109 27.4251L60.8486 26.9958C63.0055 39.6239 57.1769 52.3706 45.9594 58.8817ZM19.7216 13.1931C9.28485 19.2511 5.73107 32.7153 11.733 43.1667C17.7587 53.6594 31.1101 57.256 41.5469 51.1981C50.6688 45.9034 54.5221 34.9641 51.3309 25.3048L50.0456 24.784L45.197 27.5983C47.2983 34.3101 44.5598 41.8483 38.2731 45.4973C30.9592 49.7427 21.6261 47.2285 17.4034 39.8754C13.2044 32.5635 15.7052 23.1805 23.0191 18.9352C29.3059 15.2861 37.1685 16.6709 41.8758 21.815L46.7244 19.0006L46.9421 17.6625C40.1934 10.013 28.8435 7.89838 19.7216 13.1931ZM24.1104 20.8354C17.8648 24.4607 15.7524 32.5166 19.3346 38.7544C22.9405 45.0335 30.9125 47.181 37.1581 43.5558C42.3765 40.5268 44.7503 34.357 43.2247 28.7431L32.2949 35.0873C30.6924 36.0174 28.6832 35.4762 27.758 33.8651C26.8565 32.2954 27.3711 30.2341 28.9736 29.3039L39.9035 22.9598C35.8304 18.8246 29.3288 17.8064 24.1104 20.8354Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M62.3907 15.0847L31.2036 33.187C30.6695 33.4971 29.9565 33.305 29.6481 32.768C29.3397 32.231 29.5545 31.5555 30.0886 31.2455L61.2757 13.1432C61.8098 12.8331 62.458 13.0077 62.7664 13.5448C63.0748 14.0818 62.9248 14.7747 62.3907 15.0847Z" fill="#E1C025"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M49.3983 22.1304L49.3335 22.1129L49.3097 22.0716L49.2686 22.0954L49.2212 22.0128L49.1801 22.0367L49.1327 21.9541L49.0916 21.9779L49.0204 21.854L48.9793 21.8778L48.6946 21.3821L48.7357 21.3583L48.6646 21.2343L48.7057 21.2105L48.6582 21.1279L48.6993 21.104L48.6756 21.0627L48.7167 21.0389L48.6692 20.9562L48.7103 20.9324L50.0699 11.661C50.0919 11.3177 50.3084 11.0268 50.596 10.8599L55.198 8.18864L53.7406 17.9575L53.7232 18.0227C53.747 18.064 53.7059 18.0878 53.7296 18.1291L53.7533 18.1704L53.7122 18.1943L53.736 18.2356L53.7186 18.3008C53.7249 18.4072 53.7961 18.5312 53.8262 18.6789L53.8974 18.8029C53.9859 18.8616 54.0333 18.9443 54.1219 19.003L54.1693 19.0856L54.2104 19.0618L54.2579 19.1444L54.299 19.1206L54.3227 19.1619L54.3875 19.1793L54.4112 19.2206L54.4523 19.1968L63.5786 22.8775L59.0177 25.5248C58.7301 25.6918 58.3475 25.6935 58.0646 25.5823L49.3983 22.1304ZM57.6634 6.75763L64.2377 2.9416L62.7392 12.7343L62.763 12.7756L62.7219 12.7995C62.7456 12.8408 62.7456 12.8408 62.7282 12.9059L62.752 12.9472L62.7109 12.9711L62.7583 13.0537C62.7647 13.1602 62.7947 13.308 62.8659 13.4319L62.9371 13.5558C62.9845 13.6384 63.032 13.7211 63.1205 13.7798L63.1442 13.8211L63.1853 13.7973L63.2328 13.8799L63.2976 13.8974L63.3213 13.9387C63.3624 13.9148 63.3861 13.9561 63.3861 13.9561L63.4509 13.9736L72.5773 17.6543L66.0029 21.4703L56.0688 17.4323L57.6634 6.75763ZM66.662 1.53444L69.0452 0.151124C69.415 -0.0635281 69.8624 -0.0477808 70.2165 0.187296C70.5707 0.422374 70.7668 0.859322 70.7274 1.26774L69.464 9.65717L77.3462 12.7932C77.7177 12.9631 77.9723 13.311 77.9977 13.7369C78.0231 14.1628 77.8368 14.6014 77.4669 14.8161L75.0427 16.2232L65.0674 12.2091L66.662 1.53444Z" fill="#E1C025"/>
              </svg>
              <h6>Inversión con lógica estratégica</h6>
              <p>No se pauta por intuición. Se pauta con hipótesis y validación.</p>
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
              <h6>Optimización constante</h6>
              <p>Análisis semanal, ajustes continuos y mejora progresiva.</p>
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
              <h6>Medición real</h6>
              <p>Implementación correcta de tracking, eventos y conversiones.</p>
            </div>
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 69 69" fill="none">
                <path d="M68.4545 26.6504C68.0819 25.9779 67.5356 25.4177 66.8726 25.0284C66.2096 24.6392 65.4542 24.4351 64.6853 24.4375H23.8227C22.445 24.4375 21.1044 24.8843 20.0023 25.7109C18.9001 26.5375 18.0958 27.6993 17.71 29.0219L9.62191 56.7525C9.1961 58.2123 8.30831 59.4946 7.09179 60.407C5.87526 61.3194 4.39564 61.8125 2.875 61.8125H54.2625C55.7834 61.8125 57.2633 61.3192 58.4801 60.4066C59.6968 59.4941 60.5848 58.2115 61.0107 56.7514L68.7752 30.1313C68.9558 29.5589 69.0205 28.9562 68.9654 28.3586C68.9103 27.7609 68.7366 27.1802 68.4545 26.6504Z" fill="#E1C025"/>
                <path d="M6.85687 55.9475L14.95 28.2181C15.5138 26.3011 16.6818 24.6176 18.2801 23.4183C19.8783 22.219 21.8212 21.568 23.8194 21.5625H60.375V20.125C60.375 18.6 59.7692 17.1375 58.6909 16.0591C57.6125 14.9808 56.15 14.375 54.625 14.375H32.7113C32.2829 14.375 31.8599 14.2795 31.4731 14.0955C31.0863 13.9115 30.7453 13.6436 30.475 13.3113L27.6493 9.83667C26.9762 9.00903 26.127 8.34182 25.1636 7.88356C24.2002 7.42531 23.1468 7.18752 22.08 7.1875H5.75C4.22501 7.1875 2.76247 7.7933 1.68414 8.87164C0.605802 9.94997 0 11.4125 0 12.9375L0 56.0625C0 56.825 0.302901 57.5563 0.842068 58.0954C1.38124 58.6346 2.1125 58.9375 2.875 58.9375C3.77236 58.935 4.6449 58.6426 5.36248 58.1038C6.08006 57.5649 6.60425 56.8086 6.85687 55.9475Z" fill="#E1C025"/>
              </svg>
              <h6>Escalabilidad</h6>
              <p>Estrategias pensadas para crecer sin perder eficiencia.</p>
            </div>
          </div>
        </div>
      </div>

      <Contact form="estrategia" />
    </>
  );
};

export default Campaigns;


{/* Tabs Section
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
          <div className="container tab-content-wrapper">
            <AnimatePresence mode="sync" initial={false}>
              {activeTab === "busqueda" && (
                <motion.div
                  key="busqueda"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="tab-content"
                >
                  <div className="container grid-tab bg-white">
                    <img 
                      src={`${base}assets/paid-media/google-ads/busqueda.webp`} 
                      alt="Busqueda Google Ads" 
                      loading="lazy" 
                      decoding="async" 
                      width={800} 
                      height={480} 
                      style={{ maxWidth: '100%', height: 'auto' }} 
                    />
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
                        <img 
                          src={`${base}assets/paid-media/google-ads/search.webp`} 
                          alt="Search" 
                          loading="lazy" 
                          decoding="async" 
                          width={400} 
                          height={240} 
                          style={{ maxWidth: '100%', height: 'auto' }} 
                        />
                      </div>
                    </div>
                    <div className="bento-item bg-yellow-2">
                      <div className="content-bento">
                        <h3>Campañas Shopping</h3>
                        <p>Las campañas de Google Shopping están especialmente pensadas para promocionar productos de tiendas online.</p>
                      </div>
                      <div className="img-bento">
                        <img 
                          src={`${base}assets/paid-media/google-ads/shopping.webp`} 
                          alt="Search" 
                          loading="lazy" 
                          decoding="async" 
                          width={400} 
                          height={240} 
                          style={{ maxWidth: '100%', height: 'auto' }} 
                        />
                      </div>
                    </div>
                    <div className="bento-item bg-yellow-2">
                      <div className="content-bento">
                        <h3>Campañas Apps Móviles</h3>
                        <p>Muestran anuncios tanto por búsqueda como en sitios web y App Moviles.</p>
                      </div>
                      <div className="img-bento">
                        <img 
                          src={`${base}assets/paid-media/google-ads/apps.webp`} 
                          alt="Search" 
                          loading="lazy" 
                          decoding="async" 
                          width={400} 
                          height={240} 
                          style={{ maxWidth: '100%', height: 'auto' }} 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === "graficos" && (
                <motion.div
                  key="graficos"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="tab-content"
                >
                  <div className="container grid-tab bg-white">
                    <img 
                      src={`${base}assets/paid-media/google-ads/display-google-ads.webp`} 
                      alt="Anuncios Gráficos Google Ads" 
                      loading="lazy" 
                      decoding="async" 
                      width={800} 
                      height={480} 
                      style={{ maxWidth: '100%', height: 'auto' }} 
                    />
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
                          <div className="title-item"><h6>Temas</h6></div>
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
                          <div className="title-item"><h6>Ubicación/Emplazamientos</h6></div>
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
                          <div className="title-item"><h6>Demografía</h6></div>
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
                          <div className="title-item"><h6>Interés</h6></div>
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
                          <div className="title-item"><h6>Remarketing</h6></div>
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
                          <div className="title-item"><h6>Dispositivos</h6></div>
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
                          <div className="title-item"><h6>Keywords</h6></div>
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="tab-content"
                >
                  <div className="container grid-tab bg-white">
                    <img 
                      src={`${base}assets/paid-media/google-ads/videos.webp`} 
                      alt="Anuncios Gráficos Google Ads" 
                      loading="lazy" 
                      decoding="async" 
                      width={800} 
                      height={480} 
                      style={{ maxWidth: '100%', height: 'auto' }} 
                    />
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
 */}

       {/* Productos Section
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
      </div> */}
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Contact from "../layout/Contact.jsx";
import SimpleHeroVideo from "../components/SimpleHeroVideo";
import useMembers from "../hooks/useMembers";
import StoricalClients from "../layout/StoricalClients";

// styles
import "../assets/styles/about.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const AnimatedLetter = ({ letter, index, letterDelay, baseOpacity, hasAnimated }) => {
  const delay = hasAnimated ? 0 : index * letterDelay;
  const targetOpacity = baseOpacity >= 0.9 ? 1 : Math.max(0.1, baseOpacity);

  return (
    <motion.span
      className="about-animated-letter"
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

const AnimatedPhrase = ({ phrase, index, phraseDelay, baseOpacity, hasAnimated }) => {
  const delay = hasAnimated ? 0 : index * phraseDelay;
  const targetOpacity = baseOpacity >= 0.9 ? 1 : Math.max(0.1, baseOpacity);

  return (
    <motion.span
      className="about-animated-phrase"
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

// Componente Slider Infinito para Nosotros
const SocialMediaSlider = ({ text }) => {
  const shouldReduceMotion = useReducedMotion();
  const items = Array(16).fill(text);

  return (
    <motion.div 
      className="about-infinite-slider"
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
        pointerEvents: 'auto',
        willChange: 'transform'
      }}
    >
      {items.map((item, index) => (
        <h1 key={index} className="about-infinite-slider-item">{item}</h1>
      ))}
      {items.map((item, index) => (
        <h1 key={`duplicate-${index}`} className="about-infinite-slider-item">{item}</h1>
      ))}
    </motion.div>
  );
};

const EquipoGrid = () => {
  const { members, loading, error } = useMembers();
  const base = import.meta.env.BASE_URL?.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  if (loading) return null;
  if (error) return null;
  if (!members.length) return null;

  // Calcular número de columnas basado en la cantidad de miembros
  // Ejemplo: 9 miembros = 3x3, 6 miembros = 3x2, 4 miembros = 2x2
  const calculateColumns = (count) => {
    if (count === 0) return 1;
    if (count === 1) return 1;
    if (count <= 2) return 2;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    if (count <= 9) return 3;
    if (count <= 12) return 4;
    // Para más de 12, calcular raíz cuadrada redondeada hacia arriba
    return Math.ceil(Math.sqrt(count));
  };

  const columns = calculateColumns(members.length);

  return (
    <div className="full-container bg-yellow-2 equipo">
      <div className="equipo-slider-background">
        <SocialMediaSlider text="Nosotros" />
      </div>
      <div className="container">
        <div 
          className="grid-equipo-wrapper"
        >
          {members.map((member, index) => (
            <div 
              key={member.id} 
              className="grid-item-equipo" 
              data-member-index={index}
            >
              <img 
                src={`${base}${member.featured_image.replace(/^\//, '')}`}
                alt={member.name}
                className="equipo-image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Nosotros = () => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  
  const [baseOpacity, setBaseOpacity] = React.useState(0.1);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Usar IntersectionObserver en lugar de scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          // Mapear intersectionRatio a opacity similar al scroll anterior
          let opacity = 0.1;
          if (ratio >= 0.9) {
            opacity = 1;
          } else if (ratio >= 0.1) {
            opacity = 0.1 + (ratio - 0.1) * (1 - 0.1) / (0.9 - 0.1);
          }
          setBaseOpacity(opacity);
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const text = "En Trompo no creemos en soluciones mágicas. Creemos en conocimiento aplicado, trabajo riguroso y acompañamiento real. Desde Córdoba Capital, ayudamos a empresas a convertir desafíos digitales en ventajas competitivas.";
  
  const phraseDelay = 0.3;
  
  const phrases = React.useMemo(() => {
    const splitRegex = /([,.])\s+/g;
    const result = [];
    let lastIndex = 0;
    let match;
    
    while ((match = splitRegex.exec(text)) !== null) {
      const phrase = text.substring(lastIndex, match.index + 1) + ' ';
      if (phrase.trim().length > 0) {
        result.push(phrase);
      }
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      const lastPhrase = text.substring(lastIndex);
      if (lastPhrase.trim().length > 0) {
        result.push(lastPhrase);
      }
    }
    
    return result;
  }, [text]);

  React.useEffect(() => {
    if (baseOpacity >= 0.9) {
      if (!hasAnimated) {
        const totalPhrases = phrases.length;
        const totalAnimationTime = (totalPhrases * phraseDelay + 0.4) * 1000;
        const timeout = setTimeout(() => {
          setHasAnimated(true);
        }, totalAnimationTime);
        
        return () => clearTimeout(timeout);
      }
    } else if (baseOpacity < 0.3) {
      setHasAnimated(false);
    }
  }, [baseOpacity, hasAnimated, phrases.length, phraseDelay]);
  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/home.mp4`}
        mobileSrc={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <div className="full-container about-slider-container infinite-slider-container">
        <SocialMediaSlider text="Nosotros" />
      </div>

      <div className="full-container black-bg">
        <div className="container">
          <div className="about-grid-wrapper">
            <div className="about-grid-item">
              <span>01</span>
              <h3 className="about-question">qué hacemos</h3>
              <p>Creamos contenido audiovisual estratégico que pone en movimiento la identidad de tu marca. Desde piezas breves y potentes para redes sociales hasta producciones corporativas ágiles, narramos, mostramos y hacemos sentir lo que la marca representa, con intención y coherencia en cada formato.</p>
            </div>
            <div className="about-grid-item">
              <span>02</span>
              <h3 className="about-question">Cómo lo hacemos</h3>
              <p>Nuestro proceso combina estrategia narrativa, producción ágil y tecnología aplicada con criterio. Partimos de ideas claras, guiones optimizados y storyboards pensados para captar atención en segundos y cumplir un objetivo concreto en cada plataforma.</p>
            </div>
            <div className="about-grid-item">
              <span>03</span>
              <h3 className="about-question">Producción y post con propósito</h3>
              <p>Grabamos en contextos reales o sets ligeros, priorizando autenticidad, ritmo visual y mensaje. En postproducción sumamos edición dinámica, motion graphics, animación 2D, transiciones y sonido para transformar la idea en una pieza lista para competir en entornos digitales.</p>
            </div>
            <div className="about-grid-item">
              <span>04</span>
              <h3 className="about-question">Tecnología e IA aplicada</h3>
              <p>Integramos inteligencia artificial de forma estratégica para potenciar resultados: asistencia creativa en guiones y copy, generación de assets visuales, locuciones sintéticas de alta calidad, limpieza de audio y subtitulado creativo diseñado como parte activa de la narrativa.</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="full-container" style={{ backgroundColor: '#ffffff' }}>
        <div className="container about-animated-text-container">
          <motion.span 
            ref={textRef}
            className="about-animated-text"
            style={{ color: '#000000' }}
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

      <div className="full-container bg-yellow-2 members-container">
        <div className="container">
          <h1>Nuestro equipo</h1>
          <p>
            En Trompo creemos que las marcas que crecen nunca se quedan quietas. Por eso, nuestro equipo tampoco. Somos profesionales del marketing, la creatividad, la tecnología y la estrategia, con una misma convicción: trabajar codo a codo con cada cliente, como parte de su equipo.
          </p>
        </div>
        <div className="container">
          <EquipoGrid />
        </div>
      </div>

      {/* Histórico de clientes */}
      <div className="full-container black-bg">
        <StoricalClients />
      </div>

      {/* formulario */}
      <Contact />
    </>
  );
};

export default Nosotros;
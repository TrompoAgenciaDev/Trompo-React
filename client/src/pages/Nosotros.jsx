import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Contact from "../layout/Contact.jsx";
import SimpleHeroVideo from "../components/SimpleHeroVideo";
import StoricalClients from "../layout/StoricalClients";
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";

// styles
import "../assets/styles/about.css";
import "../assets/styles/home.css";
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
    <motion.h5
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
    </motion.h5>
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
        <h2 key={index} className="about-infinite-slider-item">{item}</h2>
      ))}
      {items.map((item, index) => (
        <h2 key={`duplicate-${index}`} className="about-infinite-slider-item">{item}</h2>
      ))}
    </motion.div>
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
              <h6 className="about-question">qué hacemos</h6>
              <p>Creamos contenido audiovisual estratégico que pone en movimiento la identidad de tu marca. Desde piezas breves y potentes para redes sociales hasta producciones corporativas ágiles, narramos, mostramos y hacemos sentir lo que la marca representa, con intención y coherencia en cada formato.</p>
            </div>
            <div className="about-grid-item">
              <span>02</span>
              <h6 className="about-question">Cómo lo hacemos</h6>
              <p>Nuestro proceso combina estrategia narrativa, producción ágil y tecnología aplicada con criterio. Partimos de ideas claras, guiones optimizados y storyboards pensados para captar atención en segundos y cumplir un objetivo concreto en cada plataforma.</p>
            </div>
            <div className="about-grid-item">
              <span>03</span>
              <h6 className="about-question">Producción y post con propósito</h6>
              <p>Grabamos en contextos reales o sets ligeros, priorizando autenticidad, ritmo visual y mensaje. En postproducción sumamos edición dinámica, motion graphics, animación 2D, transiciones y sonido para transformar la idea en una pieza lista para competir en entornos digitales.</p>
            </div>
            <div className="about-grid-item">
              <span>04</span>
              <h6 className="about-question">Tecnología e IA aplicada</h6>
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

      <div 
        className="full-container members-container"
        style={{ 
          '--team-image': `url(${base}assets/members/team.webp)`,
          '--team-mobile-image': `url(${base}assets/members/team-mobile.webp)`
        }}
      >
        <div className="container">
          <h4>Lo que nos define.</h4>
          <div className="text-members-container">
            <p>
              Hace más de una década, <strong>Trompo nació con una idea clara</strong>: una agencia no es un proveedor, es un aliado estratégico.
            </p>
            <p>
              Desde el inicio, nos propusimos involucrarnos de verdad. Entender el ADN de cada marca, sus valores, su visión, su forma de trabajar. Porque solo así se construyen estrategias que importan y relaciones que trascienden.
            </p>
            <p>
              <strong>Fuimos testigos y protagonistas de la transformación digital</strong>: cuando la pauta online era solo un 5% del mix, cuando el "mobile first" todavía no existía.
            </p>
          </div>
        </div>
      </div>

      {/* Histórico de clientes */}
      <div className="full-container black-bg">
        <StoricalClients />
      </div>
      {/*
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

      */}

      {/* formulario */}
      <Contact />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Nosotros;
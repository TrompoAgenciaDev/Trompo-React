import { Link } from "react-router-dom";
import React, { useRef, useState, useEffect, useMemo } from "react";
//styles
import "../assets/styles/home.css";
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, useSpring } from "motion/react";
import "@as/hero.css";

//components
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import Contact from "../layout/Contact";
import SimpleHeroVideo from "../components/SimpleHeroVideo";
import ServiceTitle from "../components/services/ServiceTitle";
import Beneficios from "../components/Beneficios";
import SemicircularVideoSlider from "../components/sliders/SemicircularVideoSlider";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

// Componente para animar frase por frase
const AnimatedPhrase = ({ phrase, index, phraseDelay, baseOpacity, hasAnimated }) => {
  const delay = hasAnimated ? 0 : index * phraseDelay;
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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
    layoutEffect: false
  });

  const opacityValue = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.1, 1, 1, 0.1],
    {
      clamp: false,
    }
  );
  
  const smoothedOpacity = useSpring(opacityValue, {
    stiffness: 80,
    damping: 30,
    mass: 0.6,
  });

  const [baseOpacity, setBaseOpacity] = React.useState(0.1);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  useMotionValueEvent(smoothedOpacity, "change", (latest) => {
    setBaseOpacity(latest);
  });

  const animatedText = "En trompo combinamos creatividad e innovación tecnologia para construir marcas que evolucionan";
  const phraseDelay = 0.3;
  
  const phrases = React.useMemo(() => {
    const splitRegex = /([,.])\s+/g;
    const result = [];
    let lastIndex = 0;
    let match;
    
    while ((match = splitRegex.exec(animatedText)) !== null) {
      const phrase = animatedText.substring(lastIndex, match.index + 1) + ' ';
      if (phrase.trim().length > 0) {
        result.push(phrase);
      }
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < animatedText.length) {
      const lastPhrase = animatedText.substring(lastIndex);
      if (lastPhrase.trim().length > 0) {
        result.push(lastPhrase);
      }
    }
    
    return result;
  }, [animatedText]);

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

const Home = () => {
  const animatedTextContainerRef = useRef(null);
  const [isTextSectionMounted, setIsTextSectionMounted] = useState(false);

  useEffect(() => {
    setIsTextSectionMounted(true);
  }, []);
  return (
    <main className="full-container">
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/home.mp4`}
        mobileSrc={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home-mobile-poster.webp`}
      />

      <ServiceTitle area="Home" home={true} />

      <div ref={animatedTextContainerRef} className="full-container">
        <div className="container desarrollo-animated-text-container">
          {isTextSectionMounted && (
            <AnimatedTextSection containerRef={animatedTextContainerRef} />
          )}
        </div>
      </div>

      <div className="full-container white-bg">
        <div className="full-container"></div>
        <div className="full-container"></div>
      </div>

      <div className="full-container slider-container">
        <div className="full-container">
          <SemicircularVideoSlider />
        </div>
        <div className="container slider-text">
          <span className="">Nuestra Agencia es el espacio donde nacen y se ponen a prueba las ideas. Un entorno de exploración constante donde integramos herramientas emergentes, flujos de trabajo impulsados por inteligencia artificial y métodos modernos de producción creativa.</span>
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

      <Beneficios />

      {/* formulario */}
      <Contact form="home" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </main>
  );
};

export default Home;

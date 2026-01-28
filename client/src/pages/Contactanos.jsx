import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";


import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import Contact from "../layout/Contact";
import TestimonialsSection from "../components/TestimonialsSection.jsx";

import "../assets/styles/contact-page.css";
import "../assets/styles/home.css";

const Contactanos = () => {

  const titleVar = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const groupVar = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.12 },
    },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  // Componente para animar letra por letra
  const AnimatedLetter = ({ letter, index, letterDelay }) => {
    return (
      <motion.span
        className="animated-letter"
        initial={{ opacity: 0.1 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: index * letterDelay,
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        {letter === " " ? "\u00A0" : letter}
      </motion.span>
    );
  };

  // Componente para animar frase por frase (de Nosotros)
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

  // --- CONTACTANOS ---
  const [revealed, setRevealed] = useState(false);
  const titleText = "Hagamos que funcione.";
  
  // Delay entre letras: 0.05s por letra para una animación fluida
  const letterDelay = 0.05;
  
  // Dividir el texto en letras
  const letters = titleText.split("");

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY >= 40) setRevealed(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = setTimeout(() => setRevealed(true), 2000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  // --- SECCIÓN DE TEXTO ANIMADO (de Nosotros) ---
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  
  const [baseOpacity, setBaseOpacity] = useState(0.1);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Usar IntersectionObserver para controlar la opacidad
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
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
  
  const phrases = useMemo(() => {
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

  useEffect(() => {
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
      <div className="full-container black-bg hero-contactanos-container">
        <div className="container contact-title-container">
          <h1 className="contact-main-title">
            {letters.map((letter, index) => (
              <AnimatedLetter
                key={index}
                letter={letter}
                index={index}
                letterDelay={letterDelay}
              />
            ))}
          </h1>
        </div>
      </div>

      <div id="contacto"></div>

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

      <div className="full-container black-bg contactanos-testimonials-wrapper">
        <TestimonialsSection />
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

      <Contact form="contactanos" location="contactanos"/>

      
      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>

      {/* <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>Más que clientes, aliados estratégicos.</h4>
          <p>Historias que muestran el valor de trabajar en equipo.</p>
        </div>
        <div className="full-container">
          <Testimonials3D />
        </div>
      </section> */}


    </>
  );
};

export default Contactanos;

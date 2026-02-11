import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

import Contact from "../layout/Contact";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import AnimatedTextSection from "../components/AnimatedTextSection";

import "../assets/styles/contact-page.css";

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


  // Componente InfiniteSlider (igual al de Home)
  const InfiniteSlider = ({ text, items: itemsProp }) => {
    const shouldReduceMotion = useReducedMotion();
    
    // Si se pasa items (array), usar esos; si no, usar text como antes
    const itemsArray = itemsProp || (text ? [text] : []);
    
    // 8 copias para crear un loop infinito más fluido (se duplican para 16 totales)
    const items = Array(8).fill(itemsArray).flat();

    // Calcular duración basada en la cantidad de items y su longitud total
    const totalLength = itemsArray.reduce((sum, item) => sum + item.trim().length, 0);
    const baseDuration = 30;
    const duration = baseDuration + Math.max(0, (totalLength - 80) / 30);

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
            duration: duration,
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

  // --- CONTACTANOS ---
  const [revealed, setRevealed] = useState(false);
  const titleText = "Hablemos de tu proyecto.";
  
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

      <AnimatedTextSection 
        text="En Trompo no creemos en soluciones mágicas. Creemos en conocimiento aplicado, trabajo riguroso y acompañamiento real. Acompañamos a las empresas a convertir desafíos digitales en ventajas competitivas."
        backgroundClass=""
      />

      <div className="full-container black-bg contactanos-testimonials-wrapper">
        <TestimonialsSection />
      </div>

      <Contact form="contactanos" location="contactanos"/>

      <div className="full-container contact-slider-container infinite-slider-container bg-yellow-2">
        <InfiniteSlider items={["Hablemos", "Ordenemos", "Escalemos"]} />
      </div>

    </>
  );
};

export default Contactanos;

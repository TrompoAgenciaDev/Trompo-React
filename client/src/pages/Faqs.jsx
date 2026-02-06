import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Faqs from "../layout/Faqs";
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import "../assets/styles/faqs-page.css";

// Componente Slider Infinito para FAQs
const FaqsSlider = ({ text }) => {
  const shouldReduceMotion = useReducedMotion();
  const items = Array(8).fill(text);

  return (
    <motion.div 
      className="faqs-infinite-slider"
      animate={{
        x: shouldReduceMotion ? 0 : ['0%', '-10%']
      }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear"
        }
      }}
      style={{
        pointerEvents: 'auto',
        willChange: 'transform'
      }}
    >
      {items.map((item, index) => (
        <h1 key={index} className="faqs-infinite-slider-item">{item}</h1>
      ))}
      {items.map((item, index) => (
        <h1 key={`duplicate-${index}`} className="faqs-infinite-slider-item">{item}</h1>
      ))}
    </motion.div>
  );
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

// Mapeo de categorías a títulos legibles
const categoryTitles = {
  disenio: "Diseño",
  branding: "Branding",
  desarrollo: "Desarrollo",
  landing: "Landing Page",
  catalogo: "Catálogo",
  ecommerce: "E-commerce",
  elearning: "E-learning",
  institucional: "Web Institucional",
  socialmedia: "Social Media",
  metaads: "Meta Ads",
  googleads: "Google Ads",
  paidmedia: "Paid Media",
  soporte: "Soporte",
};

const FaqsPage = () => {
  const [revealed, setRevealed] = useState(false);
  const titleText = "Preguntas Frecuentes";
  
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

  // Obtener todas las categorías del JSON (excluyendo 'home' si no quieres mostrarlo)
  const categories = Object.keys(categoryTitles).filter(cat => cat !== 'home');

  return (
    <>
      <div className="full-container black-bg hero-faqs-container">
        <div className="container faqs-title-container">
          <h1 className="faqs-main-title">
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

      {categories.map((category) => (
        <React.Fragment key={category}>
          <div className="full-container faqs-slider-container infinite-slider-container">
            <FaqsSlider text={categoryTitles[category]} />
          </div>

          <div className="full-container white-bg faqs-section-container">
            <div className="full-container bg-yellow-2">
                <Faqs location={category} />
            </div>
          </div>
        </React.Fragment>
      ))}

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default FaqsPage;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/identidades-section.css";

const IdentidadesSection = ({ 
  backgroundClass = "black-bg"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      title: "Las marcas son identidades vivas.",
      text: "Nuestro propósito es concebirlas y cultivarlas desde su núcleo más auténtico. A través de un sistema de marca sólido, construimos el fundamento estratégico y visual que permite a las empresas posicionarse con claridad, diferenciarse con fuerza y potenciar su activo más valioso: su identidad en el mundo."
    },
    {
      title: "Las marcas son identidades vivas.",
      text: "Nuestro propósito es concebirlas y cultivarlas desde su núcleo más auténtico. A través de un sistema de marca sólido, construimos el fundamento estratégico y visual que permite a las empresas posicionarse con claridad, diferenciarse con fuerza y potenciar su activo más valioso: su identidad en el mundo."
    },
    {
      title: "Las marcas son identidades vivas.",
      text: "Nuestro propósito es concebirlas y cultivarlas desde su núcleo más auténtico. A través de un sistema de marca sólido, construimos el fundamento estratégico y visual que permite a las empresas posicionarse con claridad, diferenciarse con fuerza y potenciar su activo más valioso: su identidad en el mundo."
    }
  ];

  // Auto-play del slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`full-container ${backgroundClass}`}>
      <div className="container identidades">
        <div className="identidades-slider-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="card-identidades"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <h3>{slides[currentIndex].title}</h3>
              <p>{slides[currentIndex].text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="span-identidades">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`span-identidades-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            >
              <span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdentidadesSection;

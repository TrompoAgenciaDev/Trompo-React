import { motion } from "framer-motion";
import Icons from "../components/Icons";
import { useEffect, useState, useRef } from "react";


import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import Faqs from "../layout/Faqs";
import Hero from "../layout/Hero";
import Contact from "../layout/Contact";
import Testimonials from "../components/Testimonials.jsx";

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

  return (
    <>
      <div className="full-container black-bg hero-contactanos-container">
        <div className="container">
          <div className="service-title-container">
            <h2>Contacto</h2>
            <h2>Contacto</h2>
            <h2>Contacto</h2>
            <h2>Contacto</h2>
          </div>
        </div>
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

      <section className="full-container testimonial-wrapper">
        <Testimonials />
      </section>

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
          <Testimonials size={3} />
        </div>
      </section> */}


    </>
  );
};

export default Contactanos;

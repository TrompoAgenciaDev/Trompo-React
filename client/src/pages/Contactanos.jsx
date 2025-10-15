import { motion } from "framer-motion";
import Icons from "../components/Icons";
import { useEffect, useState } from "react";


import ImageSlider from "../components/sliders/CustomerSlider";
import Faqs from "../layout/Faqs";
import Hero from "../layout/Hero";
import Contact from "../layout/Contact";
import Testimonials from "../components/Testimonials.jsx";

import "../assets/styles/contact-page.css";
import "@as/hero.css";

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

  // --- CONTACTANOS ---
  const [revealed, setRevealed] = useState(false);

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
      <div className="full-container hero-contactanos bg-yellow">
        <div className="contacto-wrap">
          <motion.h1
            className="contacto-title"
            variants={titleVar}
            initial="hidden"
            animate="show"
          >
            Hablemos de tu proyecto
          </motion.h1>

          {revealed && (
            <motion.div
              className="contacto-reveal"
              variants={groupVar}
              initial="hidden"
              animate="show"
            >
              <motion.p className="contacto-subtitle" variants={itemVar}>
                Cada proyecto es único. Completá el formulario y diseñemos la estrategia que tu marca necesita.
              </motion.p>
              <motion.a
                href="#contacto"
                className="contacto-cta"
                variants={itemVar}
              >
                <Icons iconName="down" link="#contacto" />
              </motion.a>
            </motion.div>
          )}
        </div>
      </div>

      <div id="contacto"></div>

      <Contact form="home"/>
      
      <section className="full-container slider-conainer">
        <div className="container">
          <ImageSlider />
        </div>
      </section>

    </>
  );
};

export default Contactanos;

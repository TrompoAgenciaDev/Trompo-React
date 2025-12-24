import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Portfolio3d from "../../layout/Portfolio3d";
import Testimonials from "../../components/Testimonials.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
import SemicircularVideoSlider from "../../components/sliders/SemicircularVideoSlider.jsx";

//styles
import "../../assets/styles/multimedia.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const AnimatedLetter = ({ letter, index, letterDelay, baseOpacity, hasAnimated, isInView }) => {
  // Calcular el delay para esta letra específica (solo en la primera animación)
  const delay = hasAnimated ? 0 : index * letterDelay;

  return (
    <motion.span
      className="animated-letter"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: baseOpacity }}
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

const AnimatedImageContainer = ({ src, alt }) => {
  const imageRef = useRef(null);
  const isInView = useInView(imageRef, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={imageRef}
      className="image-multimedia-container"
      initial={{ bottom: -100, rotateZ: 120 }}
      animate={{ 
        bottom: isInView ? -200 : -300,
        rotateZ: isInView ? 10 : 30
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      <img src={src} alt={alt} />
    </motion.div>
  );
};

const AnimatedLetterOpacity = ({ letter, index, letterDelay, baseOpacity, hasAnimated }) => {
  // Calcular el delay para esta letra específica (solo en la primera animación)
  const delay = hasAnimated ? 0 : index * letterDelay;

  return (
    <motion.span
      className="animated-letter-opacity"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: baseOpacity }}
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

const AnimatedOpacityText = ({ text, containerRef }) => {
  const textRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  const [baseOpacity, setBaseOpacity] = React.useState(0.1);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Cuando está en view, establecer opacidad a 1 (100%)
  // Cuando sale de view, volver a 0.1 (10%)
  React.useEffect(() => {
    if (isInView) {
      // Cuando entra en view, establecer opacidad a 1
      setBaseOpacity(1);
      // Reset hasAnimated para que se anime letra por letra
      setHasAnimated(false);
    } else {
      // Cuando sale de view, volver a opacidad 0.1
      setBaseOpacity(0.1);
      // Reset hasAnimated para que vuelva a animar cuando entre de nuevo
      setHasAnimated(false);
    }
  }, [isInView]);

  // Marcar como animado después de un pequeño delay para permitir la animación letra por letra
  React.useEffect(() => {
    if (isInView && baseOpacity === 1) {
      const timeout = setTimeout(() => {
        setHasAnimated(true);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isInView, baseOpacity]);

  // Dividir el texto en letras, preservando espacios
  const letters = text.split("");

  // 60ppm = 60 palabras por minuto = 1 palabra por segundo
  // Promedio de 5 letras por palabra = 5 letras por segundo = 0.2s por letra
  // Pero para una animación más fluida, usaremos 0.0167s (60 caracteres por segundo)
  const letterDelay = 0.0167;

  return (
    <motion.p
      ref={textRef}
      className="animated-opacity-text"
    >
      {letters.map((letter, index) => (
        <AnimatedLetterOpacity
          key={index}
          letter={letter}
          index={index}
          letterDelay={letterDelay}
          baseOpacity={baseOpacity}
          hasAnimated={hasAnimated}
        />
      ))}
    </motion.p>
  );
};

const Multimedia = () => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const enfoqueContainerRef = useRef(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });
  const [baseOpacity, setBaseOpacity] = React.useState(0.1);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // Transformar el scroll progress: cuando está en el top (1), opacidad baja
  const opacityValue = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.1, 1, 1, 0.1]
  );

  // Escuchar cambios en el scroll progress
  useMotionValueEvent(opacityValue, "change", (latest) => {
    setBaseOpacity(latest);
  });

  // Cuando está en view por primera vez, iniciar animación letra por letra
  React.useEffect(() => {
    if (isInView && !hasAnimated && baseOpacity > 0.5) {
      // Solo marcar como animado cuando la opacidad base es alta (no en el top)
      setHasAnimated(true);
    } else if (baseOpacity <= 0.5) {
      // Reset cuando la opacidad baja (está en el top)
      setHasAnimated(false);
    }
  }, [isInView, hasAnimated, baseOpacity]);

  const text = "Si el Diseño construye la identidad, la Multimedia le da movimiento y aliento. No se trata solo de ver, sino de sentir. Contamos historias que se experimentan, que capturan la atención en segundos y permanecen en la memoria, creamos momentos con intención, emoción y sentido. No producimos contenido: diseñamos experiencias sensoriales que hacen vivir a la marca.";
  
  // Dividir el texto en letras, preservando espacios
  const letters = text.split("");

  // 60ppm = 60 palabras por minuto = 1 palabra por segundo
  // Promedio de 5 letras por palabra = 5 letras por segundo = 0.2s por letra
  // Pero para una animación más fluida, usaremos 0.0167s (60 caracteres por segundo)
  const letterDelay = 0.0167;

  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/creatividad-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/creatividad-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/creatividad-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/creatividad-hero-mobile-poster.webp`}
      />

      <ServiceTitle area="Multimedia" titulo="Servicios de multimedia" />

      <div ref={containerRef} className="full-container bg-yellow-2">
        <div className="container animated-text-container">
          <motion.span 
            ref={textRef}
            className="animated-text"
          >
            {letters.map((letter, index) => (
              <AnimatedLetter
                key={index}
                letter={letter}
                index={index}
                letterDelay={letterDelay}
                baseOpacity={baseOpacity}
                hasAnimated={hasAnimated}
                isInView={isInView}
              />
            ))}
          </motion.span>
        </div>
      </div>

      <div className="full-container black-bg">
        <div className="container">
          <div className="grid-multimedia-wrapper">
            <div className="grid-item-multimedia">
              <span>01</span>
              <h3 className="question-multimedia">qué hacemos</h3>
              <p>Creamos contenido audiovisual estratégico que pone en movimiento la identidad de tu marca. Desde piezas breves y potentes para redes sociales hasta producciones corporativas ágiles, narramos, mostramos y hacemos sentir lo que la marca representa, con intención y coherencia en cada formato.</p>
            </div>
            <div className="grid-item-multimedia">
              <span>02</span>
              <h3 className="question-multimedia">Cómo lo hacemos</h3>
              <p>Nuestro proceso combina estrategia narrativa, producción ágil y tecnología aplicada con criterio. Partimos de ideas claras, guiones optimizados y storyboards pensados para captar atención en segundos y cumplir un objetivo concreto en cada plataforma.</p>
            </div>
            <div className="grid-item-multimedia">
              <span>03</span>
              <h3 className="question-multimedia">Producción y post con propósito</h3>
              <p>Grabamos en contextos reales o sets ligeros, priorizando autenticidad, ritmo visual y mensaje. En postproducción sumamos edición dinámica, motion graphics, animación 2D, transiciones y sonido para transformar la idea en una pieza lista para competir en entornos digitales.</p>
            </div>
            <div className="grid-item-multimedia">
              <span>04</span>
              <h3 className="question-multimedia">Tecnología e IA aplicada</h3>
              <p>Integramos inteligencia artificial de forma estratégica para potenciar resultados: asistencia creativa en guiones y copy, generación de assets visuales, locuciones sintéticas de alta calidad, limpieza de audio y subtitulado creativo diseñado como parte activa de la narrativa.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="full-container slider-container">
        <div className="full-container">
          <SemicircularVideoSlider />
        </div>
        <div className="container slider-text">
          <span className="">Producciones audiovisuales pensadas para captar atención, comunicar con claridad y generar impacto. </span>
        </div>
      </div>

      <div ref={enfoqueContainerRef} className="full-container multimedia-enfoque">
        <div className="container">
          <h2>El mismo enfoque que usamos para crear contenido que se ve, se siente y funciona.</h2>
          <AnimatedOpacityText 
            text="Videos para redes, publicidad digital y contenidos corporativos que combinan ritmo, narrativa, animación, audio y tecnología aplicada"
            containerRef={enfoqueContainerRef}
          />
        </div>
        <AnimatedImageContainer 
          src={`${base}assets/creatividad/multimedia/featured-image-dev.webp`}
          alt="Creatividad multimedia"
        />
      </div>



      <Faqs location="branding" />

      <Contact form="multimedia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Multimedia;
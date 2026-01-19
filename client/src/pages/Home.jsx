import { Link } from "react-router-dom";
import React, { useRef, useState, useEffect, useMemo } from "react";
//styles
import "../assets/styles/home.css";
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, useSpring, AnimatePresence, useReducedMotion } from "motion/react";
import "@as/hero.css";

//components
import CustomerSlider from "../components/sliders/CustomerSlider.jsx";
import Contact from "../layout/Contact";
import SimpleHeroVideo from "../components/SimpleHeroVideo";
import ServiceTitle from "../components/services/ServiceTitle";
import Beneficios from "../components/Beneficios";
import SemicircularVideoSlider from "../components/sliders/SemicircularVideoSlider";
import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";
import Testimonials from "../components/Testimonials";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

// Componente InfiniteSlider
const InfiniteSlider = ({ text }) => {
  const shouldReduceMotion = useReducedMotion();
  // 6 copias para crear un loop infinito más fluido
  const items = Array(16).fill(text);

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
          duration: 50,
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
        <h1 key={index} className="infinite-slider-item">{item}</h1>
      ))}
      {items.map((item, index) => (
        <h1 key={`duplicate-${index}`} className="infinite-slider-item">{item}</h1>
      ))}
    </motion.div>
  );
};

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

// Componente para items de servicios con efecto slide
const ServiceItem = ({ title, subtitle, subtitles, link, links }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasMultipleSubtitles = subtitles && subtitles.length > 0;
  
  if (hasMultipleSubtitles) {
    return (
      <div 
        className="service-item-home"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="service-item-home-content">
          <div className="service-title-wrapper">
            <motion.h3
              initial={{ y: '0%' }}
              animate={{ 
                y: isHovered ? '-100%' : '0%'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {title}
            </motion.h3>
            <motion.h3
              className="service-title-hidden"
              initial={{ y: '100%' }}
              animate={{ 
                y: isHovered ? '0%' : '100%'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {title}
            </motion.h3>
          </div>
          <div className="service-subtitles-container">
            {subtitles.map((sub, index) => (
              <span 
                key={index}
                className="service-subtitle-link"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
        <motion.div
          className="service-progress-bar"
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div
      className="service-item-home"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="service-item-home-content">
        <div className="service-title-wrapper">
          <motion.h3
            initial={{ y: '0%' }}
            animate={{ 
              y: isHovered ? '-100%' : '0%'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {title}
          </motion.h3>
          <motion.h3
            className="service-title-hidden"
            initial={{ y: '100%' }}
            animate={{ 
              y: isHovered ? '0%' : '100%'
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {title}
          </motion.h3>
        </div>
        <p className="service-subtitle-text">{subtitle}</p>
      </div>
      <motion.div
        className="service-progress-bar"
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </div>
  );
};

const Home = () => {
  const animatedTextContainerRef = useRef(null);
  const [isTextSectionMounted, setIsTextSectionMounted] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0); // 0: sobre nosotros, 1: servicios, 2: contacto

  useEffect(() => {
    setIsTextSectionMounted(true);
  }, []);

  const menuItems = [
    { 
      label: "sobre nosotros", 
      path: "/nosotros",
      contentKey: "about"
    },
    { 
      label: "servicios", 
      path: "/servicios",
      contentKey: "services"
    },
    { 
      label: "contacto", 
      path: "/contactanos",
      contentKey: "contact"
    }
  ];

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

      <div className="full-container black-bg menu-container-home-section">
        <div className="full-container">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`full-container menu-item-home-section ${activeMenuItem === index ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveMenuItem(index)}
            >
              <h1>{item.label}</h1>
              <svg xmlns="http://www.w3.org/2000/svg" width="70" height="56" viewBox="0 0 70 56" fill="none">
                <path d="M0.999994 27.8085L68.2447 27.8085M68.2447 27.8085L34.6223 1M68.2447 27.8085L34.6223 54.617" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-arrow"/>
              </svg>
            </Link>
          ))}
        </div>
        <div 
          className="full-container menu-content-container"
          onMouseLeave={() => setActiveMenuItem(0)}
        >
          <AnimatePresence mode="wait">
            {activeMenuItem === 0 && (
              <motion.div
                key="about"
                className="container menu-content-item about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setActiveMenuItem(0)}
              >
                <p><span className="yellow">En Trompo no creemos en soluciones mágicas</span>. Creemos en conocimiento aplicado, trabajo riguroso y acompañamiento real. Desde Córdoba Capital, ayudamos a empresas a convertir desafíos digitales en ventajas competitivas.</p>
              </motion.div>
            )}
            {activeMenuItem === 1 && (
              <motion.div
                key="services"
                className="container menu-content-item services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setActiveMenuItem(1)}
              >
                <Menu
                  menuType="servicios"
                  routes={routesConfig}
                  classMenu="servicios-options grid-menu"
                  location="gsap"
                />
              </motion.div>
            )}
            {activeMenuItem === 2 && (
              <motion.div
                key="contact"
                className="container menu-content-item contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setActiveMenuItem(2)}
              >
                <p>¿Listo para transformar tu estrategia digital? Contactanos y conversemos sobre cómo podemos ayudar a tu marca a alcanzar sus objetivos.</p>
                <Link to="/contactanos" className="contact-button-home">
                  Contactanos
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>      

      <div className="full-container infinite-slider-container">
        <InfiniteSlider text="servicios" />
      </div>

      <div className="full-container services-section-home black-bg">
        <div className="container">
          <ServiceItem 
            title="Social Media"
            subtitle="Estrategia de Contenido y Comunicacion"
            link="/servicios/social-media"
          />
          <ServiceItem 
            title="Multimedia"
            subtitles={["Redes Sociales", "Corporativos y testimoniales", "Animacion y Motion Graphics", "Contenido para Publicidad Digital (Ads)"]}
            links={["/servicios/multimedia", "/servicios/multimedia", "/servicios/multimedia", "/servicios/multimedia"]}
          />
          <ServiceItem 
            title="Desarrollo Web"
            subtitles={["Landing", "E-Commerse", "Formacion Online", "Catálogo"]}
            links={["/servicios/desarrollo", "/servicios/desarrollo", "/servicios/desarrollo", "/servicios/desarrollo"]}
          />
          <ServiceItem 
            title="Paid Media"
            subtitles={["Meta Ads", "Google Ads", "Analítica"]}
            links={["/servicios/paid-media/meta-ads", "/servicios/paid-media/google-ads", "/servicios/paid-media/analitica-web"]}
          />
          <ServiceItem 
            title="Diseño Gráfico"
            subtitles={["Branding", "Material Pop", "Gráfica y Publicidad"]}
            links={["/servicios/disenio", "/servicios/disenio", "/servicios/disenio"]}
          />
        </div>
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

      <section className="full-container black-bg testimonial-wrapper">
        <Testimonials />
      </section>

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

import { Link } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
//styles
import "../assets/styles/home.css";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import "@as/hero.css";

//components críticos (above-the-fold)
import StaticHero from "../components/StaticHero";
import ServiceTitle from "../components/services/ServiceTitle.jsx";
import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";
import AnimatedTextSection from "../components/AnimatedTextSection";
import TestimonialsSection from "../components/TestimonialsSection.jsx";

//components lazy (below-the-fold)
const Contact = lazy(() => import("../layout/Contact"));
const Beneficios = lazy(() => import("../components/Beneficios"));

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

// Componente SVG para el ícono del menú
const MenuIcon = () => {
  return (
    <div className="icon-servicios-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="99" height="99" viewBox="0 0 99 99" fill="none">
        <g clipPath="url(#clip0_3595_1967)">
          <path d="M46.0977 10.3275L88.5241 52.7539" stroke="#000000" strokeWidth="10"/>
          <path d="M46.0977 88.5251L88.5241 46.0987" stroke="#000000" strokeWidth="10"/>
          <path d="M11.9902 49.4784L86.9123 49.4784" stroke="#000000" strokeWidth="10"/>
        </g>
        <defs>
          <clipPath id="clip0_3595_1967">
            <rect x="49.498" y="98.995" width="70" height="70" transform="rotate(-135 49.498 98.995)" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

// Componente InfiniteSlider
const InfiniteSlider = ({ text, items: itemsProp }) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Si se pasa items (array), usar esos; si no, usar text como antes
  const itemsArray = itemsProp || (text ? [text] : []);
  
  // 8 copias para crear un loop infinito más fluido (se duplican para 16 totales)
  const items = Array(8).fill(itemsArray).flat();

  // Calcular duración basada en la cantidad de items y su longitud total
  const totalLength = itemsArray.reduce((sum, item) => sum + item.trim().length, 0);
  const baseDuration = 100;
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
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformOrigin: "left", width: "100%" }}
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
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformOrigin: "left", width: "100%" }}
      />
    </div>
  );
};

// Componente AnimatedLetter para animar letras individuales
const AnimatedLetter = ({ letter, index, letterDelay, baseOpacity, hasAnimated }) => {
  const delay = hasAnimated ? 0 : index * letterDelay;
  const targetOpacity = baseOpacity >= 0.9 ? 1 : Math.max(0.1, baseOpacity);

  return (
    <motion.span
      className="home-animated-letter"
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


const Home = () => {
  const [activeMenuItem, setActiveMenuItem] = useState(0); // 0: sobre nosotros, 1: servicios, 2: contacto

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
    <div className="full-container">
      <StaticHero
        desktopSrc={`${base}assets/hero/hero.webm`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <ServiceTitle titulo="Agencia Digital" subtitulo="Integramos diseño, multimedia, desarrollo, paid media y social media para construir un ecosistema <strong>digital coherente, medible y escalable.</strong>." page="home" />

      <AnimatedTextSection 
        text="Acompañamos a equipos de marketing y empresas en la planificación, ejecución y evolución de su ecosistema digital. Nos involucramos de verdad: ordenamos prioridades, activamos iniciativas y optimizamos procesos que impacten en el posicionamiento, la generación de demanda y los resultados del negocio."
        backgroundClass=""
      />

      <div className="full-container services-section-home black-bg">
        <div className="container">
          <h4 style={{ color: '#ffffff' }}>
            En Trompo trabajamos con cinco unidades integradas como un sistema coordinado que construye marca y genera resultados.
          </h4>
        </div>
        <div className="container">
          <ServiceItem 
            title="Diseño"
            subtitles={["Identidad y sistema visual que ordena, diferencia y profesionaliza."]}
          />
          <ServiceItem 
            title="Multimedia"
            subtitles={["Motion, edición y producción audiovisual para comunicar con impacto."]}
          />
          <ServiceItem 
            title="Desarrollo Web"
            subtitles={["Desarrollo Web que posiciona, convierte y escala."]}
          />
          <ServiceItem 
            title="Paid Media"
            subtitle={["Google, Meta, LinkedIn Ads, performance y posicionamiento."]}
          />
          <ServiceItem 
            title="Social Media"
            subtitle={["Contenido, comunidad y narrativa diaria que construye cultura de marca."]}
          />
        </div>
      </div>

      <Suspense fallback={null}>
        <Beneficios />
      </Suspense>

      <div className="full-container bg-white contactanos-testimonials-wrapper">
        <TestimonialsSection />
      </div>

      <div className="full-container menu-container-home-section">
        <div className="full-container">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`full-container menu-item-home-section ${activeMenuItem === index ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveMenuItem(index)}
            >
              <h4>{item.label}</h4>
              <MenuIcon />
            </div>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setActiveMenuItem(0)}
              >
                <p><span className="yellow">En Trompo no creemos en soluciones mágicas</span>. Creemos en conocimiento aplicado, trabajo riguroso y acompañamiento real. </p>
                <Link to="/nosotros" className="contact-button-home">conocé más</Link>
              </motion.div>
            )}
            {activeMenuItem === 1 && (
              <motion.div
                key="services"
                className="container menu-content-item services"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setActiveMenuItem(2)}
              >
                <p>Si querés ordenar tu marketing, escalar resultados o profesionalizar tu presencia digital, hablemos.</p>
                <Link to="/contactanos" className="contact-button-home">
                  Contactanos
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>      

      <div className="full-container infinite-slider-container">
        <InfiniteSlider items={[
          "Estrategia",
          "Innovación",
          "Contenido",
          "Resultados",
          "Creatividad",
          "Performance",
          "Leads",
          "Multimedia",
          "Escalabilidad",
          "Posicionamiento",
          "Optimización",
          "Analitica",
          "Branding",
          "Social media",
          "Ads",
          "Automatización",
          "Desarrollo"
        ]} />
      </div>

      <Suspense fallback={null}>
        <Contact form="home" />
      </Suspense>
    </div>
  );
};

export default Home;

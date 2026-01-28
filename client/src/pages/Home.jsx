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
import Beneficios from "../components/Beneficios";
import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";
import ServiceTitle from "../components/services/ServiceTitle.jsx";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

// Componente SVG para el ícono del menú
const MenuIcon = () => {
  return (
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
  );
};

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

// Componente para grid de videos del portfolio
const PortfolioVideosGrid = () => {
  const videoRefs = useRef([]);
  
  const videoNames = ['agreteq', 'denso', 'raulito', 'sw', 'viditec', 'volvo'];
  
  const handleMouseEnter = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };
  
  const handleMouseLeave = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0;
    }
  };
  
  return (
    <div className="full-container portfolio-videos-container">
      <div className="portfolio-videos-grid">
        {videoNames.map((videoName, index) => (
          <div 
            key={index} 
            className="portfolio-video-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="portfolio-video"
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={`${base}assets/portfolioImg/videos/${videoName}.mp4`} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
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
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
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
    <main className="full-container">
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/home.mp4`}
        mobileSrc={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home-mobile-poster.webp`}
      />

      <ServiceTitle titulo="Agencia Digital" subtitulo="En trompo combinamos creatividad e innovación tecnológica, para construir marcas que evolucionan" page="home" />

      <div className="full-container black-bg menu-container-home-section">
        <div className="full-container">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`full-container menu-item-home-section ${activeMenuItem === index ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveMenuItem(index)}
            >
              <h4>{item.label}</h4>
              <MenuIcon />
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
        <InfiniteSlider text="20 Años Produciendo Ideas" />
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

      <PortfolioVideosGrid />

      <div className="full-container strategy-container black-bg">
        <div className="container">
          <h3>
            Diseño Estratégico
          </h3>
          <h5> Que Convierte Ideas En Identidad</h5>
        </div>

        <div className="full-container grid-strategy">
          <div className="full-container strategy-item black-bg">
            <div className="container">
              <div className="grid-item-strategy">
                <h6>Diseño que transciende lo visual</h6>
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
                <h6>Identidad con propósito</h6>
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
                <h6>Hacer visible lo esencial</h6>
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

      <div className="full-container black-bg">
        <div className="container identidades">
            <div className="card-identidades">
              <h4>Las marcas son identidades vivas.</h4>
              <p>Nuestro propósito es concebirlas y cultivarlas desde su núcleo más auténtico. A través de un sistema de marca sólido, construimos el fundamento estratégico y visual que permite a las empresas posicionarse con claridad, diferenciarse con fuerza y potenciar su activo más valioso: su identidad en el mundo.</p>
            </div>
            <div className="span-identidades">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
      </div>

      <Beneficios />

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

import { Link } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
//styles
import "../assets/styles/home.css";
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, useSpring, AnimatePresence, useReducedMotion } from "motion/react";
import "@as/hero.css";

//components críticos (above-the-fold)
import StaticHero from "../components/StaticHero";
import ServiceTitle from "../components/services/ServiceTitle.jsx";
import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";

//components lazy (below-the-fold)
const CustomerSlider = lazy(() => import("../components/sliders/CustomerSlider.jsx"));
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
const InfiniteSlider = ({ text }) => {
  const shouldReduceMotion = useReducedMotion();
  // 8 copias para crear un loop infinito más fluido (se duplican para 16 totales)
  const items = Array(8).fill(text);

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
          duration: 30,
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
      <StaticHero
        desktopSrc={`${base}assets/hero/hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <ServiceTitle titulo="Agencia Digital" subtitulo="En Trompo hacemos tres cosas bien: <strong>claridad estratégica, creatividad aplicada y ejecución con criterio</strong>." page="home" />

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
                <p><span className="yellow">En Trompo no creemos en soluciones mágicas</span>. Creemos en conocimiento aplicado, trabajo riguroso y acompañamiento real. Ayudamos a empresas a convertir desafíos digitales en ventajas competitivas.</p>
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
        <InfiniteSlider text="Marketing orientado a resultados y mejora continua" />
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
            subtitle="Estrategia de Publicidad Digital"
            link="/servicios/paid-media"
          />
          <ServiceItem 
            title="Diseño Gráfico"
            subtitles={["Branding", "Material Pop", "Gráfica y Publicidad"]}
            links={["/servicios/disenio", "/servicios/disenio", "/servicios/disenio"]}
          />
        </div>
      </div>

      <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
        <Beneficios />
      </Suspense>

      <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
        <Contact form="home" />
      </Suspense>

      <section className="full-container">
        <div className="slider-container container">
          <Suspense fallback={<div style={{ minHeight: '100px' }} />}>
            <CustomerSlider />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default Home;

import React, { useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Contact from "../../layout/Contact.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo.jsx";
import ServiceTitle from "../../components/services/ServiceTitle.jsx";
import Inversiones from "../../components/Inversiones.jsx";
import SocialMediaShowcaseSlider from "../../components/sliders/SocialMediaShowcaseSlider.jsx";

//styles
import "../../assets/styles/social-media.css";
import "@as/hero.css";

// Componente Slider Infinito para Social Media
const SocialMediaSlider = ({ text }) => {
  const shouldReduceMotion = useReducedMotion();
  const items = Array(16).fill(text);

  return (
    <motion.div 
      className="sm-infinite-slider"
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
        pointerEvents: 'auto',
        willChange: 'transform'
      }}
    >
      {items.map((item, index) => (
        <h1 key={index} className="sm-infinite-slider-item">{item}</h1>
      ))}
      {items.map((item, index) => (
        <h1 key={`duplicate-${index}`} className="sm-infinite-slider-item">{item}</h1>
      ))}
    </motion.div>
  );
};

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;


// Componente para animar palabra por palabra basado en scroll
const AnimatedWord = ({ word, index, totalWords, scrollProgress }) => {
  // Calcular el progreso de animación para esta palabra específica
  // Cada palabra se anima cuando el scroll progress alcanza su posición
  const wordStart = index / totalWords;
  const wordEnd = (index + 1) / totalWords;
  
  // Calcular la opacidad basada en el scroll progress
  // La palabra comienza a aparecer cuando el scroll alcanza su posición inicial
  // y alcanza opacidad 1 cuando el scroll alcanza su posición final
  const opacity = React.useMemo(() => {
    if (scrollProgress < wordStart) {
      return 0.1; // Opacidad inicial antes de que comience la animación
    } else if (scrollProgress >= wordEnd) {
      return 1; // Opacidad completa cuando la palabra ha terminado de animarse
    } else {
      // Interpolación lineal entre wordStart y wordEnd
      const progress = (scrollProgress - wordStart) / (wordEnd - wordStart);
      return 0.1 + (progress * 0.9); // De 0.1 a 1
    }
  }, [scrollProgress, wordStart, wordEnd]);

  return (
    <motion.span
      style={{ opacity }}
      transition={{
        duration: 0,
        ease: "linear"
      }}
    >
      {word}{index < totalWords - 1 ? " " : ""}
    </motion.span>
  );
};

const SocialMedia = () => {
  const textContainerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: textContainerRef,
    offset: ["start end", "start 10vh"]
  });

  // Convertir el scroll progress a un valor de estado para usar en las animaciones
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Escuchar cambios en el scroll progress en tiempo real
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  const text = "Las redes sociales son el espacio donde las marcas conversan, escuchan y construyen comunidad.";
  const words = React.useMemo(() => {
    return text.split(" ");
  }, [text]);

  const yellowWordsCount = 3;

  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />
      
      <ServiceTitle titulo="Social Media" subtitulo="Dimensiones del patrón y momentos que conectan y dejan una imagen audaz." />

      <div ref={textContainerRef} className="full-container black-bg espacios">
        <div className="container">
          <h1 className="highlight-text">
            <span className="yellow">
              {words.slice(0, yellowWordsCount).map((word, index) => (
                <AnimatedWord
                  key={index}
                  word={word}
                  index={index}
                  totalWords={words.length}
                  // Hacemos que scrollProgress llegue a 1 (opacidad máxima) cuando el centro del contenedor toque el centro del viewport.
                  // Eso significa remapear el scrollProgress (que va de 0 a 1 en el actual range: "start end" a "start 10vh")
                  // Nueva lógica: al 0.5 de progress (en el centro), opacidad debe ser 1.
                  scrollProgress={Math.min(scrollProgress * 2, 1)}
                />
              ))}
            </span>
            {words.slice(yellowWordsCount).map((word, index) => (
              <AnimatedWord
                key={index + yellowWordsCount}
                word={word}
                index={index + yellowWordsCount}
                totalWords={words.length}
                scrollProgress={Math.min(scrollProgress * 1, 1)}
              />
            ))}
          </h1>
        </div>
      </div>

      <div className="full-container bg-yellow-2 portfolio-social-media-container">
        <div className="container">
          <div className="container">
            <h1 className="portfolio-title">Portfolio de Social Media</h1>
          </div>
          <SocialMediaShowcaseSlider sourceArray="social-media" />
        </div>
      </div>

      <div className="full-container black-bg how-container-social-media">
        <div className="container how-container">
          <h1><span className="yellow">Cómo</span> lo hacemos</h1>
          <p>Operamos en el cruce entre la estrategia de marca y la cultura digital, diseñando sistemas de contenido que generan conversación, coherencia y comunidad.</p>
        </div>
        <div className="container">
          <div className="grid-social-media-info-wrapper">
            <div className="grid-item-social-media-info">
              <span>01</span>
              <h6 className="question-social-media">ESTRATEGIA DE CONTENIDO & COMMUNITY</h6>
              <p>Definimos un social brand sólido: tono, personalidad y pilares claros. A partir de ahí construimos una matriz de contenido inteligente, adaptable y relevante, pensada para sostener la marca en el tiempo.</p>
            </div>
            <div className="grid-item-social-media-info">
              <span>02</span>
              <h6 className="question-social-media">CREACIÓN & DISEÑO NATIVO</h6>
              <p>Cada idea se traduce al lenguaje propio de cada plataforma. Instagram, LinkedIn, TikTok y más: el diseño no acompaña el mensaje, es parte esencial de cómo se comunica.</p>
            </div>
            <div className="grid-item-social-media-info">
              <span>03</span>
              <h6 className="question-social-media">GESTIÓN DE COMUNIDAD PROACTIVA</h6>
              <p>No publicamos y desaparecemos. Escuchamos, respondemos, incentivamos y moderamos, cuidando cada interacción y fortaleciendo el vínculo entre la marca y su comunidad.</p>
            </div>
            <div className="grid-item-social-media-info">
              <span>04</span>
              <h6 className="question-social-media">PLANIFICACIÓN & EJECUCIÓN</h6>
              <p>Organizamos el contenido a través de calendarios claros y flexibles, alineados a objetivos, momentos culturales y necesidades reales de la marca.</p>
            </div>
            <div className="grid-item-social-media-info">
              <span>05</span>
              <h6 className="question-social-media">ANÁLISIS & ADAPTACIÓN</h6>
              <p>Medimos desempeño, conversación y percepción. Aplicamos social listening y ajustamos la estrategia para evolucionar junto a la comunidad y el contexto digital.</p>
            </div>
            <div className="grid-item-social-media-info">
              <span>06</span>
              <h6 className="question-social-media">ENTREGABLES</h6>
              <p>Estrategia integral de Social Media, planificación de contenido (matriz y calendario), creación y diseño de piezas nativas (feed, stories, reels), gestión diaria de comunidades, reportes de desempeño y conversación, social listening y adaptación estratégica.</p>
            </div>
          </div>
        </div>
      </div>


      <div className="full-container sm-slider-container infinite-slider-container">
        <SocialMediaSlider text="Social Media" />
      </div>

      <Inversiones />

      <Contact form="interaccion" />
      
      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default SocialMedia;
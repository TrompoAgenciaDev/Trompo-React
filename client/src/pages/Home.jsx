import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
//styles
import "../assets/styles/home.css";
import "../assets/styles/beneficios.css";
import { motion, useReducedMotion } from "motion/react";
import "@as/hero.css";

//components críticos (above-the-fold)
import StaticHero from "../components/StaticHero";
import ServiceTitle from "../components/services/ServiceTitle.jsx";
import AnimatedTextSection from "../components/AnimatedTextSection";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import MenuHomeSectionDuplicate from "../components/MenuHomeSectionDuplicate";

//components lazy (below-the-fold)
const Contact = lazy(() => import("../layout/Contact"));

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;


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
            {link ? (
              <Link to={link} className="service-title-link">
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
              </Link>
            ) : (
              <>
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
              </>
            )}
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
          {link ? (
            <Link to={link} className="service-title-link">
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
            </Link>
          ) : (
            <>
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
            </>
          )}
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

  return (
    <div className="full-container">
      <StaticHero
        desktopSrc={`${base}assets/hero/hero.webm`}
        mobileSrc={`${base}assets/hero/mobile/hero-mobile.webm`}
        desktopPoster={`${base}assets/hero/home.webp`}
        mobilePoster={`${base}assets/hero/mobile/home.webp`}
      />

      <ServiceTitle titulo="Agencia Digital" tituloReplace="con estrategia real" subtitulo="Integramos diseño, multimedia, desarrollo, paid media y redes sociales para construir un ecosistema <strong>digital coherente, medible y escalable.</strong>" />

      <AnimatedTextSection
        text="Acompañamos a equipos de marketing y empresas en la planificación, ejecución y evolución de su ecosistema digital. Nos involucramos de verdad: ordenamos prioridades, activamos iniciativas y optimizamos procesos que impacten en el posicionamiento, la generación de demanda y los resultados del negocio."
        backgroundClass=""
      />

      <div className="full-container black-bg home-new-image">
        <picture>
          <source
            srcSet={`${base}assets/img/home-mobile.webp`}
            type="image/webp"
            media="(max-width: 767px)"
          />
          <source
            srcSet={`${base}assets/img/home.webp`}
            type="image/webp"
            media="(min-width: 768px)"
          />
          <img src={`${base}assets/home/desktop.webp`} alt="" />
        </picture>
      </div>

      <div className="full-container services-section-home black-bg">
        <div className="container">
          <h4 style={{ color: '#ffffff' }}>
            En Trompo trabajamos con cinco unidades integradas como un sistema coordinado que construye marca y genera resultados.
          </h4>
        </div>
        <div className="container">
          <ServiceItem
            title="Diseño"
            link="/servicios/disenio"
            subtitles={["Identidad y sistema visual que ordena, diferencia y profesionaliza."]}
          />
          <ServiceItem
            title="Multimedia"
            link="/servicios/multimedia"
            subtitles={["Motion, edición y producción audiovisual para comunicar con impacto."]}
          />
          <ServiceItem
            title="Desarrollo Web"
            link="/servicios/desarrollo"
            subtitles={["Desarrollo Web que posiciona, convierte y escala."]}
          />
          <ServiceItem
            title="Paid Media"
            link="/servicios/paid-media"
            subtitle={["Google, Meta, LinkedIn Ads, performance y posicionamiento."]}
          />
          <ServiceItem
            title="Redes Sociales"
            link="/servicios/social-media"
            subtitle={["Contenido, comunidad y narrativa diaria que construye cultura de marca."]}
          />
        </div>
      </div>

      <div className="full-container clients-img-container black-bg">
        <div className="grid-container-img">
          <div className="grid-item-client"></div>
          <div className="grid-item-client"></div>
          <div className="grid-item-client"></div>
          <div className="grid-item-client"></div>
          <div className="grid-item-client"></div>
          <div className="grid-item-client"></div>
          <div className="grid-item-client"></div>
        </div>
      </div>

      <div className="full-container beneficios-container black-bg">
        <div className="container title-beneficios">
          <h3>Beneficios diferenciales</h3>
          <h5>que aporta nuestra metodología</h5>
        </div>
        <div className="container">
          <div className="grid-beneficios">
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="78" height="63" viewBox="0 0 78 63" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M45.9594 58.8817C31.3315 67.3724 12.5358 62.3091 4.09035 47.6028C-4.35509 32.8966 0.704931 14.0415 15.3328 5.55082C26.5503 -0.960289 40.4448 0.338323 50.2206 8.489L49.481 8.91831C48.6181 9.41916 48.0336 10.3093 47.9027 11.3216L47.3474 14.8385C39.8116 7.5357 28.1221 5.78348 18.6304 11.2929C7.12526 17.9709 3.18306 32.7622 9.80181 44.2877C16.4443 55.8544 31.1568 59.8177 42.6619 53.1397C52.1536 47.6303 56.4653 36.5352 53.9424 26.3226L57.2733 27.6389C58.1871 27.9898 59.2461 27.9259 60.109 27.4251L60.8486 26.9958C63.0055 39.6239 57.1769 52.3706 45.9594 58.8817ZM19.7216 13.1931C9.28485 19.2511 5.73107 32.7153 11.733 43.1667C17.7587 53.6594 31.1101 57.256 41.5469 51.1981C50.6688 45.9034 54.5221 34.9641 51.3309 25.3048L50.0456 24.784L45.197 27.5983C47.2983 34.3101 44.5598 41.8483 38.2731 45.4973C30.9592 49.7427 21.6261 47.2285 17.4034 39.8754C13.2044 32.5635 15.7052 23.1805 23.0191 18.9352C29.3059 15.2861 37.1685 16.6709 41.8758 21.815L46.7244 19.0006L46.9421 17.6625C40.1934 10.013 28.8435 7.89838 19.7216 13.1931ZM24.1104 20.8354C17.8648 24.4607 15.7524 32.5166 19.3346 38.7544C22.9405 45.0335 30.9125 47.181 37.1581 43.5558C42.3765 40.5268 44.7503 34.357 43.2247 28.7431L32.2949 35.0873C30.6924 36.0174 28.6832 35.4762 27.758 33.8651C26.8565 32.2954 27.3711 30.2341 28.9736 29.3039L39.9035 22.9598C35.8304 18.8246 29.3288 17.8064 24.1104 20.8354Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M62.3907 15.0847L31.2036 33.187C30.6695 33.4971 29.9565 33.305 29.6481 32.768C29.3397 32.231 29.5545 31.5555 30.0886 31.2455L61.2757 13.1432C61.8098 12.8331 62.458 13.0077 62.7664 13.5448C63.0748 14.0818 62.9248 14.7747 62.3907 15.0847Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M49.3983 22.1304L49.3335 22.1129L49.3097 22.0716L49.2686 22.0954L49.2212 22.0128L49.1801 22.0367L49.1327 21.9541L49.0916 21.9779L49.0204 21.854L48.9793 21.8778L48.6946 21.3821L48.7357 21.3583L48.6646 21.2343L48.7057 21.2105L48.6582 21.1279L48.6993 21.104L48.6756 21.0627L48.7167 21.0389L48.6692 20.9562L48.7103 20.9324L50.0699 11.661C50.0919 11.3177 50.3084 11.0268 50.596 10.8599L55.198 8.18864L53.7406 17.9575L53.7232 18.0227C53.747 18.064 53.7059 18.0878 53.7296 18.1291L53.7533 18.1704L53.7122 18.1943L53.736 18.2356L53.7186 18.3008C53.7249 18.4072 53.7961 18.5312 53.8262 18.6789L53.8974 18.8029C53.9859 18.8616 54.0333 18.9443 54.1219 19.003L54.1693 19.0856L54.2104 19.0618L54.2579 19.1444L54.299 19.1206L54.3227 19.1619L54.3875 19.1793L54.4112 19.2206L54.4523 19.1968L63.5786 22.8775L59.0177 25.5248C58.7301 25.6918 58.3475 25.6935 58.0646 25.5823L49.3983 22.1304ZM57.6634 6.75763L64.2377 2.9416L62.7392 12.7343L62.763 12.7756L62.7219 12.7995C62.7456 12.8408 62.7456 12.8408 62.7282 12.9059L62.752 12.9472L62.7109 12.9711L62.7583 13.0537C62.7647 13.1602 62.7947 13.308 62.8659 13.4319L62.9371 13.5558C62.9845 13.6384 63.032 13.7211 63.1205 13.7798L63.1442 13.8211L63.1853 13.7973L63.2328 13.8799L63.2976 13.8974L63.3213 13.9387C63.3624 13.9148 63.3861 13.9561 63.3861 13.9561L63.4509 13.9736L72.5773 17.6543L66.0029 21.4703L56.0688 17.4323L57.6634 6.75763ZM66.662 1.53444L69.0452 0.151124C69.415 -0.0635281 69.8624 -0.0477808 70.2165 0.187296C70.5707 0.422374 70.7668 0.859322 70.7274 1.26774L69.464 9.65717L77.3462 12.7932C77.7177 12.9631 77.9723 13.311 77.9977 13.7369C78.0231 14.1628 77.8368 14.6014 77.4669 14.8161L75.0427 16.2232L65.0674 12.2091L66.662 1.53444Z" fill="#E1C025" />
              </svg>
              <h6>Diagnóstico</h6>
              <p>Entendemos antes de ejecutar. Marca, negocio, contexto y audiencias bajo una misma lectura estratégica.</p>
            </div>
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M68.2188 60.5586H5.78125C4.48047 60.5586 3.46875 59.4023 3.46875 58.1016V15.8984C3.46875 14.4531 4.48047 13.4414 5.78125 13.4414H18.2109C18.6445 13.4414 19.0781 13.7305 19.0781 14.3086L17.3438 15.1758H5.78125C5.63672 15.1758 5.49219 15.1758 5.34766 15.3203C5.20312 15.4648 5.20312 15.6094 5.20312 15.8984V58.1016V52.0312H68.7969V15.8984C68.7969 15.4648 68.5078 15.1758 68.2188 15.1758H63.8828L63.7383 13.1523L68.2188 13.4414C69.5195 13.4414 70.5312 14.4531 70.5312 15.8984V58.1016C70.5312 59.4023 69.5195 60.5586 68.2188 60.5586ZM51.5977 59.1133C50.0078 59.1133 48.707 57.957 48.707 56.3672C48.707 54.7773 50.0078 53.4766 51.5977 53.4766C53.1875 53.4766 54.4883 54.7773 54.4883 56.3672C54.4883 57.957 53.1875 59.1133 51.5977 59.1133ZM59.1133 59.1133C57.5234 59.1133 56.2227 57.957 56.2227 56.3672C56.2227 54.7773 57.5234 53.4766 59.1133 53.4766C60.7031 53.4766 61.8594 54.7773 61.8594 56.3672C61.8594 57.957 60.7031 59.1133 59.1133 59.1133Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M42.6367 68.2188H31.3633C30.9297 68.2188 30.4961 67.9297 30.4961 67.3516V62.293H43.5039V67.3516C43.5039 67.9297 43.0703 68.2188 42.6367 68.2188Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M51.7422 74H22.2578C21.9688 74 21.8242 73.8555 21.6797 73.7109C21.5352 73.5664 21.3906 73.4219 21.3906 73.1328V70.2422C21.3906 68.2188 23.125 66.4844 25.1484 66.4844H48.8516C50.875 66.4844 52.6094 68.2188 52.6094 70.2422V73.1328C52.6094 73.5664 52.1758 74 51.7422 74Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M55.7891 47.4062H18.2109C17.7773 47.4062 17.3438 47.1172 17.3438 46.5391V2.89062C17.3438 2.45703 17.7773 2.02344 18.2109 2.02344H55.7891C56.2227 2.02344 56.6562 2.45703 56.6562 2.89062V5.92578L43.3594 29.0508V29.1953H43.2148V29.3398V29.4844H43.0703V29.6289V30.0625L41.9141 40.4688C42.2031 41.0469 42.6367 41.625 43.2148 41.9141C43.5039 42.0586 43.9375 42.2031 44.5156 42.2031C45.0938 42.2031 45.5273 42.0586 45.9609 41.7695L53.4766 36.1328H53.6211V35.9883H53.7656V35.8438H53.9102V35.6992H54.0547V35.5547V35.4102H54.1992V35.2656L56.6562 31.0742V46.5391C56.6562 47.1172 56.2227 47.4062 55.7891 47.4062ZM38.5898 40.4688H35.4102C34.9766 40.4688 34.543 40.1797 34.543 39.6016C34.543 39.168 34.9766 38.7344 35.4102 38.7344H38.5898C39.0234 38.7344 39.457 39.168 39.457 39.6016C39.457 40.1797 39.0234 40.4688 38.5898 40.4688ZM31.6523 40.4688H28.4727C28.0391 40.4688 27.6055 40.1797 27.6055 39.6016C27.6055 39.168 28.0391 38.7344 28.4727 38.7344H31.6523C32.0859 38.7344 32.5195 39.168 32.5195 39.6016C32.5195 40.1797 32.0859 40.4688 31.6523 40.4688ZM24.7148 40.4688H21.5352C20.957 40.4688 20.668 40.1797 20.668 39.6016C20.668 39.168 20.957 38.7344 21.5352 38.7344H24.7148C25.1484 38.7344 25.582 39.168 25.582 39.6016C25.582 40.1797 25.1484 40.4688 24.7148 40.4688ZM30.0625 25.1484C29.7734 25.1484 29.6289 25.0039 29.4844 24.8594L26.7383 22.2578C26.4492 21.8242 26.4492 21.2461 26.7383 20.957C27.1719 20.668 27.6055 20.668 28.0391 20.957L30.0625 22.9805L34.543 18.6445C34.832 18.2109 35.4102 18.2109 35.6992 18.6445C36.1328 18.9336 36.1328 19.5117 35.6992 19.8008L30.6406 24.8594C30.4961 25.0039 30.3516 25.1484 30.0625 25.1484ZM31.2188 32.0859C25.582 32.0859 20.957 27.4609 20.957 21.6797C20.957 16.043 25.582 11.418 31.2188 11.418C37 11.418 41.625 16.043 41.625 21.6797C41.625 27.4609 37 32.0859 31.2188 32.0859ZM31.2188 13.1523C26.4492 13.1523 22.6914 16.9102 22.6914 21.6797C22.6914 26.4492 26.4492 30.3516 31.2188 30.3516C35.9883 30.3516 39.8906 26.4492 39.8906 21.6797C39.8906 16.9102 35.9883 13.1523 31.2188 13.1523Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M44.5157 40.4688C44.3712 40.4688 44.2267 40.4688 44.0821 40.4688C43.7931 40.1797 43.504 39.8906 43.6486 39.6016L44.5157 32.6641L50.5861 36.1328L44.9493 40.3242C44.8048 40.4688 44.6603 40.4688 44.5157 40.4688Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M52.0313 34.832C51.8867 34.832 51.7422 34.832 51.5977 34.6875L45.2383 31.0742C44.9492 30.9297 44.8047 30.7852 44.8047 30.4961C44.6602 30.3516 44.8047 30.0625 44.8047 29.918L59.4024 4.76953C59.6914 4.33594 60.125 4.19141 60.5586 4.33594L66.918 8.09375C67.2071 8.23828 67.3516 8.38281 67.3516 8.52734C67.3516 8.81641 67.3516 9.10547 67.2071 9.25L52.7539 34.3984C52.6094 34.6875 52.3203 34.832 52.0313 34.832Z" fill="#E1C025" />
                <path fillRule="evenodd" clipRule="evenodd" d="M66.4844 9.68359C66.3398 9.68359 66.1953 9.68359 66.0508 9.53906L59.6914 5.92578C59.2578 5.63672 59.1133 5.05859 59.4023 4.76953L61.8594 0.433594C62.0039 0.289062 62.1484 0.144531 62.4375 0C62.582 0 62.8711 0 63.0156 0.144531L69.375 3.75781C69.8086 4.04688 69.9531 4.625 69.6641 4.91406L67.207 9.25C67.0625 9.53906 66.7734 9.68359 66.4844 9.68359Z" fill="#E1C025" />
              </svg>
              <h6>Dirección</h6>
              <p>Definimos rumbo, no tácticas sueltas. Roadmap digital claro, prioridades bien ordenadas y foco en impacto.</p>
            </div>
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
                <g clipPath="url(#clip0_2493_937)">
                  <path d="M74.9878 33.1722C74.9241 32.5649 74.6116 32.011 74.125 31.6423L68.1841 27.1422L70.3456 20.01C70.5227 19.4254 70.45 18.7937 70.1447 18.2648C69.8395 17.736 69.3287 17.3572 68.7341 17.2183L61.4761 15.5236L60.5496 8.12865C60.4737 7.52279 60.1504 6.97523 59.6563 6.61649C59.1625 6.25731 58.5417 6.11874 57.9422 6.23402L50.6226 7.63793L46.7679 1.25926C46.4521 0.736754 45.934 0.368052 45.3367 0.241197C44.7394 0.114195 44.1162 0.240025 43.6151 0.589097L37.4998 4.84872L31.3842 0.589244C30.883 0.240318 30.2597 0.114342 29.6626 0.241344C29.0653 0.368199 28.5473 0.736754 28.2315 1.25956L24.3773 7.63836L17.0578 6.23446C16.4581 6.11962 15.8374 6.2579 15.3435 6.61693C14.8495 6.97582 14.5261 7.52308 14.4504 8.12909L13.5238 15.5241L6.26584 17.2187C5.67111 17.3576 5.16061 17.7364 4.85519 18.2652C4.54992 18.7942 4.47726 19.4257 4.65422 20.01L6.81545 27.1425L0.874921 31.6423C0.388153 32.011 0.0758483 32.5647 0.0121276 33.1721C-0.0517395 33.7794 0.138544 34.386 0.538153 34.8478L5.4133 40.4847L1.81638 47.0119C1.52165 47.5467 1.46159 48.1797 1.65026 48.7605C1.83908 49.341 2.25964 49.8178 2.81247 50.0772L9.55895 53.2436L8.92775 60.6698C8.8759 61.2783 9.07834 61.8811 9.48718 62.3349C9.89558 62.7887 10.474 63.053 11.0844 63.0653L18.5361 63.2138L20.9798 70.2544C21.1799 70.8313 21.6099 71.2997 22.1677 71.548C22.7258 71.7966 23.3614 71.8026 23.9242 71.5656L30.7923 68.6706L35.8885 74.1087C36.3061 74.5543 36.8894 74.8072 37.5 74.8072C38.1107 74.8072 38.694 74.5543 39.1116 74.1087L44.2079 68.6706L51.0754 71.5656C51.6381 71.8025 52.2739 71.7962 52.8318 71.548C53.3896 71.2997 53.8198 70.8316 54.0199 70.2546L56.4638 63.2138L63.9152 63.0653C64.5256 63.0531 65.1039 62.7887 65.5125 62.3349C65.921 61.8811 66.1236 61.2785 66.0719 60.6698L65.4407 53.2436L72.1876 50.0772C72.7406 49.8178 73.1611 49.341 73.3498 48.7603C73.5385 48.1798 73.4784 47.5467 73.1836 47.0117L69.5863 40.4846L74.4619 34.8477C74.8612 34.3861 75.0515 33.7794 74.9878 33.1722ZM37.4998 58.6344C25.8461 58.6344 16.3654 49.1535 16.3654 37.4999C16.3654 25.8464 25.8463 16.3655 37.4998 16.3655C49.1534 16.3655 58.6343 25.8465 58.6343 37.4999C58.6343 49.1534 49.1534 58.6344 37.4998 58.6344Z" fill="#E1C025" />
                  <path d="M37.4998 20.7827C28.282 20.7827 20.7827 28.282 20.7827 37.4998C20.7827 46.7176 28.2821 54.2169 37.4998 54.2169C46.7179 54.2169 54.2169 46.7176 54.2169 37.4998C54.2169 28.282 46.7178 20.7827 37.4998 20.7827ZM46.1588 34.3303L36.696 43.7931C36.2646 44.2243 35.6995 44.4401 35.1342 44.4401C34.5691 44.4401 34.0038 44.2243 33.5727 43.7931L28.841 39.0616C27.9786 38.1993 27.9786 36.8008 28.841 35.9381C29.7033 35.0758 31.102 35.0755 31.9645 35.9381L35.1342 39.1078L43.0353 31.2068C43.8978 30.3445 45.2963 30.3442 46.1589 31.2068C47.0213 32.0693 47.0213 33.4678 46.1588 34.3303Z" fill="#E1C025" />
                </g>
                <defs>
                  <clipPath id="clip0_2493_937">
                    <rect width="75" height="75" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h6>Producción</h6>
              <p>Creamos activos que activan. Diseño, contenido y desarrollo listos para convertir y escalar.</p>
            </div>
            <div className="grid-item-beneficios">
              <svg className="beneficios-icon" xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 69 69" fill="none">
                <path d="M68.4545 26.6504C68.0819 25.9779 67.5356 25.4177 66.8726 25.0284C66.2096 24.6392 65.4542 24.4351 64.6853 24.4375H23.8227C22.445 24.4375 21.1044 24.8843 20.0023 25.7109C18.9001 26.5375 18.0958 27.6993 17.71 29.0219L9.62191 56.7525C9.1961 58.2123 8.30831 59.4946 7.09179 60.407C5.87526 61.3194 4.39564 61.8125 2.875 61.8125H54.2625C55.7834 61.8125 57.2633 61.3192 58.4801 60.4066C59.6968 59.4941 60.5848 58.2115 61.0107 56.7514L68.7752 30.1313C68.9558 29.5589 69.0205 28.9562 68.9654 28.3586C68.9103 27.7609 68.7366 27.1802 68.4545 26.6504Z" fill="#E1C025" />
                <path d="M6.85687 55.9475L14.95 28.2181C15.5138 26.3011 16.6818 24.6176 18.2801 23.4183C19.8783 22.219 21.8212 21.568 23.8194 21.5625H60.375V20.125C60.375 18.6 59.7692 17.1375 58.6909 16.0591C57.6125 14.9808 56.15 14.375 54.625 14.375H32.7113C32.2829 14.375 31.8599 14.2795 31.4731 14.0955C31.0863 13.9115 30.7453 13.6436 30.475 13.3113L27.6493 9.83667C26.9762 9.00903 26.127 8.34182 25.1636 7.88356C24.2002 7.42531 23.1468 7.18752 22.08 7.1875H5.75C4.22501 7.1875 2.76247 7.7933 1.68414 8.87164C0.605802 9.94997 0 11.4125 0 12.9375L0 56.0625C0 56.825 0.302901 57.5563 0.842068 58.0954C1.38124 58.6346 2.1125 58.9375 2.875 58.9375C3.77236 58.935 4.6449 58.6426 5.36248 58.1038C6.08006 57.5649 6.60425 56.8086 6.85687 55.9475Z" fill="#E1C025" />
              </svg>
              <h6>Optimización</h6>
              <p>Medimos para crecer, no para reportar. Datos, decisiones y mejora continua orientada a resultados reales.</p>
            </div>
          </div>
        </div>
      </div>

      {/*
      <div className="full-container bg-white contactanos-testimonials-wrapper">
        <TestimonialsSection />
      </div>


      <MenuHomeSectionDuplicate />

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
          "Redes sociales",
          "Ads",
          "Automatización",
          "Desarrollo"
        ]} />
      </div>
      */}

      <Suspense fallback={null}>
        <Contact form="home" />
      </Suspense>
    </div>
  );
};

export default Home;

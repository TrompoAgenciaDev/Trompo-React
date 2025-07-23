import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icons from '../components/Icons';
import '../assets/styles/about.css';

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="about container">
      <div className="about-container">
        <div className="about about-left">
          <div className="about-title-sction"></div>
          <div className="about-acordeon">
            {/* Acordeón Item 1 */}
            <div className="acordeon-item" onClick={() => handleAccordionClick(1)}>
              <div className="acordeon-title">
                <h3>Quienes Somos</h3>
                <Icons iconName="customBlackCircle"/>
              </div>            
              <AnimatePresence>
                {activeIndex === 1 && (
                  <motion.div
                    className="acordeon-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        opacity: { duration: 0.2 },
                        height: { duration: 0.3, ease: "easeInOut" }
                      }
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        opacity: { duration: 0.15 },
                        height: { duration: 0.25, ease: "easeInOut" }
                      }
                    }}
                  >
                    <div className="acordeon-content-inner">
                      <img className="acordeon-img" src="/assets/aboutImg/quienes-somos.png" alt="Trompo Imagen" />
                      <div className="text-content">
                        <p>Somos un <span className='bold-text'>movimiento</span></p>
                        <p> que <span className='bold-text'>construye marcas</span> </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Acordeón Item 2 */}
            <div className="acordeon-item" onClick={() => handleAccordionClick(0)}>
              <div className="acordeon-title">
                <h3>Portfolios</h3>
                <Icons iconName="customBlackCircle"/>
              </div>            

              <AnimatePresence>
                {activeIndex === 0 && (
                  <motion.div
                    className="acordeon-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        opacity: { duration: 0.2 },
                        height: { duration: 0.3, ease: "easeInOut" }
                      }
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        opacity: { duration: 0.15 },
                        height: { duration: 0.25, ease: "easeInOut" }
                      }
                    }}
                  >
                    <div className="acordeon-content-inner">
                      <img className="acordeon-img" src="/assets/aboutImg/portfolio.png" alt="Western Union" />
                      <div className="text-content">
                        <p className='bold-text'>Proyectos que conectan.</p>
                        <p> ideas que impactan. </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Acordeón Item 3 */}
            <div className="acordeon-item" onClick={() => handleAccordionClick(2)}>
              <div className="acordeon-title">
                <h3>Noticias</h3>
                <Icons iconName="customBlackCircle"/>
              </div>            
              <AnimatePresence>
                {activeIndex === 2 && (
                  <motion.div
                    className="acordeon-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        opacity: { duration: 0.2 },
                        height: { duration: 0.3, ease: "easeInOut" }
                      }
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        opacity: { duration: 0.15 },
                        height: { duration: 0.25, ease: "easeInOut" }
                      }
                    }}
                  >
                    <div className="acordeon-content-inner">
                      <img className="acordeon-img" src="/assets/aboutImg/noticias.png" alt="Trompo Imagen" />
                      <div className="text-content">
                        <p> Enterate de las </p>
                        <p><span className='bold-text'>Noticias</span> del mundo digital</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="about about-right">
          <div className="text-section">
            <span>
              COMBINAMOS <span className='text-y'>CREATIVIDAD, ESTRATEGIA Y tecnología </span> para diseñar soluciones integrales que generan impacto. Con un equipo interdisciplinario y años de experiencia, nos especializamos en entender las necesidades de cada cliente y convertirlas en oportunidades que impulsen su crecimiento.
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default About;
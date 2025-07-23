import { motion, useCycle } from 'framer-motion';
import { useState } from 'react';
import MixBlendCursor from "./customCursors/MixBlendCursor";

// styles
import './assets/styles/estrategias-text.css';

function EstrategiesText() {
  const [revealText, setRevealText] = useState(false);
  const handleRevealing = () => {
    setRevealText(!revealText);
  };

  const [animate, cycle] = useCycle(
    { scale: 1.5, rotate: 0 },
    { scale: 1, rotate: 180 }
  );

  return (
    <div 
      className="et-container"
    >
      <div className="et-text">
        <h1>
          Estrategias que Convierten <br />
          <span className="hover-y">Marketing en Crecimiento.</span>          
          <MixBlendCursor/>
        </h1>
        <motion.button 
          onClick={handleRevealing}
          className="showText"
          animate={animate}
          onTap={cycle}
        >
          <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)">
              <circle cx="8.5" cy="8.5" r="8"/>
              <path d="m5.466 7.466 3 3.068 3-3.068"/>
            </g>
          </svg>
        </motion.button>
        <div
          className={ revealText ? 'description-container animated-height' : 'description-container' }  
        >
          <motion.p
            className="text et-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
            }}
          >
            Nuestro enfoque combina creatividad, estrategia y tecnología para diseñar soluciones integrales que generan impacto. Con un equipo interdisciplinario y años de experiencia, nos especializamos en entender las necesidades de cada cliente y convertirlas en oportunidades que impulsen su crecimiento.
          </motion.p>
          <motion.span
            className="hover-y text-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
            }}
          >
            VANGUARDIA DIGITAL
          </motion.span>

          <motion.p
            className="et-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1,
              duration: 0.5,
            }}
          >
            ¡Analizamos, creamos, medimos e innovamos!
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default EstrategiesText;

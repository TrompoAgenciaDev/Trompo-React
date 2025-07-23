import {useRef} from 'react';

//styles
import '../../assets/styles/card.css'
import { motion, useScroll, useTransform } from 'framer-motion'

function SocialMedia () {
  
  const targetRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: targetRef,
    offset: ["start start", "end 130%"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], ['1', '.9']);

  return (
    <div className="str-card-container">
      <motion.div 
        className='card stikcy card-grey'
        ref={targetRef}
        style={{scale}}
      >
        <div className="str-card-header">
          <h2>Social Media</h2>
          <span>Donde nace la estrategia</span>
        </div>
        <div className="str-card-body">        
          <p>Nada transforma más que el conocimiento, y la analítica es el núcleo de esa transformación. Analizamos las interacciones de los usuarios para descubrir patrones, medir resultados y optimizar cada paso del proceso digital. Este eje asegura que las decisiones estratégicas no solo sean precisas, sino que estén respaldadas por datos confiables. En Trompo Agencia, convertimos números en historias y estadísticas en estrategias.</p>
        </div>
        <div className="str-card-footer">
          <img src="./card-footer.png" alt="Social Media" />
        </div>
      </motion.div>
    </div>
  );
}


export default SocialMedia;
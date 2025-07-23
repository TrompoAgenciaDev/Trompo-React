import {useRef} from 'react';

//styles
import '../../assets/styles/card.css'
import { motion, useScroll, useTransform } from 'framer-motion'

function Analitica () {
  
  const targetRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], ['1', '.98']);
  
  return (
    <div className="str-card-container">
      <motion.div 
        className='card card-golden'
        ref={targetRef}
        style={{scale}}
      >
        <div className="str-card-header">
          <h2>Analítica</h2>
          <span>Decisiones basadas en datos</span>
        </div>
        <div className="str-card-body">        
          <p>Nada transforma más que el conocimiento, y la analítica es el núcleo de esa transformación. Analizamos las interacciones de los usuarios para descubrir patrones, medir resultados y optimizar cada paso del proceso digital. Este eje asegura que las decisiones estratégicas no solo sean precisas, sino que estén respaldadas por datos confiables. En Trompo Agencia, convertimos números en historias y estadísticas en estrategias.</p>
        </div>
        <div className="str-card-footer">
          <img src="./card-footer.png" alt='Analítica' />
        </div>
      </motion.div>
    </div>
  );
}


export default Analitica;
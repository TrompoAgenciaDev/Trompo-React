//cards
import Planning from './strategies/Planning';
import Creatividad from './strategies/Creatividad';
import SocialMedia from './strategies/SocialMedia';
import Analitica from './strategies/Analitica';
import Audiencias from './strategies/Audiencias';

import { motion } from "framer-motion";
import '../assets/styles/extra-title.css'

export default function ExtraTitleSection() {

  return (
    <>
      <motion.section 
        className="container trompo-bg"
        initial={{
          opacity: 0,
          scale: .5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: .5,
          type:'tween',
        }}
      >
        <div className="extra-container">
          <h2 className="title-section">Estrategia digital aplicada</h2>
          <h1 className="subtitle-section">
            Nuestra <strong> base estratégica</strong>
          </h1>
        </div>
        
        
      </motion.section>
      
      <div>
        <Planning/>
        <Creatividad/>
        <SocialMedia/>
        <Audiencias/>
        <Analitica/>
      </div>
    </>
  );
}
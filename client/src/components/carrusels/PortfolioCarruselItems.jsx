import { motion } from 'framer-motion';
import { useState } from 'react'

import '../assets/styles/portfolio-items.css'


function PortfolioCarruselItem({id, title, backgroundImage, enlacePortfolio}) {


  const [velocityReduction, setVelocityReduction] = useState(50)

  const SlowSpeed = () => {
    setVelocityReduction(5);
  }
  const NormalSpeed = () => {
    setVelocityReduction(260);
  }

  return (
    <motion.a
      onMouseOver={SlowSpeed}
      onMouseLeave={NormalSpeed}
      animate={{
        x: ["-0%", "-300%"],
      }}
      transition={{
        ease: "linear",
        duration: velocityReduction,
        repeat: Infinity,
      }}
      href={enlacePortfolio} data-id={id} className="portfolio-card">
      <div className="portfolio-card" style={{backgroundImage: `url(${backgroundImage})`}}>
        <h2 className='portfolio-title'>{title}</h2>
      </div>
    </motion.a>
  );
}


export default PortfolioCarruselItem;
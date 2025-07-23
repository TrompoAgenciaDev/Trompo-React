import {useState, useEffect, react} from 'react'
import { motion } from 'framer-motion'

//styles
import '../assets/styles/cursor.css'

function MixBlendCursor () {

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  })

  useEffect(() => {
    const mouseMove = e => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove)
    }
  }, []);

  const variants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
    }
  }

  return(
    <motion.div
      className='mix-cursor'
      variants={variants}
      animate="default"
    />
  )
}

export default MixBlendCursor;
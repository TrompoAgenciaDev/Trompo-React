import {motion} from 'framer-motion'

const ScrollingContainer = () => {
  return (
    <motion.div
      className='container'
      initial={{
        scale: .50,
      }}
      whileInView={{
        scale: 1,
        transition: {
          duration: 3,
        }
      }}
    >
    </motion.div>
  );
}


export default ScrollingContainer;
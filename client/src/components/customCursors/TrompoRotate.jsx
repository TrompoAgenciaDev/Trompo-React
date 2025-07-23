import { useEffect, useState } from "react";
import { useHover } from "../../context/HoverContext";
import Icons from "../Icons"; 
import '../../assets/styles/custom-cursor.css';
import { motion } from "framer-motion";

const CustomCursor = ({ icon }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: event.clientX,
          y: event.clientY + window.scrollY,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  //handle hover
  const { hoverComponent } = useHover();

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
      }}
      animate={{
        x: mousePosition.x + 20,
        y: mousePosition.y - 800,
        scale: hoverComponent ? 1.3 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className='custom-cursor'
    >
      {hoverComponent ? (
        <motion.span 
          className="custom-cursor-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          Ver
          <Icons iconName='arrowTr'/>
        </motion.span>
      ) : (
        <motion.img 
          src={icon} 
          alt="custom-cursor" 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
        />
      )}
    </motion.div>
  );
};

export default CustomCursor;
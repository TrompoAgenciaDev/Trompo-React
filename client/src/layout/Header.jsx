import { useState } from "react";
import routesConfig from "../config/routesConfig";

import Icons from '../components/Icons';

//styles & animations
import '../assets/styles/header.css'
import { motion } from "framer-motion";

const Header = ({onTogglePopup}) => {
  const [showPopuup, setShowPopup] = useState(false);

  return (
    <header className="full-container">
      <div className="container header">
        <motion.a
          className="logo-img"
          href="/"
          initial={{
            y: -250,
          }}
          animate={{
            y: 0,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 350,
          }}
        >
          <Icons iconName="logoBlack"/>
        </motion.a>
        
        <motion.button
          className="nav-button"
          initial={{
            y: -250,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            type: "spring",
            damping: 28,
            stiffness: 350,
          }}
          onClick={onTogglePopup}
        >

          <Icons iconName={"burguer"}/>

        </motion.button>
      </div>
    </header>
  );
};

export default Header;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import routesConfig from "../config/routesConfig";
import "../assets/styles/menu-home-section-duplicate.css";

// Componente SVG para el ícono del menú
const MenuIcon = () => {
  return (
    <div className="icon-servicios-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="99" height="99" viewBox="0 0 99 99" fill="none">
        <g clipPath="url(#clip0_3595_1967)">
          <path d="M46.0977 10.3275L88.5241 52.7539" stroke="#000000" strokeWidth="10"/>
          <path d="M46.0977 88.5251L88.5241 46.0987" stroke="#000000" strokeWidth="10"/>
          <path d="M11.9902 49.4784L86.9123 49.4784" stroke="#000000" strokeWidth="10"/>
        </g>
        <defs>
          <clipPath id="clip0_3595_1967">
            <rect x="49.498" y="98.995" width="70" height="70" transform="rotate(-135 49.498 98.995)" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

const MenuHomeSectionDuplicate = () => {
  const [activeMenuItem, setActiveMenuItem] = useState(0); // 0: sobre nosotros, 1: servicios, 2: contacto

  const menuItems = [
    { 
      label: "sobre nosotros", 
      path: "/nosotros",
      contentKey: "about"
    },
    { 
      label: "servicios", 
      path: "/servicios",
      contentKey: "services"
    },
    { 
      label: "contacto", 
      path: "/contactanos",
      contentKey: "contact"
    }
  ];

  return (
    <div className="full-container menu-container-home-section">
      <div className="full-container">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`full-container menu-item-home-section ${activeMenuItem === index ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveMenuItem(index)}
          >
            <h4>{item.label}</h4>
            <MenuIcon />
          </div>
        ))}
      </div>
      <div 
        className="full-container menu-content-container"
        onMouseLeave={() => setActiveMenuItem(0)}
      >
        <AnimatePresence mode="wait">
          {activeMenuItem === 0 && (
            <motion.div
              key="about"
              className="container menu-content-item about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setActiveMenuItem(0)}
            >
              <p><span className="yellow">En Trompo no creemos en soluciones mágicas</span>. Creemos en conocimiento aplicado, trabajo riguroso y acompañamiento real. </p>
              <Link to="/nosotros" className="contact-button-home">conocé más</Link>
            </motion.div>
          )}
          {activeMenuItem === 1 && (
            <motion.div
              key="services"
              className="container menu-content-item services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setActiveMenuItem(1)}
            >
              <Menu
                menuType="servicios"
                routes={routesConfig}
                classMenu="servicios-options grid-menu"
                location="gsap"
              />
            </motion.div>
          )}
          {activeMenuItem === 2 && (
            <motion.div
              key="contact"
              className="container menu-content-item contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setActiveMenuItem(2)}
            >
              <p>Si querés ordenar tu marketing, escalar resultados o profesionalizar tu presencia digital, hablemos.</p>
              <Link to="/contactanos" className="contact-button-home">
                Contactanos
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MenuHomeSectionDuplicate;

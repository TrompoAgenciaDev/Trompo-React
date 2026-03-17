import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import routesConfig from "../config/routesConfig";

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

const MenuHomeSection = () => {
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
    <>
      <style>{`
        .menu-container-home-section{
          height: 500px;
          position: relative;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          background-color: #FEE070 !important;
        }

        /* Mobile: altura automática */
        @media (max-width: 767px) {
          .menu-container-home-section{
            height: auto;
            min-height: 500px;
          }
        }

        .menu-container-home-section.black-bg{
          background-color: #FEE070 !important;
        }

        .menu-container-home-section > .full-container:first-child{
          display: flex;
          flex-direction: column;
        }

        .menu-item-home-section{
          cursor: pointer;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background-color 0.3s ease, color 0.3s ease;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          text-decoration: none;
        }

        .menu-item-home-section h4{
          color: #000000;
          font-weight: 400;
          text-transform: lowercase;
          margin: 0;
          transition: color 0.3s ease;
        }

        .menu-item-home-section .icon-servicios-container{
          width: 50px;
          height: 50px;
        }

        .menu-item-home-section svg{
          width: 100%;
          height: 100%;
          flex-shrink: 0;
          transition: stroke 0.3s ease;
        }

        .menu-item-home-section svg path{
          stroke: #000000;
        }

        .menu-item-home-section.is-active,
        .menu-item-home-section:hover{
          background-color: #262626;
        }

        .menu-item-home-section.is-active h4,
        .menu-item-home-section:hover h4{
          color: #ffffff;
        }

        .menu-item-home-section.is-active svg path,
        .menu-item-home-section:hover svg path{
          stroke: #ffffff;
        }

        .menu-content-container{
          position: relative;
          min-height: 200px;
          padding: 40px 0;
          width: 100%;
          overflow: visible;
        }

        .menu-content-item{
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .menu-content-item p{
          line-height: 1.6;
          color: #000000;
          margin: 0;
        }

        .menu-content-item .yellow{
          color: #000000;
          font-weight: 700;
        }

        .contact-button-home{
          display: inline-block;
          padding: 15px 30px;
          margin-top: 20px;
          background-color: #262626;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .contact-button-home:hover{
          opacity: 0.9;
        }

        /* Servicios menu styles */
        .menu-content-item.services .servicios-options{
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .menu-content-item.services .servicios-options li{
          list-style: none;
          margin: 0;
        }

        .menu-content-item.services .servicios-options a{
          display: block;
          padding: 20px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: #262626 !important;
          font-size: 16px;
          font-weight: 400;
          text-transform: capitalize;
          transition: color 0.3s ease, padding-left 0.3s ease;
        }

        .menu-content-item.services .servicios-options a span{
          color: #262626 !important;
        }

        .menu-content-item.services .servicios-options a:hover{
          color: #000000 !important;
          padding-left: 10px;
        }

        .menu-content-item.services .servicios-options a:hover span{
          color: #000000 !important;
        }

        .menu-content-item.services .servicios-options li:last-child a{
          border-bottom: none;
        }

        @media (min-width: 768px) {
          .menu-item-home-section{
            display: flex;
            flex-direction: row;
          }

          .menu-item-home-section h4{
            text-transform: uppercase;
          }

          .menu-item-home-section .icon-servicios-container{
            width: 50px;
            height: 50px;
          }

          .menu-container-home-section{
            height: 600px;
          }

          .menu-item-home-section{
            padding: 30px;
          }
        }

        @media (min-width: 1024px) {
          .menu-content-container{
            min-height: 300px;
            padding: 60px 0;
          }

          .menu-content-item.services .servicios-options a{
            padding: 30px 0;
            font-size: 20px;
          }

          .contact-button-home{
            padding: 18px 35px;
            font-size: 18px;
          }
        }
      `}</style>
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
    </>
  );
};

export default MenuHomeSection;

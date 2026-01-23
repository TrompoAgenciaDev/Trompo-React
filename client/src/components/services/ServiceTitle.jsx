import React, { useState } from "react";
import { motion } from "motion/react";
import "../../assets/styles/service-title.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const ServiceTitle = ({ titulo, subtitulo, page }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Detectar la página desde la prop o desde la URL
  const getPageType = () => {
    if (page) {
      const pageLower = page.toLowerCase();
      if (pageLower.includes('diseño') || pageLower.includes('disenio') || pageLower.includes('diseño')) return 'disenio';
      if (pageLower.includes('multimedia')) return 'multimedia';
      if (pageLower.includes('social')) return 'socialMedia';
      if (pageLower.includes('desarrollo')) return 'desarrollo';
      if (pageLower.includes('paid')) return 'paidMedia';
    }
    
    // Si no hay prop, detectar desde la URL
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('disenio') || pathname.includes('diseño')) return 'disenio';
    if (pathname.includes('multimedia')) return 'multimedia';
    if (pathname.includes('social')) return 'socialMedia';
    if (pathname.includes('desarrollo')) return 'desarrollo';
    if (pathname.includes('paid')) return 'paidMedia';
    
    return null;
  };

  const pageType = getPageType();

  const renderServiceTexts = () => {
    switch (pageType) {
      case 'disenio':
        return (
          <>
            <span>Branding</span>
            <span>Material POP</span>
            <span>Gráfica y Publicidad</span>
          </>
        );
      
      case 'multimedia':
        return (
          <>
            <span>Redes Sociales</span>
            <span>Videos corporativos y testimoniales</span>
            <span>Animación & Motion Graphic</span>
          </>
        );
      
      case 'socialMedia':
        return (
          <>
            <span>Community Management</span>
            <span>Estrategia de contenido</span>
            <span>Engagement y crecimiento</span>
          </>
        );
      
      case 'desarrollo':
        return (
          <>
            <span>Ecommerce</span>
            <span>Web institucional</span>
            <span>Landingpage</span>
          </>
        );
      
      case 'paidMedia':
        return (
          <>
            <span>Google ads</span>
            <span>Meta ads</span>
            <span>Analítica</span>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="full-container black-bg-2 services-title-page-container">
      <div className="container title-page-container-section">
        <div 
          className="full-container title-page-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="service-title-wrapper">
            <motion.h3
              className="title-page"
              initial={{ y: '0%' }}
              animate={{ 
                y: isHovered ? '-150%' : '0%'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {titulo}
            </motion.h3>
            <motion.h3
              className="title-page service-title-hidden"
              style={{ top: '50px' }}
              initial={{ y: '100%' }}
              animate={{ 
                y: isHovered ? '-50px' : '100%'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {titulo}
            </motion.h3>
          </div>
        </div>
        <div className={`full-container service-subtitle-container ${isHovered ? 'is-hovered' : ''}`}>
          <div className="title-creative">
            <span className="subtitle-page">{subtitulo}</span>
          </div>
          <div className="icon-container">
            <div className="svg-wrapper">
              {/* SVG Blanco */}
              <motion.svg 
                className="svg-icon svg-white"
                xmlns="http://www.w3.org/2000/svg" 
                width="102" 
                height="102" 
                viewBox="0 0 102 102" 
                fill="none"
                initial={{ y: '0%' }}
                animate={{ 
                  y: isHovered ? '-100%' : '0%'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <g clipPath="url(#clip0_3525_2018_white)">
                  <path d="M102 94L-1.52588e-05 94" stroke="white" strokeWidth="20" fill="none"/>
                  <path d="M8 0L8 102" stroke="white" strokeWidth="20" fill="none"/>
                  <path d="M95.9375 5.93756L5.87504 96" stroke="white" strokeWidth="20" fill="none"/>
                </g>
                <defs>
                  <clipPath id="clip0_3525_2018_white">
                    <rect width="102" height="102" fill="none"/>
                  </clipPath>
                </defs>
              </motion.svg>
              {/* SVG Amarillo */}
              <motion.svg 
                className="svg-icon svg-yellow"
                xmlns="http://www.w3.org/2000/svg" 
                width="102" 
                height="102" 
                viewBox="0 0 102 102" 
                fill="none"
                style={{ top: '10px' }}
                initial={{ y: '100%' }}
                animate={{ 
                  y: isHovered ? '-10px' : '100%'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <g clipPath="url(#clip0_3525_2018_yellow)">
                  <path d="M102 94L-1.52588e-05 94" stroke="#FEE070" strokeWidth="20" fill="none"/>
                  <path d="M8 0L8 102" stroke="#FEE070" strokeWidth="20" fill="none"/>
                  <path d="M95.9375 5.93756L5.87504 96" stroke="#FEE070" strokeWidth="20" fill="none"/>
                </g>
                <defs>
                  <clipPath id="clip0_3525_2018_yellow">
                    <rect width="102" height="102" fill="none"/>
                  </clipPath>
                </defs>
              </motion.svg>
            </div>
          </div>
        </div>
        <div className="full-container service-areas-container">
          <div className="service-areas-wrapper">
            <motion.div
              className="service-areas-bg service-areas-bg-white"
              initial={{ y: '0%' }}
              animate={{ 
                y: isHovered ? '-100%' : '0%'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.div
              className="service-areas-bg service-areas-bg-yellow"
              initial={{ y: '100%' }}
              animate={{ 
                y: isHovered ? '0%' : '100%'
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
          <div className="service-areas-content">
            {renderServiceTexts()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTitle;


import React from "react";
import "../../assets/styles/service-title.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const ServiceTitle = ({ titulo, subtitulo, page }) => {
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
    <div className="full-container">
      <div className="container title-container-section">
        <div className="full-container title-page-container">
          <h3 className="title-page">{titulo}</h3>
        </div>
        <div className="full-container service-subtitle-container">
          <div className="title-creative">
            <span className="subtitle-page">{subtitulo}</span>
          </div>
          <div className="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="102" height="102" viewBox="0 0 102 102" fill="none">
              <g clipPath="url(#clip0_3525_2018)">
                <path d="M102 94L-1.52588e-05 94" stroke="black" strokeWidth="20"/>
                <path d="M8 0L8 102" stroke="black" strokeWidth="20"/>
                <path d="M95.9375 5.93756L5.87504 96" stroke="black" strokeWidth="20"/>
              </g>
              <defs>
                <clipPath id="clip0_3525_2018">
                  <rect width="102" height="102" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className="full-container white-bg service-areas-container">
          {renderServiceTexts()}
        </div>
      </div>
    </div>
  );
};

export default ServiceTitle;


import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/branding-video-carrusel.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const BrandingVideoCarrusel = ({ category }) => {
  const [clientsData, setClientsData] = useState([]);
  const [hoveredClientIndex, setHoveredClientIndex] = useState(null);
  const videoRefs = useRef({});

  // Cargar datos de la categoría desde el JSON
  useEffect(() => {
    const loadClientsData = async () => {
      try {
        const response = await fetch(`${base}assets/creatividad/branding/carrusel/carrusel.json`);
        const data = await response.json();
        
        // Obtener los proyectos de la categoría especificada
        const categoryData = data[category] || [];
        setClientsData(categoryData);
      } catch (error) {
        console.error("Error loading clients data:", error);
      }
    };

    if (category) {
      loadClientsData();
    }
  }, [category]);

  // Handlers para hover
  const handleMouseEnter = (index) => {
    setHoveredClientIndex(index);
    // Reproducir video al hacer hover
    if (videoRefs.current[index]) {
      videoRefs.current[index].play().catch(() => {
        // Ignorar errores de reproducción
      });
    }
  };

  const handleMouseLeave = (index) => {
    setHoveredClientIndex(null);
    // Pausar video al salir del hover
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0; // Reiniciar al inicio
    }
  };

  // Ruta del video
  const getVideoPath = (videoName) => {
    if (videoName) {
      return `${base}assets/creatividad/${videoName}`;
    }
    return null;
  };

  if (!clientsData || clientsData.length === 0) {
    return null;
  }

  return (
    <>
      {clientsData.map((clientData, index) => {
        const videoPath = clientData.video ? getVideoPath(clientData.video) : null;

        if (!videoPath) return null;

        return (
          <div
            key={clientData.id || index}
            className="full-container brand-video-item"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="brand-video-wrapper">
              <video
                ref={(el) => {
                  if (el) videoRefs.current[index] = el;
                }}
                className="brand-video-element"
                src={videoPath}
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>

            <div className="container">
              <div className="brand-video-panel brand-video-panel-hidden">
                <h2 className="brand-video-title">{clientData.name}</h2>
                <p dangerouslySetInnerHTML={{ __html: clientData.description }} />
              </div>
            </div>
          </div>

        );
      })}
    </>
  );
};

export default BrandingVideoCarrusel;


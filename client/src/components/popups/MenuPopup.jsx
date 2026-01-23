import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "@/components/Menu";
import routesConfig from "@/config/routesConfig";
import Icons from "../Icons";
import "@as/menuPopup.css";

const MenuPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);
  const portalContainerRef = useRef(null);
  const [isServiciosOpen, setIsServiciosOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Crear portal container
  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'menu-popup-portal';
    document.body.appendChild(container);
    portalContainerRef.current = container;
    
    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // Detectar si está en modo desktop
  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    }
    function handleEsc(e) {
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const { overflow } = document.body.style;
      document.body.style.overflow = "hidden";
      document.body.classList.add("menu-open");
      return () => {
        document.body.style.overflow = overflow;
        document.body.classList.remove("menu-open");
      };
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isOpen]);

  const handleOverlayPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // --- CONTROL DE APERTURA SEGÚN DISPOSITIVO ---
  const handleServiciosClick = () => {
    if (!isDesktop) setIsServiciosOpen((prev) => !prev);
  };

  const handleHoverStart = () => {
    if (isDesktop) setIsServiciosOpen(true);
  };

  const handleHoverEnd = () => {
    if (isDesktop) setIsServiciosOpen(false);
  };

  if (!portalContainerRef.current) {
    return null;
  }

  const popupContent = (
    <>
      {isOpen && (
        <>
          <div
            className="menu-overlay"
            onPointerDownCapture={handleOverlayPointerDown}
            aria-hidden="true"
          />

          <div className="full-container popup-menu black-bg" role="dialog" aria-modal="true" ref={popupRef}>
            <div className="container mobile-header">
              <a className="logo-img" href="/">
                
              </a>

              <button
                className="nav-button close-menu-button"
                onClick={onClose}
                aria-label="Cerrar menú"
              >
                <Icons iconName="close" />
              </button>
            </div>

            <div className="container menu-options-container">
              <div className="menu-options">
                {isDesktop ? (
                  <>
                    <div className="menu-popup">
                      <Menu
                        menuType="home"
                        routes={routesConfig}
                        classMenu="grid-menu"
                        location="gsap"
                        onClose={onClose}
                      >
                        <h3>Inicio</h3>
                      </Menu>
                    </div>

                    <div className="menu-popup">
                      <Menu
                        menuType="us"
                        routes={routesConfig}
                        classMenu="grid-menu"
                        location="gsap"
                        onClose={onClose}
                      >
                        <h3>Nosotros</h3>
                      </Menu>
                    </div>

                    <motion.div
                      className="menu-popup"
                      onClick={handleServiciosClick}
                      onHoverStart={handleHoverStart}
                      onHoverEnd={handleHoverEnd}
                    >
                      <div className="grid-menu servicios-menu" style={{ cursor: "pointer" }}>
                        <div className="servicios-header">
                          <span>Servicios</span>
                          <motion.span
                            initial={{ rotate: 0 }}
                            animate={{ rotate: isServiciosOpen ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icons iconName="plus" />
                          </motion.span>
                        </div>

                        <div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="submenu-servicios"
                        >
                          <Menu
                            menuType="servicios"
                            routes={routesConfig}
                            classMenu="servicios-options grid-menu"
                            location="gsap"
                            onClose={onClose}
                          />
                        </div>
                      </div>
                    </motion.div>

                    <div className="menu-popup">
                      <Menu
                        menuType="contacto"
                        routes={routesConfig}
                        classMenu="grid-menu"
                        location="gsap"
                        onClose={onClose}
                      >
                        <h3>Contactanos</h3>
                      </Menu>
                    </div>
                  </>
                ) : (
                  <div className="menu-popup menu-popup-mobile">
                    <Menu
                      menuType="menuMobile"
                      routes={routesConfig}
                      classMenu="mobile-menu"
                      location="gsap"
                      onClose={onClose}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return createPortal(popupContent, portalContainerRef.current);
};

export default MenuPopup;

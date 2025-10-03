import { useEffect, useRef } from "react";
import Menu from "@/components/Menu";
import routesConfig from "@/config/routesConfig";
import Icon from "../Icons";
import "@as/menuPopup.css";


const MenuPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);

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
    document.addEventListener("touchstart", handleClickOutside, {
      passive: true,
    });
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const handleOverlayPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            className="menu-overlay"
            onPointerDownCapture={handleOverlayPointerDown}
            aria-hidden="true"
          />

          <div className="full-container header popup-menu" role="dialog" aria-modal="true">
            <div className="menu-options">
                <div className="menu-popup">
                    <h3>Agencia</h3>
                    <div className="menu-container">
                        <Menu
                            menuType="agencia"
                            routes={routesConfig}
                            classMenu="main-menu"
                            location="gsap"
                            onClose={onClose}
                        />
                    </div>
                </div>
                <div className="menu-popup">                    
                    <h3>Servicios</h3>
                    <div className="menu-container">
                        <Menu
                            menuType="servicios"
                            routes={routesConfig}
                            classMenu="main-menu"
                            location="gsap"
                            onClose={onClose}
                        />
                    </div>
                </div>
                <div className="menu-popup">
                    <h3>Contacto</h3>
                    <div className="menu-container">
                        <Menu
                            menuType="contacto"
                            routes={routesConfig}
                            classMenu="main-menu"
                            location="gsap"
                            onClose={onClose}
                        />
                        <div className="social-icons">
                            <Icon
                            iconName="instagram"
                            link="https://www.instagram.com/trompo.agencia/"
                            />
                            <Icon
                            iconName="linkedin"
                            link="https://ar.linkedin.com/company/trompo-agencia"
                            />
                            <Icon
                            iconName="facebook"
                            link="https://www.facebook.com/TrompoAgencia/"
                            />
                            <Icon iconName="x" link="https://x.com/trompo_agencia" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MenuPopup;

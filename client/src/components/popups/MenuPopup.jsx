import { useEffect, useRef } from "react";
import Menu from "@/components/Menu";
import routesConfig from "@/config/routesConfig";
import Icons from "../Icons";
import "@as/menuPopup.css";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelTransition = {
  delay: 0.1,
  duration: 0.3,
  type: "tween",
  damping: 26,
  stiffness: 250,
};

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="menu-overlay"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            onPointerDownCapture={handleOverlayPointerDown}
            aria-hidden="true"
          />

          <motion.div
            className="full-container header popup-menu"
            initial={{ y: -1140 }}
            animate={{ y: 0 }}
            exit={{ y: -1140 }}
            transition={panelTransition}
            ref={popupRef}
            role="dialog"
            aria-modal="true"
          >
            <div className="container header-popup">
              <motion.a
                className="logo-img"
                href="/"
                initial={{ y: -250 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 350 }}
              >
                <Icons iconName="logoBlack" />
              </motion.a>

              <motion.button
                className="nav-button"
                initial={{ y: -250, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  damping: 28,
                  stiffness: 350,
                }}
                onClick={onClose}
                aria-label="Cerrar menú"
              >
                <Icons iconName="close" />
              </motion.button>
            </div>

            <div className="container menu-popup">
              <Menu
                menuType="main"
                routes={routesConfig}
                classMenu="main-menu"
                location="header"
                onClose={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuPopup;

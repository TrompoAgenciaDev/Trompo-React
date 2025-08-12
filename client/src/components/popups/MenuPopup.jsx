import { useEffect, useRef } from "react";
import Menu from "@/components/Menu";
import routesConfig from "@/config/routesConfig";
import Icons from "../Icons";
import "@as/menuPopup.css";
import { motion, AnimatePresence } from "framer-motion";

const MenuPopup = ({ isOpen, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="full-container popup-menu"
          initial={{ y: -1140 }}
          animate={{ y: 0 }}
          exit={{ y: -1140 }}
          transition={{
            delay: 0.1,
            duration: 0.3,
            type: "tween",
            damping: 26,
            stiffness: 250,
          }}
          ref={popupRef}
        >
          <div className="container header">
            <motion.a
              className="logo-img"
              href="/"
              initial={{ y: -250 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 350,
              }}
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
            >
              <Icons iconName={"close"} />
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
      )}
    </AnimatePresence>
  );
};

export default MenuPopup;
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const Menu = ({
  menuType = "",
  routes = {},
  classMenu = "",
  location = "header",
  onClose = () => {},
}) => {
  const menuItems = routes[menuType];
  const getSubmenu = (key) => (Array.isArray(routes[key]) ? routes[key] : []);

  const [isMobile, setIsMobile] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqWide = window.matchMedia("(min-width: 1024px)");
    const upd = () => {
      setIsMobile(mqMobile.matches);
      setIsWide(mqWide.matches);
    };
    upd();
    const add = (mq, cb) =>
      mq.addEventListener ? mq.addEventListener("change", cb) : mq.addListener(cb);
    const rem = (mq, cb) =>
      mq.removeEventListener ? mq.removeEventListener("change", cb) : mq.removeListener(cb);
    add(mqMobile, upd);
    add(mqWide, upd);
    return () => {
      rem(mqMobile, upd);
      rem(mqWide, upd);
    };
  }, []);

  const handleTopClick = (e, label) => {
    const hasSub = getSubmenu(label).length > 0;
    if (hasSub) {
      e.preventDefault();
      e.stopPropagation();
      setOpenSub((prev) => (prev === label ? null : label));
      setActiveSub((prev) => (prev === label ? null : label));
      return;
    }
    onClose();
  };

  if (!menuItems || menuItems.length === 0) {
    return <p>No se encontró el menú</p>;
  }

  const renderIconAndLabel = (label, showChevronMobile = false) => (
    <motion.div
      className="menu-item-content"
      style={{ display: "flex", alignItems: "center", gap: isWide ? 0 : undefined }}
      onMouseEnter={() => setHovered(label)}
      onMouseLeave={() => setHovered((h) => (h === label ? null : h))}
    >
      {isWide ? (
        <>
          <motion.div
            className="menu-icon"
            animate={{ opacity: hovered === label ? 1 : 0, marginRight: hovered === label ? 10 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ display: "flex" }}
            aria-hidden="true"
          >
            <svg className="icon-default" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 45" fill="none">
              <path
                d="M2.04492 22.5148H41.0449M41.0449 22.5148L21.5449 2.08618M41.0449 22.5148L21.5449 42.9433"
                stroke="#1E1E1E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span>{label}</span>
        </>
      ) : (
        <>
          {showChevronMobile && (
            <div className="menu-icons" style={{ display: "flex", alignItems: "center" }}>
              <div className="menu-icon-submenu">
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 43 45"
                  fill="none"
                  animate={{ rotate: isMobile && openSub === label ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ width: 20, height: 20 }}
                >
                  <path d="M10 16L21.5 27L33 16" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </div>
            </div>
          )}
          <span>{label}</span>
        </>
      )}
    </motion.div>
  );

  return (
    <nav className="nav-menu">
      <div
        className="menu-two-col"
        style={{ width: "100%", display: "flex", gap: "24px", alignItems: "flex-start" }}
      >
        <ul className={classMenu}>
          {menuItems.map(({ path, label }, index) => {
            const hasSub = getSubmenu(label).length > 0;

            return (
              <li className="nav-menu-item" key={index}>
                <div className="item-menu-container">
                  {hasSub ? (
                    location === "header" ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleTopClick(e, label)}
                          className={`menu-item ${label}-item`}
                          aria-expanded={openSub === label}
                          style={{ background: "transparent", border: 0, padding: 0, color: "inherit" }}
                          onMouseEnter={() => {
                            if (isWide) {
                              if (closeTimer.current) clearTimeout(closeTimer.current);
                              setActiveSub(label);
                            }
                          }}
                          onMouseLeave={() => {
                            if (isWide) {
                              closeTimer.current = setTimeout(
                                () => setActiveSub((cur) => (cur === label ? null : cur)),
                                120
                              );
                            }
                          }}
                        >
                          {renderIconAndLabel(label, !isWide)}
                        </button>

                        {!isWide && (
                          <AnimatePresence initial={false}>
                            {openSub === label && (
                              <motion.ul
                                className="submenu submenu-accordion"
                                key={`${label}-accordion`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                style={{ listStyle: "none", margin: 0, padding: "8px 0 0 0" }}
                              >
                                {getSubmenu(label).map(({ path: subPath, label: subLabel }, subIndex) => (
                                  <li className="submenu-item" key={subIndex} style={{ padding: "8px 0" }}>
                                    <Link to={subPath} className="submenu-item" onClick={onClose}>
                                      {subLabel}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        )}
                      </>
                    ) : (
                      <span className={`menu-item ${label}-item`}>{label}</span>
                    )
                  ) : location === "header" ? (
                    <Link to={path} onClick={onClose} className={`menu-item ${label}-item`}>
                      {renderIconAndLabel(label, false)}
                    </Link>
                  ) : (
                    <Link to={path} onClick={onClose} className={`menu-item ${label}-item`}>
                      <span className="menu-item-content">{label}</span>
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {location === "header" && isWide && (
          <AnimatePresence initial={false}>
            {activeSub && getSubmenu(activeSub).length > 0 && (
              <motion.ul
                className="submenu submenu-panel"
                key={`${activeSub}-panel`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setHovered(activeSub);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  setActiveSub(null);
                }}
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                {getSubmenu(activeSub).map(({ path: subPath, label: subLabel }, subIndex) => (
                  <li className="submenu-item" key={subIndex}>
                    <Link to={subPath} className="submenu-item" onClick={onClose}>
                      {subLabel}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </div>
    </nav>
  );
};

export default Menu;

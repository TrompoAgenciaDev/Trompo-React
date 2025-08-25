import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/styles/scrollTop.css";

function ScrollTop() {
  const [visible, setVisible] = useState(false);
  const { pathname, hash } = useLocation();

  // reset de scroll en cada cambio de ruta
  useEffect(() => {
    if (hash) return; // si vas a /ruta#ancla, respetá el ancla
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  // opcional: desactivar restauración del navegador
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const firstSection = document.getElementById("hero");
      if (!firstSection) return;
      const sectionHeight = firstSection.offsetHeight;
      setVisible(window.scrollY > sectionHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <a
      className={`scroll-top-button ${visible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <svg
        width="23"
        height="24"
        viewBox="0 0 23 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6526 22.231L11.6526 1.83985M11.6526 1.83985L1.62695 12.0354M11.6526 1.83985L21.6782 12.0354"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

export default ScrollTop;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHeroImages } from "../hooks/useHeroImage";
import Icons from "../components/Icons";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const videosByLocation = {
  home: {
    desktop: `${base}assets/hero/home.mp4`,
    mobile: `${base}assets/hero/mobile/home-mobile.mp4`,
  },
  desarrollo: {
    desktop: `${base}assets/hero/desarrollo-hero.mp4`,
    mobile: `${base}assets/hero/mobile/desarrollo-hero-mobile.mp4`,
  },
  creatividad: {
    desktop: `${base}assets/hero/creatividad-hero.mp4`,
    mobile: `${base}assets/hero/mobile/creatividad-hero-mobile.mp4`,
  },
  estrategia: {
    desktop: `${base}assets/hero/estrategia-hero.mp4`,
    mobile: `${base}assets/hero/mobile/estrategia-hero-mobile.mp4`,
  },
};

const Hero = ({ location = "home" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const videoSrc = isMobile
    ? videosByLocation[location]?.mobile
    : videosByLocation[location]?.desktop;

  // HERO PRINCIPAL
  if (location !== "contactanos") {
    return (
      videoSrc && (
          <video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload noremoteplayback"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )
    );
  }

  // CONTACTANOS (idéntico)
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY >= 40) setRevealed(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = setTimeout(() => setRevealed(true), 2000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="full-container hero-contactanos bg-yellow">
      <div className="contacto-wrap">
        <motion.h1 className="contacto-title" initial="hidden" animate="show">
          Hablemos de tu proyecto
        </motion.h1>

        {revealed && (
          <motion.div
            className="contacto-reveal"
            initial="hidden"
            animate="show"
          >
            <motion.p className="contacto-subtitle">
              Cada proyecto es único. Completá el formulario y diseñemos la
              estrategia que tu marca necesita para evolucionar.
            </motion.p>
            <motion.a href="#contacto" className="contacto-cta">
              <Icons iconName="down" link="#contacto" />
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hero;

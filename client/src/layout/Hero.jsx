import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHeroImages } from "../hooks/useHeroImage";
import Icons from "../components/Icons";
import "@as/hero.css";

// Videos Desktop
import HomeVideo from "/assets/hero/home.mp4";
import Desarrollo from "/assets/hero/desarrollo-hero.mp4";
// Videos Mobile
import HomeVideoMobile from "/assets/hero/mobile/home-mobile.mp4";
import DesarrolloMobile from "/assets/hero/mobile/desarrollo-hero-mobile.mp4";

const videosByLocation = {
  home: { desktop: HomeVideo, mobile: HomeVideoMobile },
  desarrollo: { desktop: Desarrollo, mobile: DesarrolloMobile },
};

const titleVar = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const groupVar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.12 },
  },
};

const itemVar = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const Hero = ({ location = "home" }) => {
  const [heroImagePng, heroImageWebp] = useHeroImages(location);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener
      ? mq.addEventListener("change", handler)
      : mq.addListener(handler);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", handler)
        : mq.removeListener(handler);
    };
  }, []);

  const videoSrc = isMobile
    ? videosByLocation[location]?.mobile
    : videosByLocation[location]?.desktop;

  if (location !== "contactanos") {
    return (
      <div
        className="full-container hero-video-container"
        id={location === "home" ? "hero" : undefined}
      >
        {videoSrc && (
          <video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
    );
  }

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
        <motion.h1
          className="contacto-title"
          variants={titleVar}
          initial="hidden"
          animate="show"
        >
          Hablemos de tu proyecto
        </motion.h1>

        {revealed && (
          <motion.div
            className="contacto-reveal"
            variants={groupVar}
            initial="hidden"
            animate="show"
          >
            <motion.p className="contacto-subtitle" variants={itemVar}>
              Contanos tus objetivos y construyamos juntos el camino más
              eficiente hacia resultados medibles.
            </motion.p>
            <motion.a
              href="#contacto"
              className="contacto-cta"
              variants={itemVar}
            >
              <Icons iconName="down" link="#contacto" />
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hero;

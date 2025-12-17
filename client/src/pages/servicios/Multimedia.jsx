import React, { useState } from "react";
import { motion } from "framer-motion";
import Hero from "../../layout/Hero";
import PageTitle from "../../components/services/PageTitle";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import Portfolio3d from "../../layout/Portfolio3d";
import Testimonials from "../../components/Testimonials.jsx";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";

//styles
import "../../assets/styles/multimedia.css";
import "@as/hero.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Multimedia = () => {

  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/creatividad-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/creatividad-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/creatividad-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/creatividad-hero-mobile-poster.webp`}
      />

      <PageTitle
        title="Multimedia"
        highlight="Planificamos, producimos y animamos piezas audiovisuales que elevan lanzamientos, explican propuestas y amplifican campañas. Trabajamos con criterio de marca y performance: coherencia visual, ritmo narrativo y formatos optimizados para web, redes y presentaciones. El resultado: contenido vivo, claro y medible."
        location={"multimedia"}   
      />
      

      <div className="full-container bg-white diagonal-multimedia">
        <div className="full-container gird-motion">
          <div className="full-container">
            <h2>
              Video Institucional
            </h2>
            <div className="container">
              <p>
                Tomamos tu material y lo convertimos en historias que funcionan. Curamos guion y ritmo, musicalización, color, subtítulos y placas gráficas; sumamos llamadas a la acción y adaptamos duraciones para lanzamientos, sliders de sitio, YouTube, LinkedIn y short-form. Optimización por objetivo (retención, CTR, conversión) y mastering listo para publicar.
              </p>
            </div>
          </div>
          <div className="full-container video-background-container">
            <motion.video
              src={`${base}assets/hero/home.mp4`}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>
      </div>



      <div className="full-container bg-yellow-2 diagonal-multimedia">
        <div className="container">
          <div className="gird-motion">
            <div className="container">
              <h2>
                Motion Graphics
              </h2>
            </div>
            <div className="container">
              <p>
                Animamos tu identidad para contar mejor: tipografía en movimiento, iconografía, lower thirds, bumpers, transiciones, gráficos de datos y explicativos. Pensado para reels/stories, banners y sliders web, presentaciones y ads. 
              </p>
              <p>
                Entregamos versiones por plataforma (9:16, 1:1, 16:9), kits editables y principios de motion que mantienen la consistencia de marca.
              </p>
            </div>
          </div>
        </div>
        <div className="full-container">
          <video src={`${base}assets/portfolioImg/videos/motion-graphics.mp4`} autoPlay muted loop playsInline></video>
        </div>
      </div>
      
      <div className="full-container bg-yellow-2 diagonal-multimedia">
        <div className="container">
          <div className="gird-social-media">
            <div className="container">
              <h2>
                Videos Social Media
              </h2>              
              <div className="container">
                <p>
                  Animamos tu identidad para contar mejor: tipografía en movimiento, iconografía, lower thirds, bumpers, transiciones, gráficos de datos y explicativos. Pensado para reels/stories, banners y sliders web, presentaciones y ads. 
                </p>
                <p>
                  Entregamos versiones por plataforma (9:16, 1:1, 16:9), kits editables y principios de motion que mantienen la consistencia de marca.
                </p>
              </div>
            </div>
            <div className="container">
              <video src={`${base}assets/portfolioImg/videos/social-media.mp4`} autoPlay muted loop playsInline></video>
            </div>
          </div>
        </div>
      </div>

      <Faqs location="branding" />

      <Contact form="multimedia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Multimedia;
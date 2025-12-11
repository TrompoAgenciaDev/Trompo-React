import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    { id: "tab1", label: "Motion Graphics" },
    { id: "tab2", label: "Edición de video" },
    { id: "tab3", label: "Producción audiovisual" },
  ];

  // Contenido para cada tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "tab1":
        return (
          <>
            <div className="container">
              <div className="container">
                <div className="container highlight-content">
                  <div className="grid-item-highlight">
                    <h1 className="title-highlight">
                      Motion Graphics
                    </h1>
                  </div>
                  <div className="grid-item-content">
                    <p>
                      <strong>Animamos tu identidad para contar mejor</strong>: tipografía en movimiento, iconografía, lower thirds, bumpers, transiciones, gráficos de datos y explicativos. Pensado para reels/stories, banners y sliders web, presentaciones y ads. 
                      <br />
                      <br />
                      Entregamos versiones por plataforma (9:16, 1:1, 16:9), kits editables y principios de motion que mantienen la consistencia de marca.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="full-container grid-motion-graphics">
              {/* Item 1: content/video */}
              <div className="motion-item">
                <div className="item-content">
                  <h2 className="motion-item-title">Kindom</h2>
                  <p dangerouslySetInnerHTML={{ __html: "Kindom es una escuela de idiomas con un enfoque innovador basado en la neurodidáctica.<br><br>Diseñamos una identidad fresca, versátil y cercana, con una paleta vibrante y una mascota simbólica que representan aprendizaje, acompañamiento y experiencia." }} />
                </div>
                <div className="item-video">
                  <video
                    src={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="motion-video-element"
                  />
                </div>
              </div>
              {/* Item 2: video/content */}
              <div className="motion-item">
                <div className="item-video">
                  <video
                    src={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="motion-video-element"
                  />
                </div>
                <div className="item-content">
                  <h2 className="motion-item-title">Kindom</h2>
                  <p dangerouslySetInnerHTML={{ __html: "Kindom es una escuela de idiomas con un enfoque innovador basado en la neurodidáctica.<br><br>Diseñamos una identidad fresca, versátil y cercana, con una paleta vibrante y una mascota simbólica que representan aprendizaje, acompañamiento y experiencia." }} />
                </div>
              </div>
              {/* Item 3: content/video */}
              <div className="motion-item">
                <div className="item-content">
                  <h2 className="motion-item-title">Kindom</h2>
                  <p dangerouslySetInnerHTML={{ __html: "Kindom es una escuela de idiomas con un enfoque innovador basado en la neurodidáctica.<br><br>Diseñamos una identidad fresca, versátil y cercana, con una paleta vibrante y una mascota simbólica que representan aprendizaje, acompañamiento y experiencia." }} />
                </div>
                <div className="item-video">
                  <video
                    src={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="motion-video-element"
                  />
                </div>
              </div>
              {/* Item 4: video/content */}
              <div className="motion-item">
                <div className="item-video">
                  <video
                    src={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="motion-video-element"
                  />
                </div>
                <div className="item-content">
                  <h2 className="motion-item-title">Kindom</h2>
                  <p dangerouslySetInnerHTML={{ __html: "Kindom es una escuela de idiomas con un enfoque innovador basado en la neurodidáctica.<br><br>Diseñamos una identidad fresca, versátil y cercana, con una paleta vibrante y una mascota simbólica que representan aprendizaje, acompañamiento y experiencia." }} />
                </div>
              </div>
              {/* Item 5: content/video */}
              <div className="motion-item">
                <div className="item-content">
                  <h2 className="motion-item-title">Kindom</h2>
                  <p dangerouslySetInnerHTML={{ __html: "Kindom es una escuela de idiomas con un enfoque innovador basado en la neurodidáctica.<br><br>Diseñamos una identidad fresca, versátil y cercana, con una paleta vibrante y una mascota simbólica que representan aprendizaje, acompañamiento y experiencia." }} />
                </div>
                <div className="item-video">
                  <video
                    src={`${base}assets/hero/mobile/home-hero-mobile.mp4`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="motion-video-element"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case "tab2":
        return (
          <>
            {/* Contenido del tab 2 */}
          </>
        );
      case "tab3":
        return (
          <>
            {/* Contenido del tab 3 */}
          </>
        );
      default:
        return null;
    }
  };

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
        highlight="Contenido visual y audiovisual que captura y comunica. Producción de videos, animaciones, gráficos en movimiento y contenido multimedia que potencia tu marca en todos los canales digitales."
        location={"multimedia"}   
      />

      <div className="full-container bg-yellow-2 diagonal-multimedia">
        <div className="full-container tabs-container-creative">
          <div className="full-container title-tabs">
            <div className="container tabs">
              {/* Select para responsive (hasta tablet) */}
              <select
                className="tab-select"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
              {/* Botones para desktop (desde 1024px) */}
              <div className="tabs-container">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="full-container tab-content-container">
            {renderTabContent()}
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


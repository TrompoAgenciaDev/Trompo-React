import React, { useState } from "react";
import Faqs from "../../layout/Faqs";
import Contact from "../../layout/Contact";
import CustomerSlider from "../../components/sliders/CustomerSlider.jsx";
import SimpleHeroVideo from "../../components/SimpleHeroVideo";

//styles
import "@as/hero.css";
import "../../assets/styles/ads.css";


const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Meta = () => {  

  return (
    <>
      <SimpleHeroVideo
        desktopSrc={`${base}assets/hero/estrategia-hero.mp4`}
        mobileSrc={`${base}assets/hero/mobile/estrategia-hero-mobile.mp4`}
        desktopPoster={`${base}assets/hero/estrategia-hero-poster.webp`}
        mobilePoster={`${base}assets/hero/mobile/estrategia-hero-mobile-poster.webp`}
      />

      <div className="full-container title-container-google">
        <div className="container title-container">
          <h3 className="display-title">[Estrategia]</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width={110} height={72} viewBox="0 0 291.26 191">
            <defs>
              <linearGradient id="Degradado_sin_nombre" x1="62.34" y1="101.45" x2="260.34" y2="91.45" gradientTransform="translate(0 192) scale(1 -1)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#0064e1"/>
                <stop offset="0.4" stopColor="#0064e1"/>
                <stop offset="0.83" stopColor="#0073ee"/>
                <stop offset="1" stopColor="#0082fb"/>
              </linearGradient>
              <linearGradient id="Degradado_sin_nombre_2" x1="41.42" y1="53" x2="41.42" y2="126" gradientTransform="translate(0 192) scale(1 -1)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#0082fb"/>
                <stop offset="1" stopColor="#0064e0"/>
              </linearGradient>
            </defs>
            <path fill="#0081fb" d="M31.06,125.96c0,10.98,2.41,19.41,5.56,24.51,4.13,6.68,10.29,9.51,16.57,9.51,8.1,0,15.51-2.01,29.79-21.76,11.44-15.83,24.92-38.05,33.99-51.98l15.36-23.6c10.67-16.39,23.02-34.61,37.18-46.96C181.07,5.6,193.54,0,206.09,0,227.16,0,247.23,12.21,262.59,35.11c16.81,25.08,24.97,56.67,24.97,89.27,0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75v-31.02c17.63,0,22.03-16.2,22.03-34.74,0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16.05c-18.2,32.27-22.81,39.62-31.91,51.75-15.95,21.24-29.57,29.29-47.5,29.29-21.27,0-34.72-9.21-43.05-23.09C3.34,156.6,0,141.76,0,124.85l31.06,1.11Z"/>
            <path fill="url(#Degradado_sin_nombre)" d="M24.49,37.3C38.73,15.35,59.28,0,82.85,0c13.65,0,27.22,4.04,41.39,15.61,15.5,12.65,32.02,33.48,52.63,67.81l7.39,12.32c17.84,29.72,27.99,45.01,33.93,52.22,7.64,9.26,12.99,12.02,19.94,12.02,17.63,0,22.03-16.2,22.03-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87-6.28,10.88-18.52,21.75-39.11,21.75-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71l-25.79-43.08c-12.94-21.62-24.81-37.74-31.68-45.04-7.39-7.85-16.89-17.33-32.05-17.33-12.27,0-22.69,8.61-31.41,21.78l-26.45-15.71Z"/>
            <path fill="url(#Degradado_sin_nombre_2)" d="M82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78-12.33,18.61-19.88,46.33-19.88,72.95,0,10.98,2.41,19.41,5.56,24.51l-26.48,17.44C3.34,156.6,0,141.76,0,124.85,0,94.1,8.44,62.05,24.49,37.3,38.73,15.35,59.28,0,82.85,0l-.5,31.23Z"/>
          </svg>
        </div>
        <div className="container grid-container">
          <div className="container">
            <div className="title-google">
              <h1>Tus clientes están aquí: <br/> encuéntralos con los anuncios de Meta</h1>
              <p>
                Llega a clientes nuevos y a los actuales cuando conecten con otras personas y busquen comunidades en Facebook, Instagram, Messenger y WhatsApp.
              </p>
            </div>
          </div>
          <div className="container">
            <div className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" width={62} height={62} viewBox="0 0 62 62" fill="none">
                <path
                  d="M31 7L31 55M31 55L55 31M31 55L7 31"
                  stroke="#1D1D1B"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="full-container bg-yellow-2 diagonal-container">
        <div className="container">
          <h3>
            Miles de millones de personas usan las aplicaciones de Meta para conectar con gente y descubrir temas que les importan. 
          </h3>
        </div>
      </div>

      <div className="full-container"> 
        <div className="container">
          <h4>Tus anuncios de Meta pueden aparecer mientras tus clientes exploran el feed de Facebook, ven reels de Instagram o consultan la bandeja de entrada de Messenger.</h4>
        </div>
        <div className="container">
          <div className="tab-social-container">
            <div className="social-item">
              <img src="" alt="" />
              <p></p>
            </div>
            <div className="social-item">
              <img src="" alt="" />
              <p></p>
            </div>
          </div>
        </div>
      </div>

      <div className="full-container">

      </div>

      <Faqs location="estrategia" />

      <Contact form="estrategia" />

      <section className="full-container">
        <div className="slider-container container">
          <CustomerSlider />
        </div>
      </section>
    </>
  );
};

export default Meta;

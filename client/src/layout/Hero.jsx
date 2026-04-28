import '../assets/styles/hero.css';
import { useEffect } from 'react';

const Hero = () => {
  useEffect(() => {
      const glitchTarget = document.getElementById('glitch-target');
      if (!glitchTarget) return;

      const interval = window.setInterval(() => {
          if (Math.random() > 0.5) {
              glitchTarget.classList.add('glitch');
              window.setTimeout(() => glitchTarget.classList.remove('glitch'), 300);
          }
      }, 4000);

      return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-video-bg">
          <video autoPlay muted loop playsInline>
              <source src="https://videos.pexels.com/video-files/3196284/3196284-uhd_2560_1440_25fps.mp4" type="video/mp4" />

          </video>
      </div>

      <div className="hero-video-tag">
          <span>Trompo · Equipo en operación</span>
      </div>

      <div className="hero-eyebrow">
          <span>Trompo Agencia · 2026</span>
          <span className="blink">●</span>
          <span>Vanguardia digital · Córdoba</span>
      </div>

      <h1 className="hero-title">
          <span className="hero-title-line"><span>Marketing</span></span>
          <span className="hero-title-line"><span>para marcas</span></span>
          <span className="hero-title-line"><span>que <em id="glitch-target">mueven</em></span></span>
          <span className="hero-title-line"><span>el negocio.</span></span>
      </h1>

      <div className="hero-bottom">
          <p className="hero-desc">
              <strong>Diez años acompañando marcas argentinas.</strong>
              Diseño, multimedia, desarrollo web, paid media y redes sociales funcionando como un sistema integrado para mover el negocio del cliente — no para llenar reportes.
          </p>
          <div className="hero-stat">
              <div className="hero-stat-num">10<em>+</em></div>
              <div className="hero-stat-label">Años de operación<br/>desde Córdoba</div>
          </div>
          <div className="hero-stat">
              <div className="hero-stat-num">80<em>+</em></div>
              <div className="hero-stat-label">Marcas argentinas<br/>en nuestra cartera</div>
          </div>
      </div>
  </section>
  );
}

export default Hero;
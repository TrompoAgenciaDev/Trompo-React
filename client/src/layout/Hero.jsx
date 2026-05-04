import '../assets/styles/hero.css';
import { useEffect, useRef, useState } from 'react';

const base = import.meta.env.BASE_URL?.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

const SLIDES = [
    `${base}assets/img/home/desarrollo.jpeg`,
    `${base}assets/img/home/disenio.jpeg`,
    `${base}assets/img/home/estrategia.jpeg`,
    `${base}assets/img/home/paid-media.jpeg`,
    `${base}assets/img/home/produccion.jpeg`,
];

const SLIDE_DURATION = 5000;

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const intervalRef = useRef(null);

    const startAutoPlay = () => {
        intervalRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % SLIDES.length);
        }, SLIDE_DURATION);
    };

    useEffect(() => {
        startAutoPlay();
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        const glitchTarget = document.getElementById('glitch-target');
        if (!glitchTarget) return;
        const interval = setInterval(() => {
            if (Math.random() > 0.5) {
                glitchTarget.classList.add('glitch');
                setTimeout(() => glitchTarget.classList.remove('glitch'), 300);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleIndicatorClick = (i) => {
        clearInterval(intervalRef.current);
        setCurrentSlide(i);
        startAutoPlay();
    };

    return (
        <section className="hero">
            <div className="hero-slider">
                {SLIDES.map((src, i) => (
                    <div
                        key={i}
                        className={`slider-image${i === currentSlide ? ' active' : ''}`}
                        style={{ backgroundImage: `url('${src}')` }}
                    />
                ))}
            </div>

            <div className="hero-slider-tag">
                <span>Trompo · Equipo en operación</span>
            </div>

            <div className="slider-indicators">
                {SLIDES.map((_, i) => (
                    <div
                        key={i}
                        className={`slider-indicator${i === currentSlide ? ' active' : ''}`}
                        onClick={() => handleIndicatorClick(i)}
                    />
                ))}
                <span className="slider-counter">
                    {String(currentSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </span>

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
                    {' '}Diseño, multimedia, desarrollo web, paid media y redes sociales funcionando como un sistema integrado para mover el negocio del cliente — no para llenar reportes.
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
};

export default Hero;

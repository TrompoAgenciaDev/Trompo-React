import '../assets/styles/header.css';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import routesConfig from '../config/routesConfig';

const SERVICE_DESCRIPTIONS = {
    '/servicios/disenio':    'Identidad y sistema visual que ordena la marca.',
    '/servicios/multimedia': 'Audiovisual, motion y producción.',
    '/servicios/desarrollo': 'Sitios y plataformas que escalan.',
    '/servicios/paid-media': 'Inversión que devuelve negocio.',
    '/servicios/social-media': 'Contenido y comunidad diaria.',
};

export default function Header() {
    const base = import.meta.env.BASE_URL;
    const services = routesConfig.servicios;

    useEffect(() => {
        const nav = document.getElementById('nav');
        const clock = document.getElementById('status-clock');

        const handleScroll = () => {
            if (!nav) return;
            if (window.scrollY > 60) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };

        const updateClock = () => {
            if (!clock) return;
            const now = new Date();
            const opts = {
                timeZone: 'America/Argentina/Buenos_Aires',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            };
            const time = new Intl.DateTimeFormat('es-AR', opts).format(now);
            clock.textContent = `${time} ART`;
        };

        window.addEventListener('scroll', handleScroll);
        updateClock();
        const clockInterval = window.setInterval(updateClock, 1000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.clearInterval(clockInterval);
        };
    }, []);

    return (
        <nav id="nav">
            <NavLink to="/" className="logo" data-cursor-hover>
                <img className="logo-img" src={`${base}assets/white.webp`} alt="Trompo" />
            </NavLink>

            <div className="nav-links">
                <NavLink to="/" className="nav-link" data-cursor-hover>Inicio</NavLink>
                <NavLink to="/nosotros" className="nav-link" data-cursor-hover>Nosotros</NavLink>

                <div className="has-megamenu">
                    <span className="nav-link nav-link--trigger">Servicios ▾</span>
                    <div className="megamenu">
                        <span className="mm-eyebrow">Sistema integrado · 5 unidades</span>
                        {services.map(({ path, label }, i) => (
                            <NavLink key={path} to={path} className="mm-item" data-cursor-hover>
                                <span className="mm-num">0{i + 1}</span>
                                <div>
                                    <div className="mm-title">{label}</div>
                                    <div className="mm-desc">{SERVICE_DESCRIPTIONS[path]}</div>
                                </div>
                            </NavLink>
                        ))}
                        <div className="mm-footer">
                            <span className="mm-footer-text">¿Querés trabajarlos como sistema?</span>
                            <NavLink to="/contactanos" className="mm-footer-cta" data-cursor-hover>
                                Hablemos →
                            </NavLink>
                        </div>
                    </div>
                </div>

                <NavLink to="/contactanos" className="nav-cta" data-cursor-hover>Hablemos →</NavLink>
            </div>
        </nav>
    );
}

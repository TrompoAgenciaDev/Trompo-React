import '../assets/styles/header.css';
import { useEffect } from 'react';

export default function Header() {

    const base = import.meta.env.BASE_URL;

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
        <>
            <nav id="nav">
                <a href={`${base}`} className="logo" data-cursor-hover>
                    <img className='logo-img' src={`${base}assets/white.webp`} alt="" />
                </a>
                <div className="nav-links">
                    <a href="#sistema" className="nav-link" data-cursor-hover>Sistema</a>
                    <a href="#verticales" className="nav-link" data-cursor-hover>Verticales</a>
                    <a href="#equipo" className="nav-link" data-cursor-hover>Equipo</a>
                    <a href="#cartera" className="nav-link" data-cursor-hover>Cartera</a>
                    <a href="#contacto" className="nav-cta" data-cursor-hover>Hablemos →</a>
                </div>
            </nav>
        </>
    );
}

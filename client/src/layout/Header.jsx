import '../assets/styles/header.css';
import { useEffect } from 'react';

export default function Header() {
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
            <div className="status-bar">
                <div className="status-left">
                    <div className="status-item">
                        <span className="dot"></span>
                        <span>Agencia online</span>
                    </div>
                    <div className="status-divider"></div>
                    <div className="status-item"><span>Operativo · Lun–Vie · 09–18 hs</span></div>
                    <div className="status-divider"></div>
                    <div className="status-item"><span>10+ años · 80+ marcas</span></div>
                </div>
                <div className="status-right">
                    <div className="status-item"><span>CBA · AR</span></div>
                    <div className="status-divider"></div>
                    <div className="status-item"><span className="status-clock" id="status-clock">00:00:00</span></div>
                </div>
            </div>

            <nav id="nav">
                <a href="#" className="logo" data-cursor-hover>
                    <span className="brand-mark">
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="6" r="3.5" fill="#E8B73A"/>
                            <circle cx="18" cy="12" r="3.5" fill="#E8B73A"/>
                            <circle cx="12" cy="18" r="3.5" fill="#E8B73A"/>
                            <circle cx="6" cy="12" r="3.5" fill="#E8B73A"/>
                            <circle cx="12" cy="12" r="2.5" fill="#E8458F"/>
                        </svg>
                    </span>
                    Trompo <small>Agencia digital</small>
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

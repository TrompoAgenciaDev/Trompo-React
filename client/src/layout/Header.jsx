import '../assets/styles/header.css';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';

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
                <NavLink to="/" className="logo" data-cursor-hover>
                    <img className='logo-img' src={`${base}assets/white.webp`} alt="" />
                </NavLink>
                <HeaderNav menuKey="main" ctaLabel="Hablemos →" />
            </nav>
        </>
    );
}

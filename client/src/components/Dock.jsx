import { NavLink } from 'react-router-dom';
import '../assets/styles/dock.css';

/**
 * Dock flotante de navegación rápida.
 *
 * Props:
 *   links  – array de { title, anchor } con anclas a secciones de la página actual
 *   cta    – objeto { label, to } para el botón de navegación tipo "Hablemos →"
 *            Si se omite, no se renderiza el botón CTA
 */
export default function Dock({ links = [], cta }) {
    return (
        <div className="dock">
            <div className="dock-status">
                <span className="live-dot"></span>
                <span>Online</span>
            </div>

            {links.map((link, i) => (
                <a
                    key={i}
                    href={link.anchor}
                    className="dock-link"
                    data-cursor-hover
                >
                    {link.title}
                </a>
            ))}

            {cta && (
                <NavLink
                    to={cta.to ?? '/contactanos'}
                    className="dock-cta"
                    data-cursor-hover
                >
                    {cta.label ?? 'Hablemos →'}
                </NavLink>
            )}
        </div>
    );
}

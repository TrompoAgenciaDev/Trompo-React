import { NavLink } from 'react-router-dom';
import routesConfig from '../config/routesConfig';
import '../assets/styles/footer.css';

export default function Footer() {
    const services = routesConfig.servicios;

    return (
        <footer>
            <div className="footer-top">
                <div className="footer-brand-col">
                    <div className="footer-logo">Trompo</div>
                    <div className="footer-tagline">Vanguardia digital · Córdoba</div>
                    <p className="footer-desc">
                        Marketing para marcas que mueven el negocio. Diez años de operación desde Córdoba con clientes en toda Argentina.
                    </p>
                </div>

                <div>
                    <h4 className="footer-col-h">Institucional</h4>
                    <ul className="footer-list">
                        <li><NavLink to="/" data-cursor-hover>Inicio</NavLink></li>
                        <li><NavLink to="/nosotros" data-cursor-hover>Nosotros</NavLink></li>
                        <li><NavLink to="/contactanos" data-cursor-hover>Contactanos</NavLink></li>
                    </ul>
                </div>

                <div>
                    <h4 className="footer-col-h">Servicios</h4>
                    <ul className="footer-list">
                        {services.map(({ path, label }) => (
                            <li key={path}>
                                <NavLink to={path} data-cursor-hover>{label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="footer-col-h">Contacto</h4>
                    <ul className="footer-list">
                        <li><a href="mailto:somos@trompoagencia.com" data-cursor-hover>somos@trompoagencia.com</a></li>
                        <li className="footer-list-text">+54 351 XXX XXXX</li>
                        <li className="footer-list-text">Lun a Vie · 09–18 hs</li>
                        <li className="footer-list-text">Córdoba, Argentina</li>
                    </ul>
                </div>
            </div>

            <div className="footer-base">
                <span>© 2026 Trompo Agencia</span>
                <div className="footer-legales">
                    <a href="#" data-cursor-hover>Privacidad</a>
                    <NavLink to="/terms" data-cursor-hover>Términos</NavLink>
                    <a href="#" data-cursor-hover>Cookies</a>
                </div>
            </div>
        </footer>
    );
}

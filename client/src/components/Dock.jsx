import { NavLink } from 'react-router-dom';
import routesConfig from '../config/routesConfig';
import '../assets/styles/dock.css';

export default function Dock() {
    const services = routesConfig.servicios;

    return (
        <div className="dock">
            <div className="dock-status">
                <span className="live-dot"></span>
                <span>Online</span>
            </div>

            <div className="dock-services-wrap">
                <span className="dock-services-trigger">Servicios</span>
                <div className="dock-services-panel">
                    <div className="dock-panel-eyebrow">5 unidades · sistema integrado</div>
                    {services.map(({ path, label }, i) => (
                        <NavLink key={path} to={path} className="dock-panel-link" data-cursor-hover>
                            <span className="dock-panel-num">0{i + 1}</span>
                            <span className="dock-panel-name">{label}</span>
                            <span className="dock-panel-arrow">→</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <NavLink to="/" className="dock-link" data-cursor-hover>Inicio</NavLink>

            <NavLink to="/contactanos" className="dock-cta" data-cursor-hover>
                Hablemos →
            </NavLink>
        </div>
    );
}

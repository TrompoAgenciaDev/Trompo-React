import { NavLink } from 'react-router-dom';
import routesConfig from '../config/routesConfig';
import '../assets/styles/services-band.css';

export default function ServicesBand() {
    const services = routesConfig.servicios;

    return (
        <section className="services-band">
            <div className="services-band-inner">
                {services.map(({ path, label }, i) => (
                    <NavLink key={path} to={path} className="services-band-link" data-cursor-hover>
                        <span className="services-band-num">0{i + 1} / Servicio</span>
                        <span className="services-band-name">{label}</span>
                    </NavLink>
                ))}
            </div>
        </section>
    );
}

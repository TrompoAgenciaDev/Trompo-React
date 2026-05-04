import { NavLink } from 'react-router-dom';
import routesConfig from '../config/routesConfig';

/**
 * Renderiza dinámicamente un menú del header a partir de routesConfig.
 * El último ítem válido recibe la clase `nav-cta`; el resto, `nav-link`.
 *
 * Props:
 *   menuKey   – clave del objeto routesConfig (default: "main")
 *   ctaLabel  – texto a mostrar en el último ítem (default: usa el label del config)
 */
const HeaderNav = ({ menuKey = 'main', ctaLabel }) => {
    const routes = (routesConfig[menuKey] ?? []).filter(r => r.path);
    const lastIdx = routes.length - 1;

    return (
        <div className="nav-links">
            {routes.map(({ path, label }, i) => {
                const isCta = i === lastIdx;
                return (
                    <NavLink
                        key={path}
                        to={path}
                        className={isCta ? 'nav-cta' : 'nav-link'}
                        data-cursor-hover
                    >
                        {isCta ? (ctaLabel ?? label) : label}
                    </NavLink>
                );
            })}
        </div>
    );
};

export default HeaderNav;

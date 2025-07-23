import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";

import Icon from '../components/Icons';

//styles and animations, if..
 import '../assets/styles/footer.css'

const Footer = () => {
  return (
    <footer className="container">
      <div className="footer">
        <div className="grid-footer-container">
          <section className="footer-section">
            <div className="nav-menu-container">
              <div className="footer-menu">
                <h3>Estrategias</h3>
                <Menu
                  menuType="estrategias"
                  routes={routesConfig}
                  classMenu="footer-menu-items"
                />
              </div>
              <div className="footer-menu">
                <h3>Desarrollo</h3>
                <Menu
                  menuType="desarrollo"
                  routes={routesConfig}
                  classMenu="footer-menu-items"
                />
              </div>
              <div className="footer-menu">
                <h3>Creatividad</h3>
                <Menu
                  menuType="creatividad"
                  routes={routesConfig}
                  classMenu="footer-menu-items"
                />
              </div>
              <div className="footer-menu">
                <h3>Interacción</h3>
                <Menu
                  menuType="interaccion"
                  routes={routesConfig}
                  classMenu="footer-menu-items"
                />
              </div>
            </div>
          </section>        
          <section className="footer-section">
            <a className="footer-logo-img" href="/">
              <Icon iconName="logoAmarillo"/>
            </a>
            <div className="footer-tags">
              <p>#Marketing Digital Aplicado</p>
              <p>#Reportes en tiempo real</p>
              <p>#Procesos de mejora continua</p>
              <p>#Especialistas en performance</p>
              <div className="social-icons">
                <Icon iconName="facebook" />
                <Icon iconName="instagram" />
                <Icon iconName="linkedin" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";

import Icon from "../components/Icons";

//styles and animations, if..
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="full-container footer">
      <div className="container footer-container">
        <section className="footer-section">
          <div className="nav-menu-container">
            <div className="footer-menu">
              <Menu
                menuType="main"
                routes={routesConfig}
                classMenu="footer-menu-items"
              />
            </div>
            <div className="footer-menu">
              <Menu
                menuType="servicios"
                routes={routesConfig}
                classMenu="footer-menu-items"
              />
            </div>
          </div>
        </section>
        <section className="footer-section">
          <a className="footer-logo-img" href="/">
            <Icon iconName="logoAmarillo" />
          </a>
          <div className="social-icons">
            <Icon iconName="facebook" />
            <Icon iconName="instagram" />
            <Icon iconName="linkedin" />
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;

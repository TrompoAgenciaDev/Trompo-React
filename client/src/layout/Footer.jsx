import React from "react";
import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";
import Icon from "../components/Icons";

//styles and animations
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="full-container footer">
      <div className="container footer-container">
        <div className="footer-grid-item">
          <a className="footer-logo-img" href="/">
            <Icon iconName="logoBlack" />
          </a>
        </div>
        <div className="footer-grid-item">
          <div className="footer-menu">
            <Menu
              menuType="mainFooter"
              routes={routesConfig}
              classMenu="footer-menu-items"
              location="footer"
            />
          </div>
          <div className="footer-menu">
            <Menu
              menuType="servicios"
              routes={routesConfig}
              classMenu="footer-menu-items"
              location="footer"
            />
          </div>
          <div className="social-icons">
            <Icon
              iconName="instagram"
              link="https://www.instagram.com/trompo.agencia/"
            />
            <Icon
              iconName="linkedin"
              link="https://ar.linkedin.com/company/trompo-agencia"
            />
            <Icon
              iconName="facebook"
              link="https://www.facebook.com/TrompoAgencia/"
            />
            <Icon iconName="x" link="https://x.com/trompo_agencia" />
          </div>
        </div>
        <div className="footer-grid-item">
          <a className="footer-logo-img" href="/">
            <Icon iconName="logoBlack" />
          </a>
          <div className="social-icons">
            <Icon
              iconName="instagram"
              link="https://www.instagram.com/trompo.agencia/"
            />
            <Icon
              iconName="linkedin"
              link="https://ar.linkedin.com/company/trompo-agencia"
            />
            <Icon
              iconName="facebook"
              link="https://www.facebook.com/TrompoAgencia/"
            />
            <Icon
              iconName="x"
              link="https://www.youtube.com/@trompo.agencia"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

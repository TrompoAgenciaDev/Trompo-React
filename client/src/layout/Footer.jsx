
import React from 'react';
import Menu from "../components/Menu";
import routesConfig from "../config/routesConfig";

import Icon from "../components/Icons";

//styles and animations, if..
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="full-container footer">
      <div className="container footer-container">
        <div className="footer-grid-item">
          <a className="footer-logo-img" href="/">
            <Icon iconName="logoBlack"/>
          </a>          
        </div>
        <div className="footer-grid-item">
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
            <div className="social-icons">
              <Icon iconName="instagram" />
              <Icon iconName="linkedin" />
              <Icon iconName="facebook" />
              <Icon iconName="youtube" />
            </div>    
        </div>
        <div className="footer-grid-item">
          <a className="footer-logo-img" href="/">
            <Icon iconName="logoBlack"/>
          </a>           
          <div className="social-icons">
            <Icon iconName="instagram" />
            <Icon iconName="linkedin" />
            <Icon iconName="facebook" />
            <Icon iconName="youtube" />
          </div>    
        </div>
      </div>
    </footer>
  );
};

export default Footer;

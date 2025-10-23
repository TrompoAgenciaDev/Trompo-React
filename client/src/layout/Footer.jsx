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
          <div className="logo-footer-container">
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
            </div>
          </div>         
        </div>
        <div className="footer-grid-item footer-menu-desktop">
          <div className="footer-menu footer-menu-desktop">
            <h3>Institucional</h3>
            <Menu
              menuType="footerInstitucional"
              routes={routesConfig}
              classMenu="footer-menu-items"
              location="footer"
            />
          </div>
        </div>
        <div className="footer-grid-item">
          <div className="footer-menu footer-menu-mobile">
            <h3>Institucional</h3>
            <Menu
              menuType="footerMobile"
              routes={routesConfig}
              classMenu="footer-menu-items"
              location="footer"
            />
          </div>
          <div className="footer-menu footer-menu-desktop">
            <h3>Servicios</h3>
            <Menu
              menuType="servicios"
              routes={routesConfig}
              classMenu="footer-menu-items"
              location="footer"
            />
          </div>
        </div>
        <div className="footer-grid-item">
          <div className="info-footer">
            <div className="footer-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.5 1.6875C20.0194 1.6875 25.3125 6.98062 25.3125 13.5C25.3125 20.0194 20.0194 25.3125 13.5 25.3125C6.98062 25.3125 1.6875 20.0194 1.6875 13.5C1.6875 6.98062 6.98062 1.6875 13.5 1.6875ZM13.5 2.8125C7.60162 2.8125 2.8125 7.60162 2.8125 13.5C2.8125 19.3984 7.60162 24.1875 13.5 24.1875C19.3984 24.1875 24.1875 19.3984 24.1875 13.5C24.1875 7.60162 19.3984 2.8125 13.5 2.8125ZM13.5 3.9375C18.7779 3.9375 23.0625 8.22206 23.0625 13.5C23.0625 18.7779 18.7779 23.0625 13.5 23.0625C8.22206 23.0625 3.9375 18.7779 3.9375 13.5C3.9375 8.22206 8.22206 3.9375 13.5 3.9375ZM12.9375 6.75V13.5C12.9375 13.8105 13.1895 14.0625 13.5 14.0625H20.25C20.5605 14.0625 20.8125 13.8105 20.8125 13.5C20.8125 13.1895 20.5605 12.9375 20.25 12.9375H14.0625V6.75C14.0625 6.4395 13.8105 6.1875 13.5 6.1875C13.1895 6.1875 12.9375 6.4395 12.9375 6.75Z" fill="#9A7A00"/>
              </svg>
            </div>
            <div className="info-text">
              <h4>Horarios</h4>
              <p>Lunes a Viernes de 09:00 a 18:00 hs.</p>
            </div>
          </div> 
          <div className="info-footer">
            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
              <path d="M27.4312 10.2094C25.9874 5.3625 21.553 2.0625 16.4999 2.0625C11.4468 2.0625 7.0124 5.3625 5.56865 10.2094C5.05303 12.0656 5.05303 14.025 5.46553 15.9844C6.1874 18.3562 8.2499 22.4813 13.6124 28.875C13.8187 29.1844 14.128 29.4937 14.3343 29.7C14.6437 30.1125 15.0562 30.4219 15.4687 30.7312C16.0874 31.0406 16.8093 31.0406 17.428 30.7312C17.8405 30.4219 18.253 30.1125 18.5624 29.7C18.7687 29.3906 19.078 29.0813 19.2843 28.875C24.6468 22.5844 26.7093 18.3562 27.328 15.9844C27.9468 14.025 27.9468 12.0656 27.4312 10.2094ZM21.6562 13.4062C21.6562 16.2937 19.3874 18.5625 16.4999 18.5625C13.6124 18.5625 11.3437 16.2937 11.3437 13.4062C11.3437 10.5188 13.6124 8.25 16.4999 8.25C19.3874 8.25 21.6562 10.5188 21.6562 13.4062Z" fill="#9A7A00"/>
            </svg>
            <div className="info-text">
              <h4>Córdoba, Argentina</h4>
            </div>
          </div> 
          <div className="mailing-footer">              
            <a href="mailto:somos@trompoagencia.com">
              <div className="footer-mail-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.8566 0C4.87029 0 0 4.87029 0 10.8566C0 16.843 4.87029 21.7133 10.8566 21.7133C16.843 21.7133 21.7133 16.8431 21.7133 10.8566C21.7133 4.87015 16.843 0 10.8566 0ZM15.5676 6.59003C15.8651 6.58973 16.156 6.67791 16.4033 6.84335L10.8566 11.5183L5.30998 6.8433C5.55726 6.67784 5.84815 6.58966 6.14567 6.58998L15.5676 6.59003ZM4.63669 8.09897C4.6364 7.74561 4.76072 7.40347 4.98777 7.13272L9.24724 10.7228L4.96985 14.5585C4.75403 14.2912 4.63643 13.9579 4.63669 13.6143V8.09897ZM6.14567 15.1233C5.83767 15.1235 5.53704 15.029 5.28465 14.8524L9.57845 11.002L10.7184 11.9628C10.7571 11.9954 10.806 12.0133 10.8566 12.0133C10.9072 12.0133 10.9562 11.9954 10.9948 11.9628L12.0687 11.0577L16.4183 14.8597C16.1679 15.0316 15.8713 15.1235 15.5676 15.1232L6.14567 15.1233ZM17.0766 13.6142C17.0769 13.9619 16.9566 14.299 16.7361 14.5679L12.4005 10.7781L16.7255 7.13268C16.9526 7.40345 17.0769 7.74563 17.0766 8.09901V13.6142Z" fill="white"/>
                </svg>
              </div>
              <p>somos@trompoagencia.com</p>
            </a>
          </div>
        </div>
      </div>
      <div className="copy">
        <span>© 2025 Trompo.</span>
        <span>Todos los derechos reservados</span>
      </div>
    </footer>
  );
};

export default Footer;

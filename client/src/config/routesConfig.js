import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Casos from "../pages/Casos";
import Trends from "../pages/Trends";
import Terms from "../pages/terms";

//Servicios
import Servicios from "../pages/Servicios";
import Identidad from "../pages/servicios/Identidad";
import DesarrolloWeb from "../pages/servicios/Desarrollo-Web";
import Ads from "../pages/servicios/Ads";
import RedesSociales from "../pages/servicios/Redes-Sociales";
import Soporte from "../pages/servicios/Soporte";

//templates
import SinglePost from "../templates/singlePost";
import SinglePortfolio from "../templates/singlePortfolio";

const routesConfig = {
  main: [
    { path: "/", label: "home", Component: Home },
    { path: "/about-us", label: "sobre nosotros", Component: About },
    { path: "/identidad", label: "identidad", Component: Identidad },
    { path: "/desarrollo-web", label: "desarrollo web", Component: DesarrolloWeb },
    { path: "/ads", label: "ads", Component: Ads },
    { path: "/redes-sociales", label: "redes sociales", Component: RedesSociales },
    { path: "/soporte", label: "soporte", Component: Soporte },
    { path: "/contacto", label: "contacto", Component: Contact },
  ],
  servicios: [
    { path: "/identidad", label: "identidad", Component: Identidad },
    { path: "/desarrollo-web", label: "desarrollo web", Component: DesarrolloWeb },
    { path: "/ads", label: "ads", Component: Ads },
    { path: "/redes-sociales", label: "redes sociales", Component: RedesSociales },
    { path: "/soporte", label: "soporte", Component: Soporte },
  ],
  mainFooter: [
    { path: "/", label: "home", Component: Home },
    { path: "/about-us", label: "sobre nosotros", Component: About },
    { path: "/contacto", label: "contacto", Component: Contact },
  ],

  posts: [{ path: "/post/:slug", Component: SinglePost }],
};

export default routesConfig;

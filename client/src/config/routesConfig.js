import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Casos from "../pages/Casos";
import Trends from "../pages/Trends";

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
    { path: "/", label: "Home", Component: Home },
    { path: "#", label: "Servicios", Component: Servicios },
    { path: "#", label: "Quiénes Somos", Component: About },
    { path: "#", label: "Tendencias", Component: Trends },
    { path: "#", label: "Casos", Component: Casos },
    { path: "#", label: "Contacto", Component: Contact },
  ],
  servicios: [
    { path: "#", label: "Identidad", Component: Identidad },
    { path: "#", label: "Desarrollo web", Component: DesarrolloWeb },
    { path: "#", label: "Ads", Component: Ads },
    { path: "#", label: "Redes Sociales", Component: RedesSociales },
    { path: "#", label: "Soporte", Component: Soporte },
  ],

  posts: [{ path: "/post/:slug", Component: SinglePost }],
};

export default routesConfig;

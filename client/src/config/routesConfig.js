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
    { path: "#", label: "home", Component: Home },
    { path: "#", label: "sobre nosotros", Component: About },
    { path: "#", label: "servicios", Component: Servicios },
    { path: "#", label: "casos de éxito", Component: Casos },
    { path: "#", label: "contacto", Component: Contact },
    { path: "/", label: "desarrollo web", Component: DesarrolloWeb },
  ],
  servicios: [
    { path: "#", label: "identidad", Component: Identidad },
    { path: "/", label: "desarrollo web", Component: DesarrolloWeb },
    { path: "#", label: "ads", Component: Ads },
    { path: "#", label: "redes sociales", Component: RedesSociales },
    { path: "#", label: "soporte", Component: Soporte },
  ],

  posts: [{ path: "/post/:slug", Component: SinglePost }],
};

export default routesConfig;

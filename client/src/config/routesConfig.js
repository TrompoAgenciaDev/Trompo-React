import Home from "../pages/Home";
import Nosotros from "../pages/Nosotros.jsx";
import Contactanos from "../pages/Contactanos";
import Casos from "../pages/Casos";
import Trends from "../pages/Trends";
import Terms from "../pages/terms";
import Gracias from "../pages/Gracias";

//Servicios
import Servicios from "../pages/Servicios";
import Creatividad from "../pages/servicios/Creatividad.jsx";
import Desarrollo from "../pages/servicios/Desarrollo.jsx";
import Estrategia from "../pages/servicios/Estrategia";
import Interaccion from "../pages/servicios/Interaccion";
import Soporte from "../pages/servicios/Soporte";

//templates
import SinglePost from "../templates/singlePost";
import SinglePortfolio from "../templates/singlePortfolio";
import NotFound from "../pages/NotFound";
import Maintenance from "../pages/Maintenance.jsx";

const routesConfig = {
  main: [
    { path: "/", label: "inicio", Component: Desarrollo },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "", label: "servicios", Component: Servicios },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],
  servicios: [
    { path: "/estrategia", label: "estrategia", Component: Estrategia },
    { path: "/creatividad", label: "Creatividad", Component: Creatividad },
    { path: "/interaccion", label: "interacción", Component: Interaccion },
    { path: "/desarrollo", label: "desarrollo", Component: Desarrollo },
    { path: "/soporte", label: "soporte", Component: Soporte },
  ],
  mainFooter: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],
  legal: [
    { path: "/terms", label: "términos y condiciones", Component: Terms },
  ],
  posts: [{ path: "/post/:slug", Component: SinglePost }],

  AlternativePAges: [
    { path: "/not-found", label: "No encontrado", Component: NotFound },
    { path: "/maintenance", label: "Mantenimiento", Component: Maintenance },
    { path: "/gracias", label: "gracias", Component: Gracias },
  ],
};

export default routesConfig;

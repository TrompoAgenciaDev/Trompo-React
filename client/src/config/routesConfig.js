import { lazy } from "react";

// Code splitting - Lazy loading de todas las páginas
const Home = lazy(() => import("../pages/Home"));
const Nosotros = lazy(() => import("../pages/Nosotros.jsx"));
const Contactanos = lazy(() => import("../pages/Contactanos"));
const Casos = lazy(() => import("../pages/Casos"));
const Trends = lazy(() => import("../pages/Trends"));
const Terms = lazy(() => import("../pages/terms"));
const Gracias = lazy(() => import("../pages/Gracias"));

//Servicios
const Servicios = lazy(() => import("../pages/Servicios"));
const Creatividad = lazy(() => import("../pages/servicios/Creatividad.jsx"));
const Desarrollo = lazy(() => import("../pages/servicios/Desarrollo.jsx"));
const Estrategia = lazy(() => import("../pages/servicios/Estrategia"));
const Interaccion = lazy(() => import("../pages/servicios/Interaccion"));
const Soporte = lazy(() => import("../pages/servicios/Soporte"));
const Google = lazy(() => import("../pages/estrategias/Google.jsx"));
const Meta = lazy(() => import("../pages/estrategias/Meta.jsx"));

//Landings
const Primavera = lazy(() => import("../pages/landings/Primavera.jsx"));

//templates
const SinglePost = lazy(() => import("../templates/singlePost"));
const SinglePortfolio = lazy(() => import("../templates/singlePortfolio"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Maintenance = lazy(() => import("../pages/Maintenance.jsx"));
const ClearCache = lazy(() => import("../pages/ClearCache"));

const routesConfig = {
  main: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "", label: "servicios", Component: Servicios },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],

  menuMobile: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "/estrategia", label: "estrategia", Component: Estrategia },
    { path: "/creatividad", label: "Creatividad", Component: Creatividad },
    { path: "/interaccion", label: "interacción", Component: Interaccion },
    { path: "/desarrollo", label: "desarrollo", Component: Desarrollo },
    { path: "/soporte", label: "soporte", Component: Soporte },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],

  home: [
    { path: "/", label: "inicio", Component: Home },
  ],

  footerMobile: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "/estrategia", label: "estrategia", Component: Estrategia },
    { path: "/creatividad", label: "Creatividad", Component: Creatividad },
    { path: "/interaccion", label: "interacción", Component: Interaccion },
    { path: "/desarrollo", label: "desarrollo", Component: Desarrollo },
    { path: "/soporte", label: "soporte", Component: Soporte },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],

  footerInstitucional: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],


  servicios: [
    { path: "/estrategia", label: "estrategia", Component: Estrategia },
    { path: "/creatividad", label: "Creatividad", Component: Creatividad },
    { path: "/interaccion", label: "interacción", Component: Interaccion },
    { path: "/desarrollo", label: "desarrollo", Component: Desarrollo },
    { path: "/soporte", label: "soporte", Component: Soporte },
  ],

  us: [
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
  ],

  contacto: [
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
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
    { path: "/primavera", label: "Landing Primavera", Component: Primavera },
    { path: "/clear-cache", label: "Limpiar Caché", Component: ClearCache },
  ],

  estrategias: [
    { path: "/servicios/estrategias/google-ads", label: "Google Ads", Component: Google },
    { path: "/servicios/estrategias/meta-ads", label: "Meta Ads", Component: Meta },
  ],
};

export default routesConfig;

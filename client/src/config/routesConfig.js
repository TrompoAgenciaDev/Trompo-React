import { lazy } from "react";

// Home importado estáticamente - CRÍTICO para LCP
import Home from "../pages/Home";

// Code splitting - Lazy loading de páginas secundarias
const Nosotros = lazy(() => import("../pages/Nosotros.jsx"));
const Contactanos = lazy(() => import("../pages/Contactanos"));
const Casos = lazy(() => import("../pages/Casos"));
const Terms = lazy(() => import("../pages/terms"));
const Gracias = lazy(() => import("../pages/Gracias"));

//Servicios
const Servicios = lazy(() => import("../pages/Servicios"));
const Disenio = lazy(() => import("../pages/servicios/Disenio.jsx"));
const Desarrollo = lazy(() => import("../pages/servicios/Desarrollo.jsx"));
const PaidMedia = lazy(() => import("../pages/servicios/PaidMedia.jsx"));
const SocialMedia = lazy(() => import("../pages/servicios/SocialMedia.jsx"));
const Multimedia = lazy(() => import("../pages/servicios/Multimedia"));

//Landings
const Primavera = lazy(() => import("../pages/landings/Primavera.jsx"));

//templates
const SinglePost = lazy(() => import("../templates/singlePost"));
const SinglePortfolio = lazy(() => import("../templates/singlePortfolio"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Maintenance = lazy(() => import("../pages/Maintenance.jsx"));
const ClearCache = lazy(() => import("../pages/ClearCache"));
const Faqs = lazy(() => import("../pages/Faqs"));

const routesConfig = {
  main: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "", label: "servicios", Component: Servicios },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
    { path: "/faqs", label: "faqs", Component: Faqs },
  ],

  menuMobile: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "/servicios/disenio", label: "Diseño", Component: Disenio },
    { path: "/servicios/multimedia", label: "Multimedia", Component: Multimedia },
    { path: "/servicios/desarrollo", label: "desarrollo web", Component: Desarrollo },
    { path: "/servicios/campagne", label: "Campañas", Component: PaidMedia },
    { path: "/servicios/social-media", label: "Redes Sociales", Component: SocialMedia },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],

  home: [
    { path: "/", label: "inicio", Component: Home },
  ],

  footerMobile: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "/servicios/disenio", label: "Diseño", Component: Disenio },
    { path: "/servicios/multimedia", label: "Multimedia", Component: Multimedia },
    { path: "/servicios/desarrollo", label: "desarrollo web", Component: Desarrollo },
    { path: "/servicios/campagne", label: "Campañas", Component: PaidMedia },
    { path: "/servicios/social-media", label: "Redes Sociales", Component: SocialMedia },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
  ],

  footerInstitucional: [
    { path: "/", label: "inicio", Component: Home },
    { path: "/nosotros", label: "nosotros", Component: Nosotros },
    { path: "/contactanos", label: "contactanos", Component: Contactanos },
    { path: "/faqs", label: "FAQs", Component: Faqs },
    { path: "/terms", label: "Términos y condiciones", Component: Terms },
  ],


  servicios: [
    { path: "/servicios/disenio", label: "Diseño", Component: Disenio },
    { path: "/servicios/multimedia", label: "Multimedia", Component: Multimedia },
    { path: "/servicios/desarrollo", label: "desarrollo web", Component: Desarrollo },
    { path: "/servicios/campagne", label: "Campañas", Component: PaidMedia },
    { path: "/servicios/social-media", label: "Redes Sociales", Component: SocialMedia },
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
    { path: "/faqs", label: "Preguntas Frecuentes", Component: Faqs },
  ],
  legal: [
    { path: "/terms", label: "términos y condiciones", Component: Terms },
  ],
  posts: [{ path: "/post/:slug", Component: SinglePost }],

  AlternativePages: [
    { path: "/not-found", label: "No encontrado", Component: NotFound },
    { path: "/maintenance", label: "Mantenimiento", Component: Maintenance },
    { path: "/gracias", label: "gracias", Component: Gracias },
    { path: "/primavera", label: "Landing Primavera", Component: Primavera },
    { path: "/clear-cache", label: "Limpiar Caché", Component: ClearCache },
    { path: "/faqs", label: "faqs", Component: Faqs },
    { path: "/terms", label: "Términos y condiciones", Component: Terms },
  ],

};

export default routesConfig;

import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import routesConfig from "../config/routesConfig";

const AppRoutes = () => {
  // Separar Home (estático) de rutas lazy
  const allRoutes = Object.values(routesConfig).flat();
  
  // Eliminar duplicados usando Map para mantener solo la primera ocurrencia
  const routesMap = new Map();
  allRoutes.forEach(route => {
    if (!routesMap.has(route.path)) {
      routesMap.set(route.path, route);
    }
  });
  
  // Home debe estar primero - CRÍTICO para LCP
  const homeRoute = routesMap.get("/");
  routesMap.delete("/");
  const otherRoutes = Array.from(routesMap.values());

  return (
    <Routes>
      {/* Home renderizado sin Suspense - CRÍTICO para LCP */}
      {homeRoute && (
        <Route key="home" path={homeRoute.path} element={<homeRoute.Component />} />
      )}
      {/* Rutas secundarias con Suspense - fallback null para evitar CLS */}
      {otherRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          }
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
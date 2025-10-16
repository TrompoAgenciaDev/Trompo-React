import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import routesConfig from "../config/routesConfig";
import LoadingSpinner from "../components/LoadingSpinner";

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {Object.values(routesConfig)
          .flat()
          .map(({ path, Component }, index) => (
            <Route key={index} path={path} element={<Component/>} />
          ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
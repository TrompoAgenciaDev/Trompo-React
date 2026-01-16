// App.jsx
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import MenuPopup from "@/components/popups/MenuPopup";
import useTogglePopup from "@/hooks/useTogglePopup";
import ScrollTop from "@/components/buttons/ScrollTop";
import { usePreloadResources } from "@/hooks/usePreloadResources";
import { usePrefetchRoutes } from "@/hooks/usePrefetchRoutes";
import { HoverProvider } from "@/context/HoverContext";
// import TrailCursor from "@/components/cursors/TrailCursor";
import React from "react";

// Componente interno que usa el hook dentro del contexto del router
function AppContent() {
  const { isOpen, togglePopup } = useTogglePopup();
  const location = useLocation();
  
  // Preload dinámico de recursos críticos
  usePreloadResources();
  
  // Prefetch inteligente de rutas relacionadas
  usePrefetchRoutes();

  return (
    <>
      {/* <TrailCursor /> */}
      <Header onTogglePopup={togglePopup} />
      <MenuPopup isOpen={isOpen} onClose={togglePopup} />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename={`${import.meta.env.BASE_URL}`}>
      <HoverProvider>
        <AppContent />
      </HoverProvider>
    </BrowserRouter>
  );
}

export default App;

// App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import MenuPopup2 from "@/components/popups/MenuPopup2";
import useTogglePopup from "@/hooks/useTogglePopup";
import ScrollTop from "@/components/buttons/ScrollTop";
import { usePreloadResources } from "@/hooks/usePreloadResources";
import { usePrefetchRoutes } from "@/hooks/usePrefetchRoutes";
import React from "react";

// Componente interno que usa el hook dentro del contexto del router
function AppContent() {
  const { isOpen, togglePopup } = useTogglePopup();
  
  // Preload dinámico de recursos críticos
  usePreloadResources();
  
  // Prefetch inteligente de rutas relacionadas
  usePrefetchRoutes();

  return (
    <>
      <Header onTogglePopup={togglePopup} />
      <MenuPopup2 isOpen={isOpen} onClose={togglePopup} />
      <ScrollTop />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename={`${import.meta.env.BASE_URL}`}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

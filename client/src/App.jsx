// App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import MenuPopup2 from "@/components/popups/MenuPopup2";
import useTogglePopup from "@/hooks/useTogglePopup";
import ScrollTop from "@/components/buttons/ScrollTop";
import React from "react";

function App() {
  const { isOpen, togglePopup } = useTogglePopup();

  return (
    <BrowserRouter basename={`${import.meta.env.BASE_URL}`}>
      <Header onTogglePopup={togglePopup} />
      <MenuPopup2 isOpen={isOpen} onClose={togglePopup} />
      <ScrollTop />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

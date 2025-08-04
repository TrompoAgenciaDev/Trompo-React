// App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import MenuPopup from "@/components/popups/MenuPopup";
import useTogglePopup from "@/hooks/useTogglePopup";
import ScrollTop from "@/components/buttons/ScrollTop";

function App() {
  const { isOpen, togglePopup } = useTogglePopup();

  return (
    <BrowserRouter basename="/">
      <Header onTogglePopup={togglePopup} />
      <MenuPopup isOpen={isOpen} onClose={togglePopup} />
      <AppRoutes />
      <ScrollTop />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

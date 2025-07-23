// App.jsx
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/fonts/index.css";
import AppRoutes from "@/routes/AppRoutes";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import MenuPopup from "@/components/popups/MenuPopup";
import useTogglePopup from '@/hooks/useTogglePopup';

function App() {
  const { isOpen, togglePopup } = useTogglePopup();


  return (
    <BrowserRouter basename="/">
      <Header onTogglePopup={togglePopup}/>
      <MenuPopup isOpen={isOpen} onClose={togglePopup}/>
      <AppRoutes/>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
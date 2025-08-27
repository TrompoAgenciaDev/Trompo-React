import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import ImageSlider from "../components/sliders/CustomerSlider";
import Faqs from "../layout/Faqs";
import Hero from "../layout/Hero";
import Contact from "../layout/Contact";

import "../assets/styles/contact-page.css";

const Contactanos = () => {

  return (
    <>
      <Hero location="contactanos" />

      <div id="contacto"></div>
      <Contact/>

      <section className="full-container slider-conainer">
        <div className="container">
          <ImageSlider />
        </div>
      </section>

      <Faqs/>
    </>
  );
};

export default Contactanos;

import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import FormIndex from "../components/forms/FormIndex";
import ImageSlider from "../components/sliders/CustomerSlider";
import YellowSection from "../layout/YellowSection";
import Hero from "../layout/Hero";

import "../assets/styles/contact-page.css";

const Contact = () => {
  const titleControls = useAnimationControls();
  const highlightControls = useAnimationControls();

  useEffect(() => {
    (async () => {
      await titleControls.set({ scale: 1.1 });
      await new Promise((r) => setTimeout(r, 1500));

      const titleAnim = titleControls.start({
        scale: 1,
        transition: { duration: 0.2, ease: "easeOut" },
      });

      const highlightAnim = highlightControls.start({
        height: "auto",
        transition: { duration: 0.3, ease: "easeOut" },
      });

      await Promise.all([titleAnim, highlightAnim]);
    })();
  }, [titleControls, highlightControls]);

  return (
    <>
      <Hero lotacion="contact" />

      <section className="full-container" id="form">

        <div className="container form-container">
          <div className="grid-item-form">
            <span>
              Comenzá hoy con una estrategia que te garantice resultados.
            </span>
            <h1>
              ¡Poné en movimiento el <span className="italic"><span className="br">{"\n"}</span>marketing digital</span> de tu Empresa!
            </h1>
          </div>
          <div className="grid-item-form">
            <FormIndex />
          </div>
        </div>

        <div className="full-container text-container">
          <div className="container">
            <span>
              Transformemos obstáculos en{" "}
              <span className="italic">ventajas competitivas</span>
            </span>
          </div>
        </div>
        <section className="full-container slider-conainer">
          <div className="container">
            <ImageSlider />
          </div>
        </section>
      </section>

      <YellowSection type="faqs"/>
    </>
  );
};

export default Contact;

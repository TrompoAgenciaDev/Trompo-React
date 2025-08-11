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
          <FormIndex />
        </div>

        <div className="full-container text-container">
          <div className="container">
            <span>
              Transformemos obstáculos en{" "}
              <span className="italic">ventajas competitivas</span>
            </span>
          </div>
        </div>
      </section>

      <section className="full-container slider-conainer">
        <div className="container">
          <ImageSlider />
        </div>
      </section>

      <YellowSection type="faqs"/>
    </>
  );
};

export default Contact;

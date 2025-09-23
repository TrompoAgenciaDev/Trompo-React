import ImageSlider from "../components/sliders/CustomerSlider";
import Faqs from "../layout/Faqs";
import Hero from "../layout/Hero";
import Contact from "../layout/Contact";
import Testimonials from "../components/Testimonials.jsx";

import "../assets/styles/contact-page.css";

const Contactanos = () => {

  return (
    <>
      <Hero location="contactanos" />

      <div id="contacto"></div>
      <Contact/>
      
      <section className="full-container bg-yellow testimonial-wrapper">
        <div className="container testimonial-header">
          <h4>Más que clientes, aliados estratégicos.</h4>
          <p>Historias que muestran el valor de trabajar en equipo.</p>
        </div>
        <div className="full-container">
          <Testimonials size={4} />
        </div>
      </section>

      <Faqs/>
      
      <section className="full-container slider-conainer">
        <div className="container">
          <ImageSlider />
        </div>
      </section>

    </>
  );
};

export default Contactanos;

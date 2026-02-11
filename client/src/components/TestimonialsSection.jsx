import React from "react";
import Testimonials3d from "./Testimonials3d";
import "../assets/styles/testimonials-section.css";

const TestimonialsSection = ({ backgroundClass = "white-bg" }) => {
  return (
    <section className={`full-container testimonial-wrapper ${backgroundClass}`}>
      <div className="testimonial-cards-slider">
        <Testimonials3d />
      </div>
      <div className={`container testimonial-text-content ${backgroundClass}`}>
        <h3>Más que clientes, aliados estratégicos</h3>
        <p>Historias reales que reflejan el valor de construir en conjunto: marcas que confiaron en Trompo para evolucionar, ordenar su presencia digital y convertir desafíos en resultados concretos, con estrategia, creatividad y compromiso en cada paso.</p>
      </div>
    </section>
  );
};

export default TestimonialsSection;

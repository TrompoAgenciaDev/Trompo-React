import React from "react";
import Testimonials3D from "./Testimonials3d";
import "../assets/styles/testimonials-section.css";

const TestimonialsSection = () => {
  return (
    <section className="full-container testimonial-wrapper">
      <div className="testimonial-cards-slider">
        <Testimonials3D />
      </div>
      <div className="container testimonial-text-content">
        <h3>Dejamos que hablen por nosotros</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, natus maiores corporis earum quidem, quo alias dolore consequatur doloribus obcaecati deserunt eum suscipit dignissimos! Natus vero eveniet libero dignissimos ratione!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam minus minima placeat reprehenderit quaerat repellendus!</p>
      </div>
    </section>
  );
};

export default TestimonialsSection;

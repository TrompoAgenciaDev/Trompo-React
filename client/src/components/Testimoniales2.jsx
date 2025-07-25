import { motion, AnimatePresence } from "motion/react";
import useFetchTestimonials from "@/hooks/useFetchTestimonials";
import "../assets/styles/testimonials.css";


export default function Testimoniales() {
  const { testimonials, loading, error } = useFetchTestimonials();

  if (loading) return <div>Cargando testimonios...</div>;
  if (error) return <div>{error}</div>;
  if (!testimonials.length) return <div>No hay testimonios disponibles.</div>;

  return (
    <div className="container">
      {testimonials.map((t, idx) => (
        <div className="testimonial-card" key={idx}>
          <div className="testimonial-header">
            <div className="testimonial-author">{t.author_name || t.author}</div>
            <div className="testimonial-rating">
              {"★".repeat(t.rating)}
              <span className="testimonial-rating-empty">
                {"★".repeat(5 - t.rating)}
              </span>
            </div>
          </div>
          <div className="testimonial-text">{t.text}</div>
        </div>
      ))}
    </div>
  );
}
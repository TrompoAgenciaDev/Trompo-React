import { useEffect, useRef, useState } from "react";
import useFetchTestimonials from "../hooks/useFetchTestimonials";
import "../assets/styles/testimonials-slider.css";

const REPEAT = 3;

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

function getImagePath(path) {
  if (!path) return "";

  // URLs externas
  if (path.startsWith("http")) {
    return path;
  }

  // Evitar ./ porque Vite no resuelve bien assets dinámicos así
  const cleanPath = path.replace(/^\.?\//, "");

  return `${base}${cleanPath}`;
}

export default function TestimonialsSlider({ eyebrow, heading }) {
  const { testimonials, loading } = useFetchTestimonials();

  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const posRef = useRef(0);

  const [paused, setPaused] = useState(false);

  // Triplicar para efecto infinito
  const items = testimonials.length
    ? Array.from({ length: REPEAT }, () => testimonials).flat()
    : [];

  useEffect(() => {
    if (!testimonials.length || paused) return;

    const track = trackRef.current;

    if (!track) return;

    const getSetWidth = () => {
      return track.scrollWidth / REPEAT;
    };

    const SPEED = 0.6;

    const animate = () => {
      posRef.current += SPEED;

      const setWidth = getSetWidth();

      if (posRef.current >= setWidth) {
        posRef.current -= setWidth;
      }

      track.style.transform = `translateX(-${posRef.current}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [testimonials, paused]);

  if (loading) {
    return null;
  }

  if (!testimonials?.length) {
    return null;
  }

  return (
    <section className="ts-section">
      {(eyebrow || heading) && (
        <div className="ts-header">
          {eyebrow && (
            <p className="ts-eyebrow">
              {eyebrow}
            </p>
          )}

          {heading && (
            <h2
              className="ts-heading"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}
        </div>
      )}

      <div
        className="ts-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="ts-track"
          ref={trackRef}
        >
          {items.map((item, index) => {
            const imageSrc = getImagePath(item.image);
            const logoSrc = getImagePath(item.logo);

            return (
              <div
                className="ts-slide"
                key={`${item.name}-${index}`}
              >
                <div className="ts-card">
                  <div className="ts-quote-mark">"</div>

                  <div className="ts-card-body">
                    <p className="ts-text">
                      {String(item.text || item.quote || "").replace(
                        /^✨\s*/,
                        ""
                      )}
                    </p>

                    <div className="ts-meta">
                      {item.image && (
                        <img
                          src={imageSrc}
                          alt={item.name || "Testimonial"}
                          className="ts-avatar"
                          draggable={false}
                          loading="lazy"
                          onError={(e) => {
                            console.error(
                              "Error cargando avatar:",
                              imageSrc
                            );

                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}

                      <div className="ts-author">
                        <div className="ts-name">
                          {item.name}
                        </div>

                        <div className="ts-role">
                          {item.role}
                        </div>
                      </div>

                      {item.logo && (
                        <img
                          src={logoSrc}
                          alt={`Logo ${item.name || ""}`}
                          className="ts-logo"
                          draggable={false}
                          loading="lazy"
                          onError={(e) => {
                            console.error(
                              "Error cargando logo:",
                              logoSrc
                            );

                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
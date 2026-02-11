import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Testimonials3DTest.css";

const NUM_SLIDES = 8;
const RADIUS = 180;

export default function Testimonials3DTest() {
  const slideRefs = useRef([]);
  const angleStep = 360 / NUM_SLIDES;

  useEffect(() => {
    if (slideRefs.current.length === 0) return;

    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;

      gsap.set(slide, {
        rotateX: i * angleStep,
        z: RADIUS,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center center",
        force3D: true
      });
    });
  }, []);

  return (
    <div className="testimoniales-container">
      <div className="testimoniales-viewport">
        <div className="testimoniales-cylinder">
          {Array.from({ length: NUM_SLIDES }, (_, i) => (
            <div
              key={i}
              ref={(el) => (slideRefs.current[i] = el)}
              className="testimoniales-slide"
            >
              <div className="testimoniales-card">
                Slide {i}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

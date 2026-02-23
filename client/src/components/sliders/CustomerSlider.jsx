import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "motion/react";
import "../../assets/styles/customer-slider.css";

const sliderImages = [
  `${import.meta.env.BASE_URL}assets/customerImg/ads.svg`,
  `${import.meta.env.BASE_URL}assets/customerImg/face.svg`,
  `${import.meta.env.BASE_URL}assets/customerImg/ig.svg`,
  `${import.meta.env.BASE_URL}assets/customerImg/in.svg`,
  `${import.meta.env.BASE_URL}assets/customerImg/wp.svg`,
  `${import.meta.env.BASE_URL}assets/customerImg/yt.svg`
];

function colsForWidth(w) {
  if (w >= 1366) return 6;
  if (w >= 1280) return 5;
  if (w >= 1024) return 4;
  if (w >= 768) return 4;
  return 1;
}

export default function CustomerSlider() {
  const containerRef = useRef(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const loopWRef = useRef(0);
  const draggingRef = useRef(false);
  const x = useMotionValue(0);

  const baseSpeed = useRef(80);
  const vRef = useRef(-baseSpeed.current);
  const targetRef = useRef(-baseSpeed.current);

  const [cols, setCols] = useState(4);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const w = containerRef.current?.offsetWidth || window.innerWidth || 1280;
          setCols(colsForWidth(w));
          ticking = false;
        });
        ticking = true;
      }
    };
    if (typeof window !== "undefined" && window.requestIdleCallback) {
      requestIdleCallback(() => update(), { timeout: 100 });
    } else {
      setTimeout(update, 100);
    }
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      if (!el) return;
      const w = el.offsetWidth || 0;
      const slideW = w / Math.max(1, cols);
      loopWRef.current = slideW * sliderImages.length;
    });
  }, [cols]);

  useEffect(() => {
    const tick = (ts) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      lastTsRef.current = ts;

      if (!draggingRef.current) {
        const v = vRef.current;
        const tgt = targetRef.current;
        const k = 6;
        vRef.current = v + (tgt - v) * (1 - Math.exp(-k * dt));

        const nx = x.get() + vRef.current * dt;
        const width = loopWRef.current || 1;

        let wrapped = nx;
        if (wrapped <= -width) wrapped += width;
        if (wrapped > 0) wrapped -= width;
        x.set(wrapped);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [x]);

  const onDragStart = () => {
    draggingRef.current = true;
    targetRef.current = vRef.current;
  };

  const onDragEnd = (_e, info) => {
    draggingRef.current = false;
    const vx = info?.velocity?.x ?? 0;
    vRef.current = vx;
    targetRef.current = -baseSpeed.current;
  };

  const cloned = [...sliderImages, ...sliderImages, ...sliderImages];

  return (
    <div
      ref={containerRef}
      className="image-slider-container container"
      style={{ "--cols": cols }}
    >
      <motion.div
        className="image-slider-track"
        style={{ x }}
        drag="x"
        dragElastic={0}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {cloned.map((src, i) => (
          <div className="image-slide" key={i}>
            <img
              src={src}
              alt={`slide-${i}`}
              className="image-element"
              loading="lazy"
              width={200}
              height={100}
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

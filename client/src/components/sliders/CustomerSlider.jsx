import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "motion/react";
import "../../assets/styles/customer-slider.css";

const sliderImages = [
  `${import.meta.env.BASE_URL}assets/customerImg/denso.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/agreteq.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/menta.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/molinos.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/ranko.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/raulito.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/ravana.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/renault-trucks.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/sw.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/viditec.webp`,
  `${import.meta.env.BASE_URL}assets/customerImg/volvo.webp`,
];

function colsForWidth(w) {
  if (w >= 1366) return 6;
  if (w >= 1280) return 5;
  if (w >= 1024) return 4;
  if (w >= 768)  return 4;
  return 1;
}

export default function ImageSlider() {
  const containerRef = useRef(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const loopWRef = useRef(0);
  const draggingRef = useRef(false);
  const x = useMotionValue(0);

  // velocidad
  const baseSpeed = useRef(80);      // px/s hacia la IZQ
  const vRef = useRef(-baseSpeed.current); // vx actual
  const targetRef = useRef(-baseSpeed.current); // objetivo al que amortigua

  const [cols, setCols] = useState(4);

  // medir y ajustar columnas
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.offsetWidth || window.innerWidth || 1280;
      setCols(colsForWidth(w));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // calcular ancho de un loop (un set de imágenes) según columnas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.offsetWidth || 0;
    const slideW = w / Math.max(1, cols);
    loopWRef.current = slideW * sliderImages.length;
  }, [cols]);

  // animación continua
  useEffect(() => {
    const tick = (ts) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(0.05, (ts - last) / 1000); // seg, cap 50ms
      lastTsRef.current = ts;

      // si no se está arrastrando, avanzamos
      if (!draggingRef.current) {
        // amortiguar v hacia target
        const v = vRef.current;
        const tgt = targetRef.current;
        // amortiguación dependiente del tiempo
        const k = 6; // mayor = más rápido vuelve
        vRef.current = v + (tgt - v) * (1 - Math.exp(-k * dt));

        const nx = x.get() + vRef.current * dt;
        const width = loopWRef.current || 1;

        // wrap infinito dentro de [-width, 0)
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

  // drag handlers
  const onDragStart = () => {
    draggingRef.current = true;
    // al empezar drag, fijamos target actual para no tirar del amortiguador
    targetRef.current = vRef.current;
  };

  const onDragEnd = (_e, info) => {
    draggingRef.current = false;
    // velocidad inicial post-drag = velocidad del gesto
    const vx = (info?.velocity?.x ?? 0); // px/s, signo según dirección del gesto
    vRef.current = vx;
    // objetivo: velocidad base hacia la izquierda
    targetRef.current = -baseSpeed.current;
  };

  // 3 copias para margen al arrastrar
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
            <img className="image-element" src={src} alt={`slide-${i}`} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

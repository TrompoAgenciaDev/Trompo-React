import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// Imágenes del slider
const sliderImages = [
  "/assets/customerImg/denso.png",
  "/assets/customerImg/femesa.png",
  "/assets/customerImg/guanaco.png",
  "/assets/customerImg/lhaka.png",
  "/assets/customerImg/ranko.png",
  "/assets/customerImg/raulito.png",
  "/assets/customerImg/ravana.png",
  "/assets/customerImg/renault-trucks.png",
  "/assets/customerImg/sw.png",
  "/assets/customerImg/viditec.png",
  "/assets/customerImg/volvo.png",
];

// Helper para wrapear el índice
function wrapIndex(idx, length) {
  return (idx + length) % length;
}

// Detecta si es mobile
function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768;
}

export default function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mobile, setMobile] = useState(isMobile());
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const duration = 0.6; // segundos, más lento para mejor fluidez
  const interval = 3000; // ms

  // Escucha resize para mobile/desktop
  useEffect(() => {
    function handleResize() {
      setMobile(isMobile());
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set container width on mount
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Cambio automático
  useEffect(() => {
    if (!isDragging) {
      timerRef.current = setTimeout(() => {
        setIndex((prev) => wrapIndex(prev + 1, sliderImages.length));
      }, interval);
    }
    return () => clearTimeout(timerRef.current);
  }, [index, isDragging, mobile]);

  // Drag handlers
  function handleDragStart(event, info) {
    setIsDragging(true);
    dragStartX.current = info.point.x;
    dragDelta.current = 0;
  }
  function handleDrag(event, info) {
    dragDelta.current = info.point.x - dragStartX.current;
  }
  function handleDragEnd(event, info) {
    setIsDragging(false);
    const threshold = 80; // px
    if (dragDelta.current > threshold) {
      setIndex((prev) => wrapIndex(prev - 1, sliderImages.length));
    } else if (dragDelta.current < -threshold) {
      setIndex((prev) => wrapIndex(prev + 1, sliderImages.length));
    }
    dragDelta.current = 0;
  }

  // Mostrar siempre 2 imágenes, tanto en mobile como desktop
  const imagesToShow = 2;
  const imageWidth = "50%";

  // Genera los índices de las imágenes a mostrar (2 para mostrar 2 en pantalla)
  const indices = [];
  for (let i = 0; i < imagesToShow; i++) {
    indices.push(wrapIndex(index + i, sliderImages.length));
  }

  // Para la animación: trackea la dirección
  const [direction, setDirection] = useState(1);
  function paginate(newIndex) {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(wrapIndex(newIndex, sliderImages.length));
  }

  // Modifica el cambio automático para trackear dirección
  useEffect(() => {
    if (!isDragging) {
      timerRef.current = setTimeout(() => {
        setDirection(1);
        setIndex((prev) => wrapIndex(prev + 1, sliderImages.length));
      }, interval);
    }
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line
  }, [index, isDragging, mobile]);

  // Drag handlers con dirección
  function handleDragStartDir(event, info) {
    setIsDragging(true);
    dragStartX.current = info.point.x;
    dragDelta.current = 0;
  }
  function handleDragDir(event, info) {
    dragDelta.current = info.point.x - dragStartX.current;
  }
  function handleDragEndDir(event, info) {
    setIsDragging(false);
    const threshold = 80; // px
    if (dragDelta.current > threshold) {
      setDirection(-1);
      setIndex((prev) => wrapIndex(prev - 1, sliderImages.length));
    } else if (dragDelta.current < -threshold) {
      setDirection(1);
      setIndex((prev) => wrapIndex(prev + 1, sliderImages.length));
    }
    dragDelta.current = 0;
  }

  // Animaciones para cada imagen según su posición
  const getVariants = (pos) => {
    // pos: 0 = left, 1 = right
    // direction: 1 = next, -1 = prev
    if (pos === 0) {
      // La que queda a la izquierda
      return {
        initial: { opacity: 0, x: direction * 100, scale: 1 },
        animate: { opacity: 1, x: 0, scale: 1, transition: { duration } },
        exit: { opacity: 0, x: direction * -100, scale: 0.98, transition: { duration: duration * 0.7 } },
      };
    }
    // La que queda a la derecha
    return {
      initial: { opacity: 0, x: direction * 100, scale: 1 },
      animate: { opacity: 1, x: 0, scale: 1, transition: { duration } },
      exit: { opacity: 0, x: direction * -100, scale: 1, transition: { duration: duration * 0.7 } },
    };
  };

  // Para que AnimatePresence funcione bien, necesitamos una key única por posición
  const keys = indices.map((imgIdx, i) => `${imgIdx}-${i}-${index}`);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
        touchAction: "pan-y",
        userSelect: "none",
        minHeight: 30,
        maxHeight: 80,
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        {indices.map((imgIdx, i) => (
          <motion.img
            key={keys[i]}
            src={sliderImages[imgIdx]}
            alt={`slide-${imgIdx}`}
            style={{
              width: imageWidth,
              height: "auto",
              maxHeight: 60,
              objectFit: "contain",
              position: "relative",
              left: 0,
              top: 0,
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              zIndex: 1,
              flexShrink: 0,
              marginLeft: i === 0 ? 0 : 0, // sin solapamiento
              marginRight: 0,
              padding: 0,
              background: "white",
            }}
            initial={getVariants(i).initial}
            animate={getVariants(i).animate}
            exit={getVariants(i).exit}
            transition={{ type: "tween", duration }}
            drag={i === 0 || i === 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={i === 0 || i === 1 ? handleDragStartDir : undefined}
            onDrag={i === 0 || i === 1 ? handleDragDir : undefined}
            onDragEnd={i === 0 || i === 1 ? handleDragEndDir : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

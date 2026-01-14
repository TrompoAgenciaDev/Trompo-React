import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import LazyImage from "../LazyImage";

async function fetchSocialMediaPortfolioData() {
  const ts = Date.now();
  const res = await fetch(`${import.meta.env.BASE_URL}portfolio.json?v=${ts}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo cargar portfolio.json");
  const data = await res.json();

  const estrategia = Array.isArray(data?.estrategia) ? data.estrategia : [];
  const interaccion = Array.isArray(data?.interaccion) ? data.interaccion : [];

  const socialMedia = interaccion.filter((item) => {
    const cats = Array.isArray(item.category) ? item.category : [];
    return cats.some((c) => String(c).toLowerCase() === "social media");
  });

  // Orden: primero Estrategia, luego Social Media
  return [...estrategia, ...socialMedia];
}

function InnerAutoSlider({ list, interval = 2200, direction = 1, isVisible }) {
  const len = list.length;
  const REPEAT = 3;
  const extended = Array.from({ length: REPEAT }, () => list).flat();
  const baseLen = len;
  const middleIndex = baseLen > 0 ? baseLen * Math.floor(REPEAT / 2) : 0;

  const [idx, setIdx] = useState(middleIndex);
  const [anim, setAnim] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const t = useRef(null);
  const containerRef = useRef(null);

  if (len <= 1) {
    return (
      <div style={{ position: "relative", width: "100%", paddingTop: "75%", overflow: "hidden" }}>
        <img
          src={list[0] || ""}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  useEffect(() => {
    if (len <= 1 || !isVisible || shouldRender) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [len, isVisible, shouldRender]);

  useEffect(() => {
    if (len <= 1 || !shouldRender) return;
    t.current = setInterval(() => {
      setIdx((p) => p + (direction > 0 ? 1 : -1));
      setAnim(true);
    }, interval);
    return () => clearInterval(t.current);
  }, [len, interval, direction, shouldRender]);

  useEffect(() => {
    if (len <= 1) return;
    const min = baseLen * 2;
    const max = baseLen * (REPEAT - 2);
    if (idx < min || idx > max) {
      const mod = ((idx % baseLen) + baseLen) % baseLen;
      setAnim(false);
      setIdx(middleIndex + mod);
    }
  }, [len, idx, baseLen, REPEAT, middleIndex]);

  const offsetPct = idx * 100;

  if (!shouldRender) {
    return (
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        }}
      />
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", paddingTop: "75%", overflow: "hidden" }}>
      <motion.div
        style={{ position: "absolute", inset: 0, display: "flex" }}
        animate={{ x: `-${offsetPct}%` }}
        transition={anim ? { duration: 0.45, ease: "easeOut" } : { duration: 0 }}
      >
        {extended.map((src, i) => (
          <div key={i} style={{ width: "100%", flex: "0 0 100%" }}>
            <LazyImage
              src={src}
              alt=""
              placeholder="#f0f0f0"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function SocialMediaPortfolio() {
  const [items, setItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const draggingRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchSocialMediaPortfolioData();
        const base = import.meta.env.BASE_URL?.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

        const prepared = data
          .map((item) => {
            const images = [];
            if (item.vertical_image) images.push(`${base}${String(item.vertical_image).replace(/^\//, "")}`);
            if (item.featured_image) images.push(`${base}${String(item.featured_image).replace(/^\//, "")}`);
            if (Array.isArray(item.gallery)) {
              item.gallery.forEach((g) => images.push(`${base}${String(g).replace(/^\//, "")}`));
            }
            return { id: item.id, title: item.title || item.name, images };
          })
          .filter((x) => x.images.length > 0)
          .slice(0, 12);

        if (mounted) setItems(prepared);
      } catch (e) {
        console.error("Error cargando portfolio social media:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const REPEAT = 3;
  const slides = useMemo(() => (items.length ? Array.from({ length: REPEAT }, () => items).flat() : []), [items]);
  const baseLength = items.length;
  const middleIndex = baseLength > 0 ? baseLength * Math.floor(REPEAT / 2) : 0;
  const [carouselIndex, setCarouselIndex] = useState(middleIndex);

  useEffect(() => {
    if (!isMobile || items.length === 0) return;
    setCarouselIndex(middleIndex);
  }, [isMobile, items.length, middleIndex]);

  useEffect(() => {
    if (!isMobile || items.length <= 1) return;
    const min = baseLength * 2;
    const max = baseLength * (REPEAT - 2);
    if (carouselIndex < min || carouselIndex > max) {
      const mod = ((carouselIndex % baseLength) + baseLength) % baseLength;
      setCarouselIndex(middleIndex + mod);
    }
  }, [carouselIndex, baseLength, REPEAT, middleIndex, isMobile, items.length]);

  useEffect(() => {
    if (!isMobile || items.length <= 1 || draggingRef.current) return;
    const timer = setInterval(() => setCarouselIndex((p) => p + 1), 3000);
    return () => clearInterval(timer);
  }, [isMobile, items.length]);

  if (items.length === 0) {
    return (
      <div className="grid-portfolio-container" style={{ minHeight: "220px" }}>
        <p>Cargando portfolio...</p>
      </div>
    );
  }

  if (!isMobile) {
    return (
      <div className="grid-portfolio-container">
        <div className="grid-portfolio-wrapper">
          {items.map((item, i) => (
            <div key={item.id ?? i} className="grid-portfolio-item">
              <InnerAutoSlider list={item.images} interval={2200} direction={1} isVisible />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const slideWidthPct = 100;
  const offsetPct = carouselIndex * slideWidthPct;

  return (
    <div className="grid-portfolio-container portfolio-carousel-mobile" style={{ position: "relative", overflow: "hidden", width: "100%" }}>
      <motion.div
        className="portfolio-carousel-track"
        style={{ display: "flex", width: "100%", willChange: "transform" }}
        animate={{ x: `-${offsetPct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => {
          draggingRef.current = true;
        }}
        onDragEnd={() => {
          draggingRef.current = false;
        }}
      >
        {slides.map((item, i) => {
          const isVisible = Math.abs(i - carouselIndex) <= 1;
          return (
            <div
              key={`${item.id}-${i}`}
              style={{
                width: `${slideWidthPct}%`,
                flex: `0 0 ${slideWidthPct}%`,
                padding: "4px",
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <InnerAutoSlider list={item.images} interval={2200} direction={1} isVisible={isVisible} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}



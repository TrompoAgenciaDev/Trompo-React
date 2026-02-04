import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import LazyImage from "../LazyImage";

async function fetchSocialMediaShowcaseData(sourceArray = "social-media") {
  const ts = Date.now();
  const res = await fetch(`${import.meta.env.BASE_URL}portfolio.json?v=${ts}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo cargar portfolio.json");
  const data = await res.json();

  // Usar el array especificado (social-media o paid-media)
  const items = Array.isArray(data?.[sourceArray]) ? data[sourceArray] : [];
  
  return items;
}

function InnerAutoSlider({ list, interval = 2200, direction = 1, draggingRef, isVisible }) {
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
      if (!draggingRef?.current) {
        setIdx((p) => p + (direction > 0 ? 1 : -1));
        setAnim(true);
      }
    }, interval);
    return () => clearInterval(t.current);
  }, [len, interval, direction, draggingRef, shouldRender]);

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

export default function SocialMediaShowcaseSlider({ sourceArray = "social-media" }) {
  const [slides, setSlides] = useState([]);
  const [baseSlidesLength, setBaseSlidesLength] = useState(0);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(() =>
    typeof window === "undefined" ? 1 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1
  );
  const [paused, setPaused] = useState(false);
  const [touchDelay, setTouchDelay] = useState(false);
  const timer = useRef(null);
  const draggingRef = useRef(false);
  const isResettingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await fetchSocialMediaShowcaseData(sourceArray);

        const base = import.meta.env.BASE_URL?.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
        const baseSlides = items
          .map((it) => {
            const images = [];
            if (it.vertical_image) images.push(`${base}${String(it.vertical_image).replace(/^\//, "")}`);
            if (it.featured_image) images.push(`${base}${String(it.featured_image).replace(/^\//, "")}`);
            if (Array.isArray(it.gallery)) it.gallery.forEach((g) => images.push(`${base}${String(g).replace(/^\//, "")}`));
            return images.length ? { kind: "image", images } : null;
          })
          .filter(Boolean);

        const REPEAT = 3;
        const expanded = Array.from({ length: REPEAT }, () => baseSlides).flat();
        const middleIndex = baseSlides.length * Math.floor(REPEAT / 2);

        if (mounted) {
          setSlides(expanded);
          setBaseSlidesLength(baseSlides.length);
          setIndex(middleIndex);
        }
      } catch (e) {
        console.error(`Error cargando slider ${sourceArray}:`, e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sourceArray]);

  useEffect(() => {
    const onResize = () => {
      const v = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      setVisible(v);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // autoplay outer slider
  useEffect(() => {
    if (baseSlidesLength <= 1) return;
    if (paused || touchDelay) return;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (!draggingRef.current) setIndex((p) => p + 1);
    }, 2600);
    return () => clearInterval(timer.current);
  }, [paused, touchDelay, baseSlidesLength]);

  // reset infinito outer
  useEffect(() => {
    if (baseSlidesLength <= 0) return;
    const REPEAT = 3;
    const min = baseSlidesLength * 2;
    const max = baseSlidesLength * (REPEAT - 2);
    if (index < min || index > max) {
      const mod = ((index % baseSlidesLength) + baseSlidesLength) % baseSlidesLength;
      const middleIndex = baseSlidesLength * Math.floor(REPEAT / 2);
      isResettingRef.current = true;
      setIndex(middleIndex + mod);
      requestAnimationFrame(() => {
        isResettingRef.current = false;
      });
    }
  }, [index, baseSlidesLength]);

  const slideWidthPct = 100 / Math.max(1, visible);
  const offsetPct = index * slideWidthPct;

  const visibleRange = useMemo(() => {
    const start = Math.max(0, index - visible - 1);
    const end = Math.min(slides.length - 1, index + visible + 1);
    return { start, end };
  }, [index, visible, slides.length]);

  const prev = useCallback(() => setIndex((p) => p - 1), []);
  const next = useCallback(() => setIndex((p) => p + 1), []);

  if (slides.length === 0) return null;

  return (
    <div className="sm-showcase-section" style={{ position: "relative" }}>
      <button
        aria-label="Prev"
        className="slider-control slider-control-prev slider-control-left"
        onClick={prev}
        style={{
          position: "absolute",
          left: -50,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          borderRadius: 999,
          width: 40,
          height: 40,
          zIndex: 10,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
          <path
            d="M31.9687 16.1926L1.08382 16.1926M1.08382 16.1926L16.5263 31.3777M1.08382 16.1926L16.5263 1.00751"
            stroke="#1D1D1B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        aria-label="Next"
        className="slider-control slider-control-next slider-control-right"
        onClick={next}
        style={{
          position: "absolute",
          right: -50,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          borderRadius: 999,
          width: 40,
          height: 40,
          zIndex: 10,
        }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.5 19.0001H36.5M36.5 19.0001L19 1.79175M36.5 19.0001L19 36.2084"
            stroke="#1E1E1E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        style={{ position: "relative", overflow: "hidden", width: "100%", margin: "0 auto" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => {
          if (window.innerWidth < 768) {
            setTouchDelay(true);
            clearInterval(timer.current);
            setTimeout(() => setTouchDelay(false), 1000);
          }
        }}
      >
        <motion.div
          className="showcase-track"
          style={{ display: "flex", width: "100%", alignItems: "center", willChange: "transform" }}
          animate={{ x: `-${offsetPct}%` }}
          transition={isResettingRef.current ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
        >
          {slides.map((item, i) => {
            const isVisible = i >= visibleRange.start && i <= visibleRange.end;
            return (
              <div
                key={`${i}`}
                style={{
                  width: `${slideWidthPct}%`,
                  flex: `0 0 ${slideWidthPct}%`,
                  padding: window.innerWidth < 768 ? "4px" : window.innerWidth < 1024 ? "6px" : "8px",
                  boxSizing: "border-box",
                  minWidth: 0,
                }}
              >
                <InnerAutoSlider list={item.images} interval={2200} direction={1} draggingRef={draggingRef} isVisible={isVisible} />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}



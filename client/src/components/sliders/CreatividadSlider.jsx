import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const galleries = {
  airon: [
    `${import.meta.env.BASE_URL}assets/creatividad/slide/airon1.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/airon2.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/airon3.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/airon4.webp`,
  ],
  ayni: [
    `${import.meta.env.BASE_URL}assets/creatividad/slide/ayni1.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/ayni2.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/ayni3.webp`,
  ],
  lema: [
    `${import.meta.env.BASE_URL}assets/creatividad/slide/lema1.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/lema2.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/lema3.webp`,
  ],
  qsltec: [
    `${import.meta.env.BASE_URL}assets/creatividad/slide/qsltec1.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/qsltec2.webp`,
  ],
  smartshop: [
    `${import.meta.env.BASE_URL}assets/creatividad/slide/smartshop1.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/smartshop2.webp`,
  ],
  tearratua: [
    `${import.meta.env.BASE_URL}assets/creatividad/slide/terratua1.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/terratua2.webp`,
  ],
  vox: [
    `${import.meta.env.BASE_URL}assets/creatividad/slide/vox1.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/vox2.webp`,
    `${import.meta.env.BASE_URL}assets/creatividad/slide/vox3.webp`,
  ],
};

const videoGallery = [
  `${import.meta.env.BASE_URL}assets/creatividad/videos/agreteq-new.mp4`,
  `${import.meta.env.BASE_URL}assets/creatividad/videos/denso-new.mp4`,
  `${import.meta.env.BASE_URL}assets/creatividad/videos/raulito-new.mp4`,
  `${import.meta.env.BASE_URL}assets/creatividad/videos/viditec-new.mp4`,
  `${import.meta.env.BASE_URL}assets/creatividad/videos/volvo-new.mp4`,
  `${import.meta.env.BASE_URL}assets/creatividad/videos/wu.mp4`,
];

/* Inner slider infinito 4:3 */
function InnerAutoSlider({ list, interval = 2200, direction = 1 }) {
  const len = list.length;
  if (len <= 1) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
        }}
      >
        <img
          src={list[0]}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  const REPEAT = 5;
  const extended = Array.from({ length: REPEAT }, () => list).flat();
  const baseLen = len;
  const middleIndex = baseLen * Math.floor(REPEAT / 2);

  const [idx, setIdx] = useState(middleIndex);
  const [anim, setAnim] = useState(true);
  const t = useRef(null);

  useEffect(() => {
    t.current = setInterval(() => {
      setIdx((p) => p + (direction > 0 ? 1 : -1));
      setAnim(true);
    }, interval);
    return () => clearInterval(t.current);
  }, [interval, direction]);

  useEffect(() => {
    const min = baseLen * 2;
    const max = baseLen * (REPEAT - 2);
    if (idx < min || idx > max) {
      const mod = ((idx % baseLen) + baseLen) % baseLen;
      setAnim(false);
      setIdx(middleIndex + mod);
    }
  }, [idx, baseLen, REPEAT, middleIndex]);

  const offsetPct = idx * 100;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{ position: "absolute", inset: 0, display: "flex" }}
        animate={{ x: `-${offsetPct}%` }}
        transition={
          anim ? { duration: 0.45, ease: "easeOut" } : { duration: 0 }
        }
      >
        {extended.map((src, i) => (
          <div key={i} style={{ width: "100%", flex: "0 0 100%" }}>
            <img
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* Video único por slide 4:3 */
function VideoSlide({ src }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "75%",
        overflow: "hidden",
      }}
    >
      <video
        src={src}
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

export default function CreatividadSlider() {
  const brandKeys = Object.keys(galleries);
  const imgCount = brandKeys.length;
  const vidCount = videoGallery.length;
  const baseLen = Math.max(imgCount, vidCount) * 2; // imagen, video, imagen, video…

  // construye secuencia intercalada
  const interleaved = [];
  for (let i = 0; i < Math.max(imgCount, vidCount); i++) {
    const imgKey = brandKeys[i % imgCount];
    const vidSrc = videoGallery[i % vidCount];
    interleaved.push({ kind: "image", key: imgKey });
    interleaved.push({ kind: "video", src: vidSrc });
  }

  const REPEAT = 5;
  const slides = Array.from({ length: REPEAT }, () => interleaved).flat();
  const middleIndex = baseLen * Math.floor(REPEAT / 2);

  const [index, setIndex] = useState(middleIndex);
  const [visible, setVisible] = useState(() =>
    typeof window === "undefined" ? 1 : window.innerWidth >= 1024 ? 4 : 1
  );
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const onResize = () => setVisible(window.innerWidth >= 1024 ? 4 : 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((p) => p + 1), 4000);
    return () => clearInterval(timer.current);
  }, [paused]);

  useEffect(() => {
    const min = baseLen * 2;
    const max = baseLen * (REPEAT - 2);
    if (index < min || index > max) {
      const mod = ((index % baseLen) + baseLen) % baseLen;
      setIndex(middleIndex + mod);
    }
  }, [index, baseLen, REPEAT, middleIndex]);

  const slideWidthPct = 100 / visible;
  const offsetPct = index * slideWidthPct;

  const next = () => setIndex((p) => p + 1);
  const prev = () => setIndex((p) => p - 1);

  return (
    <div className="container">
      <button
        aria-label="Prev"
        onClick={prev}
        style={{
          position: "absolute",
          left: -30,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          borderRadius: 999,
          width: 40,
          height: 40,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
        >
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
        onClick={next}
        style={{
          position: "absolute",
          right: -30,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          borderRadius: 999,
          width: 40,
          height: 40,
        }}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        style={{ position: "relative", overflow: "hidden", width: "100%" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="showcase-track"
          style={{ display: "flex" }}
          animate={{ x: `-${offsetPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_, info) => {
            const thr = 50;
            if (info.offset.x <= -thr) next();
            if (info.offset.x >= thr) prev();
            setPaused(false);
          }}
        >
          {slides.map((item, i) => (
            <div
              key={`${item.kind}-${i}`}
              style={{
                width: `${slideWidthPct}%`,
                flex: `0 0 ${slideWidthPct}%`,
                padding: 8,
                boxSizing: "border-box",
              }}
            >
              {item.kind === "video" ? (
                <VideoSlide src={item.src} />
              ) : (
                <InnerAutoSlider
                  list={galleries[item.key]}
                  interval={2200}
                  direction={1}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

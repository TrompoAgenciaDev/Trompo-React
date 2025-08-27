// src/components/IconMorphArrowExact.jsx
import { motion } from "motion/react";
import '../assets/styles/iconMorphArrowExact.css';

export default function IconMorphArrowExact({ active }) {
  const ARROW_D =
    "M2.04492 22.5148H41.0449M41.0449 22.5148L21.5449 2.08618M41.0449 22.5148L21.5449 42.9433";

  const DOT_START_D =
    "M21.5449 22.5148 m -7,0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0";
  const DOT_END_D =
    "M41.0449 22.5148 m -0.01,0 a 0.01,0.01 0 1,0 0.02,0 a 0.01,0.01 0 1,0 -0.02,0";

  return (
    <span className="iconmorph" aria-hidden="true">
      <svg className="iconmorph__svg" viewBox="0 0 43 45">
        <motion.path
          className="iconmorph__dot"
          initial={false}
          animate={{ d: active ? DOT_END_D : DOT_START_D }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        />
        <motion.path
          className="iconmorph__arrow"
          d={ARROW_D}
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0, scale: active ? 1.2 : 1 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

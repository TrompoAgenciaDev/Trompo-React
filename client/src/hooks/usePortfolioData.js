// src/hooks/usePortfolioData.js
import { useEffect, useState } from "react";

const ABS = /^(https?:|data:|blob:|mailto:|tel:)/i;
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/,"/");
const BASE_SEG = BASE.replace(/^\/|\/$/g,"");
const STRIP = BASE_SEG ? new RegExp(`^(?:${BASE_SEG}\\/)+`, "i") : null;

const norm = (v) => (v ?? "").toString().trim().toLowerCase();
const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const toPublic = (p = "") => {
  if (!p) return "";
  if (ABS.test(p)) return p;
  let s = String(p).trim().replace(/^\/+/, "");
  if (STRIP) s = s.replace(STRIP, "");
  return `${BASE}${s}`.replace(/\/{2,}/g, "/");
};

export default function usePortfolioData({ location, category, limit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const buildTime = import.meta.env.BUILD_TIME || Date.now();
        const url = `${BASE}portfolio.json?v=${buildTime}`;
        const res = await fetch(url, { cache: "default" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const base = location ? toArray(data[location]) : Object.values(data).flat();

        const filtered = category
          ? base.filter((it) => toArray(it?.category).map(norm).includes(norm(category)))
          : base;

        const normalized = filtered.map((it) => ({
          ...it,
          vertical_image: toPublic(it.vertical_image),
          enlacePortfolio: it.url_client || "",
          categories: toArray(it.category),
          gallery: Array.isArray(it.gallery) ? it.gallery.map(toPublic) : [],
        }));

        const limited = limit ? normalized.slice(0, limit) : normalized;
        if (alive) setItems(limited);
      } catch (e) {
        if (alive) setError(e.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [location, category, limit]);

  return { items, loading, error };
}

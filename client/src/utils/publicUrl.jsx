const ABS = /^(https?:|data:|blob:|mailto:|tel:)/i;
const DEV = import.meta.env.DEV;
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/,"/"); // "/2025/"

const stripBase = (s) => {
  const seg = BASE.replace(/^\/|\/$/g,"");           // "2025"
  return seg ? s.replace(new RegExp(`^(?:${seg}/)+`,"i"), "") : s;
};

export const toPublicUrl = (p="") => {
  if (ABS.test(p)) return p;
  const clean = String(p).trim().replace(/^\/+/,"");
  const path = stripBase(clean);
  const prefix = DEV ? "/" : BASE;                   // dev: "/", build: "/2025/"
  return `${prefix}${path}`.replace(/\/{2,}/g,"/");
};

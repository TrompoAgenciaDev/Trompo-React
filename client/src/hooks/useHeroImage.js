// Objeto con las imágenes (rutas desde "public/")
const bgImages = {
  home: [
    `${import.meta.env.BASE_URL}assets/heroImages/home.png`,
    `${import.meta.env.BASE_URL}assets/heroImages/home.webp`
  ],
  gestion: [
    `${import.meta.env.BASE_URL}assets/heroImages/gestion.png`,
    `${import.meta.env.BASE_URL}assets/heroImages/gestion.webp`
  ],
  web: [
    `${import.meta.env.BASE_URL}assets/heroImages/web.png`,
    `${import.meta.env.BASE_URL}assets/heroImages/web.webp`
  ],
  gAds: [
    `${import.meta.env.BASE_URL}assets/heroImages/googleads.png`,
    `${import.meta.env.BASE_URL}assets/heroImages/googleads.webp`
  ],
  mAds: [
    `${import.meta.env.BASE_URL}assets/heroImages/metaads.png`,
    `${import.meta.env.BASE_URL}assets/heroImages/metaads.webp`
  ],
  social: [
    `${import.meta.env.BASE_URL}assets/heroImages/social.png`,
    `${import.meta.env.BASE_URL}assets/heroImages/social.webp`
  ],
  branding: [
    `${import.meta.env.BASE_URL}assets/heroImages/branding.png`,
    `${import.meta.env.BASE_URL}assets/heroImages/branding.webp`
  ],
};

// Hook personalizado
export const useHeroImages = (location) => {
  return bgImages[location] || [];
};

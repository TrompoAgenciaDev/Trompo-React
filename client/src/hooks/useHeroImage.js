// Objeto con las imágenes (rutas desde "public/")
const bgImages = {
  home: ["/assets/heroImages/home.png", "/assets/heroImages/home.webp"],
  gestion: ["/assets/heroImages/gestion.png", "/assets/heroImages/gestion.webp"],
  web: ["/assets/heroImages/web.png", "/assets/heroImages/web.webp"],
  gAds: ["/assets/heroImages/googleads.png", "/assets/heroImages/googleads.webp"],
  mAds: ["/assets/heroImages/metaads.png", "/assets/heroImages/metaads.webp"],
  social: ["/assets/heroImages/social.png", "/assets/heroImages/social.webp"],
  branding: ["/assets/heroImages/branding.png", "/assets/heroImages/branding.webp"],
};

// Hook personalizado
export const useHeroImages = (location) => {
  return bgImages[location] || [];
};

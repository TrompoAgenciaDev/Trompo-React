import { useHeroImages } from "../hooks/useHeroImage";

// Videos
import HomeVideo from "/assets/hero/home-video.mp4";
import AboutVideo from "/assets/hero/about-us.mp4";
import ContactVideo from "/assets/hero/contact.mp4";
import Desarrollo from "/assets/hero/desarrollo-web.mp4";

// Styles
import "@as/hero.css";

const videosByLocation = {
  home: HomeVideo,
  about: AboutVideo,
  contact: ContactVideo,
  desarrollo: Desarrollo,
};

const Hero = ({ location = "home" }) => {
  const [heroImagePng, heroImageWebp] = useHeroImages(location);

  const videoSrc = videosByLocation[location];

  return (
    <div className="full-container hero-video-container" id={location === "home" ? "hero" : undefined}>
      {videoSrc && (
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default Hero;

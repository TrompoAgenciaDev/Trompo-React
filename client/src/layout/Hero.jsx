import { useHeroImages } from "../hooks/useHeroImage";

// Videos
import HomeVideo from "/assets/hero/home-video.mp4";
import AboutVideo from "/assets/hero/about-us.mp4";

// Styles
import "@as/hero.css";

const videosByLocation = {
  home: HomeVideo,
  about: AboutVideo,
};

const Hero = ({ location = "home" }) => {
  const [heroImagePng, heroImageWebp] = useHeroImages(location);

  const videoSrc = videosByLocation[location];

  return (
    <div className="hero-video-container" id={location === "home" ? "hero" : undefined}>
      {videoSrc && (
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default Hero;

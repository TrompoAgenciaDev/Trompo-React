import { useHeroImages } from "../hooks/useHeroImage";
import HomeVideo from "/assets/heroImages/home-video.mp4";

// Styles
import "@as/hero.css";

const Hero = ({ location = "home" }) => {
  const [heroImagePng, heroImageWebp] = useHeroImages(location);

  return (
    <>
      {location === "home" ? (
        <div className="hero-video-container">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
          >
            <source src={HomeVideo} type="video/mp4" />
          </video>        
        </div>
      ) : (
        location === "web" ? (
          <div className="hero-video-container">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="hero-video"
            >
              <source src={HomeVideo} type="video/mp4" />
            </video>        
          </div>
        ) : (
          <div className="hero-container container">
            <div
              className="hero-image"
              style={{
                backgroundImage: `image-set(
                  url(${heroImageWebp}) type("image/webp"),
                  url(${heroImagePng}) type("image/png")
                )`,
              }}
            />
          </div>
        )
      )}
    </>
  );
};

export default Hero;

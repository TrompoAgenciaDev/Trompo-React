//styles and animations
import '@as/video-section.css';

import video from '/assets/videos/volvo.mp4';


const VideoSection = () => {

  return (    
    <video
      className="video-background"
      src={video}
      autoPlay
      muted
      loop
      playsInline
    />
  );
};

export default VideoSection;

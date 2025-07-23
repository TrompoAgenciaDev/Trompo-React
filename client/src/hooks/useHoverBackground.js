import { useState } from "react";

const useHoverBackground = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [opacity, setOpacity] = useState(1);

  const handleMouseEnter = (image) => {
    setOpacity(0);
    setTimeout(() => {
      setBackgroundImage(image);
      setOpacity(1);
    },150);
  };

  const handleMouseLeave = () => {
    setOpacity(1);
  };

  return {
    backgroundImage,
    opacity,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useHoverBackground;
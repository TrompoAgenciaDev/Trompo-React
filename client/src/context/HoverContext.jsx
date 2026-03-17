import { createContext, useContext, useState } from "react";

const HoverContext = createContext();

export const HoverProvider = ({ children }) => {
  const [hoverComponent, setHoverComponent] = useState(false);

  const handleHover = () => {
    setHoverComponent(true);
  };

  const handleLeave = () => {
    setHoverComponent(false);
  };

  return (
    <HoverContext.Provider value={{ hoverComponent, handleHover, handleLeave }}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHover = () => {
  const context = useContext(HoverContext);
  if (!context) {
    return { hoverComponent: false, handleHover: () => {}, handleLeave: () => {} };
  }
  return context;
};


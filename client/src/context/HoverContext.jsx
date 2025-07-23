import { createContext, useContext, useState } from "react";

const HoverContext = createContext();

export function HoverProvider({ children }) {
  const [hoverComponent, setHoverComponent] = useState(false);

  const handleHover = (id) => {    
    setHoverComponent(id);
  };

  const handleLeave = () => {
    setHoverComponent(false);
  };

  return (
    <HoverContext.Provider value={{ hoverComponent, handleHover, handleLeave }}>
      {children}
    </HoverContext.Provider>
  );
}

export function useHover() {
  const context = useContext(HoverContext);
  if (!context) {
    throw new Error("useHover must be used within a HoverProvider");
  }
  return context;
}

export default HoverContext;
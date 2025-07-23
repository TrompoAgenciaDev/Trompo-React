import { useState, useCallback } from 'react';

const useTogglePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, togglePopup };
};

export default useTogglePopup;
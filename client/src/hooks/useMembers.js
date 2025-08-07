import { useState, useEffect, useRef } from "react";

export default function useMembers(data, autoPlayDelay = 6000) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const length = data.length;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, autoPlayDelay);

    return () => {
      resetTimeout();
    };
  }, [current, length, autoPlayDelay]);

  const goNext = () => {
    resetTimeout();
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const goPrev = () => {
    resetTimeout();
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  const setIndex = (index) => {
    resetTimeout();
    if (index >= 0 && index < length) setCurrent(index);
  };

  return { current, goNext, goPrev, setIndex };
}

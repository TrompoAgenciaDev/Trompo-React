import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";

/**
 * Slider automático genérico con drag & drop.
 * Reutilizable para gráficos, video slides, etc.
 */
const AutoSlider = ({
  children,
  isActive,
  slideSelector = ".grafico-slide",
  containerClass = "graficos-slider-container",
  sliderClass = "graficos-slider",
  infinite = true,
}) => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const timeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const loopWidthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const childrenArray = React.Children.toArray(children);
  const clonedChildren = infinite
    ? [...childrenArray, ...childrenArray, ...childrenArray].map((child, index) => {
        if (React.isValidElement(child)) {
          const cloneIndex = Math.floor(index / childrenArray.length);
          const originalIndex = index % childrenArray.length;
          return React.cloneElement(child, {
            key: `${child.key || `slide-${originalIndex}`}-clone-${cloneIndex}`,
          });
        }
        return child;
      })
    : childrenArray;

  useEffect(() => {
    if (!sliderRef.current || !containerRef.current) return;

    const updateDimensions = () => {
      const container = containerRef.current;
      const slider = sliderRef.current;
      if (!container || !slider) return;

      requestAnimationFrame(() => {
        if (!container || !slider) return;

        const containerRect = container.getBoundingClientRect();
        const sliderRect = slider.getBoundingClientRect();

        const slideElements = slider.querySelectorAll(slideSelector);
        if (slideElements.length > 0) {
          const firstSlide = slideElements[0];
          const slideRect = firstSlide.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(slider);
          const gap = parseFloat(computedStyle.gap) || 16;
          const width = slideRect.width + gap;

          if (infinite) {
            const originalSlidesCount = childrenArray.length;
            const loopWidth = width * originalSlidesCount;
            loopWidthRef.current = loopWidth;

            if (x.get() === 0 && loopWidth > 0) {
              const initialX = -loopWidth;
              x.set(initialX);
              setCurrentSlideIndex(originalSlidesCount);
            }
          } else {
            loopWidthRef.current = 0;
          }

          setSlideWidth(width);
          setContainerWidth(containerRect.width);
          setTotalWidth(sliderRect.width);
          setTotalSlides(slideElements.length);
        }
      });
    };

    const timeoutId = setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [children, isActive, slideSelector, infinite]);

  const moveToNextSlide = useCallback(() => {
    if (isDragging || isAnimatingRef.current || !isActive) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const currentSlideWidth = slideWidth;
    const currentLoopWidth = loopWidthRef.current;

    if (!currentSlideWidth) return;

    if (infinite && (!currentLoopWidth || currentLoopWidth <= 0)) return;

    isAnimatingRef.current = true;

    setCurrentSlideIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      let targetX = -nextIndex * currentSlideWidth;
      const maxOffset = Math.max(0, totalWidth - containerWidth);
      const maxSlideIndex = Math.ceil(maxOffset / currentSlideWidth);

      if (!infinite && nextIndex > maxSlideIndex) {
        const resetX = 0;

        controls
          .start({
            x: resetX,
            transition: { duration: 0.5, ease: "easeInOut" },
          })
          .then(() => {
            x.set(resetX);
            isAnimatingRef.current = false;
            if (!isDragging && isActive) {
              timeoutRef.current = setTimeout(moveToNextSlide, 2800);
            }
          });

        return 0;
      }

      if (infinite && targetX <= -currentLoopWidth) {
        const wrappedX = targetX + currentLoopWidth;

        x.set(wrappedX);

        setTimeout(() => {
          isAnimatingRef.current = false;
          if (!isDragging && isActive) {
            timeoutRef.current = setTimeout(moveToNextSlide, 2800);
          }
        }, 2800);

        return Math.floor(-wrappedX / currentSlideWidth);
      }

      controls
        .start({
          x: targetX,
          transition: { duration: 0.5, ease: "easeInOut" },
        })
        .then(() => {
          x.set(targetX);
          isAnimatingRef.current = false;

          if (!isDragging && isActive) {
            timeoutRef.current = setTimeout(moveToNextSlide, 2800);
          }
        });

      return nextIndex;
    });
  }, [isActive, isDragging, slideWidth, x, infinite, containerWidth, totalWidth, controls]);

  useEffect(() => {
    if (!isActive || isDragging || !slideWidth || !containerWidth || !totalWidth || totalSlides === 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isAnimatingRef.current = false;
      return;
    }

    if (infinite) {
      const loopWidth = loopWidthRef.current;
      if (!loopWidth || loopWidth <= 0) return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(moveToNextSlide, 2800);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, [isActive, isDragging, slideWidth, containerWidth, totalWidth, totalSlides, infinite, moveToNextSlide]);

  const handleDragStart = () => {
    setIsDragging(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDragEnd = () => {
    if (!slideWidth || !containerWidth || !totalWidth) {
      setIsDragging(false);
      isAnimatingRef.current = false;
      return;
    }

    const maxOffset = Math.max(0, totalWidth - containerWidth);
    const currentX = x.get();

    const index = Math.round(-currentX / slideWidth);
    const maxSlideIndex = Math.ceil(maxOffset / slideWidth);
    const clampedIndex = Math.max(0, Math.min(index, maxSlideIndex));
    const targetX = -clampedIndex * slideWidth;
    const clampedX = Math.max(-maxOffset, Math.min(0, targetX));

    setCurrentSlideIndex(clampedIndex);
    isAnimatingRef.current = true;

    controls
      .start({
        x: clampedX,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      })
      .then(() => {
        x.set(clampedX);
        isAnimatingRef.current = false;
        setIsDragging(false);
      });
  };

  if (!isActive) {
    return (
      <div className={sliderClass} ref={sliderRef}>
        {children}
      </div>
    );
  }

  return (
    <div className={containerClass} ref={containerRef} style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        className={sliderClass}
        ref={sliderRef}
        animate={controls}
        style={{ x }}
        drag="x"
        dragConstraints={{
          left: -Math.max(0, totalWidth - containerWidth),
          right: 0,
        }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onUpdate={(latest) => {
          if (isDragging && infinite && loopWidthRef.current > 0) {
            const currentX = typeof latest.x === "number" ? latest.x : x.get();
            const loopWidth = loopWidthRef.current;

            if (currentX <= -loopWidth) {
              x.set(currentX + loopWidth);
            } else if (currentX > 0) {
              x.set(currentX - loopWidth);
            }
          }
        }}
        whileDrag={{ cursor: "grabbing" }}
      >
        {clonedChildren}
      </motion.div>
    </div>
  );
};

export default AutoSlider;

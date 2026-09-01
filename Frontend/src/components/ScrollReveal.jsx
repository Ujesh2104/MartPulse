import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component (Two-Way Scroll Reactive)
 * Automatically animates In on scroll-down and animates Out on scroll-up.
 */
export const ScrollReveal = ({
  children,
  className = '',
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade'
  delay = 0, // delay in ms
  duration = 600, // duration in ms
  threshold = 0.1,
  once = false, // Set to false so it re-triggers when scrolling up and down!
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && domRef.current) {
            observer.unobserve(domRef.current);
          }
        } else {
          // When user scrolls away (up or down), smoothly fade out / reset
          if (!once) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [threshold, once]);

  // Transform offsets for enter / exit
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-10';
      case 'down':
        return '-translate-y-10';
      case 'left':
        return 'translate-x-10';
      case 'right':
        return '-translate-x-10';
      case 'zoom':
        return 'scale-95';
      case 'fade':
      default:
        return '';
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
      className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0 scale-100'
          : `opacity-0 ${getInitialTransform()}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;

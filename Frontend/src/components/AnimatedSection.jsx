import React, { useEffect, useRef, useState } from 'react';

export const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-up', // 'fade', 'fade-up', 'fade-down', 'scale'
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const current = domRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) {
      if (animation === 'fade-up') return 'opacity-0 translate-y-6';
      if (animation === 'fade-down') return 'opacity-0 -translate-y-6';
      if (animation === 'scale') return 'opacity-0 scale-95';
      return 'opacity-0';
    }
    return 'opacity-100 translate-y-0 scale-100';
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

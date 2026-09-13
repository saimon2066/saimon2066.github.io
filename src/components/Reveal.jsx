import { useEffect, useRef, useState } from 'react';

// Fades a block in when it enters the viewport, and re-arms itself when the
// block leaves downwards, so the animation plays again on the way back up.
//
// Leaving upwards deliberately does NOT re-hide it: an element sitting right
// on the threshold would otherwise flip between hidden and shown on every
// small scroll, which reads as flickering. Pass once to fire a single time.
export default function Reveal({ children, delay = 0, once = false, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) observer.disconnect();
          return;
        }
        // boundingClientRect.top > 0 means the element is below the viewport,
        // i.e. we scrolled back up past it and it should re-arm
        if (!once && entry.boundingClientRect.top > 0) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

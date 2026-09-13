import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

// Scrambles a string into place the first time it scrolls into view. Each
// character churns through random glyphs for a while before it settles, and
// the settle points are staggered, so the heading resolves left to right
// instead of snapping. Written here rather than pulled from a library: the
// ready-made version needs a whole animation package for this.
export default function Scramble({ text, className = '' }) {
  const ref = useRef(null);
  // null means settled: render the real text with no per-character markup
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(null);
      return undefined;
    }

    const TICK = 32; // ms per frame
    const CHURN = 6; // frames a character scrambles before settling
    const STAGGER = 1.3; // frames between one character settling and the next
    const total = Math.ceil(text.length * STAGGER + CHURN);

    let timer = 0;
    let frame = 0;

    const run = () => {
      timer = window.setInterval(() => {
        frame += 1;

        if (frame > total) {
          window.clearInterval(timer);
          setDisplay(null);
          return;
        }

        setDisplay(
          text.split('').map((char, index) => {
            if (char === ' ') return { char: ' ', settled: true };
            const settleAt = index * STAGGER + CHURN;
            if (frame >= settleAt) return { char, settled: true };
            if (frame < index * STAGGER - CHURN) return { char: ' ', settled: true };
            return { char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], settled: false };
          })
        );
      }, TICK);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setDisplay(text.split('').map(() => ({ char: ' ', settled: true })));
        run();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {/* the real text stays in the accessibility tree; the scrambled copy is
          decoration and would otherwise be read out character by character */}
      <span aria-hidden="true">
        {display === null
          ? text
          : display.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <span key={index} className={item.settled ? undefined : 'scramble__char'}>
                {item.char}
              </span>
            ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

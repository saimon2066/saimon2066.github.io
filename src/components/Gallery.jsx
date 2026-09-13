import { useEffect, useRef, useState } from 'react';
import PixelCard from './PixelCard';
import { play } from '../lib/sound';

// Every shot ships at three widths (see the README). The browser picks by
// rendered size and pixel density, so a phone pulls the 800px file for the
// main shot and the 400px one for a thumbnail instead of the full 1600.
const widths = [400, 800, 1600];

function srcSet(src) {
  return widths
    .map(width => `${src.replace('.webp', width === 1600 ? '.webp' : `-${width}.webp`)} ${width}w`)
    .join(', ');
}

// Main shot plus thumbnails. Click, hover or arrow keys to switch, no
// autoplay: a carousel that moves on its own competes with the text next to
// it.
//
// Every shot stays mounted and stacked, and switching only changes opacity.
// Swapping the src instead left a black gap while the browser decoded the
// next file.
export default function Gallery({ shots, name }) {
  const [active, setActive] = useState(0);
  const thumbsRef = useRef(null);
  const previous = useRef(active);

  // tied to the image actually changing rather than to a click: on a desktop
  // the shot switches on hover, so a click-bound sound almost never fired.
  // The thumbs are left out of the hover selector in App.jsx so this is the
  // single blip per switch rather than two stacked on top of each other
  useEffect(() => {
    if (previous.current === active) return;
    previous.current = active;
    play('hover');
  }, [active]);

  const move = delta => {
    const next = (active + delta + shots.length) % shots.length;
    setActive(next);
    thumbsRef.current?.children[next]?.focus();
  };

  const onKeyDown = event => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
  };

  return (
    <div className="gallery">
      <PixelCard variant="amber" className="shot-card">
        <div className="shot-stack">
          {shots.map((shot, index) => (
            <img
              key={shot.src}
              className={`project__shot ${index === active ? 'is-active' : ''}`}
              src={shot.src}
              srcSet={srcSet(shot.src)}
              // the shot column is a bit over half of a 68rem page, and the
              // full width of the screen once the layout stacks
              sizes="(max-width: 860px) 92vw, 640px"
              alt={index === active ? shot.alt : ''}
              aria-hidden={index === active ? undefined : 'true'}
              // the first one sizes the stack, so it must not be lazy
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}
        </div>
      </PixelCard>

      {shots.length > 1 && (
        <div
          className="gallery__thumbs"
          role="tablist"
          aria-label={`${name} screenshots`}
          ref={thumbsRef}
          onKeyDown={onKeyDown}
        >
          {shots.map((shot, index) => (
            <button
              key={shot.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={shot.alt}
              tabIndex={index === active ? 0 : -1}
              className={`gallery__thumb ${index === active ? 'is-active' : ''}`}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
            >
              <img
                src={shot.src.replace('.webp', '-400.webp')}
                srcSet={srcSet(shot.src)}
                sizes="150px"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Source: React Bits (https://reactbits.dev) - MIT licensed.
// Tweak: the marquee stops running when it is scrolled out of view.
import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

// TWEAK: upstream passes the refs as an array literal, which is a new value
// on every render, so the effect tore down and rebuilt both ResizeObservers
// several times per second while the marquee was running. The refs are stable
// objects, so they are read inside the effect instead of being dependencies.
const useResizeObserver = (callback, containerRef, seqRef) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }
    const observers = [containerRef, seqRef].map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [callback, containerRef, seqRef]);
};

const useImageLoader = (seqRef, onLoad) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };
    images.forEach(img => {
      const htmlImg = img;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [onLoad, seqRef]);
};

const useAnimationLoop = (trackRef, containerRef, targetVelocity, seqWidth, hoveredRef, hoverSpeed) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    // TWEAK: no reason to keep a rAF loop alive for a marquee nobody is
    // looking at.
    let visible = true;
    let io;
    if (containerRef.current) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        lastTimestampRef.current = null;
      });
      io.observe(containerRef.current);
    }

    const animate = timestamp => {
      rafRef.current = requestAnimationFrame(animate);

      if (!visible) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = hoveredRef.current && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      io?.disconnect();
      lastTimestampRef.current = null;
    };
    // isHovered deliberately absent: it lives in a ref, because tearing the
    // rAF loop down and rebuilding it on every hover is what made the
    // deceleration stutter.
  }, [targetVelocity, seqWidth, hoveredRef, hoverSpeed, trackRef, containerRef]);
};

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    ariaLabel = 'Partner logos',
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const hoveredRef = useRef(false);

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === 'left' ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth = seqRef.current?.getBoundingClientRect?.().width ?? 0;
      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        // hard cap: if a parent ever sizes itself to the track, copies and
        // width feed each other and the page grows without bound
        setCopyCount(Math.min(12, Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded)));
      }
    }, []);

    useResizeObserver(updateDimensions, containerRef, seqRef);
    useImageLoader(seqRef, updateDimensions);
    useAnimationLoop(trackRef, containerRef, targetVelocity, seqWidth, hoveredRef, hoverSpeed);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        ['logoloop', 'logoloop--horizontal', fadeOut && 'logoloop--fade', scaleOnHover && 'logoloop--scale-hover', className]
          .filter(Boolean)
          .join(' '),
      [fadeOut, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      hoveredRef.current = true;
    }, []);
    const handleMouseLeave = useCallback(() => {
      hoveredRef.current = false;
    }, []);

    const renderLogoItem = useCallback((item, key) => {
      const isNodeItem = 'node' in item;
      const content = isNodeItem ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img src={item.src} alt={item.alt ?? ''} title={item.title} loading="lazy" decoding="async" draggable={false} />
      );
      const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);
      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || 'logo link'}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      );
      return (
        <li className="logoloop__item" key={key} title={item.title}>
          {itemContent}
        </li>
      );
    }, []);

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      () => ({ width: toCssLength(width) ?? '100%', ...cssVariables, ...style }),
      [width, cssVariables, style]
    );

    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="logoloop__track" ref={trackRef}>
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;

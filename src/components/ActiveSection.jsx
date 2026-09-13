import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ActiveSectionContext = createContext('');

// One observer for every section, with a narrow band across the upper third
// of the viewport: only what crosses that band counts as active. Without a
// band, two sections are "visible" at once on most scroll positions and the
// highlight flickers between them. The band sits high rather than centred so
// that clicking a nav link, which parks a section at the top of the screen,
// highlights that section even when it is a short one.
export function ActiveSectionProvider({ ids, children }) {
  const [active, setActive] = useState('');
  const [pinned, setPinned] = useState('');
  const [atBottom, setAtBottom] = useState(false);
  const key = ids.join(',');

  useEffect(() => {
    const sections = key
      .split(',')
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0 || !('IntersectionObserver' in window)) return undefined;

    // how much of each section sits inside the band, by id
    const slices = new Map();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) slices.set(entry.target.id, entry.intersectionRect.height);
          else slices.delete(entry.target.id);
        }

        // two sections can touch the band at once, so take the one filling
        // more of it, and on a tie the later one: that is the one being
        // scrolled into
        let best = '';
        let bestSlice = -1;
        for (const section of sections) {
          const slice = slices.get(section.id);
          if (slice === undefined) continue;
          if (slice >= bestSlice) {
            best = section.id;
            bestSlice = slice;
          }
        }
        setActive(best);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [key]);

  // Two positions on the page are ambiguous by geometry alone. At the very
  // bottom nothing can scroll further, so the band may still be sitting on
  // the second-to-last section while the reader is plainly looking at the
  // last one. And clicking a link to a short section near the end lands at
  // that same maximum scroll, which is a different intent with identical
  // geometry. So: a click pins its target until the reader scrolls by hand,
  // and otherwise the bottom of the page means the last section.
  useEffect(() => {
    const onClick = event => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      if (key.split(',').includes(id)) setPinned(id);
    };

    const release = () => setPinned('');

    document.addEventListener('click', onClick);
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchstart', release, { passive: true });
    window.addEventListener('keydown', release);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchstart', release);
      window.removeEventListener('keydown', release);
    };
  }, [key]);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setAtBottom(max > 0 && window.scrollY >= max - 2);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const last = ids[ids.length - 1];
  const value = useMemo(
    () => pinned || (atBottom ? last : active),
    [pinned, atBottom, last, active]
  );

  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

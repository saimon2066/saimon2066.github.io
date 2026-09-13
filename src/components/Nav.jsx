import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import { useActiveSection } from './ActiveSection';
import SoundToggle from './SoundToggle';

const LINKS = [
  { id: 'projects', label: 'projects' },
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'skills' },
  { id: 'contact', label: 'contact' }
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 40);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
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

  return (
    <nav className="nav" data-scrolled={scrolled}>
      <div className="nav__inner">
        <a className="nav__mark" href="#top">
          {profile.handle}
        </a>
        <div className="nav__links">
          {LINKS.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active === link.id ? 'is-active' : ''}
              aria-current={active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
          <SoundToggle />
        </div>
      </div>
      <div className="nav__progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
    </nav>
  );
}

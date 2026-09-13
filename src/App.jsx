import { useEffect } from 'react';
import Nav from './components/Nav';
import { ActiveSectionProvider } from './components/ActiveSection';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import { profile } from './data/profile';
import { play } from './lib/sound';

export default function App() {
  // Two delegated listeners rather than handlers on every control.
  // The gallery makes its own noise when the picture changes, so it is not
  // in the click selector here.
  useEffect(() => {
    // everything clickable makes the soft hover blip, except the gallery
    // thumbs: those already blip when the picture changes
    const INTERACTIVE =
      'a, button, .btn, .logoloop__link, .sound';

    const onClick = event => {
      const target = event.target.closest?.('a, button');
      if (!target) return;
      // the gallery blips when the picture changes, so a click on a thumb
      // would otherwise sound twice
      if (target.closest('.gallery__thumb')) return;

      // the firmer click is reserved for leaving the page: an external link,
      // a new tab or a mail client. Jumping to a section on the same page is
      // not a departure, so it keeps the quiet blip.
      const href = target.getAttribute?.('href') || '';
      const leaves =
        target.target === '_blank' ||
        href.startsWith('http') ||
        href.startsWith('mailto:');

      play(leaves ? 'click' : 'hover');
    };

    // hover sound only where there is a real pointer: on a touchscreen the
    // browser fires synthetic mouseover on tap and it would double up with
    // the click
    const fine = window.matchMedia('(pointer: fine)');
    let last = null;

    const onOver = event => {
      if (!fine.matches) return;
      const target = event.target.closest?.(INTERACTIVE);
      if (!target || target === last) return;
      if (target.closest('.gallery__thumb')) return;
      last = target;
      play('hover');
    };

    const onOut = event => {
      if (last && !event.relatedTarget?.closest?.(INTERACTIVE)) last = null;
    };

    document.addEventListener('click', onClick);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <ActiveSectionProvider ids={['projects', 'about', 'skills', 'contact']}>
      <a className="skip-link" href="#projects">
        Skip to projects
      </a>
      <Nav />
      <Hero />
      <main className="shell" id="main">
        <Projects />
        <About />
        <Contact />
      </main>
      <footer className="shell footer">
        <div className="footer__row">
          <span>
            {profile.first} {profile.last}, {new Date().getFullYear()}
          </span>
          <span className="footer__built">Built with React and Vite</span>
          <a className="footer__top" href="#top">
            back to top <span aria-hidden="true">↑</span>
          </a>
        </div>

        <p className="footer__prompt" aria-hidden="true">
          {profile.handle}@portfolio:~$ <span className="caret" />
        </p>
      </footer>
    </ActiveSectionProvider>
  );
}
